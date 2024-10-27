import { list, config } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { relationship, text } from '@opensaas/keystone-core/fields'
import { dbConfig } from '../utils'

export const lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text(),
      numbers: relationship({
        ref: 'Number.user',
        many: true,
        ui: {
          displayMode: 'cards',
          cardFields: ['value'],
        },
        hooks: {
          // every time you save, add a random number
          async resolveInput (args) {
            return {
              ...args.resolvedData[args.fieldKey],
              create: {
                value: Math.floor(Math.random() * 100000).toString(),
              },
            }
          },
        },
      }),
    },
  }),
  Number: list({
    access: allowAll,
    fields: {
      user: relationship({ ref: 'User.numbers' }),
      value: text({ validation: { isRequired: true } }),
    },
  }),
}

export default config({
  db: dbConfig,
  lists
})
