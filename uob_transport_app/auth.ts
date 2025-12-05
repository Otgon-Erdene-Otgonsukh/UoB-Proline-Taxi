import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// Re-use existing function implemented by Yidi
import { searchUserAccess } from "@/backend/access/user_access";
import { User } from '@/generated/prisma/browser';
import bcrypt from "bcryptjs"

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
                const { email, password } = credentials as { email: string; password: string };

                // Server side validation.
                if (email.length < 1 || password.length < 1) {
                    throw new Error("Email or password too short.")
                } else if (email.length > 32 || password.length > 64) {
                    throw new Error("Email or password too long.")
                }

                const userDetail: User | null = await searchUserAccess(email);

                if (userDetail) {
                    // Compare the password against the hashed + salted password against the DB.
                    if (bcrypt.compareSync(credentials.password, userDetail.password)) {
                        // Stripped down user object / info to transform into the JWT by NextAuth.
                        // We do not want the entire user object as it would be quite large and pointless.
                        return {
                            user_id: userDetail.user_id,
                            username: userDetail.username,
                            name: userDetail.name,
                            email: userDetail.email,
                        };
                        
                    }

                }

               // Error to show if credentials are incorrect.
                throw new Error("Invalid credentials.")
            },
        }),
    ],
    callbacks: {
        // Adding username + other data to the session.
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name
            }
            return token;
        },

        async session({ session, token }) {
            if (token?.firstname) {
                session.user.name = token.name as string;
            }
            return session;
        }
    }
})