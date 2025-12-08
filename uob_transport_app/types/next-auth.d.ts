import NextAuth from "next-auth";

// Custom user object for some cosmetic parts of the page such as welcome messages.

declare module "next-auth" {
    interface User {
        user_id: number;
        username: string;
    }

    interface Session {
        user: {
            name: string;
            email: string;
            username: string;
            user_id: number;
        };
    }

    interface JWT {
        name: string;
        email: string;
        user_id: number;
    }
}
