"use client";

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
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
      <main className="flex flex-col ml-1 mx-5 md:mx-2 md:flex-row min-h-screen">
        {/* Left hand side of page on md screen. */}
        <motion.div
          className="md:w-3/5 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <motion.div
            className="shadow-lg/20 rounded-md w-full h-full p-15 md:pt-15 pt-7 ml-4 mt-3 mb-5 border-t-6 border-t-yellow-500"
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Image
                  src="/aboutlogo.png"
                  width="300"
                  height="30"
                  className="mix-blend-darken shrink-0"
                  alt="Collab photo of UoB university logo and the Proline taxi logo"
              ></Image>
              <div className="flex flex-col gap-2 text-center md:text-start">
                <h1 className="text-2xl font-bold text-gray-800 font-aleo text-shadow-lg/10">
                  Proline Taxi | University of Bristol
                </h1>
                <p className="text-md text-gray-600">
                  This service, in partnership with Proline Taxi, aims to
                  streamline the taxi booking process by automating the processes
                  from requesting, approving, and even merging taxi services
                  together. The platform also provides automated invoicing to
                  simplify finances and clarify billing for your departments.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="shadow-lg/20 rounded-md w-full h-full p-15 md:px-15 px-7 ml-4 mb-3 -mt-2 border-t-6 border-t-blue-500"
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <RateReview sx={{ fontSize: 60, color: '#2563eb' }} />
              <br />
              <h1 className="md:text-3xl text-2xl font-bold font-aleo text-shadow-lg/10 text-black-600 md:text-start text-center">
                Check out Proline Taxi Reviews
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <div className="rounded-md border p-5 shadow-lg/10 hover:scale-103 transition-all duration-300 hover:bg-linear-to-br hover:from-cyan-50 hover:to-blue-50" data-testid="review-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold">Vanessa Rolland</h3>
                  <StarsIcon sx={{ color: '#16a34a' }}/>
                </div>
                <p className="text-gray-600 italic">Always helpful and on time, as well as very comfortable cars!</p>
              </div>
              <div className="rounded-md border p-5 shadow-lg/10 hover:scale-103 transition-all duration-300 hover:bg-linear-to-br hover:from-cyan-50 hover:to-blue-50" data-testid="review-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold">Thomas Lanzoni</h3>
                  <StarsIcon sx={{ color: '#eab308'}}/>
                </div>
                <p className="text-gray-600 italic">Very professional, sympathic and flexible ! I recommend it!</p>
              </div>
              <div className="rounded-md border p-5 shadow-lg/10 hover:scale-103 transition-all duration-300 hover:bg-linear-to-br hover:from-cyan-50 hover:to-blue-50" data-testid="review-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold">Helen Elliott</h3>
                  <StarsIcon sx={{ color: '#9333ea' }}/>
                </div>
                <p className="text-gray-600 italic">Always an excellent service and great at keeping in touch with taxi en route.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right hand side of page on md screen - Booking Made Easy */}
        <motion.div
          className="md:w-2/5 w-full flex items-center justify-center shadow-lg ml-2 md:ml-5 md:mr-3 my-3 rounded-md border-t-6 border-t-orange-500"
          initial={{ opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
        >
          <div className="w-full flex flex-col items-center md:gap-5 gap-10 font-inter px-4">
            <div className="flex flex-col items-center text-center">
              <h1 className="md:text-3xl text-2xl font-aleo text-shadow-lg/10 font-bold md:mb-10 md:-mt-2 mt-10">
                BOOKING MADE EASY
              </h1>
              <p className="text-gray-600 md:-mt-8 mt-4">Simple steps to your ride</p>
            </div>

            {/* Steps with improved design */}
            <div className="flex flex-col gap-2 items-center w-full mt-10">
              {/* Step 1 */}
              <div className="mb-10 w-80">
                <div className="flex items-center gap-6 text-left">
                  <div className="shrink-0 bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <Assignment sx={{ fontSize: 36, color: '#2563eb' }} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">1. Fill in the booking form</p>
                    <p className="text-sm text-gray-600 mt-1">Quick and easy form with all necessary details</p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="mb-10 w-80">
                <div className="flex items-center gap-6 text-left">
                  <div className="shrink-0 bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <CheckCircle sx={{ fontSize: 36, color: '#16a34a' }} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">2. Get approval</p>
                    <p className="text-sm text-gray-600 mt-1">Fast automated approval from your department</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="mb-10 w-80">
                <div className="flex items-center gap-6 text-left">
                  <div className="shrink-0 bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <Sms sx={{ fontSize: 36, color: '#9333ea' }} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">3. Receive confirmation</p>
                    <p className="text-sm text-gray-600 mt-1">Get all details and driver info via SMS</p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="mb-10 w-80">
                <div className="flex items-center gap-6 text-left">
                  <div className="shrink-0 bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <DirectionsCar sx={{ fontSize: 36, color: '#ea580c' }} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">4. Off you go!</p>
                    <p className="text-sm text-gray-600 mt-1">Enjoy your comfortable, reliable ride</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t-2 border-gray-200 pt-4 pb-6 text-center">
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
        </motion.div>
      </main>
  );
}