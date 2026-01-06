"use client";

import Image from "next/image";
import SendIcon from "@mui/icons-material/Send";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";

export default function RegRequestSent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="bg-white flex flex-col md:flex-row shadow-2xl rounded-2xl max-w-2xl w-full mt-20 mb-20">
        <motion.div
          className="flex flex-col items-center md:gap-15 p-6 md:w-1/2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="w-full relative min-h-[250px] md:min-h-[300px] mt-16">
            <Image
              src="/wait.png"
              fill
              alt="person waiting image"
              className="object-contain"
            />
          </div>
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#2c2c2c",
              ":hover": { scale: 1.02 },
              transition: "all ease 0.2s",
              display: { xs: "none", md: "block" },
            }}
            onClick={() => {
              redirect("/");
            }}
          >
            <KeyboardBackspaceIcon sx={{ mr: 1 }} />
            Go to home page
          </Button>
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 md:p-8 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="flex flex-col justify-center items-center gap-4 text-center">
            <div className="bg-green-100 rounded-full p-3 hover:scale-110 transition-all ease-in-out duration-200">
              <SendIcon
                sx={{
                  fontSize: 36,
                  color: "#16a34a",
                  transform: "rotate(-45deg)",
                }}
              />
            </div>
            <h1 className="font-inter text-xl font-bold text-gray-800">
              Request Sent Successfully
            </h1>
            <p className="font-inter text-sm text-gray-600 leading-relaxed">
              Your staff account registration request has been sent to the
              corresponding admin for review.
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-4 text-center pt-6 border-t border-gray-200">
            <div className="bg-orange-100 rounded-full p-3 hover:scale-110 transition-all ease-in-out duration-200">
              <ContactSupportIcon sx={{ fontSize: 36, color: "#ea580c" }} />
            </div>
            <h2 className="font-inter text-lg font-bold text-gray-800">
              What&apos;s Next?
            </h2>
            <p className="font-inter text-sm text-gray-600 leading-relaxed">
              You will receive an email notification if your request is
              approved, along with a link to the login page. Once approved, sign
              in with your credentials and start booking!
            </p>
          </div>
          <Button
            sx={{
              display: { md: "none", xs: "block" },
              bgcolor: "#2c2c2c",
              px: 10,
              color: "white",
            }}
            onClick={() => {
              redirect("/");
            }}
          >
            <KeyboardBackspaceIcon sx={{ mr: 1, mb: 0.2 }} />
            Go to home page
          </Button>
        </motion.div>
      </div>
    </div>
  );
}