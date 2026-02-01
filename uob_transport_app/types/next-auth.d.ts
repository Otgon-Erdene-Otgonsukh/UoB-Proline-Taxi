//import NextAuth from "next-auth";
import NextAuth from "next-auth"

// Custom user object for some cosmetic parts of the page such as welcome messages.

declare module "next-auth" {
    interface User {
        user_id: number;
        name: string;
        email: string;
        phone_number: string;
        department: string | undefined;
        account_type: string;
    }

    interface Session {
        user: {
            name: string;
            email: string;
            user_id: number;
            phone_number: string;
            department: string | null;
            account_type: string;
        };
    }

    interface JWT {
        name: string;
        email: string;
        user_id: number;
        phone_number: string;
        department: string;
        account_type: string;
    }
}
