import { easyGetRequest, easyPostRequest } from "@/utils/easyRequest";

export const getPendingBookingList = async (page: number, pageSize: number, searchParams: { from?: string, to?: string, passengerName?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string, isFlight: boolean }): Promise<Response> => {
  return easyGetRequest('get_pending_bookings', {
    page,
    pageSize,
    ...searchParams
  })
}