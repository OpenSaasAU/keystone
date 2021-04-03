import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

//Need to bring in correct props
type NextAuthPageProps = {
    identityField: string;
    secretField: string;
    mutationName: string;
    successTypename: string;
    failureTypename: string;
  };
export const getNextAuthPage = (props: NextAuthPageProps) => () => NextAuthPage({ ...props });

export default function NextAuthPage(props: NextAuthPageProps){
    console.log(props);
    return NextAuth({
        providers: [
            Providers.Auth0({
                clientId: process.env.AUTH0_CLIENT_ID || '',
                clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
                domain: process.env.AUTH0_DOMAIN || '',
            })
        ],
        callbacks: {
            async signIn(user, account, profile) {
                console.log('Signin... User:' , user, 'Account: ', account, 'Profile: ', profile);
                // TODO Check if the user is allowed access...
                const isUser = true;
                if (isUser){
                    return true;
                } else {
                    return false;
                }
            },
            async redirect(url, baseUrl) {
                console.log('Redirect... URL: ', url, 'baseUrl: ', baseUrl);
                return '/signin';
            },
            async session(session: any, token: any) {
                session.subject = token.sub;
                return Promise.resolve(session);
            },
            async jwt(token, user, account, profile, isNewUser) {
                console.log('JWT: ... Token', token, 'User: ', user, 'Account: ', account, 'Profile: ', profile, 'isNewUser: ', isNewUser);
                return token;
            }
        }
    });
}