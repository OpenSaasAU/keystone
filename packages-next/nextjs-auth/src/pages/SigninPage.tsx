/* @jsx jsx */

import { useState, FormEvent, useRef, useEffect } from 'react';

import { jsx, H1, Stack } from '@keystone-ui/core';
import { Notice } from '@keystone-ui/notice';

import { useMutation, gql } from '@keystone-next/admin-ui/apollo';
import { useRawKeystone, useReinitContext } from '@keystone-next/admin-ui/context';
import { useRouter } from '@keystone-next/admin-ui/router';
import { Button } from '@keystone-ui/button';

type SigninPageProps = {
    identityField: string;
    secretField: string;
    mutationName: string;
    successTypename: string;
    failureTypename: string;
  };
  
export const getSigninPage = (props: SigninPageProps) => () => <SigninPage {...props} />;

export const SigninPage = ({
    identityField,
    secretField,
    mutationName,
    successTypename,
    failureTypename,
  }: SigninPageProps) => {
    const mutation = gql`
      mutation($identity: String, $secret: String) {
        authenticate: ${mutationName}(${identityField}: $identity, ${secretField}: $secret) {
          ... on ${successTypename} {
            item {
              id
            }  
          }
          ... on ${failureTypename} {
            message
          }
        }
      }
    `;

  const [mutate, { error, loading, data }] = useMutation(mutation);
  console.log("1", error, loading, data);
  const reinitContext = useReinitContext();
  const router = useRouter();
  const rawKeystone = useRawKeystone();
  const mode = 'signin'

  useEffect(() => {
    if (rawKeystone.authenticatedItem.state === 'authenticated') {
      router.push((router.query.from as string | undefined) || '/');
    }
  }, [rawKeystone.authenticatedItem, router.query.from]);

  const runMutate = async function result () {
    try {
      let result = await mutate({
        variables: {
        },
      });
      console.log("2", error, loading, data);
      if (result.data.authenticate?.__typename !== successTypename) {
        return;
      }
    } catch (err) {
      return;
    }
    
  }
  useEffect(() => {
    runMutate();
    reinitContext();
    console.log("3", error, loading, data);
    router.push((router.query.from as string | undefined) || '/');
  })

    return (
      <Stack
        gap="xlarge"
        as="form"
        onSubmit={async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          if (mode === 'signin') {
            try {
              let result = await mutate({
                variables: {
                },
              });
              if (result.data.authenticate?.__typename !== successTypename) {
                return;
              }
            } catch (err) {
              return;
            }
            reinitContext();
            router.push((router.query.from as string | undefined) || '/');
          }
        }}
      >
      <H1>Sign In</H1>
      {loading && (
        <Notice title="Loading" tone="positive">
        Loading
      </Notice>
      )}
      {error && (
        <Notice title="Error" tone="negative">
          {error.message}
        </Notice>
      )}
      {data?.authenticate?.__typename === failureTypename && (
        <Notice title="Error" tone="negative">
          {data?.authenticate.message}
        </Notice>
      )}
      <Button
              weight="bold"
              tone="active"
              isLoading={
                loading ||
                // this is for while the page is loading but the mutation has finished successfully
                data?.authenticate?.__typename === successTypename
              }
              type="submit"
            >
              Sign In
            </Button>
    </Stack>
  )
};