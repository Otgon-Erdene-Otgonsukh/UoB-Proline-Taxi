import { updateUserPassowrdAccess } from "@/backend/access/user_access";
import { getUserResetByUuidAccess, deleteUserResetAccess } from "@/backend/access/user_reset_access";
import bcrypt from "bcryptjs"
import { NextRequest } from "next/server";
import { withRateLimit } from "@/lib/rateLimit";

async function resetPasswordHandler(request: NextRequest) {
  const requestJson = await request.json()
  const uuid = requestJson['uuid']
  const newPassword = requestJson['password']

  // Server side validaion length check.
  if (newPassword.length === 0 || newPassword === null || newPassword === undefined) {
    return new Response(JSON.stringify({
      message: 'Password is required.'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (newPassword.length < 5) {
    return new Response(JSON.stringify({
      message: 'Password too short.'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (newPassword.length > 64) {
    return new Response(JSON.stringify({
      message: 'Password too long.'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Hash the inputted password.
  const hashRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, hashRounds);

  const userReset = await getUserResetByUuidAccess(uuid)

  if (userReset && userReset.expired_at > new Date()) {
    await updateUserPassowrdAccess(userReset.email, hashedPassword)
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

export async function POST(request: NextRequest) {
  return withRateLimit({
    limit: 100, // 100 requests per 10 minutes
    windowMs: 1000 * 60 * 10, // 10 minutes
    getIdentifier: (req) => req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for') ?? 'global', // get the IP address of the request
  })(resetPasswordHandler)(request);
}