import { getPendingBookings, getPendingBookingsCount } from "@/backend/pending_bookings/get_pending_bookings";
import { prismaMock } from "@/utils/singleton";


describe("The tests for the 2 functions for fetching bookings/count for dep-dashboard page", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    test("Both functions passes the correct query to prisma when no filter is applied", async () => {
        const mockSearchParams = {
            from: undefined,
            to: undefined,
            passengerName: undefined,
            pickUpTimeFrom: undefined,
            pickUpTimeTo: undefined,
            isFlight: false
        }
        await getPendingBookings(4, 10, mockSearchParams);
        await getPendingBookingsCount(mockSearchParams);
        expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
            where: {
                booking_status: "Pending",
            },
            orderBy: {
                time_created: "desc",
            },
            include: {
                trip: true,
                User: {
                    include: {
                        department: true,
                    },
                    omit: {
                        password: true,
                    }
                }
            },
            skip: 40,
            take: 10,
        });
        expect(prismaMock.booking.findMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.booking.count).toHaveBeenCalledWith({
            where: {
                booking_status: "Pending",
            }
        })
    })

    test("When search params are defined, the prisma query is built correctly", async () => {
        const mockSearchParams = {
            from: "fogs",
            to: "tri",
            passengerName: "Geo",
            pickUpTimeFrom: "",
            pickUpTimeTo: "",
            isFlight: true
        }
        await getPendingBookings(2, 5, mockSearchParams);
        expect(prismaMock.booking.findMany).toHaveBeenCalledWith({
            
        })
    })
})