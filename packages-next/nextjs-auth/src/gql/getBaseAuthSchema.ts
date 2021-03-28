import type { GraphQLSchemaExtension, KeystoneContext } from '@keystone-next/types';

import { AuthGqlNames } from '../types';
import { getSession } from 'next-auth/client';

import { getPasswordAuthError } from '../lib/getErrorMessage';
import { validateNextAuth } from '../lib/validateNextAuth';

export function getBaseAuthSchema<I extends string, S extends string>({
  listKey,
  identityField,
  secretField,
  protectIdentities,
  gqlNames,
}: {
  listKey: string;
  identityField: I;
  secretField: S;
  protectIdentities: boolean;
  gqlNames: AuthGqlNames;
}): GraphQLSchemaExtension {
  return {
    typeDefs: `
      # Auth
      union AuthenticatedItem = ${listKey}
      type Query {
        authenticatedItem: AuthenticatedItem
      }
      # Password auth
      type Mutation {
        ${gqlNames.authenticateItemWithPassword}(${identityField}: String, ${secretField}: String): ${gqlNames.ItemAuthenticationWithPasswordResult}!
      }
      union ${gqlNames.ItemAuthenticationWithPasswordResult} = ${gqlNames.ItemAuthenticationWithPasswordSuccess} | ${gqlNames.ItemAuthenticationWithPasswordFailure}
      type ${gqlNames.ItemAuthenticationWithPasswordSuccess} {
        sessionToken: String!
        item: ${listKey}!
      }
      type ${gqlNames.ItemAuthenticationWithPasswordFailure} {
        code: PasswordAuthErrorCode!
        message: String!
      }
      enum PasswordAuthErrorCode {
        FAILURE
        IDENTITY_NOT_FOUND
        SECRET_NOT_SET
        MULTIPLE_IDENTITY_MATCHES
        SECRET_MISMATCH
      }
    `,
    resolvers: {
      Mutation: {
        async [gqlNames.authenticateItemWithPassword](
          root: any,
          args: { [P in I]: string } & { [P in S]: string },
          context
        ) {
          if (!context.startSession) {
            throw new Error('No session implementation available on context');
          }
          const req = context.req;
          const nextSession = await getSession({ req });
          console.log("NextSession - gql", nextSession);
          const list = context.keystone.lists[listKey];
          const itemAPI = context.sudo().lists[listKey];
          const identity = nextSession.subject;

          const result = await validateNextAuth(
            list,
            identityField,
            identity,
            secretField,
            protectIdentities,
            args[secretField],
            itemAPI
          );
          if (!result.success) {
            const message = getPasswordAuthError({
              identityField,
              secretField,
              itemSingular: list.adminUILabels.singular,
              itemPlural: list.adminUILabels.plural,
              code: result.code,
            });
            return { code: result.code, message };
          }
          // Update system state
          const sessionToken = await context.startSession({ listKey, itemId: result.item.id  });
          return { sessionToken, item: result.item };
        },
      },
      Query: {
        async authenticatedItem(root, args, { session, lists }) {
          if (typeof session?.itemId === 'string' && typeof session.listKey === 'string') {
            try {
              return lists[session.listKey].findOne({
                where: { id: session.itemId },
                resolveFields: false,
              });
            } catch (e) {
              return null;
            }
          }
          return null;
        },
      },
      AuthenticatedItem: {
        __resolveType(rootVal: any, { session }: KeystoneContext) {
          return session?.listKey;
        },
      },
      // TODO: Is this the preferred approach for this?
      [gqlNames.ItemAuthenticationWithPasswordResult]: {
        __resolveType(rootVal: any) {
          return rootVal.sessionToken
            ? gqlNames.ItemAuthenticationWithPasswordSuccess
            : gqlNames.ItemAuthenticationWithPasswordFailure;
        },
      },
    },
  };
}
