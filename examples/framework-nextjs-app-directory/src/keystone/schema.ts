import { list } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { text, timestamp } from '@opensaas/keystone-core/fields'
import { document } from '@opensaas/keystone-fields-document'

import { type Lists } from '.keystone/types'

export const lists = {
  User: list({
    // WARNING
    //   for this example, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    fields: {
      name: text({ validation: { isRequired: true } }),
      about: document({
        formatting: true,
        dividers: true,
        links: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
        ],
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
} satisfies Lists
