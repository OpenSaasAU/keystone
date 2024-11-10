import { type GraphQLNamedType, GraphQLSchema } from 'graphql'

import { graphql } from '../types/schema'
import {
  type __ResolvedKeystoneConfig
} from '../types'
import type { InitialisedList } from './core/initialise-lists'
import { KeystoneMeta } from './resolve-admin-meta'

import { getQueriesForList } from './core/queries'
import { getMutationsForList } from './core/mutations'
import type { AdminMetaRootVal } from './create-admin-meta'

function getGraphQLSchema (
  lists: Record<string, InitialisedList>,
  extraFields: {
    query: Record<string, graphql.Field<unknown, any, graphql.OutputType, string>>
    mutation: Record<string, graphql.Field<unknown, any, graphql.OutputType, string>>
  },
  sudo: boolean
) {
  const query = graphql.object()({
    name: 'Query',
    fields: Object.assign(
      {},
      ...Object.values(lists).map(list => getQueriesForList(list)),
      extraFields.query
    ),
  })

  const updateManyByList: Record<string, graphql.InputObjectType<any>> = {}
  const mutation = graphql.object()({
    name: 'Mutation',
    fields: Object.assign(
      {},
      ...Object.values(lists).map(list => {
        const { mutations, updateManyInput } = getMutationsForList(list)
        updateManyByList[list.listKey] = updateManyInput
        return mutations
      }),
    ),
  })

  return new GraphQLSchema({
    query: query.graphQLType,
    mutation: mutation.graphQLType,
    // not about behaviour, only ordering
    types: [...collectTypes(lists, updateManyByList), mutation.graphQLType],
    extensions: {
      sudo,
    },
  })
}

function collectTypes (
  lists: Record<string, InitialisedList>,
  updateManyByList: Record<string, graphql.InputObjectType<any>>
) {
  const collectedTypes: Set<GraphQLNamedType> = new Set()
  for (const list of Object.values(lists)) {
    const { isEnabled } = list.graphql
    if (!isEnabled.type) continue
    // adding all of these types explicitly isn't strictly necessary but we do it to create a certain order in the schema
    collectedTypes.add(list.graphql.types.output.graphQLType)
    if (isEnabled.query || isEnabled.update || isEnabled.delete) {
      collectedTypes.add(list.graphql.types.uniqueWhere.graphQLType)
    }
    if (isEnabled.query) {
      for (const field of Object.values(list.fields)) {
        if (
          isEnabled.query &&
          field.graphql.isEnabled.read &&
          field.unreferencedConcreteInterfaceImplementations
        ) {
          // this _IS_ actually necessary since they aren't implicitly referenced by other types, unlike the types above
          field.unreferencedConcreteInterfaceImplementations.map(x => x.graphQLType).forEach(collectedTypes.add, collectedTypes)
        }
      }
      collectedTypes.add(list.graphql.types.where.graphQLType)
      collectedTypes.add(list.graphql.types.orderBy.graphQLType)
    }
    if (isEnabled.update) {
      if (list.graphql.types.update.kind === 'input') {
        collectedTypes.add(list.graphql.types.update.graphQLType)
      }
      collectedTypes.add(updateManyByList[list.listKey].graphQLType)
    }
    if (isEnabled.create) {
      if (list.graphql.types.create.kind === 'input') {
        collectedTypes.add(list.graphql.types.create.graphQLType)
      }
    }
  }
  // this is not necessary, just about ordering
  collectedTypes.add(graphql.JSON.graphQLType)
  return collectedTypes
}

export function createGraphQLSchema (
  config: __ResolvedKeystoneConfig,
  lists: Record<string, InitialisedList>,
  adminMeta: AdminMetaRootVal | null,
  sudo: boolean
) {
  const graphQLSchema = getGraphQLSchema(
    lists,
    {
      mutation: config.session
        ? {
            endSession: graphql.field({
              type: graphql.nonNull(graphql.Boolean),
              async resolve (rootVal, args, context) {
                await context.sessionStrategy?.end({ context })
                return true
              },
            }),
          }
        : {},
      query: adminMeta
        ? {
            keystone: graphql.field({
              type: graphql.nonNull(KeystoneMeta),
              resolve: () => ({ adminMeta }),
            }),
          }
        : {},
    },
    sudo
  )

  // merge in the user defined graphQL API
  return config.graphql?.extendGraphqlSchema?.(graphQLSchema) ?? graphQLSchema
}
