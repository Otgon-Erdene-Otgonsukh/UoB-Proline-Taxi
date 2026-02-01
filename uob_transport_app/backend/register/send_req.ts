import { sesClient } from "@/utils/ses_client";
import { render } from "@react-email/components";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import RegisterRequestMail from "@/components/emails/register_req_mail";

export default async function sendReq(name: string, email: string) {
    const htmlData = await render(RegisterRequestMail({name}))
    const input = new SendEmailCommand({
        FromEmailAddress: process.env.SES_FROM_EMAIL!,
        Destination: {
            ToAddresses: [email]
        },
        Content: {
            Simple: {
                Subject: {
                    Data: "Account Registration Request Submitted"
                },
                Body: {
                    Html: {
                        Data: htmlData
                    }
                }
            }
        }
    })
    await sesClient.send(input);
}