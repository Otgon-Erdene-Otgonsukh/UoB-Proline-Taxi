import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getUserListAccess, getUserCountAccess, updateUserAccess } from "@/backend/access/user_access";
import sendRes from "@/backend/register/send_res";
import { isAdmin } from "@/backend/access/user_access";

export async function GET(request: NextRequest) {

  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({
      message: 'login required'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Check if user does not have admin privileges.
  if (!await isAdmin(session.user.user_id)) {
    return new Response(JSON.stringify({
      message: 'Not authorised'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const searchParams = request.nextUrl.searchParams;

  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');
  const name = searchParams.get('name') || undefined
  const role = searchParams.get('role') || undefined
  const userStatus = searchParams.get('user_status') || undefined

  if (!page || !pageSize) {
    return new Response(JSON.stringify({ message: 'page params needed' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const userList = await getUserListAccess(parseInt(page), parseInt(pageSize), name, role, userStatus ? parseInt(userStatus) : undefined)
  const userCount = await getUserCountAccess(name, role, userStatus ? parseInt(userStatus) : undefined)

  return new Response(JSON.stringify({
    userList,
    userCount
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Update user info by super admin. This is used for user management in super admin dashboard. Super admin can update user's name, email, phone number, role, user status and department.
 * Only super admin can access this endpoint. This endpoint will also send approval/rejection email to the user when the user status is updated.
 * @param request 
 * @returns 
 */
export async function POST(request: NextRequest) {
  // TODO Check super admin

  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({
      message: 'login required'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Check if user does not have admin privileges.
  if (!await isAdmin(session.user.user_id)) {
    return new Response(JSON.stringify({
      message: 'Not authorised'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const requestJson = await request.json()
  const userData = requestJson.userData

  const updateResult = await updateUserAccess(userData.user_id, {
    name: userData.name!,
    email: userData.email,
    phone_number: userData.phone_number!,
    role: userData.role!,
    user_status: userData.user_status,
    department: userData.department,
  })

  if (updateResult) {
    // send approval/rejection email from the server side
    try {
      await sendRes(userData.name!, userData.email, userData.user_status);
    } catch (err) {
      console.error("Failed to send registration response email:", err);
    }
    return new Response(JSON.stringify({
      message: 'update user success'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({
      message: 'update user failed'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
