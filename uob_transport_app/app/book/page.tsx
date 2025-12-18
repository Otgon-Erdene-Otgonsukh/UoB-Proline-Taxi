"use client";

import { useState } from "react";
import { useRouter, redirect } from "next/navigation";
import {
  Button,
  createTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  CircularProgress
} from "@mui/material";
import NumberField from "@/components/NumberField";
import { useSession } from "next-auth/react";

export default function BookingPage() {
  const commonLocations = [
    "Queens Building",
    "Merchant Venturers Building",
    "Richmond Building",
    "Victoria's Room",
    "Will's Memorial",
    "Physics Building",
  ];

  const session = useSession();

  if (!session) {
    // protected page
    redirect("/login");
  }

  const [isManualChecked, setIsManualChecked] = useState(false);
  const [isFlightChecked, setIsFlightChecked] = useState(false);
  const [isViaChecked, setIsViaChecked] = useState(false);
  const [isReturnChecked, setIsReturnChecked] = useState(false);
  const [phoneCode, setPhoneCode] = useState("+44");
  const [loadingBar, setLoadingBar] = useState(false);

  // Set error messages visible next to fields, default "" (empty) for hide.
  const [formFeedback, setFormFeedback] = useState({
    CommonLoc: "",
    CustomLoc: "",
    FlightNum: "",
    Airport: "",
    DropoffLoc: "",
    PickupDate: "",
    PickupTime: "",
    FirstName: "",
    Surname: "",
    Number: "",
    Email: "",
    AdditionalInfo: "",
  });

  const clearFeedback = () => {
    const dict = { ...formFeedback };
    for (const key in dict) {
      dict[key as keyof typeof dict] = "";
    }
    setFormFeedback(dict);
  };

  const addFormFeedback = (field: string, text: string) => {
    setFormFeedback((existing) => ({ ...existing, [field]: text }));
  };

  // Variables for storing the state of the values entered into the fields.
  const [formData, setFormData] = useState({
    CommonLoc: "",
    CustomLoc: "",
    Via: "",
    ReturnTo: "",
    FlightNum: "",
    Airport: "",
    DropoffLoc: "",
    PickupDate: "",
    PickupTime: "",
    FirstName: "",
    Surname: "",
    Number: "",
    Email: "",
    department: "",
    Passengers: 1,
    AdditionalInfo: "",
  });

  const router = useRouter();

  // Client side validation.
  const handleSubmit = (e: React.FormEvent) => {
    let fail = false;

    // Disallow submission to endpoint before validation.
    e.preventDefault();

    // Reset all messages to default:
    clearFeedback();

    let loc = "";

    // Custom Location
    if (isManualChecked) {
      if (formData.CustomLoc == "") {
        addFormFeedback("CustomLoc", "Please enter a pickup location.");
        fail = true;
      } else if (formData.CustomLoc.length < 5) {
        addFormFeedback("CustomLoc", "Pickup location not detailed enough.");
        fail = true;
      } else if (formData.CustomLoc.length > 100) {
        addFormFeedback("CustomLoc", "Pickup location too long.");
        fail = true;
      }

      loc = formData.CustomLoc;
    } else if (!isFlightChecked){
      // Common Pickup Location / Dropdown
      if (formData.CommonLoc == "") {
        addFormFeedback("CommonLoc", "Please pick one.");
        fail = true;
      }
      loc = formData.CommonLoc;
    }

    // Drop-Off Location
    // Not too long, not too short.
    if (formData.DropoffLoc == "") {
      addFormFeedback("DropoffLoc", "Please enter a drop-off location.");
      fail = true;
    } else if (formData.DropoffLoc.length < 5) {
      addFormFeedback("DropoffLoc", "Drop-off location not detailed enough.");
      fail = true;
    } else if (formData.DropoffLoc.length > 100) {
      addFormFeedback("DropoffLoc", "Drop-off location too long.");
      fail = true;
    }

    // Flight number (LLN{1,4}) and Airport
    // Some airlines such as easyJet are listed "U2NNNN" technically comprising LNNNNN.
    // Only validate if box is checked.
    if (isFlightChecked) {
      // Flight Number
      const flightNumCriteria = /^[A-Za-z]{1}[A-Za-z0-9]{1}[0-9]{1,4}$/;
      if (!flightNumCriteria.test(formData.FlightNum)) {
        addFormFeedback(
          "FlightNum",
          "Please enter your flight number (formatted AB1234)."
        );
        fail = true;
      }

      // Airport, between 2 and 50 characters.
      if (formData.Airport == "") {
        addFormFeedback("Airport", "Please enter your airport.");
        fail = true;
      } else if (formData.Airport.length < 2) {
        addFormFeedback("Airport", "Airport name too short.");
        fail = true;
      } else if (formData.Airport.length > 50) {
        addFormFeedback("Airport", "Airport name too long.");
        fail = true;
      }
    }

    // Pickup Date & Time
    // Form Date and Time are bound by selection in the browser and therefore
    // should only be subject to server side validation other than presence and being later than Date.Now().

    let pickupDateTime = new Date();

    if (formData.PickupDate == "") {
      addFormFeedback("PickupDate", "Please select a Date.");
      fail = true;
    } else if (formData.PickupTime == "") {
      addFormFeedback("PickupTime", "Please select a Time.");
      fail = true;
    } else {
      // Ensure user cannot make a booking in the past.
      const today = new Date();
      const targetDateTime = new Date(formData.PickupDate);
      const [h, m] = formData.PickupTime.split(":").map(Number);
      targetDateTime.setHours(h, m, 0, 0);

      if (today >= targetDateTime) {
        addFormFeedback("PickupDate", "Booking cannot be made in the past.");
        addFormFeedback("PickupTime", " "); // Make both boxes go red, hacky workaround.
        fail = true;
      }

      pickupDateTime = targetDateTime;
    }

    // Phone number
    // Some additional leniency for international numbers may need to be added later.
    // Matches UK formatting for mobile numbers (expecting mobile numbers only).
    const numberCriteria = /^(0)?[0-9]{4}(\s)?[0-9]{3}(\s)?[0-9]{1,3}$/;
    if (formData.Number == "") {
      addFormFeedback("Number", "Please enter the passenger's Phone Number.");
    } else if (!numberCriteria.test(formData.Number)) {
      addFormFeedback("Number", "Please enter a valid phone number.");
    }

    // First name, between 1 and 50 chars.
    if (formData.FirstName == "") {
      addFormFeedback("FirstName", "Please enter a First Name.");
      fail = true;
    } else if (formData.FirstName.length > 50) {
      addFormFeedback(
        "FirstName",
        "First Name too long. Please use an abbreviation."
      );
      fail = true;
    }

    // Surname, between 1 and 50 chars.
    if (formData.Surname == "") {
      addFormFeedback("Surname", "Please enter a Surname.");
      fail = true;
    } else if (formData.Surname.length > 50) {
      addFormFeedback(
        "Surname",
        "Surname too long. Please use an abbreviation."
      );
      fail = true;
    }

    // Email (at least one letter (not space), an @ symbol, and domain of
    // at least one letter before and two letters after a full stop.)
    const emailCriteria = /^[^\s]{1,}\@[^\s]{1,}\.[^\s]{2,}$/;
    if (!emailCriteria.test(formData.Email)) {
      addFormFeedback("Email", "Please enter a valid email address.");
      fail = true;
    }

    // Additional details (optional field)
    if (formData.AdditionalInfo.length > 500) {
      addFormFeedback("AdditionalInfo", "Too many characters. (max. 500)");
      fail = true;
    }

    // fail == false if all validation succeeds, then post the request.
    if (fail == false) {
      setLoadingBar(true);
      const jsonBody = {
        user_id: session.data?.user.user_id,
        pickup_location: loc,
        dropoff_location: formData.DropoffLoc,
        pickup_time: pickupDateTime,
        first_name: formData.FirstName,
        surname: formData.Surname,
        email: formData.Email,
        tel_number: phoneCode + " " + formData.Number,
        additional_info: formData.AdditionalInfo,
        via: formData.Via,
        returnTo: formData.ReturnTo,
        passengers: formData.Passengers,
        department: formData.department,
        airport: formData.Airport,
        flight_num: formData.FlightNum,
      };
      fetch("/api/create_booking", {
        method: "POST",
        body: JSON.stringify(jsonBody),
      })
        .then((response) => {
          if (response.status == 200) {
            router.push("/confirmed"); // Refresh page to (/confirmed) page, to reflect changes once implemented.
          } else {
            // Use additional info box to mark error. Will replace with specific errors in the future.
            addFormFeedback(
              "AdditionalInfo",
              "Form failed to submit. Please try again or check inputs."
            );
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          addFormFeedback(
            "AdditionalInfo",
            "Form failed to submit. Please try again later or check your network connection."
          );
        });
    }
  };

  const inputTheme = createTheme({
    //creating a custom theme outside the component
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "0.375rem", // rounded
            fontSize: "0.875rem", // text-sm
            color: "#111827", // gray-900 text color
            "& fieldset": {
              borderWidth: "2px",
              borderColor: "#111827",
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#111827", // gray-900 when select is focused
              borderWidth: "2px",
            },
          },
        },
      },
      MuiInputLabel: {
        //input label handling(default is blue)
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

  return (
    <div className="flex min-h-screen justify-center items-center font-inter p-4">
      <div className="border-3 border-[#2c2c2c] flex flex-col lg:flex-row bg-white shadow-lg rounded-lg my-8 max-w-5xl overflow-hidden">
        {/* Booking Form Section */}
        <div className="p-4 sm:p-6 md:p-8 w-full lg:w-1/2">
          <div className="bg-[#2c2c2c] text-white py-4 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 -mt-4 sm:-mt-6 md:-mt-8 mb-6">
            <h1 className="font-aleo text-2xl sm:text-3xl font-semibold text-center">
              BOOKING DETAILS
            </h1>
          </div>

          <form action="/" onSubmit={handleSubmit} method="POST">
            {/*should go to some confirmed page or alike, currently goes to homepage*/}
            <div className="flex flex-col gap-4">
              <div
                className={`flex flex-col ${
                  isManualChecked || isFlightChecked ? "text-gray-400" : ""
                }`}
              >
                {/*using the custom theme above*/}
                <ThemeProvider theme={inputTheme}>
                  <FormControl
                    fullWidth
                    disabled={isManualChecked || isFlightChecked}
                    sx={{
                      "& .MuiSelect-icon": {
                        color: "#111827", // gray-900 dropdown arrow
                      },
                    }}
                  >
                    <InputLabel id="commonLoc-label" className="text-sm">
                      Common pick-up locations
                    </InputLabel>
                    <Select
                      id="commonLoc"
                      label="Common pick-up locations"
                      defaultValue=""
                      onChange={(e) => {
                        setFormData({ ...formData, CommonLoc: e.target.value });
                      }}
                      error={formFeedback.CommonLoc != ""}
                    >
                      <MenuItem value="">
                        <em>Select a location</em>
                      </MenuItem>
                      {/*used an array to store the common locations and used map to populate the menu items*/}
                      {commonLocations.map((loc) => (
                        <MenuItem key={loc} value={loc}>
                          {loc}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText
                      sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                      className={`${
                        formFeedback.CommonLoc != "" ? "" : "hidden"
                      }`}
                    >
                      {formFeedback.CommonLoc}
                    </FormHelperText>
                  </FormControl>
                </ThemeProvider>
              </div>
              <div
                id="checkboxes"
                className="flex flex-row justify-start gap-6"
              >
                <label
                  htmlFor="manual"
                  className="inline-flex items-center cursor-pointer gap-2"
                >
                  <span className="text-sm font-medium text-gray-900">
                    Manually Enter
                  </span>
                  <input
                    id="manual"
                    type="checkbox"
                    checked={isManualChecked}
                    onChange={(e) => setIsManualChecked(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-gray-300 peer-checked:bg-[#4a4a4a] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <label
                  htmlFor="flight"
                  className="inline-flex items-center cursor-pointer gap-2"
                >
                  <span className="text-sm font-medium text-gray-900">
                    Flight
                  </span>
                  <input
                    id="flight"
                    type="checkbox"
                    checked={isFlightChecked}
                    onChange={(e) => setIsFlightChecked(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-gray-300 peer-checked:bg-[#4a4a4a] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <label
                  htmlFor="via"
                  className="inline-flex items-center cursor-pointer gap-2 ml-2"
                >
                  <span className="text-sm font-medium text-gray-900">Via</span>
                  <input
                    id="via"
                    type="checkbox"
                    checked={isViaChecked}
                    onChange={(e) => setIsViaChecked(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-gray-300 peer-checked:bg-[#4a4a4a] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              {isViaChecked && !isManualChecked && !isFlightChecked && (
                <div className="flex flex-col">
                  <label htmlFor="via" className="mb-1 text-sm">
                    Via
                  </label>
                  <input
                    id="via"
                    placeholder="Via..."
                    className="border-2 rounded px-3 py-2"
                    onChange={(e) => {
                      setFormData({ ...formData, Via: e.target.value });
                    }}
                  ></input>
                </div>
              )}

              {/* Show manual input field only when manual checkbox is checked */}
              {isManualChecked && (
                <div className="flex flex-col">
                  <label htmlFor="custom" className="mb-1 text-sm">
                    Custom pick-up location
                  </label>
                  <input
                    id="custom"
                    placeholder="Enter"
                    className={`border-2 rounded px-3 py-2 ${
                      formFeedback.CustomLoc == "" ? "" : "border-red-700"
                    }`}
                    onChange={(e) => {
                      setFormData({ ...formData, CustomLoc: e.target.value });
                    }}
                  ></input>
                  <FormHelperText
                    sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                    className={`${
                      formFeedback.CustomLoc != "" ? "" : "hidden"
                    }`}
                  >
                    {formFeedback.CustomLoc}
                  </FormHelperText>
                </div>
              )}

              {isManualChecked && isViaChecked && (
                <div className="flex flex-col">
                  <label htmlFor="via" className="mb-1 text-sm">
                    Via
                  </label>
                  <input
                    id="via"
                    placeholder="Via..."
                    className="border-2 rounded px-3 py-2"
                    onChange={(e) => {
                      setFormData({ ...formData, Via: e.target.value });
                    }}
                  ></input>
                </div>
              )}

              {/* Show flight input field only when flight checkbox is checked */}
              {isFlightChecked && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <label htmlFor="flightNum" className="mb-1 text-sm">
                      Flight number
                    </label>
                    <input
                      id="flightNum"
                      placeholder="AB1234"
                      className={`border-2 rounded px-3 py-2 ${
                        formFeedback.FlightNum == "" ? "" : "border-red-700"
                      }`}
                      onChange={(e) => {
                        setFormData({ ...formData, FlightNum: e.target.value });
                      }}
                    ></input>
                    <FormHelperText
                      sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                      className={`${
                        formFeedback.FlightNum != "" ? "" : "hidden"
                      }`}
                    >
                      {formFeedback.FlightNum}
                    </FormHelperText>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="airport" className="mb-1 text-sm">
                      Airport
                    </label>
                    <input
                      id="airport"
                      placeholder="Bristol Airport"
                      className={`border-2 rounded px-3 py-2 ${
                        formFeedback.Airport == "" ? "" : "border-red-700"
                      }`}
                      onChange={(e) => {
                        setFormData({ ...formData, Airport: e.target.value });
                      }}
                    ></input>
                    <FormHelperText
                      sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                      className={`${
                        formFeedback.Airport != "" ? "" : "hidden"
                      }`}
                    >
                      {formFeedback.Airport}
                    </FormHelperText>
                  </div>
                  {isViaChecked && (
                    <div className="flex flex-col">
                      <label htmlFor="via" className="mb-1 text-sm">
                        Via
                      </label>
                      <input
                        id="via"
                        placeholder="Via..."
                        className="border-2 rounded px-3 py-2"
                        onChange={(e) => {
                          setFormData({ ...formData, Via: e.target.value });
                        }}
                      ></input>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col">
                <label htmlFor="dropLoc" className="mb-1 text-sm">
                  Drop-off location
                </label>
                <input
                  type="dropLoc"
                  id="dropLoc"
                  placeholder="Temple Quarter Enterprise Campus, Bristol"
                  onChange={(e) => {
                    setFormData({ ...formData, DropoffLoc: e.target.value });
                  }}
                  className={`border-2 rounded px-3 py-2 ${
                    formFeedback.DropoffLoc == "" ? "" : "border-red-700"
                  }`}
                ></input>
                <FormHelperText
                  sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                  className={`${formFeedback.DropoffLoc != "" ? "" : "hidden"}`}
                >
                  {formFeedback.DropoffLoc}
                </FormHelperText>
              </div>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: "#2c2c2c",
                        "&.Mui-checked": { color: "#2c2c2c" },
                      }}
                      checked={isReturnChecked}
                      onChange={(e) => setIsReturnChecked(e.target.checked)}
                    />
                  }
                  label="Return trip"
                />
              </div>
              {isReturnChecked && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="returnPickUp" className="mb-1 text-sm">
                      Pick-up location
                    </label>
                    <input
                      id="returnPickUp"
                      className="border-2 rounded px-3 py-2"
                      value={formData.DropoffLoc}
                      disabled
                    ></input>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="returnDropOff" className="mb-1 text-sm">
                      Drop-off location
                    </label>
                    <input
                      id="returnDropOff"
                      placeholder="Enter"
                      className="border-2 rounded px-3 py-2"
                      onChange={(e) => {
                        setFormData({ ...formData, ReturnTo: e.target.value });
                      }}
                    ></input>
                  </div>
                </div>
              )}
              <div className="flex flex-col text-sm">
                <label htmlFor="pickupDate" className="mb-1">
                  Pick-up date and time
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                  <input
                    id="pickupDate"
                    type="date"
                    className={`border-2 rounded px-3 sm:px-3 py-2 flex-1 min-w-0 ${
                      formFeedback.PickupDate == "" ? "" : "border-red-700"
                    }`}
                    onChange={(e) => {
                      setFormData({ ...formData, PickupDate: e.target.value });
                    }}
                  ></input>
                  <input
                    id="pickupTime"
                    type="time"
                    className={`border-2 rounded px-3 sm:px-3 py-2 flex-1 min-w-0 ${
                      formFeedback.PickupTime == "" ? "" : "border-red-700"
                    }`}
                    onChange={(e) => {
                      setFormData({ ...formData, PickupTime: e.target.value });
                    }}
                  ></input>
                </div>
                <FormHelperText
                  sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                  className={`${formFeedback.PickupDate != "" ? "" : "hidden"}`}
                >
                  {formFeedback.PickupDate}
                </FormHelperText>
                <FormHelperText
                  sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                  className={`${formFeedback.PickupTime != "" ? "" : "hidden"}`}
                >
                  {formFeedback.PickupTime}
                </FormHelperText>
              </div>
              <div>
                <h3 className="font-bold">Lead passenger details:</h3>
              </div>
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 text-sm">
                  First name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`border-2 rounded px-3 py-2 ${
                    formFeedback.FirstName == "" ? "" : "border-red-700"
                  }`}
                  onChange={(e) => {
                    setFormData({ ...formData, FirstName: e.target.value });
                  }}
                ></input>
                <FormHelperText
                  sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                  className={`${formFeedback.FirstName != "" ? "" : "hidden"}`}
                >
                  {formFeedback.FirstName}
                </FormHelperText>
              </div>
              <div className="flex flex-col">
                <label htmlFor="surname" className="mb-1 text-sm">
                  Last name
                </label>
                <input
                  id="surname"
                  type="text"
                  className={`border-2 rounded px-3 py-2 ${
                    formFeedback.Surname == "" ? "" : "border-red-700"
                  }`}
                  onChange={(e) => {
                    setFormData({ ...formData, Surname: e.target.value });
                  }}
                ></input>
                <FormHelperText
                  sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                  className={`${formFeedback.Surname != "" ? "" : "hidden"}`}
                >
                  {formFeedback.Surname}
                </FormHelperText>
              </div>
              <div className="flex flex-col">
                <label htmlFor="number" className="mb-1 text-sm">
                  Phone number
                </label>
                <div className="flex gap-2">
                  <select
                    className="border-2 rounded px-2 py-2"
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
                  <input
                    type="tel"
                    id="number"
                    placeholder="1234567890"
                    className={`border-2 rounded flex-1 sm:px-3 py-2 min-w-0 w-full ${
                      formFeedback.Number == "" ? "" : "border-red-700"
                    }`}
                    onChange={(e) => {
                      setFormData({ ...formData, Number: e.target.value });
                    }}
                  />
                </div>
                <FormHelperText
                  sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                  className={`${formFeedback.Number != "" ? "" : "hidden"}`}
                >
                  {formFeedback.Number}
                </FormHelperText>
              </div>
              <div className="flex flex-col">
                <label htmlFor="dropLoc" className="mb-1 text-sm">
                  Department
                </label>
                <input
                  id="department"
                  onChange={(e) => {
                    setFormData({ ...formData, department: e.target.value });
                  }}
                  className="border-2 rounded px-3 py-2"
                ></input>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <label htmlFor="mail" className="mb-1 text-sm">
                    Email
                  </label>
                  <input
                    id="mail"
                    type="email"
                    className={`border-2 rounded px-3 py-2 ${
                      formFeedback.Email == "" ? "" : "border-red-700"
                    }`}
                    onChange={(e) => {
                      setFormData({ ...formData, Email: e.target.value });
                    }}
                  ></input>
                  <FormHelperText
                    sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                    className={`${formFeedback.Email != "" ? "" : "hidden"}`}
                  >
                    {formFeedback.Email}
                  </FormHelperText>
                </div>
                <div className="flex flex-col flex-1">
                  <label htmlFor="passenger" className="mb-1 text-sm">
                    Passengers
                  </label>
                  <NumberField
                    min={1}
                    max={20}
                    defaultValue={1}
                    size="small"
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        Passengers: value !== null ? value : 1,
                      });
                    }}
                  ></NumberField>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="addInfo" className="mb-1 text-sm">
                  Additional information
                </label>
                <textarea
                  id="addInfo"
                  className={`border-2 rounded px-3 py-2 min-h-20 ${
                    formFeedback.AdditionalInfo == "" ? "" : "border-red-700"
                  }`}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      AdditionalInfo: e.target.value,
                    });
                  }}
                  maxLength={500}
                  placeholder="Enter any additional information..."
                ></textarea>
                <FormHelperText
                  sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                  className={`${
                    formFeedback.AdditionalInfo != "" ? "" : "hidden"
                  }`}
                >
                  {formFeedback.AdditionalInfo}
                </FormHelperText>
              </div>
              <div className="flex justify-center mt-4">
                <Button //used MUI button component for a clean animation on clicks
                  type="submit"
                  fullWidth
                  sx={{
                    py: 2.5,
                    bgcolor: "#2c2c2c",
                    color: "white",
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#414040", transform: "scale(1.01)" },
                    transition: "all 0.2s",
                    fontSize: "0.875rem",
                  }}
                >
                  {loadingBar ? <CircularProgress color="inherit" size="30px"/> : "Confirm Booking"}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            src="/emptymap.png"
            alt="Map"
            className="w-full h-full object-cover border-l-3 border-[#2c2c2c]"
          />
        </div>
      </div>
    </div>
  );
}
