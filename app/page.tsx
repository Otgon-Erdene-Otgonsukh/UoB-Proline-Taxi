"use client"; //client side rendering is used because we need web based interactivity

import { useState } from "react";

function page() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    pickupLocation: "",
    dropoffLocation: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //gathering data and putting them in the formData object
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <div className="flex min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-transparent backdrop-blur-3xl rounded-lg shadow-md p-6 border-1 border-yellow-300">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Booking Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-large text-white mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm bg-white text-gray-700 placeholder-white caret-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-white mb-1"
              >
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm bg-white text-gray-700 placeholder-white caret-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="First name"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-white mb-1"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm bg-white text-gray-700 placeholder-white caret-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="pickupLocation"
              className="block text-sm font-medium text-white mb-1"
            >
              Pickup Location *
            </label>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm bg-white text-gray-700 placeholder-white caret-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter pickup address"
            />
          </div>

          <div>
            <label
              htmlFor="dropoffLocation"
              className="block text-sm font-medium text-white mb-1"
            >
              Drop-off Location *
            </label>
            <input
              type="text"
              id="dropoffLocation"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-sm bg-white text-gray-700 placeholder-white caret-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter drop-off address"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-white mb-1"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-white rounded-md shadow-sm bg-white text-gray-700 placeholder-white caret-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-300  text-gray-700 py-2 px-4 rounded-md hover:bg-yellow-500 hover:scale-103 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-extrabold"
          >
            Book Taxi
          </button>
        </form>
      </div>
    </div>
  );
}

export default page;
