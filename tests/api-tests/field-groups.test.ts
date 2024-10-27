import { group, list } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { getContext } from '@opensaas/keystone-core/context'
import { integer, text } from '@opensaas/keystone-core/fields'

test('errors with nested field groups', () => {
  expect(() =>
    getContext({
      db: {
        provider: 'sqlite',
        url: 'file://'
      },
      lists: {
        User: list({
          access: allowAll,
          fields: {
            name: text(),
            ...group({
              label: 'Group 1',
              fields: {
                ...group({
                  label: 'Group 2',
                  fields: {
                    something: integer(),
                  },
                }),
              },
            }),
          },
        }),
      },
    }, {})
  ).toThrowErrorMatchingInlineSnapshot(`"groups cannot be nested"`)
})

test('errors if you write a group manually differently to the group function', () => {
  expect(() =>
    getContext({
      db: {
        provider: 'sqlite',
        url: 'file://'
      },
      lists: {
        User: list({
          access: allowAll,
          fields: {
            name: text(),
            __group0: {
              fields: ['name'],
              label: 'Group 1',
              description: null,
            } as any,
          },
        }),
      }
    }, {})
  ).toThrowErrorMatchingInlineSnapshot(`"unexpected value for a group at User.__group0"`)
})
