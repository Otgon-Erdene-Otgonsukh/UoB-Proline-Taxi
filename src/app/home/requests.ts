import { easyGetRequest, easyPostRequest } from "@/src/utils/easyRequest";

export const getUserBookingList = async (page: number, pageSize: number): Promise<Response> => {
  return easyGetRequest('booking-list', {
    page,
    pageSize,
  }, true)
}

export const cancelBooking = async (bookingId: number): Promise<Response> => {
  return easyPostRequest('cancel-booking', {
    bookingId
  }, true)
}
