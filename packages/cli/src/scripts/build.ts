import esbuild from 'esbuild'
import {
  generateArtifacts,
  generatePrismaClient,
  generateTypes,
  validateArtifacts,
} from '../artifacts'
import { getEsbuildConfig } from './esbuild'
import type { Flags } from './cli'
import { importBuiltKeystoneConfiguration } from './utils'
import { createSystem } from '@opensaas/keystone-core/lib'

export async function build (
  cwd: string,
  { frozen, prisma, ui }: Pick<Flags, 'frozen' | 'prisma' | 'ui'>
) {
  // TODO: should this happen if frozen?
  await esbuild.build(await getEsbuildConfig(cwd))

  const system = createSystem(await importBuiltKeystoneConfiguration(cwd))
  if (prisma) {
    if (frozen) {
      await validateArtifacts(cwd, system)
      console.log('✨ GraphQL and Prisma schemas are up to date') // TODO: validating?
    } else {
      await generateArtifacts(cwd, system)
      console.log('✨ Generated GraphQL and Prisma schemas') // TODO: generating?
    }

    await generateTypes(cwd, system)
    await generatePrismaClient(cwd, system)
  }

  if (system.config.ui?.isDisabled || !ui) return
}
