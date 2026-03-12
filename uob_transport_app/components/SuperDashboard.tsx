"use client";

import { Person, DriveEta, PendingActions, Sell } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { SuperData } from "@/model/models";
import { easyGetRequest } from "@/utils/easyRequest";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

export default function SuperDashboard() {
  const [dashboardData, setDashboardData] = useState<SuperData>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    easyGetRequest("super-data", {})
      .then((res) => res.json())
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      });
  }, []);
  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ y: 10, opacity: 0, scale: 0.94 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        id="cards"
        className="grid grid-cols-2 md:grid-cols-4 md:mt-10 mt-5 mx-4 sm:mx-6 lg:mx-8 gap-4 md:gap-10 text-shadow-md/10"
      >
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4 border-r-4 border-blue-500 hover:shadow-lg transition-shadow ease-in-out duration-200">
          <div className="bg-blue-100 rounded-full p-3 sm:p-4">
            <Person
              className="text-blue-600"
              sx={{ fontSize: { xs: 32, sm: 40 } }}
            />
          </div>
          {loading ? (
            <CircularProgress color="inherit" sx={{ ml: 5 }} />
          ) : (
            <div className="text-right grow">
              <p className="text-gray-500 text-[10px] sm:text-sm font-medium uppercase tracking-wide">
                Active Users
              </p>
              <p className="text-2xl sm:text-4xl font-bold text-blue-600 mt-1">
                {dashboardData?.cardData.totalUser}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4 border-r-4 border-green-500 hover:shadow-lg transition-shadow ease-in-out duration-200">
          <div className="bg-green-100 rounded-full p-3 sm:p-4">
            <DriveEta
              className="text-green-600"
              sx={{ fontSize: { xs: 32, sm: 40 } }}
            />
          </div>
          {loading ? (
            <CircularProgress color="inherit" sx={{ ml: 5 }} />
          ) : (
            <div className="text-right grow">
              <p className="text-gray-500 text-[9.5px] sm:text-sm font-medium uppercase tracking-wide">
                Total Bookings
              </p>
              <p className="text-2xl sm:text-4xl font-bold text-green-600 mt-1">
                {dashboardData?.cardData.totalBooking}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4 border-r-4 border-orange-500 hover:shadow-lg transition-shadow ease-in-out duration-200">
          <div className="bg-orange-100 rounded-full p-3 sm:p-4">
            <PendingActions
              className="text-orange-600"
              sx={{ fontSize: { xs: 32, sm: 40 } }}
            />
          </div>
          {loading ? (
            <CircularProgress color="inherit" sx={{ ml: 5 }} />
          ) : (
            <div className="text-right grow">
              <p className="text-gray-500 text-[10px] sm:text-sm font-medium uppercase tracking-wide">
                Pending Users
              </p>
              <p className="text-2xl sm:text-4xl font-bold text-orange-600 mt-1">
                {dashboardData?.cardData.pendingUser}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center gap-4 border-r-4 border-purple-500 hover:shadow-lg transition-shadow ease-in-out duration-200">
          <div className="bg-purple-100 rounded-full p-3 sm:p-4">
            <Sell
              className="text-purple-600"
              sx={{ fontSize: { xs: 32, sm: 40 } }}
            />
          </div>
          {loading ? (
            <CircularProgress color="inherit" sx={{ ml: 5 }} />
          ) : (
            <div className="text-right grow">
              <p className="text-gray-500 text-[10px] sm:text-sm font-medium uppercase tracking-wide">
                Price Required
              </p>
              <p className="text-2xl sm:text-4xl font-bold text-purple-600 mt-1">
                {dashboardData?.cardData.priceRequired}
              </p>
            </div>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 10, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        id="graphs"
        className="grid md:grid-cols-2 grid-cols-1 md:mt-10 mt-5 mx-4 sm:mx-6 lg:mx-8 gap-4 md:gap-10 mb-10"
      >
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-start mb-8">
            <div className="text-shadow-md/10">
              <h2 className="md:text-2xl text-md font-bold text-gray-800 mb-2">
                Monthly Booking Activity
              </h2>
              <p className="md:text-sm text-[10px] text-gray-600">
                Booking activity over the past 4 months and 2 months ahead
              </p>
            </div>
            <div className="flex items-center gap-1 md:gap-2 bg-blue-50 md:text-center text-end px-2 py-1 md:px-3 md:py-2 rounded-md">
              <div className="w-4 md:w-8 h-0.5 bg-purple-800"></div>
              <span className="text-[9px] md:text-sm font-medium text-gray-700">
                Bookings
              </span>
            </div>
          </div>

          <div className="flex justify-start">
            <LineChart
              style={{
                width: "100%",
                maxWidth: "700px",
                maxHeight: "70vh",
                aspectRatio: 1.618,
                marginLeft: -30,
              }}
              responsive
              data={dashboardData?.lineGraph}
            >
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis
                dataKey="month"
                interval={0}
                height={60}
                style={{ fontSize: "12px" }}
              />
              <YAxis style={{ fontSize: "12px" }} />
              <Tooltip />
              <Line
                activeDot={{ stroke: "red", strokeWidth: 3 }}
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                strokeWidth={2.5}
                name="Bookings"
              />
            </LineChart>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-start mb-8">
            <div className="text-shadow-md/10">
              <h2 className="md:text-2xl text-md font-bold text-gray-800 mb-2">
                Department Spending Activity
              </h2>
              <p className="md:text-sm text-[10px] text-gray-600">
                Total spending and bookings per department
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-1 md:gap-3">
              <div className="flex items-center gap-1 md:gap-2 bg-blue-50 md:text-center text-end px-2 py-1 md:px-3 md:py-2 rounded-md">
                <div className="w-4 md:w-6 h-0.5 bg-purple-800"></div>
                <span className="text-[7px] md:text-sm font-medium text-gray-700">
                  Bookings
                </span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 bg-blue-50 md:text-center text-end px-2 py-1 md:px-3 md:py-2 rounded-md justify-between">
                <div className="w-4 md:w-6 h-[2.3px] bg-green-700"></div>
                <span className="text-[7px] md:text-sm font-medium text-gray-700">
                  Total Price
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <BarChart
              style={{
                width: "100%",
                maxWidth: "700px",
                maxHeight: "70vh",
                aspectRatio: 1.618,
              }}
              responsive
              data={dashboardData?.barGraph}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="department"
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
                tick={{ dy: 13 }}
                style={{ fontSize: "clamp(8px, 2vw, 12px)" }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#8884d8"
                width={32}
                style={{ fontSize: "clamp(8px, 2vw, 14px)" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#22b55e"
                width={35}
                style={{ fontSize: "clamp(8px, 2vw, 14px)" }}
              />
              <Tooltip cursor={{ fill: "rgba(200, 200, 200, 0.4)" }} />
              <Bar
                yAxisId="left"
                dataKey="bookingCount"
                fill="#8884d8"
                name="Bookings"
                maxBarSize={20}
              />
              <Bar
                yAxisId="right"
                dataKey="priceTotal"
                fill="#22b55e"
                name="Total Price (£)"
                maxBarSize={20}
              />
            </BarChart>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
