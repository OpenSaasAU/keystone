import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { useState, FormEvent, useRef, useEffect } from 'react';

type NextAuthPageProps = {
    identityField: string;
    secretField: string;
    mutationName: string;
    successTypename: string;
    failureTypename: string;
  };

export const getNextAuthPage = (props: NextAuthPageProps) => () => <NextAuthPage {...props} />;

export default NextAuthPage({
    providers: [
        Providers.Auth0({
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            domain: process.env.AUTH0_DOMAIN,
        })
    ]
});