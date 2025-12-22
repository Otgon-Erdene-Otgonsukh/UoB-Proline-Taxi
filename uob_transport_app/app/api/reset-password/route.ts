import { updateUserPassowrdAccess } from "@/backend/access/user_access";
import { getUserResetByUuidAccess, deleteUserResetAccess } from "@/backend/access/user_reset_access";

import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const requestJson = await request.json()
  const uuid = requestJson['uuid']
  const newPassword = requestJson['password']

  const userReset = await getUserResetByUuidAccess(uuid)

  if (userReset && userReset.expired_at > new Date()) {
    await updateUserPassowrdAccess(userReset.email, newPassword)
    // delete the user reset record when the password has been changed
    await deleteUserResetAccess(userReset.id)
    return new Response(JSON.stringify({
      message: 'update password success'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (userReset) {
    // delete the user reset record when it is expired
    await deleteUserResetAccess(userReset.id)
  }
  return new Response(JSON.stringify({
    message: 'This link has been expired!'
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}