import {
  Html,
  Head,
  Container,
  Section,
  Text,
  Hr,
  Tailwind,
  Button,
} from "@react-email/components";

export default function RegisterResponseMail({
  name,
  status,
}: {
  name: string;
  status: number;
}) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Container className="mx-auto bg-gray-100 rounded-lg p-1">
          <Section
            className={`${status === 1 ? "bg-green-100" : "bg-red-100"} px-6 pt-7 pb-5 rounded-md text-center`}
          >
            <Text
              className={`text-xl font-bold ${status === 1 ? "text-green-700" : "text-red-700"} m-0 mt-1`}
            >
              Registration {status === 1 ? "Accepted ✓" : "Rejected ✗"}
            </Text>
            <Text
              className={`text-sm mt-1 ${status === 1 ? "text-green-800" : "text-red-800"}`}
            >
              Your registration request was{" "}
              {status === 1 ? "accepted" : "rejected"}
            </Text>
          </Section>

          <Section className="px-6 py-6 bg-white rounded-md">
            <Text className="text-lg font-semibold text-gray-700 mb-3">
              Hello {name},
            </Text>

            {status === 1 ? (
              <Text className="text-base text-gray-700 leading-relaxed mb-4">
                Great news! Your account registration request has been{" "}
                <strong>approved</strong> by the system admin. Click the button
                below to sign in using the credentials you registered.
              </Text>
            ) : (
              <Text className="text-base text-gray-700 leading-relaxed mb-4">
                We’re sorry — your registration request was{" "}
                <strong>not approved</strong> by the administrator. If you
                believe this was a mistake, review and update your registration
                details and submit a new request if needed.
              </Text>
            )}

            {status === 1 ? (
              <Section className="text-center">
                <Button
                  className="px-10 py-2 bg-blue-700 rounded-md text-sm text-white mt-4 font-semibold mx-auto cursor-pointer"
                  href={
                    process.env.NODE_ENV === "development"
                      ? "http://localhost:3000/login"
                      : "http://uob-transport-alb-848507222.eu-west-2.elb.amazonaws.com/login"
                  }
                >
                  Log In
                </Button>
              </Section>
            ) : (
              <Section className="text-center">
                <Button
                  className="px-10 py-2 bg-blue-700 rounded-md text-sm text-white mt-4 font-semibold mx-auto cursor-pointer"
                  href={
                    process.env.NODE_ENV === "development"
                      ? "http://localhost:3000/register"
                      : "http://uob-transport-alb-848507222.eu-west-2.elb.amazonaws.com/register"
                  }
                >
                  Register Again
                </Button>
              </Section>
            )}

            <Hr className="my-6 border-gray-300" />

            <Text className="text-gray-500 text-xs text-center">
              UoB Taxi & Chauffeur
              <br />
              This is an automated message, please do not reply to this email.
            </Text>
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
}
