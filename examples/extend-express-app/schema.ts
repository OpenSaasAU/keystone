import { list } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import {
  checkbox,
  text
} from '@opensaas/keystone-core/fields'

import { type Lists } from '.keystone/types'

export const lists = {
  Post: list({
    access: allowAll,
    fields: {
      title: text(),
      content: text(),
      draft: checkbox()
    },
  }),
} satisfies Lists

