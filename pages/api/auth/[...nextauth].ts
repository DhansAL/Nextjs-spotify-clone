import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      //@ts-expect-error
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      //@ts-expect-error
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,

      //   authorization: LOGIN_URL
    }),
    // ...add more providers here
  ],
});
