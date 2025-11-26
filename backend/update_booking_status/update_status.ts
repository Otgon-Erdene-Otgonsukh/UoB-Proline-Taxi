import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export default async function updateBookingStatus(
  bookingId: number,
  newStatus: string,
  poNumber: string
) {
  if (newStatus === "Approved") {
    return prisma.booking.update({
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
  } else {
    return prisma.booking.update({
        where: {
            booking_id: bookingId,
        },
        data: {
            booking_status: newStatus
        }
    })
  }
}
