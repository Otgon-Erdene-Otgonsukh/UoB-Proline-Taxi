// MUI Icons chosen from list
import {
  RateReview,
  Assignment,
  CheckCircle,
  Sms,
  DirectionsCar,
} from "@mui/icons-material";
import StarsIcon from "@mui/icons-material/Stars";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="flex flex-col ml-1 mx-5 md:mx-2 md:flex-row min-h-screen bg-gray-50">
      {/* Left hand side of page on md screen. */}
      <div className="md:w-3/5 flex flex-col items-center justify-center">
        <div className="shadow-lg/20 rounded-md w-full h-full p-15 ml-4 mt-3 mb-5">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <Image
              src="/aboutlogo.png"
              width="300"
              height="30"
              className="md:-ml-19 mr-4 mix-blend-darken ml-2"
              alt="Collab photo of UoB university logo and the Proline taxi logo"
            ></Image>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-gray-800 font-aleo text-center md:text-start text-shadow-lg/10">
                Proline Taxi | University of Bristol
              </h1>
              <p className="text-md text-gray-600 -mr-2">
                This service, in partnership with Proline Taxi, aims to
                streamline the taxi booking process by automating the processes
                from requesting, approving, and even merging taxi services
                together. The platform also provides automated invoicing to
                simplify finances and clarify billing for your departments.
              </p>
            </div>
          </div>
        </div>

        <div className="shadow-lg/20 rounded-md w-full h-full p-15 ml-4 mb-3 -mt-2">
          <div className="flex flex-col items-center">
            <RateReview sx={{ fontSize: 60 }} />
            <br />
            <h1 className="text-3xl font-bold font-aleo text-shadow-lg/10">
              Check out proline taxi Reviews
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="rounded-md border p-5 shadow-lg/10 hover:scale-103 transition-all duration-300 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">John Doe</h3>
                <StarsIcon />
              </div>
              <p className="text-gray-600">Great experience.</p>
            </div>
            <div className="rounded-md border p-5 shadow-lg/10 hover:scale-103 transition-all duration-300 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Allen Key</h3>
                <StarsIcon />
              </div>
              <p className="text-gray-600">Very smooth travel.</p>
            </div>
            <div className="rounded-md border p-5 shadow-lg/10 hover:scale-103 transition-all duration-300 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Jane Doe</h3>
                <StarsIcon />
              </div>
              <p className="text-gray-600">Love it!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right hand side of page on md screen. */}
      <div className="md:w-2/5 w-full flex items-center justify-center shadow-lg ml-[8px] md:ml-5 md:mr-3 my-3 rounded-md">
        <div className="text-center w-full flex flex-col md:gap-5 gap-10 font-inter">
          <div className="items-center">
            <h1 className="text-3xl font-aleo text-shadow-lg/10 font-bold md:mb-15 md:-mt-2 mt-10">
              BOOKING MADE EASY
            </h1>
          </div>
          <div className="flex flex-col text-center gap-2">
            <div className="items-start mb-10">
              <Assignment
                sx={{ fontSize: 60 }}
              />
              <br />
              <p className="text-lg font-bold mt-1">
                1. Fill in the booking form
              </p>
            </div>

            <div className="items-start mb-10">
              <CheckCircle
                sx={{ fontSize: 60 }}
              />
              <br />
              <p className="text-lg font-bold mt-1">2. Get approval</p>
            </div>

            <div className="items-start mb-10">
              <Sms
                sx={{ fontSize: 60 }}
              />
              <br />
              <p className="text-lg font-bold mt-1">
                3. Receive confirmation and details via SMS
              </p>
            </div>

            <div className="items-start mb-10">
              <DirectionsCar
                sx={{ fontSize: 60 }}
              />
              <br />
              <p className="text-lg font-bold mt-1">4. Off you go!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
