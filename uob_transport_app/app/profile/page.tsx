"use client";

import { Avatar, Button, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";

const role: Record<string, string> = {
  normal_user: "Normal User",
  finance_staff: "University Finance Staff",
  proline_staff: "ProLine Staff",
  super_admin: "Super Admin",
};

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [nameEdit, setNameEdit] = useState(false);
  const [surnameEdit, setSurnameEdit] = useState(false);
  const [usernameEdit, setUsernameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [departmentEdit, setDepartmentEdit] = useState(false);
  const [accountTypeEdit, setAccountTypeEdit] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") { // display a loading bar for feedback
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CircularProgress color="inherit" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center flex-col p-6 mt-6">
      <div className="flex flex-col items-center justify-center mb-8">
        <Avatar
          className="drop-shadow-lg/40"
          sx={{
            bgcolor: "#2c2c2c",
            border: 3,
            borderColor: "white",
            width: 100,
            height: 100,
            fontSize: "2.5rem",
            marginBottom: 2,
          }}
        >
          {session?.user.name.charAt(0).toUpperCase()}
        </Avatar>
        <h1 className="font-mono font-bold text-3xl text-gray-800 mb-1 text-shadow-lg/10">
          {session?.user.name} {session?.user.surname}
        </h1>
      </div>

      <div className="bg-white flex flex-col w-full max-w-2xl shadow-xl rounded-2xl p-8 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
              onMouseEnter={() => {
                setNameEdit(true);
              }}
              onMouseLeave={() => setNameEdit(false)}
            >
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  First Name
                </p>
                <p className="text-gray-800 font-medium">
                  {session?.user.name}
                </p>
              </div>

              {nameEdit && (
                <Button
                  sx={{ minWidth: "auto", padding: "4px", color: "gray" }}
                >
                  <EditIcon fontSize="small" />
                </Button>
              )}
            </div>
            <div
              className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
              onMouseEnter={() => setSurnameEdit(true)}
              onMouseLeave={() => setSurnameEdit(false)}
            >
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Last Name
                </p>
                <p className="text-gray-800 font-medium">
                  {session?.user.surname}
                </p>
              </div>

              {surnameEdit && (
                <Button
                  sx={{ minWidth: "auto", padding: "4px", color: "gray" }}
                >
                  <EditIcon fontSize="small" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
              onMouseEnter={() => setUsernameEdit(true)}
              onMouseLeave={() => setUsernameEdit(false)}
            >
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Username
                </p>
                <p className="text-gray-800 font-medium">
                  {session?.user.username}
                </p>
              </div>

              {usernameEdit && (
                <Button
                  sx={{ minWidth: "auto", padding: "4px", color: "gray" }}
                >
                  <EditIcon fontSize="small" />
                </Button>
              )}
            </div>
            <div
              className="bg-gray-50 p-4 rounded-lg flex justify-between items-center"
              onMouseEnter={() => setEmailEdit(true)}
              onMouseLeave={() => setEmailEdit(false)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-gray-800 font-medium truncate">
                  {session?.user.email}
                </p>
              </div>

              {emailEdit && (
                <Button
                  sx={{ minWidth: "auto", padding: "4px", color: "gray" }}
                >
                  <EditIcon fontSize="small" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Account Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {session?.user.department && (
              <div
                className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex justify-between items-center"
                onMouseEnter={() => setDepartmentEdit(true)}
                onMouseLeave={() => setDepartmentEdit(false)}
              >
                <div>
                  <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">
                    Department
                  </p>
                  <p className="text-gray-800 font-medium">
                    {session.user.department}
                  </p>
                </div>

                {departmentEdit && (
                  <Button
                    sx={{ minWidth: "auto", padding: "4px", color: "#2563eb" }}
                  >
                    <EditIcon fontSize="small" />
                  </Button>
                )}
              </div>
            )}
            {session?.user.account_type && (
              <div
                className="bg-green-50 p-4 rounded-lg border border-green-200 flex justify-between items-center"
                onMouseEnter={() => setAccountTypeEdit(true)}
                onMouseLeave={() => setAccountTypeEdit(false)}
              >
                <div>
                  <p className="text-xs text-green-600 uppercase tracking-wide mb-1">
                    Account Type
                  </p>
                  <p className="text-gray-800 font-medium">
                    {role[session.user.account_type] ||
                      session.user.account_type}
                  </p>
                </div>

                {accountTypeEdit && (
                  <Button
                    sx={{ minWidth: "auto", padding: "4px", color: "#16a34a" }}
                  >
                    <EditIcon fontSize="small" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
