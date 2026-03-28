"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useSession } from "next-auth/react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  const { data } = useSession()
  // Set the paths where you want to hide the navbar
  const pathname = usePathname();
  const noNavbar = pathname === "/super" || (pathname.includes("book") && data?.user.account_type === "super_admin");

  return (
    <>
      {!noNavbar && <Navbar />}
      {children}
    </>
  );
}
