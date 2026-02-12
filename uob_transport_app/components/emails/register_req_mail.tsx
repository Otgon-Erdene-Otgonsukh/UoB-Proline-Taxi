import {
  Html,
  Head,
  Container,
  Section,
  Text,
  Hr,
  Tailwind,
} from "@react-email/components";

export default function RegisterRequestMail({
  name,
}: {
  name: string;
}) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Container className="mx-auto bg-gray-100 rounded-lg p-1">
          <Section className="bg-amber-200 px-6 pt-7 pb-5 rounded-md text-center">
            <Text className="text-2xl font-bold text-amber-700 m-0 mt-1">
              Registration Submitted ➤
            </Text>
            <Text className="text-sm mt-1 text-amber-800">
              Your request is now under review
            </Text>
          </Section>

          <Section className="px-6 py-6 bg-white rounded-md">
            <Text className="text-lg font-semibold text-gray-700 mb-3">
              Hello {name},
            </Text>

            <Text className="text-base text-gray-700 leading-relaxed mb-4">
              Your{" "}
              <span className="font-semibold text-blue-700">
                account registration request
              </span>{" "}
              has been successfully received and forwarded to the{" "}
              <span className="font-semibold text-blue-700">
                system administrator
              </span>{" "}
              for review.
            </Text>

            <Hr className="my-6 border-gray-300" />

            <Section className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-4 my-5">
              <Text className="text-sm text-gray-700 mb-2">
                <span className="font-semibold text-green-700">
                  ✔ If approved
                </span>
                , you will receive an email containing your login link.
              </Text>
              <Text className="text-sm text-gray-700">
                <span className="font-semibold text-red-700">
                  ✖ If not approved
                </span>
                , you will be notified with further details.
              </Text>
            </Section>

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
