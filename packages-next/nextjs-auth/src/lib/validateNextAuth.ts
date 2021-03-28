import type { KeystoneListsAPI } from '@keystone-next/types';
import { NextAuthErrorCode } from '../types';
import { findMatchingIdentity } from './findMatchingIdentity';

export async function validateNextAuth(
    list: any,
    identityField: string,
    identity: string,
    secretField: string,
    protectIdentities: boolean,
    secret: string,
    itemAPI: KeystoneListsAPI<any>[string]
  ): Promise<
  | { success: false; code: NextAuthErrorCode }
  | { success: true; item: { id: any; [prop: string]: any } }
> {
 const match = await findMatchingIdentity(identityField, identity, itemAPI);
 let code: NextAuthErrorCode | undefined;

 if (!match.success) {
    code = match.code;
  }

  const { item } = match as { success: true; item: { id: any; [prop: string]: any } };

  if (item){
    return {success: true, item};
  } else {
    return { success: false, code: protectIdentities ? 'FAILURE' : 'SECRET_MISMATCH' };
  }
 
}