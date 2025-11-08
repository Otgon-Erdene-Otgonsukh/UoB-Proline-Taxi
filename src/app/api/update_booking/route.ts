import updateStatus from "@/backend/update_booking_status/update_status"

export async function POST(req: Request) {
    const body = await req.json()

    const bookingId: number = body.bookingId
    const newStatus: string = body.newStatus

    updateStatus(bookingId, newStatus)
}