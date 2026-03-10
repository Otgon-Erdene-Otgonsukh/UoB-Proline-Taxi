"use client";

import { useEffect, useState, useRef } from "react";
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
  CircularProgress,
  Autocomplete,
  TextField,
} from "@mui/material";
import NumberField from "@/components/NumberField";
import { useSession } from "next-auth/react";
import { formLocation, location } from "@/model/models";
import {
  Map,
  MapMarker,
  MarkerContent,
  MapRoute,
  MarkerLabel,
  MapRef,
} from "@/components/ui/map";
import { Clock, Route } from "lucide-react";
import { LngLatLike } from "maplibre-gl";
import { getDepartments } from "@/app/requests/departments";
import { department } from "@/generated/prisma/client";

export default function BookingPage() {
  // Attach common locations as keys to hashmapped Lat/Lon for routing.
  type commonLoc = { [key: string]: { lat: string; lng: string; address: string } };
  const commonLocations: commonLoc = {
    "Queens Building": { "lat": "51.456890", "lng": "-2.601892", address: "Faculty of Engineering, University Walk, Tyndall's Park, Cotham, Bristol, City of Bristol, West of England, England, BS8 1TR, United Kingdom" },
    "Merchant Venturers Building": { "lat": "51.456111", "lng": "-2.602830", address: "Merchant Venturers Building, 75, Woodland Road, Tyndall's Park, Cotham, Bristol, City of Bristol, West of England, England, BS8 1UB, United Kingdom" },
    "Richmond Building": { "lat": "51.456996", "lng": "-2.613267", address: "Bristol University Student Union, Queen's Road, Clifton Village, Clifton, Bristol, City of Bristol, West of England, England, BS8 1LN, United Kingdom" },
    "Victoria Rooms": { "lat": "51.458173", "lng": "-2.609358", address: "Victoria Rooms, Whiteladies Road, Tyndall's Park, Clifton, Bristol, City of Bristol, West of England, England, BS8 2PY, United Kingdom" },
    "Wills Memorial Building": { "lat": "51.455927", "lng": "-2.604696", address: "Wills Memorial Building, Queen's Road, Tyndall's Park, City Centre, Bristol, City of Bristol, West of England, England, BS8 1RJ, United Kingdom" },
    "Physics Building": { "lat": "51.458986", "lng": "-2.602204", address: "H.H. Wills Physics Laboratory, Tyndall Avenue, Tyndall's Park, Cotham, Bristol, City of Bristol, West of England, England, BS8 1TL, United Kingdom" },
  };

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
  const [departmentEmpty, setDepartmentEmpty] = useState(false);

  // Set error messages visible next to fields, default "" (empty) for hide.
  const [formFeedback, setFormFeedback] = useState({
    CommonLoc: "",
    CustomLoc: "",
    FlightNum: "",
    Airport: "",
    DropoffLoc: "",
    PickupDate: "",
    PickupTime: "",
    passengerName: "",
    Number: "",
    Email: "",
    Via1: "",
    Via2: "",
    Via3: "",
    AdditionalInfo: "",
    ReturnTime: "",
    ReturnDate: "",
    ReturnTo: "",
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

  type FormData = {
    CommonLoc: string;
    CustomLoc: string;
    PickupLoc: formLocation
    Via: formLocation[];
    ReturnTo: formLocation;
    FlightNum: string;
    Airport: string;
    DropoffLoc: formLocation;
    PickupDate: string;
    PickupTime: string;
    ReturnDate: string;
    ReturnTime: string;
    PassengerName: string;
    Number: string;
    Email: string;
    dep_id: number;
    Passengers: number;
    AdditionalInfo: string;
  };

  // Variables for storing the state of the values entered into the fields.
  const [formData, setFormData] = useState<FormData>({
    CommonLoc: "",
    CustomLoc: "",
    Via: [],
    ReturnTo: null,
    FlightNum: "",
    Airport: "",
    DropoffLoc: null,
    PickupLoc: null,
    PickupDate: "",
    PickupTime: "",
    ReturnDate: "",
    ReturnTime: "",
    PassengerName: "",
    Number: "",
    Email: "",
    dep_id: 0,
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

    let loc = null;

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

      loc = formData.PickupLoc
    } else if (!isFlightChecked && !isManualChecked) {
      // Common Pickup Location / Dropdown
      if (formData.CommonLoc == "") {
        addFormFeedback("CommonLoc", "Please pick one.");
        fail = true;
      }
      loc = { short_name: formData.CommonLoc, address: commonLocations[formData.CommonLoc].address,
        lat: parseFloat(commonLocations[formData.CommonLoc].lat),
        lng: parseFloat(commonLocations[formData.CommonLoc].lng)};
    } else loc = formData.Airport;

    // Department check
    if (formData.dep_id === 0) {
      setDepartmentEmpty(true);
      fail = true;
    }

    // Drop-Off Location
    // Not too long, not too short.
    if (formData.DropoffLoc == null) {
      addFormFeedback("DropoffLoc", "Please enter a drop-off location.");
      fail = true;
    } else if (formData.DropoffLoc.address.length < 5) {
      addFormFeedback("DropoffLoc", "Drop-off location not detailed enough.");
      fail = true;
    } else if (formData.DropoffLoc.address.length > 200) {
      addFormFeedback("DropoffLoc", "Drop-off location too long.");
      fail = true;
    } else if (!routes || routes.length == 0) {
      addFormFeedback("DropoffLoc", "Unable to find route. Please check the address or try a different location.");
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
          "Please enter your flight number (formatted AB1234).",
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
    const returnDateTime = new Date(formData.ReturnDate);
    const [h, m] = formData.ReturnTime.split(":").map(Number);
    returnDateTime.setHours(h, m, 0, 0);

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

    if (isReturnChecked) {
      if (formData.ReturnDate == "") {
        addFormFeedback("ReturnDate", "Please select a return Date.");
        fail = true;
      } else if (formData.ReturnTime == "") {
        addFormFeedback("ReturnTime", "Please select a return Time.");
        fail = true;
      }
      const targetDateTime = new Date(formData.PickupDate);
      const [h, m] = formData.PickupTime.split(":").map(Number);
      targetDateTime.setHours(h, m, 0, 0);
      if (pickupDateTime >= targetDateTime) {
        addFormFeedback("ReturnDate", "Return Booking must be after pick-up.");
        addFormFeedback("ReturnTime", ""); // Make both boxes go red, hacky workaround.
        fail = true;
      }
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

    // Passenger name, between 1 and 100 chars.
    if (formData.PassengerName == "") {
      addFormFeedback("PassengerName", "Please enter the passenger's name.");
      fail = true;
    } else if (formData.PassengerName.length > 100) {
      addFormFeedback(
        "Passenger",
        "Passenger Name too long. Please use an abbreviation.",
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
        ...(isReturnChecked
          ? { return_time: returnDateTime, returnTo: formData.ReturnTo }
          : {}),
        passenger_name: formData.PassengerName,
        email: formData.Email,
        tel_number: phoneCode + " " + formData.Number,
        additional_info: formData.AdditionalInfo,
        via: formData.Via,
        passengers: formData.Passengers,
        dep_id: formData.dep_id,
        airport: formData.Airport,
        flight_num: formData.FlightNum,
      };

      fetch("/api/create_booking", {
        method: "POST",
        body: JSON.stringify(jsonBody),
      })
        .then((response) => {
          if (response.status == 200) {
            router.push("/book/confirmed");
          } else {
            // Use additional info box to mark error. Will replace with specific errors in the future.
            addFormFeedback(
              "AdditionalInfo",
              "Form failed to submit. Please try again or check inputs.",
            );
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoadingBar(false);
          addFormFeedback(
            "AdditionalInfo",
            "Form failed to submit. Please try again later or check your network connection.",
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

  interface RouteData {
    coordinates: [number, number][];
    duration: number; // seconds
    distance: number; // meters
  }

  function formatDuration(seconds: number): string {
    const mins = Math.round(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  }

  function formatDistance(meters: number): string {
    // We use yards and miles in the UK, so convert metres to miles and yards.
    if (meters / 0.9144 < 1760) return `${Math.round(meters / 0.9144)} yd`;
    return `${(meters / 1609.344).toFixed(1)} mi`;
  }

  // Use Nominatim to return latitude and longitude from address.
  async function getLatLon(address: string): Promise<{ lat: string; lon: string; name: string; full_address: string } | null> {
    // Specify English for results regardless of browser.
    const headers = new Headers();
    headers.append("Accept-Language", "en-GB");
    const result = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`, { headers });
    if (result.ok) {
      const data = await result.json();
      if (data && data.length > 0) {
        const display_name = data[0].display_name
        // Check if last item in the array made by splititng with , is United Kingdom to ensure location is not abroad.
        if (display_name.split(",")[display_name.split(",").length - 1].trim() === "United Kingdom") {
          return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, full_address: display_name };
        } else {
          if (!address.includes("United Kingdom")) {
            return getLatLon(address + ", United Kingdom"); // Try appending "United Kingdom" to the search query if initial search isn't a place in the UK.
          }
        }
      }
    };
    return null;
  }

  const [start, setStart] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [end, setEnd] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [vias, setVias] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [returnloc, setReturnLoc] = useState<{ name: string; lat: number; lng: number } | null>(null);

  // Update the route when start or end changes.
  useEffect(() => {
    if (end != null && start != null) {
      updateRoute();
    }
  }, [start, end, vias, returnloc]);


  const [departmentList, setDepartmentList] = useState<department[]>([]);

  useEffect(() => {
    getDepartments().then(res => {
      if (res.status === 200) {
        res.json().then(data => {
          setDepartmentList(data);
        })
      }
    })
  }, [])

  const [routes, setRoutes] = useState<RouteData[]>([]);
  const mapRef = useRef<MapRef>(null);

  type Loc = { name: string; lat: number; lng: number }

  // Only call updateRoute when both start and end are set.
  async function updateRoute() {
    if (start != null && end != null) {
      // Create a route array.
      const route = [];
      route.push({ name: start.name, lat: start.lat, lng: start.lng });
      for (let i = 0; i < vias.length; i++) {
        route.push({ name: vias[i].name, lat: vias[i].lat, lng: vias[i].lng });
      }
      route.push({ name: end.name, lat: end.lat, lng: end.lng });
      fetchRoutes(route);

      if (returnloc != null) {
        fetchRoutes([end, returnloc], true);
      }

      function getRouteProperties(route: Loc[]) {
        return {
          name: route[0].name,
          lat: route[0].lat,
          lng: route[0].lng
        };
      }

      for (let i = 0; i < vias.length; i++) {
        getRouteProperties([vias[i]]);
      }

      // Find each corner of the square bounding box from the two start/end points and vias on the map.
      const swLng = Math.min(start.lng, end.lng, ...vias.map(via => via.lng), ...returnloc?.lng ? [returnloc.lng] : []);
      const swLat = Math.min(start.lat, end.lat, ...vias.map(via => via.lat), ...returnloc?.lat ? [returnloc.lat] : []);
      const neLng = Math.max(start.lng, end.lng, ...vias.map(via => via.lng), ...returnloc?.lng ? [returnloc.lng] : []);
      const neLat = Math.max(start.lat, end.lat, ...vias.map(via => via.lat), ...returnloc?.lat ? [returnloc.lat] : []);

      // Check bounds are LngLatLike type for fitBounds function.
      const bounds: [LngLatLike, LngLatLike] = [[swLng, swLat], [neLng, neLat]];
      mapRef.current?.fitBounds(bounds, { padding: 100 });
    }
  }

  async function fetchRoutes(locations: Loc[], returnJourney = false) {
    const osrmRoutes = [];
    try {
      const response = await fetch(
        "/api/route",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ points: locations })
        }
      );
      const data = await response.json();
      if (data.routes?.length > 0) {
        osrmRoutes.push({
          coordinates: data.routes[0].geometry.coordinates,
          duration: data.routes[0].duration,
          distance: data.routes[0].distance
        }
        );
      }
      if (returnJourney) {
        setRoutes([routes[0], ...osrmRoutes]);
      } else {
        setRoutes(osrmRoutes);
      }
    } catch (error) {
      console.error("Failed to fetch routes:", error);
    }
  }

  return (
    <div className="flex min-h-screen justify-center items-center font-inter p-4">
      <div className="border-3 border-[#2c2c2c] flex flex-col lg:flex-row bg-white shadow-lg rounded-lg my-8 max-w-10xl overflow-hidden">
        {/* Booking Form Section */}
        <div className="p-4 sm:p-6 md:p-8 w-full lg:w-1/2">
          <div className="bg-[#2c2c2c] text-white py-6 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 -mt-4 sm:-mt-6 md:-mt-8 mb-6">
            <h1 className="font-aleo text-2xl sm:text-3xl font-semibold text-center">
              BOOKING DETAILS
            </h1>
          </div>

          <form action="/" onSubmit={handleSubmit} method="POST">
            {/*should go to some confirmed page or alike, currently goes to homepage*/}
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-bold">Trip details:</h3>
              </div>
              <div
                className={`flex flex-col ${isManualChecked || isFlightChecked ? "text-gray-400" : ""
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

                        // Update route
                        // Ensure that e.target value is a key of commonLocations
                        type LocKey = keyof typeof commonLocations;
                        const value = e.target.value as LocKey;
                        if (e.target.value) {
                          // Convert lat and long strings to numbers for mapcn
                          setStart({ name: e.target.value, lat: parseFloat(commonLocations[value].lat), lng: parseFloat(commonLocations[value].lng) });
                        }
                      }}
                      error={formFeedback.CommonLoc != ""}
                    >
                      <MenuItem value="">
                        <em>Select a location</em>
                      </MenuItem>
                      {/*used an array to store the common locations and used map to populate the menu items*/}
                      {Object.keys(commonLocations).map((loc) => (
                        <MenuItem key={loc} value={loc}>
                          {loc}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText
                      sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                      className={`${formFeedback.CommonLoc != "" ? "" : "hidden"
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
                {!isFlightChecked && (
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                      }}
                      onChange={(e) => {
                        setIsManualChecked(e.target.checked);
                        setFormData({ ...formData, CustomLoc: "" });
                      }}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-gray-300 peer-checked:bg-[#4a4a4a] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                )}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.blur();
                      }
                    }}
                    onChange={(e) => {
                      setIsFlightChecked(e.target.checked);
                      setIsManualChecked(false);
                      setFormData({ ...formData, FlightNum: "", Airport: "" });
                    }}
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
                    onChange={(e) => {
                      setIsViaChecked(e.target.checked);
                      setFormData({ ...formData, Via: [] });
                      setVias([]);
                    }}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-gray-300 peer-checked:bg-[#4a4a4a] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
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
                    className={`border-2 rounded px-3 py-2 ${formFeedback.CustomLoc == "" ? "border-gray-800" : "border-red-700"
                      }`}
                    onChange={(e) => {
                      setFormData({ ...formData, CustomLoc: e.target.value });
                      if (e.target.value !== "") {
                        addFormFeedback("CustomLoc", "");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.blur();
                      }
                    }}
                    onBlur={async (e) => {
                      if (e.target.value == "") {
                        return; // Do not try to update route if field is empty
                      }
                      const latlon = await getLatLon(e.target.value)
                      if (latlon != null) {
                        setStart({ name: latlon.name, lat: parseFloat(latlon.lat), lng: parseFloat(latlon.lon) });
                        addFormFeedback("CustomLoc", ""); // Reset any validation errors
                        e.target.value = latlon.full_address;
                      } else {
                        // Reset start and routes if no result is found.
                        addFormFeedback("CustomLoc", "No results found for this search term.");
                        setStart(null);
                        setRoutes([]);
                      }
                    }}
                  />
                  <FormHelperText
                    sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                    className={`${formFeedback.CustomLoc != "" ? "" : "hidden"
                      }`}
                  >
                    {formFeedback.CustomLoc}
                  </FormHelperText>
                </div>
              )}

              {/* Via Box 1 */}

              {isViaChecked && (
                <div className="flex flex-col">
                  <label htmlFor="via" className="mb-1 text-sm">
                    Via
                  </label>
                  <input
                    id="via"
                    placeholder="Via..."
                    className={`border-2 rounded px-3 py-2 ${formFeedback.Via1 == "" ? "border-gray-800" : "border-red-700"}`}
                    // Prevent Enter from submitting the booking form.
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.blur();
                        // Go to next via box on Enter.
                        setTimeout(() => {
                          document.getElementById("via2")?.focus();
                        }, 10);
                      }
                    }}
                    onBlur={async (e) => {
                      if (e.target.value == "") {
                        setVias([]);
                        return; // Do not try to update route if field is empty
                      }
                      const latlon = await getLatLon(e.target.value)
                      if (latlon != null) {
                        setVias([{ name: latlon.name, lat: parseFloat(latlon.lat), lng: parseFloat(latlon.lon) }, ...vias.slice(1)]);
                        setFormData({
                          ...formData,
                          Via: [{ 
                            short_name: latlon.name,
                            address: latlon.full_address, 
                            lat: parseFloat(latlon.lat), 
                            lng: parseFloat(latlon.lon) 
                          },
                            ...formData.Via.slice(1)] 
                          });
                        addFormFeedback("Via1", ""); // Reset any validation errors
                        e.target.value = latlon.full_address;
                      } else {
                        // Reset start and routes if no result is found.
                        addFormFeedback("Via1", "No results found for this search term.");
                        // Remove this via (and the next ones) if it is removed or changed to an invalid location.
                        setFormData({
                          ...formData,
                          Via: [...formData.Via.slice(1)] 
                        });
                        setVias([]);
                      }
                    }}
                  ></input>
                  <FormHelperText
                    sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                    className={`${formFeedback.Via1 != "" ? "" : "hidden"
                      }`}
                  >
                    {formFeedback.Via1}
                  </FormHelperText>
                </div>
              )}

              {/* Via Box 2 if Via Box 1 is populated, cleared when modified */}

              {isViaChecked &&
                formData.Via.length > 0 && formData.Via[0] != null && (
                  <div className="flex flex-col">
                    <input
                      id="via2"
                      placeholder="Via..."
                      className={`border-2 rounded px-3 py-2 ${formFeedback.Via2 == "" ? "border-gray-800" : "border-red-700"}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.currentTarget.blur();
                          // Go to next via box on Enter.
                          setTimeout(() => {
                            document.getElementById("via3")?.focus();
                          }, 10);
                        }
                      }}
                      onBlur={async (e) => {
                        if (e.target.value == "") {
                          setVias([...vias.slice(0, 1), ...vias.slice(2)]); // Remove via if field is cleared.
                          return; // Do not try to update route if field is empty
                        }
                        const latlon = await getLatLon(e.target.value)
                        if (latlon != null) {
                          setVias([...vias.slice(0, 1), { name: latlon.name, lat: parseFloat(latlon.lat), lng: parseFloat(latlon.lon) }, ...vias.slice(2)]);
                          setFormData({
                            ...formData,
                            Via: [
                              ...formData.Via.slice(0, 1),
                              { 
                                short_name: latlon.name,
                                address: latlon.full_address, 
                                lat: parseFloat(latlon.lat), 
                                lng: parseFloat(latlon.lon) 
                              },
                              ...formData.Via.slice(2)] 
                          });
                          addFormFeedback("Via2", ""); // Reset any validation errors
                          e.target.value = latlon.full_address;
                        } else {
                          // Reset start and routes if no result is found.
                          addFormFeedback("Via2", "No results found for this search term.");
                          // Remove this via (and the next ones) if it is removed or changed to an invalid location.
                          setFormData({
                            ...formData,
                            Via: [...formData.Via.slice(0, 1)] 
                          });
                          // Remove it from the map too.
                          setVias(vias.slice(0, 1));
                        }
                      }}
                    ></input>
                    <FormHelperText
                      sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                      className={`${formFeedback.Via2 != "" ? "" : "hidden"
                        }`}
                    >
                      {formFeedback.Via2}
                    </FormHelperText>
                  </div>
                )}

              {/* Via Box 3 if Via Box 1&2 are populated, cleared when modified */}

              {isViaChecked &&
                formData.Via.length > 1 && formData.Via[0] != null && formData.Via[1] != null && (
                  <div className="flex flex-col">
                    <input
                      id="via3"
                      placeholder="Via..."
                      className={`border-2 rounded px-3 py-2 ${formFeedback.Via3 == "" ? "border-gray-800" : "border-red-700"}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                      }}
                      onBlur={async (e) => {
                        if (e.target.value == "") {
                          setVias([...vias.slice(0, 2), ...vias.slice(3)]); // Remove via if field is cleared.
                          return; // Do not try to update route if field is empty
                        }
                        const latlon = await getLatLon(e.target.value)
                        if (latlon != null) {
                          setVias([...vias.slice(0, 2), { name: latlon.name, lat: parseFloat(latlon.lat), lng: parseFloat(latlon.lon) }]);
                          setFormData({
                            ...formData,
                            Via: [...formData.Via.slice(0, 2),
                              { 
                                short_name: latlon.name,
                                address: latlon.full_address, 
                                lat: parseFloat(latlon.lat), 
                                lng: parseFloat(latlon.lon) 
                              },
                            ] 
                          });
                          addFormFeedback("Via3", ""); // Reset any validation errors
                          e.target.value = latlon.full_address;
                        } else {
                          // Reset start and routes if no result is found.
                          addFormFeedback("Via3", "No results found for this search term.");
                          // Remove this via if it is removed or changed to an invalid location.
                          setFormData({
                            ...formData,
                            Via: [...formData.Via.slice(0, 2)] 
                          });
                          // Remove the vias from the map.
                          setVias(vias.slice(0, 2));
                        }
                      }}
                    ></input>
                    <FormHelperText
                      sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                      className={`${formFeedback.Via3 != "" ? "" : "hidden"
                        }`}
                    >
                      {formFeedback.Via3}
                    </FormHelperText>
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
                      className={`border-2 rounded px-3 py-2 ${formFeedback.FlightNum == "" ? "border-gray-800" : "border-red-700"
                        }`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                      }}
                      onChange={(e) => {
                        setFormData({ ...formData, FlightNum: e.target.value });
                        if (e.target.value !== "") {
                          addFormFeedback("FlightNum", "");
                        }
                      }}
                    />
                    <FormHelperText
                      sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                      className={`${formFeedback.FlightNum != "" ? "" : "hidden"
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
                      className={`border-2 rounded px-3 py-2 ${formFeedback.Airport == "" ? "border-gray-800" : "border-red-700"
                        }`}
                      onChange={(e) => {
                        setFormData({ ...formData, Airport: e.target.value });
                        if (e.target.value !== "") {
                          addFormFeedback("Airport", "");
                        }
                      }}
                    />
                    <FormHelperText
                      sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                      className={`${formFeedback.Airport != "" ? "" : "hidden"
                        }`}
                    >
                      {formFeedback.Airport}
                    </FormHelperText>
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
                  placeholder="Temple Quarter Enterprise Campus, Bristol"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      addFormFeedback("DropoffLoc", "");
                    }
                  }}
                  onBlur={async (e) => {
                    if (e.target.value == "") {
                      return; // Do not try to update route if field is empty
                    }
                    const latlon = await getLatLon(e.target.value)
                    if (latlon != null) {
                      setEnd({ name: latlon.name, lat: parseFloat(latlon.lat), lng: parseFloat(latlon.lon) });
                      addFormFeedback("DropoffLoc", ""); // Reset any validation errors
                      setFormData({ ...formData, DropoffLoc: { short_name: latlon.name, address: latlon.full_address, lat: parseFloat(latlon.lat), lng: parseFloat(latlon.lon) } });
                      e.target.value = latlon.full_address;
                    } else {
                      // Reset destination and show error if there are no results.
                      addFormFeedback("DropoffLoc", "No results found for this search term.");
                      setFormData({ ...formData, DropoffLoc: null });
                      setEnd(null);
                      setRoutes([]);
                    }
                  }}
                  className={`border-2 rounded px-3 py-2 ${formFeedback.DropoffLoc == "" ? "border-gray-800" : "border-red-700"}`}
                ></input>
                <FormHelperText
                  sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                  className={`${formFeedback.DropoffLoc != "" ? "" : "hidden"}`}
                >
                  {formFeedback.DropoffLoc}
                </FormHelperText>
              </div>
              <div className="flex flex-col text-sm">
                <label htmlFor="pickupDate" className="mb-1">
                  Pick-up date and time
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                  <input
                    id="pickupDate"
                    type="date"
                    className={`border-2 rounded px-3 sm:px-3 py-2 flex-1 min-w-0 ${formFeedback.PickupDate == "" ? "border-gray-800" : "border-red-700"
                      }`}
                    onChange={(e) => {
                      setFormData({ ...formData, PickupDate: e.target.value });
                      if (e.target.value !== "") {
                        addFormFeedback("PickupDate", "");
                      }
                    }}
                  />
                  <input
                    id="pickupTime"
                    type="time"
                    className={`border-2 rounded px-3 sm:px-3 py-2 flex-1 min-w-0 ${formFeedback.PickupTime == "" ? "border-gray-800" : "border-red-700"
                      }`}
                    onChange={(e) => {
                      setFormData({ ...formData, PickupTime: e.target.value });
                      if (e.target.value !== "") {
                        addFormFeedback("PickupTime", "");
                      }
                    }}
                  />
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
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{
                        color: "#2c2c2c",
                        "&.Mui-checked": { color: "#2c2c2c" },
                      }}
                      checked={isReturnChecked}
                      onChange={(e) => {
                        setIsReturnChecked(e.target.checked);
                        setFormData({ ...formData, ReturnTo: null });
                        if (e.target.checked == false) {
                          setReturnLoc(null);
                          if (routes.length > 1) {
                            setRoutes(routes.slice(0, routes.length - 1)); // Remove return route from map if return trip is unchecked.
                          }
                        }
                      }}
                    />
                  }
                  label="Return trip"
                />
              </div>
              {isReturnChecked && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="returnPickUp" className="mb-1 text-sm">
                      Return Trip Pick-up location
                    </label>
                    <input
                      id="returnPickUp"
                      className="border-2 rounded px-3 py-2 border-gray-800"
                      value={formData.DropoffLoc?.address || ""}
                      disabled
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="returnDropOff" className="mb-1 text-sm">
                      Return Trip Drop-off location
                    </label>
                    <input
                      id="returnDropOff"
                      placeholder="Enter"
                      className={`border-2 rounded px-3 sm:px-3 py-2 flex-1 min-w-0 ${formFeedback.ReturnTo == "" ? "border-gray-800" : "border-red-700"}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                      }}
                      onChange={(e) => {
                        if (e.target.value !== "") {
                          addFormFeedback("ReturnTo", "");
                        }
                      }}
                      onBlur={async (e) => {
                        if (e.target.value == "") {
                          return;
                        }
                        const latlon = await getLatLon(e.target.value)
                        if (latlon != null) {
                          setReturnLoc({ name: latlon.name, lat: parseFloat(latlon.lat), lng: parseFloat(latlon.lon) });
                          setFormData({ ...formData, ReturnTo: { short_name: latlon.name, address: latlon.full_address, lat: parseFloat(latlon.lat), lng: parseFloat(latlon.lon) } });
                          addFormFeedback("ReturnTo", ""); // Reset any validation errors
                          e.target.value = latlon.full_address; 
                        } else { // No results
                          addFormFeedback("ReturnTo", "No results found for this search term.");
                          setFormData({ ...formData, ReturnTo: null });
                          setReturnLoc(null);
                          setRoutes(routes.slice(0, routes.length - 1)); // Remove return route from map
                        }
                      }}
                    />
                    <FormHelperText
                      sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                      className={`${formFeedback.ReturnTo != "" ? "" : "hidden"}`}
                    >
                      {formFeedback.ReturnTo}
                    </FormHelperText>
                  </div>
                  <div className="flex flex-col text-sm">
                    <label htmlFor="returnDate" className="mb-1">
                      Return trip pick-up date and time
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
                      <input
                        id="returnDate"
                        type="date"
                        className={`border-2 rounded px-3 sm:px-3 py-2 flex-1 min-w-0 ${formFeedback.ReturnDate == "" ? "border-gray-800" : "border-red-700"
                          }`}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            ReturnDate: e.target.value,
                          });
                          addFormFeedback("ReturnDate", "");
                        }}
                      />
                      <input
                        id="returnTime"
                        type="time"
                        className={`border-2 rounded px-3 sm:px-3 py-2 flex-1 min-w-0 ${formFeedback.ReturnTime == "" ? "border-gray-800" : "border-red-700"
                          }`}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            ReturnTime: e.target.value,
                          });
                          addFormFeedback("ReturnTime", "");
                        }}
                      />
                    </div>
                    <FormHelperText
                      sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                      className={`${formFeedback.ReturnDate != "" ? "" : "hidden"}`}
                    >
                      {formFeedback.ReturnDate}
                    </FormHelperText>
                    <FormHelperText
                      sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                      className={`${formFeedback.ReturnTime != "" ? "" : "hidden"}`}
                    >
                      {formFeedback.ReturnTime}
                    </FormHelperText>
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-bold">Lead passenger details:</h3>
              </div>
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 text-sm">
                  Passenger Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`border-2 rounded px-3 py-2 ${formFeedback.passengerName == "" ? "border-gray-800" : "border-red-700"
                    }`}
                  onChange={(e) => {
                    setFormData({ ...formData, PassengerName: e.target.value });
                  }}
                />
                <FormHelperText
                  sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                  className={`${formFeedback.passengerName != "" ? "" : "hidden"}`}
                >
                  {formFeedback.passengerName}
                </FormHelperText>
              </div>
              <div className="flex flex-col">
                <label htmlFor="number" className="mb-1 text-sm">
                  Phone number
                </label>
                <div className="flex gap-2">
                  <select
                    className="border-2 rounded px-2 py-2 border-gray-800"
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
                    className={`border-2 rounded flex-1 sm:px-3 py-2 min-w-0 w-full ${formFeedback.Number == "" ? "border-gray-800" : "border-red-700"
                      }`}
                    onChange={(e) => {
                      setFormData({ ...formData, Number: e.target.value });
                      addFormFeedback("Number", "");
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
              <ThemeProvider theme={inputTheme}>
                <Autocomplete
                  sx={{ my: 1 }}
                  disablePortal
                  onChange={(_, dep) => {
                    setFormData({ ...formData, dep_id: dep!.dep_id });
                    setDepartmentEmpty(false);
                  }}
                  options={departmentList}
                  getOptionKey={(department) => department.dep_id}
                  getOptionLabel={(department) => department.dep_name}
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
                      helperText={departmentEmpty && "Select a department."}
                    />
                  )}
                />
              </ThemeProvider>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col flex-1">
                  <label htmlFor="mail" className="mb-1 text-sm">
                    Email
                  </label>
                  <input
                    id="mail"
                    type="email"
                    className={`border-2 rounded px-3 py-2 ${formFeedback.Email == "" ? "border-gray-800" : "border-red-700"
                      }`}
                    onChange={(e) => {
                      setFormData({ ...formData, Email: e.target.value });
                      addFormFeedback("Email", "");
                    }}
                  />
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
                    max={5}
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
                  className={`border-2 rounded px-3 py-2 min-h-20 ${formFeedback.AdditionalInfo == "" ? "border-gray-800" : "border-red-700"
                    }`}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      AdditionalInfo: e.target.value,
                    });
                    addFormFeedback("AdditionalInfo", "");
                  }}
                  maxLength={500}
                  placeholder="Enter any additional information..."
                ></textarea>
                <FormHelperText
                  sx={{ color: "oklch(50.5% 0.213 27.518) !important" }}
                  className={`${formFeedback.AdditionalInfo != "" ? "" : "hidden"
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
                  {loadingBar ? (
                    <CircularProgress color="inherit" size="30px" />
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Map Section */}
        { /* https://mapcn.vercel.app/docs/routes */}
        <div className="container hidden lg:block lg:w-1/2 w-full object-contain min-w-150 border-l-3 border-gray-700 rounded-[0px_5px_5px_0px] overflow-hidden">
          { /* Lat and long are inverted by MAPCN here */}
          <Map ref={mapRef} center={[-2.602, 51.458]} zoom={14}>
            {start && routes && routes.length > 0 && (
              <MapRoute
                coordinates={routes[0].coordinates}
                color={"#6366f1"}
                width={6}
                opacity={1}
              />
            )};

            {returnloc && returnloc.lat && returnloc.lng && (
              <MapMarker longitude={returnloc.lng} latitude={returnloc.lat}>
                <MarkerContent>
                  <div className="size-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
                  <MarkerLabel position="top" className="bg-white p-1 rounded opacity-80">{returnloc.name}</MarkerLabel>
                </MarkerContent>
              </MapMarker>
            )}
            
            {start && start.lat && start.lng && ( // Only render marker when not null
              <MapMarker longitude={start.lng} latitude={start.lat}>
                <MarkerContent>
                  <div className="size-5 rounded-full bg-green-500 border-2 border-white shadow-lg" />
                  <MarkerLabel position="top" className="bg-white p-1 rounded opacity-80">{start.name}</MarkerLabel>
                </MarkerContent>
              </MapMarker>
            )}

            {vias && vias.length > 0 && vias.map((via, index) => (
              via.lat && via.lng && (
                <MapMarker key={index} longitude={via.lng} latitude={via.lat}>
                  <MarkerContent>
                    <div className="size-5 rounded-full bg-yellow-500 border-2 border-white shadow-lg" />
                    <MarkerLabel position="top" className="bg-white p-1 rounded opacity-80">{via.name}</MarkerLabel>
                  </MarkerContent>
                </MapMarker>
              )
            ))}

            {end && end.lat && end.lng && (
              <MapMarker longitude={end.lng} latitude={end.lat}>
                <MarkerContent>
                  <div className="size-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
                  <MarkerLabel position="top" className="bg-white p-1 rounded opacity-80">{end.name}</MarkerLabel>
                </MarkerContent>
              </MapMarker>
            )}

            {returnloc && routes && routes.length > 1 && (
              <MapRoute
                coordinates={routes[1].coordinates}
                color={"#707070"}
                width={6}
                opacity={1}
              />
            )};

            {routes && routes.length > 0 && (
              <div className="absolute top-3 left-3 bg-black text-white opacity-80 rounded-md gap-2 p-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span className="text-md">
                    {formatDuration(routes[0].duration)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs opacity-80">
                  <Route className="size-3" />
                  {formatDistance(routes[0].distance)}
                </div>
                <p className="text-xs opacity-80">
                  Subject to traffic and weather conditions<br/><br/>
                  <b>Key:</b><br/>
                  <span className="text-xs text-green-500">◉</span> Origin<br/>
                  <span className="text-xs text-yellow-500">◉</span> Via<br/>
                  <span className="text-xs text-red-500">◉</span> Destination<br/>
                  <span className="text-xs text-indigo-500">▬</span> Outbound Trip<br/>
                  <span className="text-xs text-gray-700">▬</span> Return Trip
                </p>
              </div>
            )}
          </Map>
        </div>
      </div>
    </div>
  );
}
