import prisma from "@/utils/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
    const data = await req.json();
    const session = await auth();
    const userId: number = data.user_id;
    const department = await prisma.user.findUnique({
        where: {
            user_id: userId
        },
        select: {
            dep_id: true
        }
    })
    const depId = department?.dep_id;

    if (!depId) {
        return NextResponse.json({ message: "Bad request" }, {
            status: 400
        })
    }
 
    const isAssign : boolean = JSON.parse(data.isAssign);

    if (!session) {
        return NextResponse.json({ message: "Unauthenticated access" }, {
            status: 401
        })
    }

    if (session?.user.account_type != "super_admin") {
        return NextResponse.json({ message: "Unauthorised access" }, {
            status: 403
        })
    }



    try {
        if (isAssign) {
            await prisma.department.update({
                where: {
                    dep_id: depId
                },
                data: {
                    manager_id: userId
                }
            })
        }
        else {
            await prisma.department.update({
                where: {
                    dep_id: depId
                },
                data: {
                    manager_id: null
                }
            })
        }
        return NextResponse.json({ message: "Manager updated successfully" }, { status: 200 });
    } catch {
        return NextResponse.json({ message: "There was an error" }, { status: 500 })
    }


}