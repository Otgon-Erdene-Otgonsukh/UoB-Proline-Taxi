"use client";

import {
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardActionArea,
  Button,
  createTheme,
  ThemeProvider,
  CircularProgress,
  Snackbar,
  Alert,
  AlertProps,
  Autocomplete,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CheckIcon from "@mui/icons-material/Check";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ApartmentIcon from "@mui/icons-material/Apartment";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Register() {
  const session = useSession();

  const departments = [
    "Centre for Academic Language and Development",
    "Centre for Innovation and Entrepreneurship",
    "Arts",
    "Economics",
    "Education",
    "Humanities",
    "Modern Languages",
    "Policy Studies",
    "Sociology, Politics and International Studies",
    "Business",
    "Law",
    "Dental",
    "Medical",
    "Veterinary",
    "Health Professions Education",
    "Anatomy",
    "Biochemistry",
    "Biological Sciences",
    "Cellular and Molecular Medicine",
    "Physiology, Pharmacology and Neuroscience",
    "Psychological Science",
    "Chemistry",
    "Civil, Aerospace, and Design Engineering",
    "Computer Science",
    "Earth Sciences",
    "Electrical, Electronic and Mechanical Engineering",
    "Engineering Mathematics and Technology",
    "Geographical Sciences",
    "Mathematics",
    "Physics",
  ];

  if (session.data) {
    // if user is logged in, protect this route
    redirect("/home");
  }

  const [normalUser, setNormalUser] = useState(false);
  const [financeStaff, setFinanceStaff] = useState(false);
  const [proLineStaff, setProLineStaff] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailEmpty, setEmailEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);
  const [noRole, setNoRole] = useState(false);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [firstNameEmpty, setFirstNameEmpty] = useState(false);
  const [lastNameEmpty, setLastNameEmpty] = useState(false);
  const [usernameEmpty, setUsernameEmpty] = useState(false);
  const [phoneNumberEmpty, setPhoneNumberEmpty] = useState(false);
  const [departmentEmpty, setDepartmentEmpty] = useState(false);
  const [prolineMailError, setProlineMailError] = useState(false);
  const [financeStaffMailError, setFinanceStaffMailError] = useState(false);
  const [phoneCode, setPhoneCode] = useState("+44");
  const [loadingBar, setLoadingBar] = useState(false);
  const [snackState, setSnackState] = useState({ open: false, severity: "" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const inputTheme = createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "0.375rem",
            "& fieldset": {
              borderWidth: "2px",
              borderColor: "#111827",
            },
            "&:hover fieldset": {
              borderColor: "#111827",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: "0.875rem",
            color: "#111827",
            "&.Mui-focused": {
              color: "#111827",
            },
          },
        },
      },
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset all errors
    setEmailError(false);
    setEmailEmpty(false);
    setPasswordError(false);
    setPasswordEmpty(false);
    setFirstNameEmpty(false);
    setLastNameEmpty(false);
    setUsernameEmpty(false);
    setPhoneNumberEmpty(false);
    setDepartmentEmpty(false);

    let hasError = false;

    if (emailRegex.test(mail) === false && mail.length !== 0 && normalUser) {
      setEmailError(true);
      hasError = true;
    }
    if (financeStaff && !mail.endsWith("@bristol.ac.uk") && mail.length !== 0) {
      setFinanceStaffMailError(true);
      hasError = true;
    }
    if (
      proLineStaff &&
      !mail.endsWith("@prolinetaxi.com") &&
      mail.length !== 0
    ) {
      setProlineMailError(true);
      hasError = true;
    }
    if (mail.length === 0) {
      setEmailEmpty(true);
      hasError = true;
    }
    if (password.length === 0) {
      setPasswordEmpty(true);
      hasError = true;
    }
    if (password.length < 5 || password.length > 20) {
      setPasswordError(true);
      hasError = true;
    }
    if (firstName.length === 0) {
      setFirstNameEmpty(true);
      hasError = true;
    }
    if (lastName.length === 0) {
      setLastNameEmpty(true);
      hasError = true;
    }
    if (username.length === 0) {
      setUsernameEmpty(true);
      hasError = true;
    }
    if (phoneNumber.length === 0) {
      setPhoneNumberEmpty(true);
      hasError = true;
    }
    if (department.length === 0 && (normalUser || financeStaff)) {
      setDepartmentEmpty(true);
      hasError = true;
    }
    if (
      proLineStaff === false &&
      normalUser === false &&
      financeStaff === false
    ) {
      setNoRole(true);
      hasError = true;
    }

    if (!hasError) {
      setLoadingBar(true);
      const body = {
        mail: mail,
        password: password,
        firstName: firstName,
        lastName: lastName,
        department: department,
        phoneNumber: phoneCode + " " + phoneNumber,
        username: username,
        role: financeStaff
          ? "finance_staff"
          : proLineStaff
          ? "proline_staff"
          : "normal_user",
      };
      fetch("api/create_user", { method: "POST", body: JSON.stringify(body) })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200 && normalUser) {
            setSnackState({ open: true, severity: "success" });
            setTimeout(() => {
              // Giving time to display the success message to inform the user
              redirect("/login");
            }, 3000);
          } else if (data.status === 200 && (financeStaff || proLineStaff)) {
            redirect("/register/register-req");
          } else {
            setLoadingBar(false);
            setSnackState({ open: true, severity: "error" });
          }
        });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg/20 max-w-3xl rounded-md border-4 border-[#2c2c2c] mt-20 mb-20">
        <div className="flex">
          <div
            id="left"
            className="bg-[#2c2c2c] w-1/2 flex flex-col justify-center items-center"
          >
            <Image
              src="/ownlogo.png"
              alt="location logo"
              className=""
              width={320}
              height={150}
            ></Image>
            <div className="text-white p-5 font-inter text-center leading-relaxed">
              <h1 className="text-[21px] font-bold mb-3">
                Account Registration Process
              </h1>
              <p className="text-[16px] font-light leading-relaxed">
                <span className="block mb-2">
                  <strong className="font-semibold">1. Choose</strong> your role
                  below
                </span>
                <span className="block mb-2">
                  <strong className="font-semibold">2. Submit</strong> your
                  registration request
                </span>
                <span className="block mb-2">
                  <strong className="font-semibold">3. Wait</strong> for admin
                  approval
                </span>
                <span className="block">
                  <strong className="font-semibold">4. Access</strong> your
                  account once granted permission
                </span>
              </p>
            </div>
          </div>
          <div
            id="right"
            className="flex flex-col items-center gap-6 justify-center p-8 w-1/2"
          >
            <h1 className="font-inter font-bold text-[22px] text-shadow-lg/5 mb-1">
              Create Account
            </h1>
            <ThemeProvider theme={inputTheme}>
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex gap-3">
                  <TextField
                    fullWidth
                    error={firstNameEmpty}
                    helperText={firstNameEmpty ? "Please enter first name" : ""}
                    label="First Name"
                    id="firstName"
                    type="text"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setFirstNameEmpty(false);
                    }}
                  />
                  <TextField
                    fullWidth
                    error={lastNameEmpty}
                    helperText={lastNameEmpty ? "Please enter last name" : ""}
                    label="Last Name"
                    id="lastName"
                    type="text"
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setLastNameEmpty(false);
                    }}
                  />
                </div>
                <TextField
                  fullWidth
                  error={usernameEmpty}
                  helperText={usernameEmpty ? "Please enter username" : ""}
                  label="Username"
                  id="username"
                  type="text"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameEmpty(false);
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <PersonIcon sx={{ color: "#111827" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <div className="flex gap-3">
                  <select
                    className="border-2 rounded-md max-h-14 px-2"
                    defaultValue="+44"
                    onChange={(e) => {
                      setPhoneCode(e.target.value);
                    }}
                  >
                    <option value="+44">+44 (UK)</option>
                    <option value="+1">+1 (US/CA)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+86">+86 (CN)</option>
                    <option value="+61">+61 (AU)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+49">+49 (DE)</option>
                    <option value="+81">+81 (JP)</option>
                  </select>
                  <TextField
                    fullWidth
                    error={phoneNumberEmpty}
                    helperText={
                      phoneNumberEmpty ? "Please enter phone number" : ""
                    }
                    label="Phone Number"
                    id="phoneNumber"
                    type="tel"
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setPhoneNumberEmpty(false);
                    }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <LocalPhoneIcon sx={{ color: "#111827" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>
                <Autocomplete
                  disablePortal
                  value={department}
                  inputValue={department}
                  onInputChange={(_, dep) => {
                    setDepartment(dep);
                    setDepartmentEmpty(false);
                  }}
                  disabled={proLineStaff}
                  options={departments}
                  slotProps={{
                    paper: {
                      sx: {
                        border: "2px solid #2c2c2c",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        mt: 0.5,
                        "& .MuiAutocomplete-option": {
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                          },
                          '&[aria-selected="true"]': {
                            backgroundColor: "#e5e7eb !important",
                          },
                        },
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Department"
                      error={departmentEmpty}
                      helperText={
                        departmentEmpty
                          ? "Select a department"
                          : "Proline staff, please ignore this field"
                      }
                    ></TextField>
                  )}
                ></Autocomplete>
                <TextField
                  fullWidth
                  error={
                    emailError ||
                    emailEmpty ||
                    prolineMailError ||
                    financeStaffMailError
                  }
                  helperText={
                    emailError
                      ? "Enter a valid email"
                      : emailEmpty
                      ? "Please enter an email"
                      : prolineMailError
                      ? "Enter a valid company email"
                      : financeStaffMailError
                      ? "Enter a valid university email"
                      : ""
                  }
                  label="Email"
                  id="email"
                  type="email"
                  onChange={(e) => {
                    setMail(e.target.value);
                    setEmailError(false);
                    setEmailEmpty(false);
                    setFinanceStaffMailError(false);
                    setProlineMailError(false);
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <EmailIcon sx={{ color: "#111827" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth
                  error={passwordEmpty || passwordError}
                  helperText={
                    passwordEmpty
                      ? "Please enter a password"
                      : passwordError
                      ? "Enter a valid password"
                      : ""
                  }
                  label="Password"
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                    setPasswordEmpty(false);
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            sx={{ color: "#111827", mr: -1 }}
                            onClick={() => {
                              setPasswordVisible(!passwordVisible);
                            }}
                          >
                            {passwordVisible ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <span className="text-center font-inter font-bold">
                  Register as:
                </span>
                <div id="role_choice_cards" className="flex gap-3 h-30">
                  <Card
                    sx={{
                      border: normalUser ? 0 : 2,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                      },
                      cursor: "pointer",
                    }}
                  >
                    <CardActionArea
                      sx={{
                        height: "100%",
                        "&[data-active='true']": {
                          border: 3,
                          borderColor: "green",
                          bgcolor: "#E8FDEB",
                        },
                      }}
                      onClick={() => {
                        setNormalUser(!normalUser);
                        setProLineStaff(false);
                        setFinanceStaff(false);
                        setNoRole(false);
                      }}
                      data-active={normalUser ? "true" : "false"}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "16px",
                          gap: "8px",
                        }}
                      >
                        {normalUser && (
                          <CheckIcon
                            sx={{
                              position: "absolute",
                              ml: 7.5,
                              mb: 11,
                              color: "green",
                            }}
                          />
                        )}
                        <PersonIcon sx={{ fontSize: 40, color: "#2c2c2c" }} />
                        <div className="text-center font-inter text-sm font-medium">
                          <span>Normal User</span>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  <Card
                    sx={{
                      border: financeStaff ? 0 : 2,
                      maxWidth: 100,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                      },
                      cursor: "pointer",
                    }}
                  >
                    <CardActionArea
                      sx={{
                        height: "100%",
                        '&[data-active="true"]': {
                          border: 3,
                          borderColor: "green",
                          bgcolor: "#E8FDEB",
                        },
                      }}
                      onClick={() => {
                        setFinanceStaff(!financeStaff);
                        setNormalUser(false);
                        setProLineStaff(false);
                        setNoRole(false);
                      }}
                      data-active={financeStaff ? "true" : "false"}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "16px",
                          gap: "8px",
                        }}
                      >
                        {financeStaff && (
                          <CheckIcon
                            sx={{
                              position: "absolute",
                              ml: 7.5,
                              mb: 11,
                              color: "green",
                            }}
                          />
                        )}
                        <ManageAccountsIcon
                          sx={{ fontSize: 40, color: "#2c2c2c" }}
                        />
                        <div className="text-center font-inter text-sm font-medium -mb-1">
                          <span>Finance Staff</span>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                  <Card
                    sx={{
                      border: proLineStaff ? 0 : 2,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                      },
                      cursor: "pointer",
                    }}
                  >
                    <CardActionArea
                      sx={{
                        height: "100%",
                        '&[data-active="true"]': {
                          border: 3,
                          borderColor: "green",
                          bgcolor: "#E8FDEB",
                        },
                      }}
                      onClick={() => {
                        setProLineStaff(!proLineStaff);
                        setDepartment("");
                        setDepartmentEmpty(false);
                        setNormalUser(false);
                        setFinanceStaff(false);
                        setNoRole(false);
                      }}
                      data-active={proLineStaff ? "true" : "false"}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "16px",
                          gap: "8px",
                        }}
                      >
                        {proLineStaff && (
                          <CheckIcon
                            sx={{
                              position: "absolute",
                              ml: 7.5,
                              mb: 11,
                              color: "green",
                            }}
                          />
                        )}
                        <PersonSearchIcon
                          sx={{ fontSize: 40, color: "#2c2c2c" }}
                        />
                        <div className="text-center font-inter text-sm font-medium">
                          <span>ProLine Staff</span>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </div>
                {noRole && (
                  <span className="text-red-400 text-sm text-center">
                    Account type must be selected
                  </span>
                )}
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    bgcolor: "#2c2c2c",
                    color: "white",
                    font: "inter",
                    py: 1.5,
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    fontWeight: 300,
                    "&:hover": {
                      bgcolor: "#414040",
                      transform: "scale(1.01)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  {loadingBar ? (
                    <CircularProgress color="inherit" size="30px" />
                  ) : (
                    "Sign up"
                  )}
                </Button>
                <span
                  id="login redirect"
                  className="font-inter text-sm text-center"
                >
                  Already have an account?
                  <Link href="/login" className="text-blue-500">
                    {" "}
                    Log in.
                  </Link>
                </span>
              </form>
            </ThemeProvider>
          </div>
        </div>
      </div>
      <Snackbar
        open={snackState.open}
        onClose={() => {
          setSnackState({ open: false, severity: "" });
        }}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackState.severity as AlertProps["severity"]}
          variant="filled"
        >
          {snackState.severity === "success"
            ? "Account successfully created"
            : "Failed to create an account"}
        </Alert>
      </Snackbar>
    </div>
  );
}
