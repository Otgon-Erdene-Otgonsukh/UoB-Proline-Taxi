import type { Metadata, Viewport } from "next";
import { Aleo, Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Suspense } from 'react';
import LayoutWrapper from "./conditinalnavbar";
import { CircularProgress } from "@mui/material";

const aleo = Aleo({ subsets: ["latin"], variable: "--font-aleo" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// The website is automatically zoomed out a bit to avoid browser default zooms making UI feel off
export const viewport: Viewport = { 
  width: "device-width",
  initialScale: 0.93
};

export const metadata: Metadata = {
  title: "UoB Taxi & Chauffeur",
  description: "A Smart Booking Platform designed to streamline the booking flow for the staff at the University of Bristol in collaboration with ProLine Taxi Company",
  icons: {
    icon: "/windows.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${aleo.variable} ${inter.variable}`}>
        <SessionProvider>
          <LayoutWrapper>
            <main><Suspense fallback={<div className="min-h-screen flex justify-center items-center"><CircularProgress color="inherit"/></div>}>{children}</Suspense></main>
          </LayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
