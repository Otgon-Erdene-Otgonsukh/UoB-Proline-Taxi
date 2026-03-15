"use client";

import { useEffect, useState, useRef } from "react";
import { Map, MapMarker, MapRoute, MapRef } from "./ui/map";
import { easyGetRequest } from "@/utils/easyRequest";
import { NormalBookings, NormalDashboardData } from "@/model/models";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import CustomizedButton from "./CustomizedButton";
import {
  DirectionsCar,
  CurrencyPound,
  Upcoming,
  NotListedLocation,
  East,
} from "@mui/icons-material";

interface UnparsedBooking {
  booking_status: string;
  trip: {
    pickup_location: string;
    via: string | null;
    dropoff_location: string;
    pickup_time: Date;
  };
}

export default function NormalUserDashboard() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  const [dashboardData, setDashboardData] = useState<NormalDashboardData>();
  const mapRef = useRef<MapRef>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    easyGetRequest("normal-user-dashboard", {}).then(async (res) => {
      if (res.status === 200) {
        const data = await res.json();

        const parsedRecentBookings: NormalBookings[] = data.recentBookings.map(
          (e: UnparsedBooking) => ({
            ...e,
            trip: {
              ...e.trip,
              pickup_location: JSON.parse(e.trip.pickup_location),
              dropoff_location: JSON.parse(e.trip.dropoff_location),
              via: e.trip.via
                ? JSON.parse(e.trip.via).length !== 0
                  ? JSON.parse(e.trip.via)
                  : null
                : null,
            },
          }),
        );

        setDashboardData({
          recentBookings: parsedRecentBookings,
          totalBookings: data.totalBookings,
          totalPrice: data.totalPrice,
          upcomingBookings: data.upcomingBookings,
        });
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white lg:flex lg:flex-row">
      <div
        id="data"
        className="flex w-full flex-col px-6 py-8 lg:w-1/2 lg:px-8"
      >
        <div id="cards" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-linear-to-br from-white to-sky-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 inline-flex rounded-full bg-sky-100 p-2.5">
              <DirectionsCar sx={{ color: "#0369a1" }} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {dashboardData?.totalBookings ?? 0}
            </p>
            <p className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-500">
              Total Bookings
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-white to-emerald-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 inline-flex rounded-full bg-emerald-100 p-2.5">
              <CurrencyPound sx={{ color: "#047857" }} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              £{dashboardData?.totalPrice ?? 0}
            </p>
            <p className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-500">
              Total Price
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-linear-to-br from-white to-amber-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 inline-flex rounded-full bg-amber-100 p-2.5">
              <Upcoming sx={{ color: "#b45309" }} />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {dashboardData?.upcomingBookings ?? 0}
            </p>
            <p className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-500">
              Upcoming Bookings
            </p>
          </div>
        </div>
        <div id="bookings">
          {dashboardData?.recentBookings.length === 0 ? (
            <div className="mt-8 flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-6 py-23 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-white p-3 text-slate-500 shadow-sm">
                <NotListedLocation fontSize="large" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">
                  No bookings to display
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Create your first booking to see trip history here.
                </p>
              </div>
              <div className="pt-1">
                <CustomizedButton
                  title="+ Create Your First Booking"
                  type="warning"
                  click={() => redirect("/book")}
                />
              </div>
            </div>
          ) : (
            <div className="mt-8 flex h-full md:h-100 flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-4 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-600">
                Recent bookings
              </p>
              {dashboardData?.recentBookings.map((e, index) => {
                const isActive = activeIndex === index;
                return (
                  <div
                    key={index}
                    className={`flex h-full flex-wrap items-center gap-2 rounded-xl border px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${isActive ? "border-slate-900 bg-slate-800 shadow-lg" : "border-slate-200 bg-slate-50"}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div
                      className={`h-2.5 w-2.5 rounded-full border-2 shadow-sm ${e.booking_status === "Pending" ? "border-orange-500 bg-amber-200" : "border-green-600 bg-green-300"}`}
                    />
                    <span
                      className={`rounded-md px-2 py-0.5 text-sm font-medium ${isActive ? "bg-slate-700 text-slate-100" : "bg-white text-slate-700"}`}
                    >
                      {e.trip.pickup_location.short_name}
                    </span>
                    <East
                      sx={{
                        fontSize: 18,
                        color: isActive ? "#cbd5e1" : "#64748b",
                      }}
                    />
                    {e.trip.via && e.trip.via.length > 0 ? (
                      <>
                        <span
                          className={`rounded-md px-2 py-0.5 text-sm font-medium ${isActive ? "bg-slate-700 text-slate-100" : "bg-white text-slate-700"}`}
                        >
                          {e.trip.via[0].short_name}
                        </span>
                        <East
                          sx={{
                            fontSize: 18,
                            color: isActive ? "#cbd5e1" : "#64748b",
                          }}
                        />
                      </>
                    ) : null}
                    <span
                      className={`rounded-md px-2 py-0.5 text-sm font-medium ${isActive ? "bg-slate-700 text-slate-100" : "bg-white text-slate-700"}`}
                    >
                      {e.trip.dropoff_location.short_name}
                    </span>
                    <span
                      className={`mx-1 h-1 w-1 rounded-full ${isActive ? "bg-slate-300" : "bg-slate-500"}`}
                    />
                    <span
                      className={`text-sm ${isActive ? "text-white" : "text-slate-600"}`}
                    >
                      {new Date(e.trip.pickup_time).toDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div
        id="map"
        className="relative block w-full px-6 pb-8 lg:my-7.75 lg:mr-6 lg:w-1/2 lg:px-0 lg:pb-0"
      >
        <div className="h-200 overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.12)] lg:h-full">
          <Map ref={mapRef} center={[-2.5955, 51.45411]} zoom={14}></Map>
        </div>
      </div>
    </div>
  );
}
