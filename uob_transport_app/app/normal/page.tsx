"use client";

import NormalUserDashboard from "@/components/NormalUserDashboard";
import { USER_ROLE } from "@/model/models";
import { useSession } from "next-auth/react";
import { redirect } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";
import ForbiddenPage from "@/components/ForbiddenPage";

// Temporary path to test the page design, will be deleted later when dashboards are displayed according to roles

const Normal = () => {

  const { status, data } = useSession();
  const [isForbidden, setIsForbidden] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    } else if (data && data.user?.account_type !== USER_ROLE.NORMAL_USER) {
      // Only normal users can access this page
      setIsForbidden(true);
    } else if (data && data.user?.account_type === USER_ROLE.NORMAL_USER) {
      setIsForbidden(false);
    }
  }, [status, data]);

  if (isForbidden) {
    return <ForbiddenPage />;
  }

  return (
    <NormalUserDashboard />
  )
}

export default Normal