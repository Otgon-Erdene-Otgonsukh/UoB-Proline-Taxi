"use client";

import {
  Avatar,
  Button,
  CircularProgress,
  TextField,
  Autocomplete,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDepartments } from "@/app/requests/departments";
import { department } from "@/generated/prisma/client";

const role: Record<string, string> = {
  normal_user: "Normal User",
  finance_staff: "University Finance Staff",
  proline_staff: "ProLine Staff",
  super_admin: "Super Admin",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Profile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nameEdit, setNameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [phoneEdit, setPhoneEdit] = useState(false);
  const [departmentEdit, setDepartmentEdit] = useState(false);
  const [nameEditOn, setNameEditOn] = useState(false);
  const [emailEditOn, setEmailEditOn] = useState(false);
  const [phoneEditOn, setPhoneEditOn] = useState(false);
  const [departmentEditOn, setDepartmentEditOn] = useState(false);
  const [snackState, setSnackState] = useState({
    open: false,
    severity: "" as AlertColor,
  });
  const [changeError, setChangeError] = useState({
    name: false,
    email: false,
    department: false,
    phone_number: false,
  });
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    dep_id: 0,
    phone_number: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const [departments, setDepartmentList] = useState<department[]>([]);
  useEffect(() => {
    getDepartments().then((res) => {
      if (res.status === 200) {
        res.json().then(data => {
          setDepartmentList(data);
        })
      }
    });
  }, [])

  if (status === "loading") {
    // display a loading bar for feedback
    return (
      <div className="min-h-screen flex justify-center items-center">
        <CircularProgress color="inherit" />
      </div>
    );
  }

  const handleCancel = () => {
    setEditMode(false);
    setNameEditOn(false);
    setNameEdit(false);
    setEmailEditOn(false);
    setEmailEdit(false);
    setPhoneEdit(false);
    setPhoneEditOn(false);
    setDepartmentEdit(false);
    setDepartmentEditOn(false);
    setChangeError({
      name: false,
      email: false,
      department: false,
      phone_number: false,
    });
  };

  const handleSave = () => {
    let fail = false;
    const newErrors = { ...changeError };

    // Client side validation
    if (nameEditOn) {
      if (editData.name.length === 0 || editData.name.length > 15) {
        newErrors.name = true;
        fail = true;
      }
    }
    if (emailEditOn) {
      if (!emailRegex.test(editData.email)) {
        newErrors.email = true;
        fail = true;
      }
    }
    if (phoneEditOn) {
      if (
        !editData.phone_number.startsWith("+") ||
        editData.phone_number.length > 25
      ) {
        newErrors.phone_number = true;
        fail = true;
      }
    }

    // Set all errors for feedback
    setChangeError(newErrors);

    // API call if no error is present
    if (!fail) {
      setLoading(true);
      const data = {
        user_id: session?.user.user_id,
        ...(nameEditOn && { name: editData.name }),
        ...(emailEditOn && { email: editData.email }),
        ...(phoneEditOn && { phone_number: editData.phone_number }),
        ...(departmentEditOn && { dep_id: editData.dep_id }),
      };
      fetch("/api/update-user-info", {
        body: JSON.stringify(data),
        method: "POST",
      }).then((res) => {
        if (res.status === 200) {
          setLoading(false);
          handleCancel();
          setSnackState({ open: true, severity: "success" });
          // Trigger session refresh from server
          update({
            ...session,
            user: {
              ...session?.user,
              ...(nameEditOn && { name: editData.name }),
              ...(emailEditOn && { email: editData.email }),
              ...(phoneEditOn && { phone_number: editData.phone_number }),
              ...(departmentEditOn && { dep_id: editData.dep_id }),
            },
          });
        } else {
          setLoading(false);
          handleCancel();
          setSnackState({ open: true, severity: "error" });
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center flex-col p-6 mt-6">
      <motion.div
        className="flex flex-col items-center justify-center mb-8"
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0 }}
      >
        <Avatar
          data-testid="avatar"
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
          {session?.user.name}
        </h1>
      </motion.div>

      <div className="bg-white flex flex-col md:w-1/2 w-full shadow-xl rounded-2xl p-8 space-y-6 mb-10">
        <motion.div
          className="border-b border-gray-200 pb-4"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0 }}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {nameEditOn ? (
              <TextField
                data-testid="nameTextField"
                label="Name"
                color="secondary"
                sx={{
                  "& .MuiInputBase-root": {
                    height: "100%",
                  },
                }}
                focused
                value={editData.name}
                onChange={(e) => {
                  setEditData({ ...editData, name: e.target.value });
                  setChangeError({ ...changeError, name: false });
                }}
                helperText={changeError.name && "Enter a valid name"}
                error={changeError.name}
              ></TextField>
            ) : (
              <div
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:drop-shadow-md/20 hover:-translate-y-1 transition-all ease-in-out duration-200"
                onMouseEnter={() => {
                  setNameEdit(true);
                }}
                onMouseLeave={() => setNameEdit(false)}
                data-testid="nameDiv"
              >
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Full Name
                  </p>
                  <p className="text-gray-800">
                    {session?.user.name}
                  </p>
                </div>

                {nameEdit && (
                  <Button
                  data-testid="name-edit-button"
                    sx={{ minWidth: "auto", padding: "4px", color: "gray" }}
                    onClick={() => {
                      setEditData({
                        ...editData,
                        name: session?.user.name ?? "",
                      });
                      setNameEditOn(true);
                      setEditMode(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="border-b border-gray-200 pb-4"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailEditOn ? (
              <TextField
                label="Email"
                color="secondary"
                sx={{
                  "& .MuiInputBase-root": {
                    height: "100%",
                  },
                }}
                focused
                value={editData.email}
                onChange={(e) => {
                  setEditData({ ...editData, email: e.target.value });
                  setChangeError({ ...changeError, email: false });
                }}
                helperText={changeError.email && "Enter a valid email address"}
                error={changeError.email}
              ></TextField>
            ) : (
              <div
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:drop-shadow-md/20 hover:-translate-y-1 transition-all ease-in-out duration-200"
                onMouseEnter={() => setEmailEdit(true)}
                onMouseLeave={() => setEmailEdit(false)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="text-gray-800 truncate">
                    {session?.user.email}
                  </p>
                </div>

                {emailEdit && (
                  <Button
                    sx={{
                      minWidth: "auto",
                      padding: "4px",
                      color: "gray",
                      ml: 1,
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      setEditData({
                        ...editData,
                        email: session?.user.email ?? "",
                      });
                      setEmailEditOn(true);
                      setEditMode(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </Button>
                )}
              </div>
            )}
            {phoneEditOn ? (
              <TextField
                label="Phone Number"
                color="secondary"
                focused
                sx={{
                  "& .MuiInputBase-root": {
                    height: "100%",
                  },
                }}
                value={editData.phone_number}
                onChange={(e) => {
                  setEditData({ ...editData, phone_number: e.target.value });
                  setChangeError({ ...changeError, phone_number: false });
                }}
                helperText={
                  changeError.phone_number && "Enter a valid phone number"
                }
                error={changeError.phone_number}
              ></TextField>
            ) : (
              <div
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-center hover:drop-shadow-md/20 hover:-translate-y-1 transition-all ease-in-out duration-200"
                onMouseEnter={() => setPhoneEdit(true)}
                onMouseLeave={() => setPhoneEdit(false)}
              >
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Phone Number
                  </p>
                  <p>{session?.user.phone_number}</p>
                </div>
                {phoneEdit && (
                  <Button
                    sx={{ minWidth: "auto", padding: "4px", color: "gray" }}
                    onClick={() => {
                      setEditData({
                        ...editData,
                        phone_number: session?.user.phone_number ?? "",
                      });
                      setPhoneEditOn(true);
                      setEditMode(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Account Details
          </h2>
          <div
            className={`grid grid-cols-1 md:${session?.user.dep_id ? "grid-cols-2" : "grid-cols-1"} gap-4`}
          >
            {session?.user.dep_id &&
              (departmentEditOn ? (
                <Autocomplete
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: 2,
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#2563eb",
                        borderWidth: 2,
                      },
                      "&:hover fieldset": {
                        borderColor: "#2563eb",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2563eb",
                      },
                    },
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        border: "2px solid #2c2c2c",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        mt: 0.5,
                        "& .MuiAutocomplete-option": {
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                            borderLeft: 2,
                            borderColor: "#2c2c2c",
                          },
                          transition: "all 0.1s ease-in-out",
                        },
                      },
                    },
                  }}
                  autoFocus
                  onChange={(_, dep) => {
                    setEditData({ ...editData, dep_id: dep!.dep_id });
                    setChangeError({ ...changeError, department: false });
                  }}
                  options={departments}
                  getOptionKey={(department) => department.dep_id}
                  getOptionLabel={(department) => department.dep_name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Department"
                      error={changeError.department}
                      helperText={
                        changeError.department
                          ? "Please select from the valid department options"
                          : "Note: When changing department, the request have to be approved"
                      }
                    />
                  )}
                ></Autocomplete>
              ) : (
                <div
                  className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex justify-between items-center hover:drop-shadow-md/20 hover:-translate-y-1 transition-all ease-in-out duration-200"
                  onMouseEnter={() => setDepartmentEdit(true)}
                  onMouseLeave={() => setDepartmentEdit(false)}
                >
                  <div>
                    <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">
                      Department
                    </p>
                    <p className="text-gray-800">
                      {session.user.dep_name}
                    </p>
                  </div>

                  {departmentEdit && (
                    <Button
                      sx={{
                        minWidth: "auto",
                        padding: "4px",
                        color: "#2563eb",
                      }}
                      onClick={() => {
                        setEditData({
                          ...editData,
                          dep_id: session?.user.dep_id ?? 0,
                        });
                        setDepartmentEditOn(true);
                        setEditMode(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                  )}
                </div>
              ))}
            {session?.user.account_type && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex justify-between items-center hover:drop-shadow-md/20 hover:-translate-y-1 transition-all ease-in-out duration-200">
                <div>
                  <p className="text-xs text-green-600 uppercase tracking-wide mb-1">
                    Account Type
                  </p>
                  <p className="text-gray-800">
                    {role[session.user.account_type] ||
                      session.user.account_type}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        {editMode && (
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="contained"
              sx={{
                bgcolor: "#2c2c2c",
                color: "white",
                textTransform: "none",
                px: 3,
                py: 1,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "#1a1a1a",
                  transform: "scale(1.03)",
                },
              }}
              onClick={handleSave}
            >
              {loading ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: "#9ca3af",
                color: "#6b7280",
                textTransform: "none",
                px: 3,
                py: 1,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "#6b7280",
                  bgcolor: "#f9fafb",
                  transform: "scale(1.03)",
                },
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        )}
        <Snackbar
          open={snackState.open}
          onClose={() => {
            setSnackState({ ...snackState, open: false });
          }}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={snackState.severity}
            variant="filled"
            onClose={() => {
              setSnackState({ ...snackState, open: false });
            }}
          >
            {snackState.severity === "success"
              ? "Changes saved successfully."
              : "Changes were not saved, try again later."}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
