import { graphql, list } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { text } from '@opensaas/keystone-core/fields'

export const lists = {
  Something: list({
    access: allowAll,
    fields: {
      text: text({ label: 'Initial Label For Text' }),
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
