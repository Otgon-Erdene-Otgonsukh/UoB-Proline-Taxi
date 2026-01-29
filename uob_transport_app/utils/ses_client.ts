import { SESv2Client } from "@aws-sdk/client-sesv2";

// Reusable SES client
export const sesClient = new SESv2Client({
  region: process.env.AWS_SES_REGION!,
  // The credeentials are for dev only, for production: use task role for temporary permissioned access
  //credentials: {
    //accessKeyId: process.env.AWS_ACCESS_KEY!,
    //secretAccessKey: process.env.AWS_SECRET_KEY!
  //}
})