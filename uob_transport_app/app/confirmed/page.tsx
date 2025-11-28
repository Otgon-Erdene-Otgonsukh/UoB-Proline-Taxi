"use client";

import { CheckCircle } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import { Button } from "@mui/material";

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white flex flex-col justify-center gap-5 items-center max-w-md border-2 rounded-md border-[#2c2c2c] md:mx-auto mx-3 shadow-lg/30">
        <div className="bg-[#2c2c2c] text-white overflow-hidden font-aleo w-full text-center py-6 text-[30px]">
          All Done!
        </div>
        <div>
          <CheckCircle sx={{ fontSize: 80 }} />
        </div>
        <div className="text-center text-[#2c2c2c] font-inter flex flex-col px-10">
          Your booking is forwarded to your department head for approval. Visit
          the home page to check your booking status.
        </div>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          sx={{
            bgcolor: "#2c2c2c",
            my: 3,
            width: { xs: 200, lg: 300 },
            py: 1.2,
            ":hover": {
              scale: 1.03,
              bgcolor: "#1a1a1a",
              boxShadow: 6,
            },
            transition: "all 0.2s ease-in-out",
          }}
          href="/home"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
