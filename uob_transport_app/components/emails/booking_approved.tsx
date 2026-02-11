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

export default function BookingPoAttach({
  from,
  via,
  to,
  airport,
  flightNum,
  pickUpTime,
  returnTime,
  returnTo,
  firstName,
  surName,
  phoneNumber,
  department,
  price="87",
}: {
  from: string;
  via: string;
  to: string;
  airport: string;
  flightNum: string;
  pickUpTime: Date;
  returnTime?: Date;
  returnTo?: string;
  firstName: string;
  surName: string;
  phoneNumber: string;
  department: string;
  price: string;
}) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Container className="mx-auto p-1 bg-gray-50">
          <Section className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
            {/* Header */}
            <Section className="text-center mb-6 bg-green-100 p-6 rounded-lg">
              <Text className="text-2xl font-bold text-green-600 mb-2">
                ✓ Booking Approved
              </Text>
              <Text className="text-lg text-gray-600">
                Your booking has been approved, Ride Away!
              </Text>
            </Section>

            <Hr className="border-gray-300 my-3" />
            <Text className="font-bold text-[17px]">
                Hello, {firstName}
            </Text>

            <Text className="text-gray-700 mb-4 text-[16px]">
              Your department finance staff has <strong>approved</strong>{" "}
              the booking with the following details. The price is attached below and enjoy the ride! 
            </Text>

            <Section className="bg-blue-50 p-4 rounded-lg mb-4">
              <Text className="text-gray-700">
                <strong>Booking Price:</strong>{" "}
                <span className="text-[16px] text-green-600 font-semibold">
                  £{price}
                </span>
              </Text>
            </Section>

            <Hr className="border-gray-300 my-3" />
            <Text className="text-2xl font-semibold text-gray-800">
              Booking Details:
            </Text>

            {/* Passenger Information */}
            <Section className="mb-6">
              <Text className="text-xl font-semibold text-gray-800 mb-2">
                Passenger Information
              </Text>
              <Text className="text-gray-700 mb-2">
                <strong>Name:</strong> {firstName} {surName}
              </Text>
              <Text className="text-gray-700 mb-2">
                <strong>Department:</strong> {department}
              </Text>
              <Text className="text-gray-700 mb-2">
                <strong>Phone:</strong> {phoneNumber}
              </Text>
            </Section>

            <Hr className="border-gray-300 mt-3 mb-3" />

            <Section className="mb-6">
              <Text className="text-xl font-semibold text-gray-800 mb-4">
                Journey Details
              </Text>
              <Section>
                {/* From */}
                <table className="w-full mb-2 align-top">
                  <tbody>
                    <tr>
                      <td className="w-8 align-top text-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mx-auto"></div>
                        <div className="w-0.5 h-10 bg-gray-300 mt-1 mx-auto"></div>
                      </td>
                      <td className="align-top pl-2">
                        <span className="text-gray-700 font-semibold">
                          From:
                        </span>{" "}
                        {from}
                        <br />
                        <span className="text-gray-500 text-xs">
                          Pick-up time: {new Date(pickUpTime).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* Via */}
                {via && (
                  <table className="w-full mb-2 align-top">
                    <tbody>
                      <tr>
                        <td className="w-8 align-top text-center">
                          <div className="w-3 h-3 rounded-full bg-gray-400 mx-auto"></div>
                          <div className="w-0.5 h-10 bg-gray-300 mt-1 mx-auto"></div>
                        </td>
                        <td className="align-top pl-2">
                          <span className="text-gray-700 font-semibold">
                            Via:
                          </span>{" "}
                          {via}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {/* To */}
                <table className="w-full mb-9 align-top">
                  <tbody>
                    <tr>
                      <td className="w-8 align-top text-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mx-auto"></div>
                      </td>
                      <td className="align-top pl-2">
                        <span className="text-gray-700 font-semibold">To:</span>{" "}
                        {to}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* Return To */}
                {returnTo && returnTime && (
                  <>
                    <Hr className="border-gray-300 mb-9" />
                    <table className="w-full mb-2 align-top">
                      <tbody>
                        <tr>
                          <td className="w-8 align-top text-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto"></div>
                          </td>
                          <td className="align-top pl-2">
                            <span className="text-gray-700 font-semibold">
                              Return To:
                            </span>{" "}
                            {returnTo}
                            <br />
                            <span className="text-gray-500 text-xs">
                              Pick-up time:{" "}
                              {new Date(returnTime).toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )}
              </Section>
              {airport !== "" && flightNum !== "" && (
                <>
                  <Hr className="border-gray-300 my-4" />
                  <Text className="font-bold text-[18px]">Flight Details</Text>
                  <Text className="text-gray-700 mb-2 mt-3">
                    <strong>Airport:</strong> {airport}
                  </Text>
                  <Text className="text-gray-700 mb-2">
                    <strong>Flight Number:</strong> {flightNum}
                  </Text>
                </>
              )}
            </Section>

            <Hr className="border-gray-300 my-6" />

            {/* Button */}
            <Section className="text-center mt-8">
              <Button
                className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg cursor-pointer"
                href={
                  process.env.NODE_ENV === "development"
                    ? "http://localhost:3000/home"
                    : "http://uob-transport-alb-848507222.eu-west-2.elb.amazonaws.com/home"
                }
              >
                Go to Home
              </Button>
            </Section>

            {/* Footer */}
            <Section className="mt-8">
              <Text className="text-gray-500 text-xs text-center">
                UoB Taxi & Chauffeur
                <br />
                This is an automated message, please do not reply to this email.
              </Text>
            </Section>
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
}
