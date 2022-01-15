import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

const refreshAccesToken = async (token: any) => {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("REFRESHED TOKEN IS ", refreshedToken);
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "REFRESH ACCESS TOKEN ERROR",
    };
  }
};

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      //@ts-expect-error
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      //@ts-expect-error
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,

      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      //initial signin
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          // @ts-expect-error
          accessTokenExpires: account?.expires_at * 1000,
        };
      }
      //if returned to website before the previous token is expired then return the previous token
      //@ts-expect-error
      if (Date.now() < token.accessTokenExpires) {
        console.log("EXISTING ACCESS TOKEN IS STILL VALID ");
        return token;
      }
      // refresh the access token
      console.log("Access token has expired , refreshing");
      return await refreshAccesToken(token);
    },
    async session({ session, token }) {
      //@ts-expect-error
      session.user.accessToken = token.accessToken;
      //@ts-expect-error
      session.user.refreshToken = token.refreshToken;
      //@ts-expect-error
      session.user.username = token.usernam;
      return session;
    },
  },
});
