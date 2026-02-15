import prisma from '@/utils/client';

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
