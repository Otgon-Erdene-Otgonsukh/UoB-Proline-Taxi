import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient()

export default async function updateBookingStatus(bookingId: number, newStatus: string) {
    return prisma.booking.update({
        where: {
            booking_id: bookingId
        },
        data: {
            booking_status: newStatus
        }
    })
}