import { createUserResetAccess, deleteUserResetAccess, getUserResetAccess, getUserResetByUuidAccess } from "@/backend/access/user_reset_access";
import { generateUuid } from "@/backend/utils/uuid";
import { NextRequest } from "next/server";
import { createTransport } from "nodemailer"

// get user reset record by uuid
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const uuid = searchParams.get('uuid');

  // TODO
  if (!uuid) {
    return new Response(JSON.stringify({
      message: 'Invalid params'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  let userReset = await getUserResetByUuidAccess(uuid)

  if (userReset && userReset.expired_at < new Date()) {
    // expired, delete this record
    await deleteUserResetAccess(userReset.id)
    userReset = null
  }

  return new Response(JSON.stringify({
    userReset
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

}

export async function POST(request: NextRequest) {
  const requestJson = await request.json()
  const toEmail = requestJson['email']

  const uuid = generateUuid()

  let userReset = await getUserResetAccess(toEmail)
  if (userReset) {
    if (userReset.expired_at < new Date()) {
      // has expired, delete and create a new one the record
      await deleteUserResetAccess(userReset.id)
      userReset = await createUserResetAccess(toEmail, uuid)
    } else {
      // not expired, just send the email
    }
  } else {
    // no userReset record, dreate a new one
    userReset = await createUserResetAccess(toEmail, uuid)
  }

  if (userReset) {
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    })
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: toEmail,
        subject: 'Reset Password',
        text: `Please go to the following link to reset the password: \n\nhttp://localhost:3000/home/reset-password?uuid=${userReset.uuid} \n\nThe link expired at ${userReset.expired_at}`,
        replyTo: process.env.EMAIL_USERNAME,
      })
      return new Response(JSON.stringify({
        message: 'send success'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        message: 'send email failed, try again later'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

}