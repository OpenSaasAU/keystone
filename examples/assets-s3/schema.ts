import { list } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { text, image, file } from '@opensaas/keystone-core/fields'

import type { Lists } from '.keystone/types'

export const lists = {
  Post: list({
    access: allowAll,
    fields: {
      title: text({ validation: { isRequired: true } }),
      content: text(),
      banner: image({ storage: 'my_images' }),
      attachment: file({ storage: 'my_files' }),
    },
  }),
} satisfies Lists
