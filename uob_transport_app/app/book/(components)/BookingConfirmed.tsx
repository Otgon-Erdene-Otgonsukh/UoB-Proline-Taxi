"use client";

import { CheckCircle, CheckCircleOutline, Dashboard } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import { Button } from "@mui/material";

export default function BookingConfirmedPage({
  admin,
  update,
}: {
  admin: boolean;
  update: boolean;
}) {
  return (
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="bg-white flex flex-col justify-center gap-3 border-2 border-green-400 items-center max-w-md rounded-xl md:mx-auto mx-5 shadow-2xl pt-7 pb-2">
        <div>
          <CheckCircle sx={{ fontSize: 80, color: "#10b981" }} />
        </div>
        <div className="w-full px-8">
          <div className="bg-green-50 border border-green-400 rounded-lg p-4 mb-4 flex items-center gap-3 shadow-sm">
            <CheckCircleOutline sx={{ color: "green" }} />
            {update ? (
              <span className="text-green-700 font-semibold text-base">
                Booking has been updated successfully!
              </span>
            ) : (
              <span className="text-green-700 font-semibold text-base">
                Booking created and confirmation email sent!
              </span>
            )}
          </div>
        </div>
        {update ? (
          <div className="text-center font-inter flex flex-col px-12 text-sm text-gray-500">
            The selected booking has been updated with the new details.
            <br />
            Please navigate to the bookings table to see the changes.
          </div>
        ) : (
          <div className="text-center font-inter flex flex-col px-12 text-sm text-gray-500">
            Your booking is forwarded to your department head for approval.
            <br />
            Please check your email for booking details and visit the home page
            to check your booking status.
          </div>
        )}

        <Button
          variant="contained"
          startIcon={admin ? <Dashboard /> : <HomeIcon />}
          sx={{
            bgcolor: "#2c2c2c",
            my: 3,
            width: { xs: 250, lg: 300 },
            py: 1.2,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 13,
            boxShadow: 3,
            textTransform: "none",
            ":hover": {
              scale: 1.02,
              bgcolor: "#1a1a1a",
              boxShadow: 6,
            },
            transition: "all 0.2s ease-in-out",
          }}
          href={admin ? "/super" : "/home"}
        >
          {admin ? "Go Back To Admin Panel" : "Check Status"}
        </Button>
      </div>
    </div>
  );
}
