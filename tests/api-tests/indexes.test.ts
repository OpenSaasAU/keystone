import { list } from '@opensaas/keystone-core'
import { allowAll } from '@opensaas/keystone-core/access'
import { select, text } from '@opensaas/keystone-core/fields'
import { setupTestEnv } from './test-runner'
import { dbProvider } from './utils'

test('isIndexed: true and db.map on a text field generates a valid Prisma schema', async () => {
  const { artifacts, system } = await setupTestEnv({
    config: {
      lists: {
        Test: list({
          access: allowAll,
          fields: {
            somethingIndexed: text({ isIndexed: true, db: { map: 'something' } }),
            other: text(),
          },
        }),
      },
    }
  })

  expect(artifacts.prisma).toEqual(
`// This file is automatically generated by Keystone, do not modify it manually.
// Modify your Keystone config when you want to change this.

datasource ${dbProvider} {
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  provider          = "${dbProvider}"
}

generator client {
  provider = "prisma-client-js"
  output   = "${system.config.db.prismaClientPath}"
}

model Test {
  id               String @id @default(cuid())
  somethingIndexed String @default("") @map("something")
  other            String @default("")

  @@index([somethingIndexed])
}
`)
})

if (dbProvider === 'postgresql') {
  // scalar and enum fields are printed slightly differently so that's why we're also testing an enum select field
  test('isIndexed: true and db.map on an enum select field generates a valid Prisma schema', async () => {
    const { artifacts, system } = await setupTestEnv({
      config: {
        lists: {
          Test: list({
            access: allowAll,
            fields: {
              somethingIndexed: text({ isIndexed: true, db: { map: 'something' } }),
              enumSelectIndexed: select({
                type: 'enum',
                options: ['a', 'b'],
                isIndexed: true,
                db: { map: 'enum_select' },
              }),
              other: text(),
            },
          }),
        },
      }
    })
    expect(artifacts.prisma).toEqual(
`// This file is automatically generated by Keystone, do not modify it manually.
// Modify your Keystone config when you want to change this.

datasource postgresql {
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  provider          = "postgresql"
}

generator client {
  provider = "prisma-client-js"
  output   = "${system.config.db.prismaClientPath}"
}

model Test {
  id                String                     @id @default(cuid())
  somethingIndexed  String                     @default("") @map("something")
  enumSelectIndexed TestEnumSelectIndexedType? @map("enum_select")
  other             String                     @default("")

  @@index([somethingIndexed])
  @@index([enumSelectIndexed])
}

enum TestEnumSelectIndexedType {
  a
  b
}
`)
  })
}
