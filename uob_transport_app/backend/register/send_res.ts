import { sesClient } from "@/utils/ses_client";
import { render } from "@react-email/components";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import RegisterResponseMail from "@/components/emails/register_req_res";

export default async function sendRes(
  name: string,
  email: string,
  status: number,
) {
  const htmlData = await render(RegisterResponseMail({ name, status }));
  const input = new SendEmailCommand({
    FromEmailAddress: process.env.SES_FROM_EMAIL!,
    Destination: {
      ToAddresses: [email],
    },
    Content: {
      Simple: {
        Subject: {
          Data:
            status === 1
              ? "Account Registration Accepted"
              : "Account Registration Rejected",
        },
        Body: {
          Html: {
            Data: htmlData,
          },
        },
      },
    },
  });
  await sesClient.send(input);
}
