import { NextRequest } from "next/server";
import { createTransport } from "nodemailer"

// const resend = new Nodemailer();

export async function POST(request: NextRequest) {
  const requestJson = await request.json()
  const toEmail = requestJson['email']

  console.log(toEmail);

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
      subject: 'Hello world',
      text: 'message',
      replyTo: process.env.EMAIL_USERNAME,
    })
    return new Response(JSON.stringify({
      message: 'send success'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error);

    return new Response(JSON.stringify({
      message: 'send email failed, try again later'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }






}