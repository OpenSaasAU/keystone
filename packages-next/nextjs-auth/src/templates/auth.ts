import { AuthGqlNames } from '../types';

export const authTemplate = ({
  gqlNames,
  identityField,
  secretField,
}: {
  gqlNames: AuthGqlNames;
  identityField: string;
  secretField: string;
}) => {
  // -- TEMPLATE START
  return `

  import getNextAuthPage from '@keystone-next/nextjs-auth/pages/NextAuthPage';



export default getNextAuthPage(${JSON.stringify({
  identityField: identityField,
  secretField: secretField,
  mutationName: gqlNames.authenticateItemWithPassword,
  successTypename: gqlNames.ItemAuthenticationWithPasswordSuccess,
  failureTypename: gqlNames.ItemAuthenticationWithPasswordFailure,
})});
`;
  // -- TEMPLATE END
};
