import { list, config } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { checkbox, text } from '@opensaas/keystone-core/fields'

export default config({
  db: {
    provider: 'sqlite',
    url: 'file:./app.db',
    prismaClientPath: 'node_modules/.testprisma/client',
  },
  ui: { isDisabled: true },
  lists: {
    Todo: list({
      access: allowAll,
      fields: {
        title: text(),
        isComplete: checkbox(),
      },
    }),
  },
})
