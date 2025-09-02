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

          if (!res.ok) return null;

          const { data, access_token, refresh_token } = await res.json();
          console.log("🚀 ~------------- data:", data);

          if (data && access_token) {
            return {
              id: data.sub,
              email: data.email,
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              role: data.role || "user",
              provider: data.provider,
              accessToken: access_token,
              refreshToken: refresh_token,
            };
          }

          return null;
        } catch (error) {
          console.log("🚀 ~ error:", error);

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
      const res = await fetch(`${env.API_URL}/auth/oauth`, {
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

      const { data } = await res.json();

      // Attach backend response to user object
      user.backendToken = data.token;
      user.role = data.role;
      user.id = data.sub;
      user.firstName = data.firstName || "";
      user.lastName = data.lastName || "";
      user.image = data.image || "";
      user.accessToken = data.access_token;
      user.refreshToken = data.refresh_token;
      user.isProfileComplete = data.isProfileComplete || false;

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
        token.image = user.image;

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
        image: token.image,
      };

      return session;
    },
  },
};

export default authOptions;
