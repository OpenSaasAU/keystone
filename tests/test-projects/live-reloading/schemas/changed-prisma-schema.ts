import { list, graphql } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { text } from '@opensaas/keystone-core/fields'

export const lists = {
  Something: list({
    access: allowAll,
    fields: {
      text: text({ label: 'Initial Label For Text' }),
      anotherField: text(),
    },
  }),
}

export const extendGraphqlSchema = graphql.extend(() => {
  return {
    query: {
      someNumber: graphql.field({
        type: graphql.Int,
        resolve: () => 1,
      }),
    },
  }
})
