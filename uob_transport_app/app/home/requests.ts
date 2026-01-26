import { easyGetRequest, easyPostRequest } from "@/utils/easyRequest";

export const getUserBookingList = async (page: number, pageSize: number, searchParams: { from?: string, to?: string, bookingStatus?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string }): Promise<Response> => {
  return easyGetRequest('booking-list', {
    page,
    pageSize,
    ...searchParams
  })
}

export const cancelBooking = async (bookingId: number): Promise<Response> => {
  return easyPostRequest('cancel-booking', {
    bookingId
  })
}
