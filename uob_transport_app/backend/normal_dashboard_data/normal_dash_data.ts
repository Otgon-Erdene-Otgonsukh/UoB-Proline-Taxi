import prisma from "@/utils/client";

export const getNormalDashboardData = async (userId: number) => {
  const bookings = await prisma.booking.findMany({
    where: {
      user_id: userId,
      AND: [
        { booking_status: { not: "Rejected" } },
        { booking_status: { not: "Cancelled" } },
      ],
    },
    select: {
      booking_status: true,
      trip: {
        select: {
          pickup_location: true,
          via: true,
          dropoff_location: true,
          pickup_time: true,
        },
      },
    },
    orderBy: {
      time_created: "desc",
    },
    take: 5,
  });

  const total = await prisma.booking.count({
    where: {
      user_id: userId,
    },
  });
  const price = await prisma.trip.aggregate({
    where: {
      booking: {
        is: {
          user_id: userId,
        },
      },
    },
    _sum: {
      price: true,
    },
  });

  const totalPrice = price._sum.price ?? 0; // could all be null thus defaults to 0

  const upcoming = await prisma.trip.count({
    where: {
      booking: {
        is: {
          user_id: userId,
        },
      },
      pickup_time: {
        gte: new Date(),
      },
    },
  });

  return {
    recentBookings: bookings,
    totalBookings: total,
    totalPrice: totalPrice,
    upcomingBookings: upcoming
  }
};
