import { easyGetRequest } from "@/src/utils/easyRequest";

export const getUserBookingList = async (page: number, pageSize: number): Promise<Response> => {
  return easyGetRequest('booking-list', {
    page,
    pageSize,
  }, true)
}
