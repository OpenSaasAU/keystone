import { list, config } from '@opensaas/keystone-core'
import { text } from '@opensaas/keystone-core/fields'
import { allowAll } from '@opensaas/keystone-core/access'

console.log('CLI-TESTS-NODE-ENV: ' + process.env.NODE_ENV)
console.log('CLI-TESTS-NODE-ENV-EVAL: ' + eval('process.env' + '.NODE_ENV'))

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
      },
    }),
  },
})
