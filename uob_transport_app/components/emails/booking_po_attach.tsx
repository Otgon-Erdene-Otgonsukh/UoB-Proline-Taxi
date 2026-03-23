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
import { location } from "@/model/models";

export default function BookingPoAttach({
  from,
  via,
  to,
  airport,
  flightNum,
  pickUpTime,
  returnTime,
  returnTo,
  passenger_name,
  phoneNumber,
  department,
  po = "90273",
  price = "100",
}: {
  from: location;
  via: location[];
  to: location;
  airport: location | null;
  flightNum: string;
  pickUpTime: Date;
  returnTime?: Date;
  returnTo?: location;
  passenger_name: string;
  phoneNumber: string;
  department: string;
  po: string;
  price: string;
}) {
  const formatAddress = (loc: location) => {
    return loc.short_name + ", " + loc.address.split(",").slice(-5)[0].trim();
  };

  return (
    <Html>
      <Head />
      <Tailwind>
        <Container className="mx-auto p-1 bg-gray-50">
          <Section className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
            {/* Header */}
            <Section className="text-center mb-6 bg-green-100 p-6 rounded-lg">
              <Text className="text-2xl font-bold text-green-600 mb-2">
                ✓ PO Number Assigned - Ready to Export
              </Text>
              <Text className="text-lg text-gray-600">
                University finance staff has approved this booking
              </Text>
            </Section>

            <Hr className="border-gray-300 my-3" />

            <Text className="text-gray-700 mb-4 text-[16px]">
              University finance staff has <strong>approved</strong> this
              booking and attached the PO number. The booking is now ready to be
              exported to CSV and forwarded to the dispatch service.
            </Text>

            <Section className="bg-blue-50 p-4 rounded-lg mb-4">
              <Text className="text-gray-700 mb-2">
                <strong>Purchase Order Number:</strong>{" "}
                <span className="text-[16px] text-blue-600 font-semibold">
                  {po}
                </span>
              </Text>
              <Text className="text-gray-700">
                <strong>Booking Price:</strong>{" "}
                <span className="text-[16px] text-green-600 font-semibold">
                  £{price}
                </span>
              </Text>
            </Section>

            <Text className="text-gray-700 mb-2">
              <strong>Next Steps:</strong>
            </Text>
            <Text className="text-gray-700 mb-2 ml-4">
              <strong>1.</strong> Review the booking details below
            </Text>
            <Text className="text-gray-700 mb-2 ml-4">
              <strong>2.</strong> Export the booking to CSV format
            </Text>
            <Text className="text-gray-700 mb-4 ml-4">
              <strong>3.</strong> Forward the CSV to the dispatch for processing
            </Text>

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
                <strong>Name:</strong> {passenger_name}
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
                        {formatAddress(from)}
                        <br />
                        <span className="text-gray-500 text-xs">
                          Pick-up time: {new Date(pickUpTime).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* Via */}
                {via.length > 0 && (
                  <table className="w-full mb-2 align-top">
                    <tbody>
                      <tr>
                        <td className="w-8 align-top text-center">
                          <div className="w-3 h-3 rounded-full bg-gray-400 mx-auto"></div>
                          <div className="w-0.5 h-10 bg-gray-300 mt-1 mx-auto"></div>
                        </td>
                        <td className="align-top pl-2">
                          <table className="w-full" role="presentation">
                            <tbody>
                              <tr>
                                <td className="align-top pr-3 whitespace-nowrap">
                                  <span className="text-gray-700 font-semibold mr-2">
                                    Via:
                                  </span>
                                </td>
                                <td className="align-top">
                                  <ul className="m-0 p-0">
                                    {via.map((loc, i) => (
                                      <li key={i}>{formatAddress(loc)}</li>
                                    ))}
                                  </ul>
                                </td>
                              </tr>
                            </tbody>
                          </table>
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
                        {formatAddress(to)}
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
                            {formatAddress(returnTo)}
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
              {airport !== null && (
                <>
                  <Hr className="border-gray-300 my-4" />
                  <Text className="font-bold text-[18px]">Flight Details</Text>
                  <Text className="text-gray-700 mb-2 mt-3">
                    <strong>Airport:</strong> {airport.short_name}
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
                    ? "http://localhost:3000/super"
                    : "https://uobst.ilm.gg/super"
                }
              >
                Go to Dashboard
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
