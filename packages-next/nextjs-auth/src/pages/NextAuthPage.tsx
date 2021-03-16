import NextAuth from "next-auth"
import Providers from "next-auth/providers"


type NextAuthPageProps = {
    identityField: string;
    secretField: string;
    mutationName: string;
    successTypename: string;
    failureTypename: string;
  };
export const getNextAuthPage = (props: NextAuthPageProps ) => () => NextAuthPage({...props});
export default function NextAuthPage(props: NextAuthPageProps){
    return NextAuth({
        providers: [
            Providers.Auth0({
                clientId: process.env.AUTH0_CLIENT_ID,
                clientSecret: process.env.AUTH0_CLIENT_SECRET,
                domain: process.env.AUTH0_DOMAIN,
            })
        ],
        callbacks: {
            async signIn(user, account, profile) {

                console.log("Signin... User: ", user, "Account: ", account, "Profile: ", profile)
                return true
            },
            async redirect(url, baseUrl) {
                console.log("Redirect... URL: ", url, "baseUrl: ", baseUrl)
                return baseUrl
            },
            async session(session, user) {
                console.log("Session... Session: ", session, "User: ", user)
                return session
            },
            async jwt(token, user, account, profile, isNewUser) {
                console.log(" JWT... token: ", token, "User: ", user, "Account: ", account, "Profile: ", profile, "isNew: ", isNewUser)
                return token
            }
        }
    });
}


        