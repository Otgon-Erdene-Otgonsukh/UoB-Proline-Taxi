import prisma from "@/utils/client";
import { sesClient } from "@/utils/ses_client";
import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import { location } from "@/model/models";
import { render } from "@react-email/components";
import BookingPoAttach from "@/components/emails/booking_po_attach";
import BookingApproved from "@/components/emails/booking_approved";
import BookingAdminReject from "@/components/emails/booking_admin_rejection";

export default async function updateBookingStatus(
  bookingId: number,
  newStatus: string,
  poNumber: string,
) {
  if (newStatus === "Approved") {
    await prisma.booking.update({
      where: {
        booking_id: bookingId,
      },
      data: {
        booking_status: newStatus,
        trip: {
          update: {
            PO: poNumber,
          },
        },
      },
    });

    const booking = await prisma.booking.findUnique({
      where: {
        booking_id: bookingId,
      },
      include: {
        trip: true,
        department: true,
      },
    });

    // Finding the user who made the booking
    const user = await prisma.user.findUnique({
      where: {
        user_id: booking?.user_id,
      },
      select: {
        email: true,
      },
    });

    const superAdminEmail = await prisma.user.findFirst({
      where: {
        role: "super_admin",
      },
      select: {
        email: true,
      },
    });

    if (!booking) {
      return new Error("Booking does not exist");
    }

    if (!superAdminEmail) {
      return new Error("Super admin does not exist");
    }

    if (!user) {
      return new Error("Something went wrong");
    }

    const from = JSON.parse(booking.trip.pickup_location) as location;
    const via = booking.trip.via
      ? (JSON.parse(booking.trip.via) as location[])
      : [];
    const to = JSON.parse(booking.trip.dropoff_location) as location;
    const airport = booking.trip.airport
      ? (JSON.parse(booking.trip.airport) as location)
      : null;
    const returnTo = booking.trip.return_drop_loc
      ? (JSON.parse(booking.trip.return_drop_loc) as location)
      : undefined;

    // Render and send PO email to super admin
    const poHtml = await render(
      BookingPoAttach({
        from,
        via,
        to,
        airport,
        flightNum: booking.trip.flight_num ?? "",
        pickUpTime: booking.trip.pickup_time,
        returnTime: booking.trip.return_pickup_time ?? undefined,
        returnTo,
        passenger_name: booking.passenger_name,
        phoneNumber: booking.tel_number,
        department: booking.department.dep_name,
        po: poNumber,
        price: String(booking.trip.price),
      }),
    );

    const poInput = new SendEmailCommand({
      FromEmailAddress: `UoB Taxi & Chauffeur <${process.env.SES_FROM_EMAIL!}>`,
      Destination: {
        ToAddresses: [superAdminEmail.email],
      },
      Content: {
        Simple: {
          Subject: {
            Data: "PO Number Attachment Notice",
          },
          Body: {
            Html: {
              Data: poHtml,
            },
          },
        },
      },
    });

    const approvedHtml = await render(
      BookingApproved({
        from,
        via,
        to,
        airport,
        flightNum: booking.trip.flight_num ?? "",
        pickUpTime: booking.trip.pickup_time,
        returnTime: booking.trip.return_pickup_time ?? undefined,
        returnTo,
        passengerName: booking.passenger_name,
        phoneNumber: booking.tel_number,
        department: booking.department.dep_name,
        price: String(booking.trip.price),
      }),
    );

    const approvedInput = new SendEmailCommand({
      FromEmailAddress: `UoB Taxi & Chauffeur <${process.env.SES_FROM_EMAIL!}>`,
      Destination: {
        ToAddresses:
          booking.email === user.email
            ? [user.email]
            : [booking.email, user.email],
      },
      Content: {
        Simple: {
          Subject: {
            Data: "Booking Approval Notice",
          },
          Body: {
            Html: {
              Data: approvedHtml,
            },
          },
        },
      },
    });

    await sesClient.send(poInput);
    await sesClient.send(approvedInput);
  } else {
    await prisma.booking.update({
      where: {
        booking_id: bookingId,
      },
      data: {
        booking_status: newStatus,
      },
    });

    const booking = await prisma.booking.findUnique({
      where: {
        booking_id: bookingId,
      },
      include: {
        trip: true,
        department: true,
      },
    });

    // Finding the user who made the booking
    const user = await prisma.user.findUnique({
      where: {
        user_id: booking?.user_id,
      },
      select: {
        email: true,
      },
    });

    const superAdminEmail = await prisma.user.findFirst({
      where: {
        role: "super_admin",
      },
      select: {
        email: true,
      },
    });

    if (!booking) {
      return new Error("Booking does not exist");
    }

    if (!superAdminEmail) {
      return new Error("Super admin does not exist");
    }

    if (!user) {
      return new Error("Something went wrong");
    }

    const from = JSON.parse(booking.trip.pickup_location) as location;
    const via = booking.trip.via
      ? (JSON.parse(booking.trip.via) as location[])
      : [];
    const to = JSON.parse(booking.trip.dropoff_location) as location;
    const airport = booking.trip.airport
      ? (JSON.parse(booking.trip.airport) as location)
      : null;
    const returnTo = booking.trip.return_drop_loc
      ? (JSON.parse(booking.trip.return_drop_loc) as location)
      : undefined;

    const rejectedHtml = await render(
      BookingAdminReject({
        from,
        via,
        to,
        airport,
        flightNum: booking.trip.flight_num ?? "",
        pickUpTime: booking.trip.pickup_time,
        returnTime: booking.trip.return_pickup_time ?? undefined,
        returnTo,
        passengerName: booking.passenger_name,
        phoneNumber: booking.tel_number,
        department: booking.department.dep_name,
        uniStaffRejection: true,
      }),
    );

    const rejectInput = new SendEmailCommand({
      FromEmailAddress: `UoB Taxi & Chauffeur <${process.env.SES_FROM_EMAIL!}>`,
      Destination: {
        ToAddresses:
          booking.email === user.email
            ? [user.email]
            : [booking.email, user.email],
      },
      Content: {
        Simple: {
          Subject: {
            Data: "Booking Rejection Notice",
          },
          Body: {
            Html: {
              Data: rejectedHtml,
            },
          },
        },
      },
    });

    await sesClient.send(rejectInput);
  }
}
