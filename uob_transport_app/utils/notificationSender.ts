import prisma from "./client";
import webpush from "web-push";

let vapidConfigured = false;

export async function notificationHelper(
  notificationType: string,
  bookingId: number | undefined,
  userId: number,
) {
  if (!vapidConfigured) {
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPublicKey || !vapidPrivateKey) {
      return;
    }

    webpush.setVapidDetails(
      "mailto:placeholder@example.com",
      vapidPublicKey,
      vapidPrivateKey,
    );
    vapidConfigured = true;
  }

  if (!vapidConfigured) {
    return;
  }

  let payload;
  let userSub;

  // Don't fetch the user subscription on price attach notification
  if (notificationType !== "price_attach") {
    userSub = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        subscription: true,
      },
    });
  }

  if (notificationType === "booking_creation") {
    payload = {
      title: "Booking Created",
      body: "Your booking has been created successfully. Click to view.",
    };
  } else if (notificationType === "booking_approve") {
    payload = {
      title: "Booking Approved",
      body: "Your booking has been approved. Click to view details.",
    };
  } else if (notificationType === "booking_reject") {
    payload = {
      title: "Booking Rejected",
      body: "Your booking has been rejected. Click to view details.",
    };
  } else if (notificationType === "price_attach") {
    let financeStaffSubs;

    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: {
          booking_id: bookingId,
        },
        select: {
          dep_id: true,
          trip: {
            select: {
              price: true,
            },
          },
        },
      });

      if (!booking) {
        return;
      }

      financeStaffSubs = await prisma.user.findMany({
        where: {
          role: "finance_staff",
          dep_id: booking.dep_id,
        },
        select: {
          subscription: true,
        },
      });

      payload = {
        title: "Price Attachment Notice",
        body: `A price of £${booking.trip.price} has been attached to a booking by the admin. Click to view.`,
      };
    }

    if (financeStaffSubs) {
      // Send the price notification to all the finance staff that is subscribed
      for (const sub of financeStaffSubs) {
        if (sub.subscription !== null) {
          try { // try to send to every finance staff that has a valid subscription 
            const parsed = JSON.parse(sub.subscription);
            await webpush.sendNotification(parsed, JSON.stringify(payload));
          } catch (error) {
            console.error("Invalid subscription or network error", error);
          }
        }
      }
    }
    return;
  }

  if (!userSub || userSub.subscription === null) {
    return;
  }

  await webpush.sendNotification(
    JSON.parse(userSub.subscription),
    JSON.stringify(payload),
  );
}
