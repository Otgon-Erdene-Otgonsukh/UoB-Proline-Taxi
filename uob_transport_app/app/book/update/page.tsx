"use client";

import BookingPage from "@/app/book/page";

export default function UpdateBookingPage() {
    return (BookingPage as any)({prefilledBookingID: true});
}