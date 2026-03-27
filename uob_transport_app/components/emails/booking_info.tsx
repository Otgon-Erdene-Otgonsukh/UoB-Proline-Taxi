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
import { Location } from "@/model/models";

export default function BookingInfo({
  from = {
    short_name: "UoB Campus",
    address: "Bristol, UK, BS8 1UB",
    lat: 51.4597,
    lng: -2.6044,
  },
  via = [
    {
      short_name: "Old Market",
      address: "Bristol, UK, BS2 0EJ",
      lat: 51.4569,
      lng: -2.5789,
    },
    {
      short_name: "Bristol City Centre",
      address: "Bristol, UK, BS1 5TR",
      lat: 51.4545,
      lng: -2.5879,
    },
    {
      short_name: "St Paul's",
      address: "Bristol, UK, BS2 9LJ",
      lat: 51.4555,
      lng: -2.5895,
    },
  ],
  to = {
    short_name: "Temple Quarter",
    address: "Bristol, UK, BS1 6AZ",
    lat: 51.4437,
    lng: -2.5921,
  },
  airport = null,
  flightNum = "BA1234",
  pickUpTime = new Date("2024-03-25T09:00:00"),
  returnTime = new Date("2024-03-25T17:00:00"),
  returnTo,
  passengerName = "John Doe",
  phoneNumber = "+44 123 456 7890",
}: {
  from: Location;
  via: Location[];
  to: Location;
  airport: Location | null;
  flightNum: string;
  pickUpTime: Date;
  returnTime?: Date;
  returnTo?: Location;
  passengerName: string;
  phoneNumber: string;
}) {
  const formatAddress = (loc: Location) => {
    return loc.short_name + ", " + loc.address.split(",").slice(-5)[0].trim();
  };

  return (
    <Html>
      <Head />
      <Tailwind>
        <Container className="mx-auto p-1 bg-gray-50">
          <Section className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
            {/* Header */}
            <Section className="text-center mb-6 bg-yellow-100 p-6 rounded-lg">
              <Text className="text-2xl font-bold text-yellow-600 mb-2">
                Booking Submitted Successfully! ➤
              </Text>
              <Text className="text-lg text-gray-600">
                Your booking is awaiting approval
              </Text>
            </Section>

            <Hr className="border-gray-300 my-3" />

            <Text>
              Your booking with the following details has been forwarded to
              admin and university staff, who will assign a purchase order (PO)
              number and pricing.
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
                <strong>Name:</strong> {passengerName}
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
                className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg cursor-pointer"
                href={
                  process.env.NODE_ENV === "development"
                    ? "http://localhost:3000/home"
                    : "https://uobst.ilm.gg/home"
                }
              >
                Check Booking Status
              </Button>
            </Section>

            {/* Footer */}
            <Section className="mt-8">
              <Text className="text-sm text-gray-500 text-center">
                You will receive a confirmation email once your booking has been
                resonded by the department and admin.
              </Text>
              <Text className="text-sm text-gray-500 text-center mt-2">
                Thank you for using UoB Taxi & Chauffeur!
              </Text>
            </Section>
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
}
