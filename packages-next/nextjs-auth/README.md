# @keystone-next/nextjs-auth

Does not work properly yet! Allows login but does not check if the user is in the keystone db or is allowed access in anyway. Purely being used as a POC/net-auth playground. and just setup for auth0 at this stage...

You will need to following setup:
```
process.env.AUTH0_CLIENT_ID
process.env.AUTH0_CLIENT_SECRET
process.env.AUTH0_DOMAIN
process.env.NEXTAUTH_URL
```

This is just copied from the keystone-next/auth package and changed up a bit to work with next-auth