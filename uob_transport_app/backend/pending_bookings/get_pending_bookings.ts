import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export default async function getPendingBookings() {
  return prisma.booking.findMany({
    where: {
      booking_status: "Pending",
    },
    orderBy: {
      time_created: 'desc' // latest one shows up at the top
    },
    include: {   // fetching the connected trip and User and department tables to fill out the dep-dashboard table and view 
      trip: true,
      User: {
        include: {
          department: true,
          // Explicitly do not include sensitive and irrelevant fields.
          password: false,
        },
      },
    },
  });
}
