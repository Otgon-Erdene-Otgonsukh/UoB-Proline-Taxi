"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Set the paths where you want to hide the navbar
  const pathname = usePathname();
  const noNavbar = pathname === "/super";

  return (
    <>
      {!noNavbar && <Navbar />}
      {children}
    </>
  );
}
