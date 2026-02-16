// MUI Icons chosen from list
import {
  RateReview,
  Assignment,
  CheckCircle,
  Sms,
  DirectionsCar,
  Phone,
  Email,
} from "@mui/icons-material";
import StarsIcon from "@mui/icons-material/Stars";
import Image from "next/image";

export default function AboutPage() {
  return (
      <main className="flex flex-col ml-1 mx-5 md:mx-2 md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Left hand side of page on md screen. */}
        <div className="md:w-3/5 flex flex-col items-center justify-center">
          <div className="shadow-lg/20 rounded-md w-full h-full p-15 ml-4 mt-3 mb-5">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <Image
                  src="/aboutlogo.png"
                  width="300"
                  height="30"
                  className="md:-ml-10 mr-4 mix-blend-darken ml-2"
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
              <RateReview sx={{ fontSize: 60, color: '#2563eb' }} />
              <br />
              <h1 className="text-3xl font-bold font-aleo text-shadow-lg/10 text-yellow-600 ">
                Check out proline taxi Reviews
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="rounded-md border p-5 shadow-lg/10 hover:scale-103 transition-all duration-300 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">John Doe</h3>
                  <StarsIcon sx={{ color: '#16a34a' }}/>
                </div>
                <p className="text-gray-600">Great experience.</p>
              </div>
              <div className="rounded-md border p-5 shadow-lg/10 hover:scale-103 transition-all duration-300 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Allen Key</h3>
                  <StarsIcon sx={{ color: '#eab308'}}/>
                </div>
                <p className="text-gray-600">Very smooth travel.</p>
              </div>
              <div className="rounded-md border p-5 shadow-lg/10 hover:scale-103 transition-all duration-300 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Jane Doe</h3>
                  <StarsIcon sx={{ color: '#9333ea' }}/>
                </div>
                <p className="text-gray-600">Love it!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right hand side of page on md screen - Booking Made Easy */}
        <div className="md:w-2/5 w-full flex items-center justify-center shadow-lg ml-[8px] md:ml-5 md:mr-3 my-3 rounded-md">
          <div className="text-center w-full flex flex-col md:gap-5 gap-10 font-inter px-4">
            <div className="items-center">
              <h1 className="text-3xl font-aleo text-shadow-lg/10 font-bold md:mb-15 md:-mt-2 mt-10">
                BOOKING MADE EASY
              </h1>
              <p className="text-gray-600 mt-2">Simple steps to your ride</p>
            </div>

            {/* Steps with improved design */}
            <div className="flex flex-col gap-2">
              {/* Step 1 */}
              <div className="items-start mb-10">
                <div className="flex items-start gap-4 text-left">
                  <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                    <Assignment sx={{ fontSize: 40, color: '#2563eb' }} />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-lg font-bold">1. Fill in the booking form</p>
                    <p className="text-sm text-gray-600 mt-1">Quick and easy form with all necessary details</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="items-start mb-10">
                <div className="flex items-start gap-4 text-left">
                  <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                    <CheckCircle sx={{ fontSize: 40, color: '#16a34a' }} />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-lg font-bold">2. Get approval</p>
                    <p className="text-sm text-gray-600 mt-1">Fast automated approval from your department</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="items-start mb-10">
                <div className="flex items-start gap-4 text-left">
                  <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                    <Sms sx={{ fontSize: 40, color: '#9333ea' }} />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-lg font-bold">3. Receive confirmation</p>
                    <p className="text-sm text-gray-600 mt-1">Get all details and driver info via SMS</p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="items-start mb-10">
                <div className="flex items-start gap-4 text-left">
                  <div className="flex-shrink-0 bg-orange-100 p-3 rounded-full">
                    <DirectionsCar sx={{ fontSize: 40, color: '#ea580c' }} />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-lg font-bold">4. Off you go!</p>
                    <p className="text-sm text-gray-600 mt-1">Enjoy your comfortable, reliable ride</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t-2 border-gray-200 pt-4 pb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Need Help?</h3>
              <div className="flex flex-col gap-2 text-sm">
                <a href="tel:+441179289000" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <Phone fontSize="small" /> +44 790 445 9504
                </a>
                <a href="mailto:transport@bristol.ac.uk" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <Email fontSize="small" /> sales@prolinetaxi.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}