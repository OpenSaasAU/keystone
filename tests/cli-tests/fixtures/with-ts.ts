import { config, list } from '@opensaas/keystone-core'
import { text } from '@opensaas/keystone-core/fields'
import { allowAll } from '@opensaas/keystone-core/access'

export type something = string

export default config({
  db: {
    provider: 'sqlite',
    url: 'file:./app.db',
    prismaClientPath: 'node_modules/.testprisma/client',
  },
  lists: {
    Todo: list({
      access: allowAll,
      fields: {
        title: text(),
      },
    }),
  },
})
