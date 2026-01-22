import {
  Html,
  Head,
  Heading,
  Tailwind,
  Button,
  Container,
  Text,
  Section,
  Hr,
} from "@react-email/components";

export default function ResetEmail({
  uuid,
  expiry,
}: {
  uuid: string;
  expiry: Date;
}) {
  const formattedExpiry = new Date(expiry)
    .toISOString()
    .replace("T", " ")
    .split(".")[0];

  return (
    <Html>
      <Tailwind>
        <Head />
        <Container className="mx-auto bg-gray-100 rounded-lg p-2">
          <Section className="bg-orange-300 text-white rounded-t-lg py-6 px-4">
            <Text className="font-bold text-center text-2xl m-0">
              UoB Taxi & Chauffeur
            </Text>
          </Section>

          <Section className="p-4 bg-white">
            <Text className="text-2xl font-bold text-center">
              Reset Your Password
            </Text>
            <Text className="text-gray-800 text-lg mb-4">Hello,</Text>

            <Text className="text-gray-700 text-base leading-relaxed mb-6">
              We received a request to reset your password for your UoB Taxi &
              Chauffeur account. Click the button below to reset your password.
            </Text>

            <Section className="text-center my-8">
              <Button
                href={`http://localhost:3000/reset-password?uuid=${uuid}`} //the base url used is only for dev testing, in production change it to the ALB dns name or the domain when we get access to one
                className="bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg inline-block text-center no-underline"
              >
                Reset Your Password
              </Button>
            </Section>

            <Text className="text-gray-600 text-sm leading-relaxed mb-4">
              This link will expire on <strong>{formattedExpiry}</strong>. If
              you need a new link, please request another password reset.
            </Text>

            <Hr className="my-6 border-gray-300" />

            <Text className="text-gray-600 text-sm leading-relaxed mb-2">
              If you didn't request a password reset, you can safely ignore this
              email. Your password will remain unchanged.
            </Text>

            <Text className="text-gray-600 text-sm leading-relaxed">
              For security reasons, this link can only be used once and will
              expire after the time shown above.
            </Text>

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
