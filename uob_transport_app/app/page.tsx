"use client";

import Land from "@/components/Landing_page";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const page = () => {

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

export default page;
