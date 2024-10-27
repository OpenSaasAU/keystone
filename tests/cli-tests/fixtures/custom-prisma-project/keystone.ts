import { list, config } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { text } from '@opensaas/keystone-core/fields'

export default config({
  db: {
    provider: 'postgresql',
    url: 'file:./app.db',
    extendPrismaSchema: schema =>
      schema
        .replace(/(\ngenerator[^\n]+\{[^}]+)}/, '$1  previewFeatures = ["multiSchema"]\n}')
        .replace(/(datasource[^\n]+\{[^}]+)}/, '$1  schemas = ["first", "second"]\n}'),
  },
  ui: { isDisabled: true },
  lists: {
    Todo: list({
      access: allowAll,
      db: {
        extendPrismaSchema: model => model.replace('}', '@@schema("first")' + '\n}'),
      },
      fields: {
        title: text(),
      },
    }),
    SecondTodo: list({
      access: allowAll,
      db: {
        extendPrismaSchema: model => model.replace('}', '@@schema("second")' + '\n}'),
      },
      fields: {
        title: text(),
      },
    }),
  },
})
