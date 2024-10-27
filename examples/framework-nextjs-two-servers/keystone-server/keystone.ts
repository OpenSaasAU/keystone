import { config } from '@opensaas/keystone-core'
import type { KeystoneConfig } from '@opensaas/keystone-core/types'
import { seedDatabase } from './src/seed'
import { lists } from './src/schema'
import { type Context, type TypeInfo } from '.keystone/types'

const db: KeystoneConfig<TypeInfo>['db'] = {
  provider: 'sqlite',
  url: process.env.DATABASE_URL || 'file:./database.db',
  async onConnect (context: Context) {
    if (process.argv.includes('--seed-database')) {
      await seedDatabase(context)
    }
  },

  // WARNING: this is only needed for our monorepo examples, dont do this
  prismaClientPath: 'node_modules/myprisma',
}

export default config({
  db,
  lists,
})
