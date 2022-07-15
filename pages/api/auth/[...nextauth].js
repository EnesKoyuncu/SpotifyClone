import { Session } from "inspector";
import { SessionProvider } from "next-auth/react"
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token){
  try{

    spotifyApi.setAccessToken(token.accesToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const {body: refreshedToken} = await spotifyApi.refreshAccessToken();
    console.log("REFRESHED TOKEN IS", refreshedToken)

    return{
      ...token,
      accesToken : refreshedToken.access_token,
      accessTokenExpires : Date.now + refreshedToken.expires_in *1000, // 1 hour as 3600 returns from Spotify API
      refreshToken : refreshedToken.refresh_token ?? token.refreshToken,
      // replace if new one comes back else fall back to old refresh token
    }

  }catch(error){ // basit hata yakalama olayı. c#'ta da vardı.
    console.error(error)

    return{
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}



export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider ({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
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
    async jwt({token, account, user}){

        //initial sign in
        if(account && user) {
            return{
                ...token,
                accesToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires : account.expires_at *1000, 
            }
        }

        // return previous token if the access token has not expired yet
        if(Date.now() < token.accessTokenExpires){
            console.log("EXISTING ACCESS TOKEN IS VALID");
            return token;
        }
        
        // access token has expired, so we need to refresh it ...
            console.log("ACCES TOKEN HAS EXPIRED, REFRESHING...");
            return await refreshAccessToken(token);
    },

    async session ({session,token}){
      session.user.accesToken = token.accesToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    }
  }
})