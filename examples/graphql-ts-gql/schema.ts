/* eslint-disable @typescript-eslint/consistent-type-imports */
import { list, graphql } from '@opensaas/keystone-core'
import { select, relationship, text, timestamp, virtual } from '@opensaas/keystone-core/fields'
import { allowAll } from '@opensaas/keystone-core/access'
import { gql } from '@ts-gql/tag/no-transform'

import type { Lists } from '.keystone/types'

export const lists = {
  Post: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' },
        ],
      }),
      // A virtual field returning a value derived from the item data.
      isPublished: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          resolve (item: any) {
            return item.status === 'published'
          },
        }),
      }),
      content: text({ ui: { displayMode: 'textarea' } }),
      // A virtual field returning a custom GraphQL object type.
      counts: virtual({
        ui: {
          itemView: { fieldMode: 'hidden' },
          listView: { fieldMode: 'hidden' },
        },
        field: graphql.field({
          type: graphql.object<{
            words: number
            sentences: number
            paragraphs: number
          }>()({
            name: 'PostCounts',
            fields: {
              words: graphql.field({ type: graphql.Int }),
              sentences: graphql.field({ type: graphql.Int }),
              paragraphs: graphql.field({ type: graphql.Int }),
            },
          }),
          resolve (item) {
            const content = item.content || ''
            return {
              words: content.split(' ').length,
              sentences: content.split('.').length,
              paragraphs: content.split('\n\n').length,
            }
          },
        }),
      }),
      // A virtual field which accepts GraphQL arguments.
      excerpt: virtual({
        field: graphql.field({
          type: graphql.String,
          args: {
            length: graphql.arg({ type: graphql.nonNull(graphql.Int), defaultValue: 200 }),
          },
          resolve (item, { length }) {
            if (!item.content) {
              return null
            }
            const content = item.content
            if (content.length <= length) {
              return content
            } else {
              return content.slice(0, length - 3) + '...'
            }
          },
        }),
        ui: { query: '(length: 10)' },
      }),
      publishDate: timestamp(),
      author: relationship({ ref: 'Author.posts', many: false }),
      // A virtual field which uses `item` and `context` to query data.
      authorName: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve (item, args, context) {
            const POST_AUTHOR_QUERY = gql`
              query POST_AUTHOR_QUERY($id: ID!) {
                post(where: { id: $id }) {
                  id
                  author {
                    id
                    name
                  }
                }
              }
            ` as import('./__generated__/ts-gql/POST_AUTHOR_QUERY').type
            const data = await context.graphql.run({
              query: POST_AUTHOR_QUERY,
              variables: { id: item.id },
            })
            const author = data?.post?.author
            return author && author.name
          },
        }),
      }),
    },
  }),
  Author: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ isIndexed: 'unique', validation: { isRequired: true } }),
      posts: relationship({ ref: 'Post.author', many: true }),
      // A virtual field which returns a type derived from a Keystone list.
      latestPost: virtual({
        field: lists =>
          graphql.field({
            type: lists.Post.types.output,
            async resolve (item, args, context) {
              const LATEST_POST_QUERY = gql`
                query LATEST_POST_QUERY($id: ID!) {
                  author(where: { id: $id }) {
                    id
                    posts(orderBy: { publishDate: desc }, take: 1) {
                      id
                    }
                  }
                }
              ` as import('./__generated__/ts-gql/LATEST_POST_QUERY').type
              const data = await context.graphql.run({
                query: LATEST_POST_QUERY,
                variables: { id: item.id },
              })
              const posts = data?.author?.posts
              if (posts && posts.length > 0) {
                return context.db.Post.findOne({ where: { id: posts[0].id } })
              }
            },
          }),
        ui: { query: '{ title publishDate }' },
      }),
    },
  }),
} satisfies Lists
