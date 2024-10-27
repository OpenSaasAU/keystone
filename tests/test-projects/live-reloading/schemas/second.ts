import { graphql, list } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { text, virtual } from '@opensaas/keystone-core/fields'

import type { Lists } from '.keystone/types'

export const lists = {
  Something: list({
    access: allowAll,
    fields: {
      text: text({ label: 'Very Important Text' }),
      virtual: virtual({
        field: graphql.field({
          type: graphql.String,
          resolve (item) {
            return item.text
          },
        }),
      }),
    },
  }),
} satisfies Lists

export const extendGraphqlSchema = graphql.extend(() => {
  return {
    query: {
      someNumber: graphql.field({
        type: graphql.nonNull(graphql.Int),
        resolve: () => 1,
      }),
    },
  }
})
