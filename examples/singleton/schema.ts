import { list } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { relationship, text, timestamp } from '@opensaas/keystone-core/fields'

import type { Lists } from '.keystone/types'

export const lists = {
  Settings: list({
    access: allowAll,
    isSingleton: true,
    fields: {
      websiteName: text(),
      copyrightText: text(),
      highlightedPosts: relationship({ ref: 'Post', many: true }),
    },
    graphql: {
      plural: 'ManySettings',
    },
  }),
  Post: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),
      content: text(),
      publishDate: timestamp(),
    },
  }),
} satisfies Lists
