import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// Re-use existing function implemented by Yidi
import { searchUserAccess } from "@/backend/access/user_access";
import { User, department } from "@/generated/prisma/browser";

import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Explicitly define that jwt is used for session management
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // Server side validation.
        if (email.length < 1 || password.length < 1) {
          throw new Error("Email or password too short.");
        } else if (email.length > 64 || password.length > 64) {
          throw new Error("Email or password too long.");
        }

        const userDetail: (User & { department: department | null }) | null =
          await searchUserAccess(email);

        if (userDetail) {
          // Compare the password against the hashed + salted password against the DB.
          if (bcrypt.compareSync(password, userDetail.password)) {
            // Stripped down user object / info to transform into the JWT by NextAuth.
            // We do not want the entire user object as it would be quite large and pointless.
            return {
              user_id: userDetail.user_id,
              name: userDetail.name,
              email: userDetail.email,
              phone_number: userDetail.phone_number,
              department: userDetail.department?.dep_name,
              account_type: userDetail.role,
            };
          }
        }

        // Error to show if credentials are incorrect.
        throw new Error("Invalid credentials.");
      },
    }),
  ],
  callbacks: {
    // Adding username + other data to the session.
    async jwt({ token, user, trigger, session }) {
      // On sign in, populate token from user
      if (user) {
        token.name = user.name;
        token.user_id = user.user_id;
        token.phone_number = user.phone_number;
        token.account_type = user.account_type;
        token.department = user.department;
      }

      // On update, use the session data passed from client to update both token and active session data
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.phone_number = session.user.phone_number;
        token.department = session.user.department;
        token.account_type = session.user.account_type;
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.name) {
        session.user.name = token.name as string;
      }
      if (token?.user_id) {
        session.user.user_id = token.user_id as number;
      }
      if (token?.phone_number) {
        session.user.phone_number = token.phone_number as string;
      }
      if (token?.department) {
        session.user.department = token.department as string;
      }
      if (token?.account_type) {
        session.user.account_type = token.account_type as string;
      }
      return session;
    },
  },
});
