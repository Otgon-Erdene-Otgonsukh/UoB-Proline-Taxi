"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";

export function Landing_page() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  return (
    <div>
      <motion.div
        className="flex flex-col mb-8 lg:flex-row min-h-screen justify-evenly items-center px-4 md:-mt-13 mt-10 lg:py-0"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/*the image and the h1 dynamically shrinks and expand based on the screen size using lg sm tailwind properties*/}
        <Image
          width="100"
          height="100"
          className="w-64 h-64 mt-14 sm:w-80 sm:h-80 sm:mt-25 lg:w-100 lg:h-100 lg:order-2 lg:mr-12 mb-8 lg:mb-0"
          src={"/landpic.svg"}
          alt="Landing"
        />
        <div className="lg:order-1 text-center lg:text-left">
          <h1 className="font-aleo font-light text-2xl sm:text-3xl lg:text-4xl text-shadow-lg/20 lg:ml-6 lg:mt-20 px-4 lg:px-0">
            From <strong>quick</strong> campus rides to <br /> professional{" "}
            <strong>chauffeur</strong> journeys,
            <br /> make every trip smooth, safe, and <br /> comfortable with{" "}
            <strong>Proline Taxi</strong>.
          </h1>
          <div className="mt-8 lg:ml-6 flex flex-col lg:flex-row gap-4 max-w-md mx-auto lg:mx-5">
            <Link
              href={
                !session
                  ? "/login"
                  : session.user.account_type === "normal_user"
                    ? "/home"
                    : session.user.account_type === "super_admin" ||
                        session.user.account_type === "proline_staff"
                      ? "/super"
                      : "/dep-dashboard"
              }
            >
              <button
                onClick={() => setLoading(true)}
                type="button"
                className="w-full lg:min-w-[250px] lg:w-auto border-[#2c2c2c] border-1 bg-[#2c2c2c] text-white font-inter font-light rounded-md py-3 px-11 text-sm cursor-pointer hover:scale-103 hover:bg-[#393939] transition-all duration-300 active:bg-[#4d4d4d] whitespace-nowrap"
              >
                {loading ? (
                  <CircularProgress
                    size="15px"
                    color="inherit"
                  ></CircularProgress>
                ) : !session ? (
                  "LOGIN TO BOOK NOW"
                ) : session.user.account_type === "super_admin" ||
                  session.user.account_type === "finance_staff" ||
                  session.user.account_type === "proline_staff" ? (
                  "MANAGE BOOKINGS"
                ) : (
                  "VIEW BOOKINGS"
                )}
              </button>
            </Link>
            <Link href="/about">
              <button
                type="button"
                className="w-full lg:w-auto border-1 border-[#2c2c2c] text-[#303030] font-inter font-medium rounded-md py-3 px-20 text-sm cursor-pointer hover:scale-103 transition-all duration-300 hover:bg-[#f9f7f7] whitespace-nowrap active:bg-[#efefef]"
              >
                MORE INFO
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Landing_page;
