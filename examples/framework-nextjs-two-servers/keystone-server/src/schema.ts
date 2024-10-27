import { list } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { relationship, text, timestamp } from '@opensaas/keystone-core/fields'
import { document } from '@keystone-6/fields-document'

import type { Lists } from '.keystone/types'

export const lists = {
  User: list({
    access: allowAll,
    fields: {
      email: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      name: text({ validation: { isRequired: true } }),
      posts: relationship({ ref: 'Post.author', many: true }),
    },
  }),
  Post: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),
      slug: text({ isIndexed: 'unique', validation: { isRequired: true } }),
      content: document({
        formatting: true,
        dividers: true,
        links: true,
        // grid layout options
        layouts: [
          [1, 1], // grid layout 1fr 1fr
          [1, 1, 1], // grid layout 1fr 1fr 1fr
        ],
      }),
      publishDate: timestamp({ defaultValue: { kind: 'now' } }),
      author: relationship({ ref: 'User.posts', many: false }),
    },
  }),
} satisfies Lists
