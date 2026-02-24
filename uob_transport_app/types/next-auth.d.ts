//import NextAuth from "next-auth";
import NextAuth from "next-auth"

// Custom user object for some cosmetic parts of the page such as welcome messages.

declare module "next-auth" {
    interface User {
        user_id: number;
        name: string;
        account_type: string;
    }

    interface Session {
        user: {
            name: string;
            user_id: number;
            account_type: string;
        };
    }

    interface JWT {
        name: string;
        user_id: number;
        account_type: string;
    }
}