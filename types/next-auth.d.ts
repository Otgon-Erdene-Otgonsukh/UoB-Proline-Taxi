import NextAuth from "next-auth";

// Custom user object for some cosmetic parts of the page such as welcome messages.

declare module "next-auth" {
    interface Session {
        user: {
        name: string;
        email: string;
        username: string;
        };
    }

    interface JWT {
        name: string;
        email: string;
  }
}
