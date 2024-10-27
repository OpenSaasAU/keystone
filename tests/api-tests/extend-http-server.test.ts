import { list } from '@opensaas/keystone-core'
import { text } from '@opensaas/keystone-core/fields'
import { allowAll } from '@opensaas/keystone-core/access'
import supertest from 'supertest'

import { setupTestRunner } from './test-runner'

const runner = setupTestRunner({
  serve: true,
  config: {
    lists: {
      User: list({
        access: allowAll,
        fields: {
          name: text()
        },
      }),
    },
    server: {
      extendHttpServer: server => {
        server.prependListener('request', (req, res) => {
          res.setHeader('test-header', 'test-header-value')
        })
      },
    },
  },
})

test('server extension', runner(async ({ http }) => {
  await supertest(http).get('/anything').expect('test-header', 'test-header-value')
}))
