"use client";

import { useEffect, useState, useRef } from "react";
import {
  Map,
  MapMarker,
  MapRoute,
  MapRef,
  MarkerContent,
  MarkerLabel,
} from "./ui/map";
import { easyGetRequest } from "@/utils/easyRequest";
import { NormalBookings, NormalDashboardData } from "@/model/models";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import CustomizedButton from "./CustomizedButton";
import { CircularProgress } from "@mui/material";
import {
  DirectionsCar,
  CurrencyPound,
  Upcoming,
  NotListedLocation,
  East,
} from "@mui/icons-material";

interface RouteData {
  coordinates: [number, number][];
}

interface RouteItem {
  index: number;
  route?: RouteData;
}

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
  const [dashboardData, setDashboardData] = useState<NormalDashboardData>();
  const mapRef = useRef<MapRef>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    const recentBookings = dashboardData?.recentBookings ?? []; // typescript complaints...
    if (recentBookings.length === 0) {
      setRoutes([]);
      return;
    }

    let minLng = Number.POSITIVE_INFINITY;
    let minLat = Number.POSITIVE_INFINITY;
    let maxLng = Number.NEGATIVE_INFINITY;
    let maxLat = Number.NEGATIVE_INFINITY;

    async function fetchRoutes() {
      const bookingRoutes = await Promise.all(
        recentBookings.map(async (e, index) => {
          const vias = e.trip.via
            ? e.trip.via.map((v) => ({ lat: v.lat, lng: v.lng }))
            : [];
          const points = [
            {
              lat: e.trip.pickup_location.lat,
              lng: e.trip.pickup_location.lng,
            },
            ...vias,
            {
              lat: e.trip.dropoff_location.lat,
              lng: e.trip.dropoff_location.lng,
            },
          ];

          const viaLngs = e.trip.via?.map((v) => v.lng) ?? [];
          const viaLats = e.trip.via?.map((v) => v.lat) ?? [];
          const currentMinLng = Math.min(
            e.trip.pickup_location.lng,
            e.trip.dropoff_location.lng,
            ...viaLngs,
          );
          const currentMinLat = Math.min(
            e.trip.pickup_location.lat,
            e.trip.dropoff_location.lat,
            ...viaLats,
          );
          const currentMaxLng = Math.max(
            e.trip.pickup_location.lng,
            e.trip.dropoff_location.lng,
            ...viaLngs,
          );
          const currentMaxLat = Math.max(
            e.trip.pickup_location.lat,
            e.trip.dropoff_location.lat,
            ...viaLats,
          );

          minLng = Math.min(minLng, currentMinLng);
          minLat = Math.min(minLat, currentMinLat);
          maxLng = Math.max(maxLng, currentMaxLng);
          maxLat = Math.max(maxLat, currentMaxLat);

          const res = await fetch("/api/route", {
            method: "POST",
            body: JSON.stringify({ points }),
          });
          const data = await res.json();
          return {
            index,
            route: data.routes?.[0]?.geometry as RouteData | undefined,
          };
        }),
      );
      setRoutes(bookingRoutes);

      mapRef.current?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 70 },
      );
    }

    fetchRoutes();
  }, [dashboardData]); // only run after the dashboard data is set

  // Updating the map bound to fit each selected booking
  useEffect(() => {
    if (!dashboardData) return;
    if (activeIndex < 0) {
      // prevent from running the below code on initial load
      return;
    }

    const activeBooking = dashboardData.recentBookings[activeIndex];
    const viaLats = activeBooking.trip.via?.map((v) => v.lat) ?? [];
    const viaLngs = activeBooking.trip.via?.map((v) => v.lng) ?? [];

    const minLat = Math.min(
      ...viaLats,
      activeBooking.trip.pickup_location.lat,
      activeBooking.trip.dropoff_location.lat,
    );
    const minLng = Math.min(
      ...viaLngs,
      activeBooking.trip.pickup_location.lng,
      activeBooking.trip.dropoff_location.lng,
    );
    const maxLat = Math.max(
      ...viaLats,
      activeBooking.trip.pickup_location.lat,
      activeBooking.trip.dropoff_location.lat,
    );
    const maxLng = Math.max(
      ...viaLngs,
      activeBooking.trip.pickup_location.lng,
      activeBooking.trip.dropoff_location.lng,
    );

    mapRef.current?.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      { padding: 140 },
    );
  }, [activeIndex]);

  // Sort routes: non-selected first, selected last (renders on top)
  const sortedRoutes = [...routes].sort((a, b) => {
    if (a.index === activeIndex) return 1;
    if (b.index === activeIndex) return -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white lg:flex lg:flex-row">
      <div
        id="data"
        className="flex w-full flex-col px-6 pt-8 mb-8 md:mb-0 md:h-full md:w-1/2 lg:px-8 gap-8 min-h-screen"
      >
        <div id="cards" className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex md:flex-col items-center md:items-start justify-between rounded-2xl border border-sky-100 bg-linear-to-br from-white to-sky-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 w-fit rounded-full bg-sky-100 p-2.5 mt-3 md:mt-0">
              <DirectionsCar
                sx={{ color: "#0369a1", fontSize: { md: 24, xs: 35 } }}
              />
            </div>
            {loading ? (
              <CircularProgress color="inherit" size={30} />
            ) : (
              <div>
                <p className="text-3xl font-bold text-slate-900 md:text-start text-end">
                  {dashboardData?.totalBookings ?? 0}
                </p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-500">
                  Total Bookings
                </p>
              </div>
            )}
          </div>

          <div className="flex md:flex-col items-center md:items-start justify-between rounded-2xl border border-emerald-100 bg-linear-to-br from-white to-emerald-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 w-fit rounded-full bg-emerald-100 p-2.5 mt-3 md:mt-0">
              <CurrencyPound
                sx={{ color: "#047857", fontSize: { md: 24, xs: 35 } }}
              />
            </div>
            {loading ? (
              <CircularProgress color="inherit" size={30} />
            ) : (
              <div>
                <p className="text-3xl font-bold text-slate-900 md:text-start text-end">
                  £{dashboardData?.totalPrice ?? 0}
                </p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-500">
                  Total Price
                </p>
              </div>
            )}
          </div>

          <div className="flex md:flex-col items-center md:items-start justify-between rounded-2xl border border-amber-100 bg-linear-to-br from-white to-amber-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 w-fit rounded-full bg-amber-100 p-2.5 mt-3 md:mt-0">
              <Upcoming
                sx={{ color: "#b45309", fontSize: { md: 24, xs: 35 } }}
              />
            </div>
            {loading ? (
              <CircularProgress color="inherit" size={30} />
            ) : (
              <div>
                <p className="text-3xl font-bold text-slate-900 md:text-start text-end">
                  {dashboardData?.upcomingBookings ?? 0}
                </p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-500">
                  Upcoming Bookings
                </p>
              </div>
            )}
          </div>
        </div>
        <div id="bookings" className="h-full md:h-99.5">
          {dashboardData?.recentBookings.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-6 py-23 text-center">
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
            <div className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white/90 px-5 py-4 shadow-sm">
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium uppercase tracking-wide text-slate-600">
                    Recent bookings
                  </p>
                  <p className="text-[12px] font-medium tracking-wide text-slate-600">
                    • Click to view on map
                  </p>
                </div>
                <CustomizedButton
                  type="warning"
                  title="✚"
                  click={() => redirect("/book")}
                ></CustomizedButton>
              </div>

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
          <Map ref={mapRef} center={[-2.5955, 51.45411]} zoom={14}>
            {sortedRoutes.map((r, _) => {
              const coordinates = r.route?.coordinates;

              if (!coordinates) return null;

              const isActive = r.index === activeIndex;
              return (
                <MapRoute
                  key={r.index}
                  coordinates={coordinates}
                  color={isActive ? "#314158" : "#94a3b8"}
                  width={isActive ? 6 : 4}
                  opacity={isActive ? 1 : 0.7}
                  onClick={() => setActiveIndex(r.index)}
                ></MapRoute>
              );
            })}

            {dashboardData?.recentBookings &&
              dashboardData.recentBookings.map((e, index) => {
                const active = activeIndex === index;
                return (
                  <div key={index}>
                    <MapMarker
                      latitude={e.trip.pickup_location.lat}
                      longitude={e.trip.pickup_location.lng}
                    >
                      <MarkerContent>
                        <div
                          className={`rounded-full border-2 border-white shadow-lg transition-all ${active ? "size-5 bg-green-400" : "size-4 bg-green-200"}`}
                        />
                        {active && (
                          <MarkerLabel
                            position="top"
                            className="bg-white p-1 rounded shadow text-xs font-medium"
                          >
                            {e.trip.pickup_location.short_name}
                          </MarkerLabel>
                        )}
                      </MarkerContent>
                    </MapMarker>
                    {e.trip.via &&
                      e.trip.via.map((v, viaIndex) => (
                        <MapMarker
                          key={viaIndex}
                          latitude={v.lat}
                          longitude={v.lng}
                        >
                          <MarkerContent>
                            <div
                              className={`rounded-full border-2 border-white shadow-lg transition-all ${active ? "size-5 bg-yellow-400" : "size-4 bg-yellow-200"}`}
                            />
                            {active && (
                              <MarkerLabel
                                position="top"
                                className="bg-white p-1 rounded shadow text-xs font-medium"
                              >
                                {v.short_name}
                              </MarkerLabel>
                            )}
                          </MarkerContent>
                        </MapMarker>
                      ))}
                    <MapMarker
                      latitude={e.trip.dropoff_location.lat}
                      longitude={e.trip.dropoff_location.lng}
                    >
                      <MarkerContent>
                        <div
                          className={`rounded-full border-2 border-white shadow-lg transition-all ${active ? "size-5 bg-red-400" : "size-4 bg-red-200"}`}
                        />
                        {active && (
                          <MarkerLabel
                            position="top"
                            className="bg-white p-1 rounded shadow text-xs font-medium"
                          >
                            {e.trip.dropoff_location.short_name}
                          </MarkerLabel>
                        )}
                      </MarkerContent>
                    </MapMarker>
                  </div>
                );
              })}
          </Map>
        </div>
      </div>
    </div>
  );
}
