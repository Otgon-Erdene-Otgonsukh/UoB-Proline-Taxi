"use client";

import { useState } from "react";

export function BookingPage() {
  const [isManualChecked, setIsManualChecked] = useState(false);
  const [isFlightChecked, setIsFlightChecked] = useState(false);

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
            {isManualChecked || isFlightChecked ? (
              <div className="flex flex-col text-gray-400">
                <label htmlFor="commonLoc" className="mb-1 text-sm">
                  Common pick-up locations
                </label>
                <select
                  id="commonLoc"
                  className="border-2 rounded px-2 py-2"
                  defaultValue="None"
                  disabled={isManualChecked}
                >
                  <option>Queen's Building</option>
                  <option>Will's Memorial</option>
                  <option>Merchant Venturers Building</option>
                  <option>Victoria Rooms</option>
                  <option>Richmond Building</option>
                </select>
              </div>
            ) : (
              <div className="flex flex-col">
                <label htmlFor="commonLoc" className="mb-1 text-sm">
                  Common pick-up locations
                </label>
                <select
                  id="commonLoc"
                  className="border-2 rounded px-2 py-2"
                  defaultValue="None"
                  disabled={isManualChecked}
                >
                  <option>Queen's Building</option>
                  <option>Will's Memorial</option>
                  <option>Merchant Venturers Building</option>
                  <option>Victoria Rooms</option>
                  <option>Richmond Building</option>
                </select>
              </div>
            )}
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
              <button
                type="submit"
                className="cursor-pointer bg-[#2c2c2c] text-white font-light text-sm rounded-md py-3 px-12 hover:bg-[#414040] w-full hover:scale-101 transition-colors"
              >
                CONFIRM BOOKING
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;
