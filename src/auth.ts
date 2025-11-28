import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { searchUserAccess } from "@/backend/access/user_access";
import { User } from '@/generated/prisma/browser';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const userDetail: User | null = await searchUserAccess(credentials.email);

        if (userDetail && userDetail.password === credentials.password) {
            // Stripped down user object / info to transform into the JWT.
            // We do not want the entire user object as it would be quite large and pointless.
            return {
                user_id: userDetail.user_id,
                username: userDetail.username,
                email: userDetail.email,
                };
        } else {
            // Error to show if credentials are incorrect.
            throw new Error("Invalid credentials.")
        }
      },
    }),
  ],
})