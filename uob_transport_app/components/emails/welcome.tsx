import {
  Html,
  Head,
  Tailwind,
  Button,
  Container,
  Text,
  Section,
  Hr,
} from "@react-email/components";
import { roleReadableStrMap } from "@/app/super/constants";

export default function Welcome({
  name = "Bob Donkey",
  account_type = "Normal user",
}: {
  name: string;
  account_type: string;
}) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Container className="mx-auto p-4 bg-slate-100">
          <Section className="bg-white rounded-xl p-0 max-w-2xl mx-auto overflow-hidden border border-slate-200">
            <Section className="bg-[#2c2c2c] px-6 py-7 text-center">
              <Text className="text-white text-2xl font-bold m-0">
                Welcome to UoB Taxi & Chauffeur
              </Text>
              <Text className="text-slate-200 text-sm mt-2 mb-0">
                Your account is now ready to use
              </Text>
            </Section>

            <Section className="px-6 py-6">
              <Text className="text-slate-800 text-base leading-7 mt-0 mb-4">
                Hello <strong>{name}</strong>,
              </Text>

              <Text className="text-slate-700 text-[15px] leading-7 m-0">
                We are delighted to welcome you to the UoB Taxi & Chauffeur
                platform. Your account with the <strong>{roleReadableStrMap[account_type]}</strong>{" "}
                role has been successfully created.
              </Text>

              <Section className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mt-5">
                <Text className="text-slate-600 text-sm m-0 text-center">
                  You can now log in and start booking rides!
                </Text>
              </Section>

              <Section className="text-center text-md mt-6 mb-2">
                <Button
                  className="bg-[#2c2c2c] text-white font-semibold py-3 px-8 rounded-lg"
                  href={
                    process.env.NODE_ENV === "development"
                      ? "http://localhost:3000/login"
                      : "https://uobst.ilm.gg/login"
                  }
                >
                  Log in to Your Account
                </Button>
              </Section>

              <Hr className="border-slate-200 my-6" />

              <Text className="text-slate-500 text-xs text-center m-0">
                This is an auto-generated email, please do not respond.
              </Text>
            </Section>
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
}
