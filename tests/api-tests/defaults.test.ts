import { text } from '@opensaas/keystone-core/fields'
import { list } from '@opensaas/keystone-core'
import { type BaseFields } from '@opensaas/keystone-core/types'
import { allowAll } from '@opensaas/keystone-core/access'

import { setupTestRunner } from './test-runner'

const setupList = (fields: BaseFields<any>) =>
  setupTestRunner({
    config: ({
      lists: {
        User: list({
          access: allowAll,
          fields,
        }),
      },
    }),
  })

describe('defaultValue field config', () => {
  test(
    'text with isNullable: true has no default by default',
    setupList({ name: text({ db: { isNullable: true } }) })(async ({ context }) => {
      const result = await context.query.User.createOne({ data: {}, query: 'name' })
      expect(result).toMatchObject({ name: null })
    })
  )

  test(
    'Sets a scalar as a default',
    setupList({ name: text({ defaultValue: 'hello' }) })(async ({ context }) => {
      const result = await context.query.User.createOne({ data: {}, query: 'name' })
      expect(result).toMatchObject({ name: 'hello' })
    })
  )
})
