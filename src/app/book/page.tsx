"use client";

import { useState } from "react";
import {
  Button,
  createTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
} from "@mui/material";

export function BookingPage() {
  const commonLocations = [
    "Queens Building",
    "Merchant Venturers Building",
    "Richmond Building",
    "Victoria's Room",
    "Will's Memorial",
    "Physics Building",
  ];

  const [isManualChecked, setIsManualChecked] = useState(false);
  const [isFlightChecked, setIsFlightChecked] = useState(false);

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

  {
    /*no client side validation at all except some default ones like input types*/
  }

  return (
    <div className="flex min-h-screen justify-center items-center font-inter p-4">
      <div className="bg-white mt-50 mb-30 shadow-lg/20 p-4 sm:p-6 md:p-8 rounded-lg my-8 w-full max-w-lg">
        <h1 className="font-aleo text-2xl sm:text-3xl font-semibold mb-6 text-center text-shadow-lg/20">
          BOOKING DETAILS
        </h1>
        <form action="/" method="POST">
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
                </FormControl>
              </ThemeProvider>
            </div>
            <div id="checkboxes" className="flex flex-row justify-start gap-6">
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
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-gray-300 peer-checked:bg-[#4a4a4a] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
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
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-gray-300 peer-checked:bg-[#4a4a4a] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            {/* Show manual input field only when manual checkbox is checked */}
            {isManualChecked && (
              <div className="flex flex-col">
                <label htmlFor="custom" className="mb-1 text-sm">
                  Custom pick-up location
                </label>
                <input
                  id="custom"
                  placeholder="Enter"
                  className="border-2 rounded px-3 py-2"
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
                    placeholder="AB123"
                    className="border-2 rounded px-3 py-2"
                  ></input>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="airport" className="mb-1 text-sm">
                    Airport
                  </label>
                  <input
                    id="airport"
                    className="border-2 rounded px-3 py-2"
                  ></input>
                </div>
              </div>
            )}

            <div className="flex flex-col">
              <label htmlFor="dropLoc" className="mb-1 text-sm">
                Drop-off location
              </label>
              <input
                type="dropLoc"
                id="dropLoc"
                placeholder="Enter"
                className="border-2 rounded px-3 py-2"
              ></input>
            </div>
            <div className="flex flex-col text-sm">
              <label htmlFor="pickupDate" className="mb-1">
                Pick-up date and time
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                <input
                  id="pickupDate"
                  type="date"
                  className="border-2 rounded px-2 sm:px-3 py-2 flex-1 min-w-0"
                ></input>
                <input
                  id="pickupTime"
                  type="time"
                  className="border-2 rounded px-2 sm:px-3 py-2 flex-1 min-w-0"
                ></input>
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className="mb-1 text-sm">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="border-2 rounded px-3 py-2"
              ></input>
            </div>
            <div className="flex flex-col">
              <label htmlFor="surname" className="mb-1 text-sm">
                Surname
              </label>
              <input
                id="surname"
                type="text"
                className="border-2 rounded px-3 py-2"
              ></input>
            </div>
            <div className="flex flex-col">
              <label htmlFor="number" className="mb-1 text-sm">
                Phone number
              </label>
              <div className="flex gap-2">
                <select className="border-2 rounded px-2 py-2">
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
                  className="border-2 rounded flex-1 px-2 sm:px-3 py-2 min-w-0"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="mail" className="mb-1 text-sm">
                Email
              </label>
              <input
                id="mail"
                type="email"
                className="border-2 rounded px-3 py-2"
              ></input>
            </div>
            <div className="flex flex-col">
              <label htmlFor="department" className="mb-1 text-sm">
                Department
              </label>
              <input
                id="department"
                type="text"
                className="border-2 rounded px-3 py-2"
              ></input>
            </div>
            <div className="flex flex-col">
              <label htmlFor="addInfo" className="mb-1 text-sm">
                Additional information
              </label>
              <textarea
                id="addInfo"
                className="border-2 rounded px-3 py-2 min-h-[80px]"
                maxLength={500}
                placeholder="Enter any additional information..."
              ></textarea>
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
                Confirm Booking
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;
