"use client";

import { CheckCircle, CheckCircleOutline } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import { Button } from "@mui/material";

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white flex flex-col justify-center gap-3 border-2 border-green-400 items-center max-w-md rounded-xl md:mx-auto mx-3 shadow-2xl pt-7 pb-2">
        <div>
          <CheckCircle sx={{ fontSize: 80, color: "#10b981" }} />
        </div>
        <div className="w-full px-8">
          <div className="bg-green-50 border border-green-400 rounded-lg p-4 mb-4 flex items-center gap-3 shadow-sm">
            <CheckCircleOutline sx={{ color: "green" }} />
            <span className="text-green-700 font-semibold text-base">
              Booking created and confirmation email sent!
            </span>
          </div>
        </div>
        <div className="text-center font-inter flex flex-col px-10 text-sm text-gray-500">
          Your booking is forwarded to your department head for approval.
          <br />
          Please check your email for booking details and visit the home page to
          check your booking status.
        </div>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          sx={{
            bgcolor: "#2c2c2c",
            my: 3,
            width: { xs: 200, lg: 300 },
            py: 1.2,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 13,
            boxShadow: 3,
            textTransform: "none",
            ":hover": {
              scale: 1.04,
              bgcolor: "#1a1a1a",
              boxShadow: 6,
            },
            transition: "all 0.2s ease-in-out",
          }}
          href="/home"
        >
          Check Status
        </Button>
      </div>
    </div>
  );
}
