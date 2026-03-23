import { sesClient } from "@/utils/ses_client";
import { render } from "@react-email/components";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import RegisterRequestMail from "@/components/emails/register_req_mail";
import Welcome from "@/components/emails/welcome";

export default async function sendReq(
  name: string,
  email: string,
  role: string,
) {
  if (role !== "normal_user") {
    const htmlData = await render(RegisterRequestMail({ name }));
    const input = new SendEmailCommand({
      FromEmailAddress: `UoB Taxi & Chauffeur <${process.env.SES_FROM_EMAIL!}>`,
      Destination: {
        ToAddresses: [email],
      },
      Content: {
        Simple: {
          Subject: {
            Data: "Account Registration Request Submitted",
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
  } else {
    const htmlData = await render(Welcome({ name: name, account_type: role }));
    const input = new SendEmailCommand({
      FromEmailAddress: `UoB Taxi & Chauffeur <${process.env.SES_FROM_EMAIL!}>`,
      Destination: {
        ToAddresses: ["otgonerdeneotgonsukh@gmail.com"],
      },
      Content: {
        Simple: {
          Subject: {
            Data: "Account Created, Welcome!",
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
}
