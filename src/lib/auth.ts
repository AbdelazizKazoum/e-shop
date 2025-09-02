// lib/auth.ts (for NextAuth v4)
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { env } from "./env";

const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) return null;

        try {
          const res = await fetch(`${process.env.API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          console.log("🚀 ~ res:", res);

          if (!res.ok) return null;

          const data = await res.json();

          if (data && data.access_token) {
            // the backend returns user details along with tokens
            return {
              // id: credentials.email, // or fetch the actual user ID
              email: credentials.email,
              username: data.user.username || credentials.email.split("@")[0], // Fallback to email prefix
              firstName: data.user.firstName || "",
              lastName: data.user.lastName || "",
              image: data.user.image || "",
              // Include any other fields you need
              role: data.user.role || "user", // Default role
              accessToken: data.access_token, // Include access token in user object
              refreshToken: data.refresh_token, // Include refresh token if available
            };
          }

          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  secret: env.NEXTAUTH_SECRET,

  // Custom sign-in page
  pages: {
    signIn: "/login",
    error: "/login", // Error page
  },

  callbacks: {
    // 1) On OAuth sign-in, ask Nest if the user exists / is complete
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        // ✅ Already handled inside `authorize`
        return true;
      }

      // ✅ OAuth providers (Google, Facebook, etc.)
      const res = await fetch(`${env.API_URL}/auth/oauth-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: account?.provider,
          providerId: account?.providerAccountId,
          email: user.email,
          name: user.name,
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          image: user.image,
        }),
      });

      if (!res.ok) return false;

      const data = await res.json();

      // Attach backend response to user object
      user.backendToken = data.token;
      user.role = data.user.role;
      user.id = data.user.id;
      user.firstName = data.user.firstName || "";
      user.lastName = data.user.lastName || "";
      user.image = data.user.image || "";
      user.accessToken = data.access_token;
      user.refreshToken = data.refresh_token;
      user.isProfileComplete = data.user.isProfileComplete || false;

      return true;
    },

    // async redirect({ url, baseUrl }) {
    //   // If relative URL, allow it
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   // If same origin
    //   if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl; // default
    // },

    //-------------------------------------------------------------------------------------

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isProfileComplete = user.isProfileComplete;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user = {
        id: token.id,
        firstName: token.firstName,
        lastName: token.lastName,
        role: token.role,
        email: token.email,
        isProfileComplete: token.isProfileComplete,
      };

      return session;
    },
  },
};

export default authOptions;
