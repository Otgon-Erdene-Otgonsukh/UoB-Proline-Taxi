"use client";

import Land from "@/components/Landing_page";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function MainPage() {

  const { data }  = useSession();

  if (data?.user.account_type === "super_admin") {
    redirect("/super")
  }

  return (
    <div>
      <Land></Land>
    </div>
  );
};
