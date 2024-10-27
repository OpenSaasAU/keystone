import { config, list } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { text, timestamp } from '@opensaas/keystone-core/fields'
import { type TypeInfo } from '.keystone/types'

export default config<TypeInfo>({
  db: {
    provider: 'sqlite',
    url: process.env.DATABASE_URL || 'file:./keystone-example.db',

    // this is called by Keystone on start, or when connect() is called in script.ts
    onConnect: async context => {
      console.log('(keystone.ts)', 'onConnect')
      await context.db.Post.createOne({ data: { title: 'Created in onConnect' } })
    },

    // WARNING: this is only needed for our monorepo examples, dont do this
    prismaClientPath: 'node_modules/myprisma',
  },
  lists: {
    Post: list({
      access: allowAll,
      fields: {
        title: text(),
        createdAt: timestamp({
          db: {
            isNullable: false,
          },
          defaultValue: { kind: 'now' },
        }),
      },
    }),
  },
})
