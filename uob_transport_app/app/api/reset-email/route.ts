import { createUserResetAccess } from "@/backend/access/user_reset_access";
import { generateUuid } from "@/backend/utils/uuid";
import { NextRequest } from "next/server";
import { createTransport } from "nodemailer"

// const resend = new Nodemailer();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const uuid = searchParams.get('uuid');

  // TODO

}

export async function POST(request: NextRequest) {
  const requestJson = await request.json()
  const toEmail = requestJson['email']

  const uuid = generateUuid()
  console.log(toEmail);
  console.log(uuid);

  // TODO Check if there already has a field in the UserReset Table
  const userReset = await createUserResetAccess(toEmail, uuid)
  console.log(userReset);

  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  if (userReset) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: toEmail,
        subject: 'Reset Password',
        text: `Please go to the following link to reset the password: \nhttp://localhost:3000/home/reset-password?uuid=${userReset.uuid} \nThe link expired at ${userReset.expired_at}`,
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
  } else {
    return new Response(JSON.stringify({
      message: 'send email failed, try again later'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

}