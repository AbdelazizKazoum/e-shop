import "next-auth";
import { DefaultUser, Account, Profile as NextAuthProfile } from "next-auth";

// Extend the default Profile type to include Google fields
declare module "next-auth" {
  // This will replace the default Profile type inside callbacks
  interface Profile extends NextAuthProfile {
    given_name?: string;
    family_name?: string;
    email_verified?: boolean;
    picture?: string;
  }

  interface User extends DefaultUser {
    id?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    email?: string;
    image?: string;
    isProfileComplete?: boolean;

    accessToken?: string;
    refreshToken?: string;
    backendToken?: string;

    account?: Account;
    profile?: Profile;
  }

  interface Session {
    accessToken?: string;
    refreshToken?: string;
    account?: Account;
    profile?: Profile;

    user: {
      id?: string;
      username?: string;
      role?: string;
      email?: string;
      image?: string;
      lastName?: string;
      firstName?: string;
      isProfileComplete?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    email?: string;
    picture?: string;
    isProfileComplete?: boolean;

    accessToken?: string;
    refreshToken?: string;
    backendToken?: string;

    account?: Account;
    profile?: Profile;
  }
}
