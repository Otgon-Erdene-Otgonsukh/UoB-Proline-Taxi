import sendRes from "@/backend/register/send_res";
import { sesClient } from "@/utils/ses_client";
import { render } from "@react-email/components";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";

jest.mock("@/utils/ses_client", () => ({
  sesClient: {
    send: jest.fn(),
  },
}));

jest.mock("@react-email/components", () => ({
  render: jest.fn().mockResolvedValue("<html>test</html>"),
}));

jest.mock("@aws-sdk/client-sesv2", () => ({
  SendEmailCommand: jest.fn(),
}));

describe("The registration response email is sent with the correct details", () => {
  test("When the response is rejection, the email title is the expected", async () => {
    await sendRes("Test", "test@example.com", 2);

    expect(render as jest.Mock).toHaveBeenCalledTimes(1);
    expect(SendEmailCommand as unknown as jest.Mock).toHaveBeenCalledWith({
      FromEmailAddress: `UoB Taxi & Chauffeur <${process.env.SES_FROM_EMAIL!}>`,
      Destination: {
        ToAddresses: ["test@example.com"],
      },
      Content: {
        Simple: {
          Subject: {
            Data: "Account Registration Rejected",
          },
          Body: {
            Html: {
              Data: "<html>test</html>",
            },
          },
        },
      },
    });
    expect(sesClient.send as jest.Mock).toHaveBeenCalledTimes(1);
  });
});
