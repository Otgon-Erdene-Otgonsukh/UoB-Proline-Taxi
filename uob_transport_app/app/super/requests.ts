import { easyGetRequest, easyPostRequest } from "@/utils/easyRequest";

export const getDepartmentsList = async (): Promise<Response> => {
  return easyGetRequest('departments', {})
}

export const getBookingsList = async (page: number, pageSize: number, isExport: boolean, searchParams: { from?: string, to?: string, bookingStatus?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string, department?: string }): Promise<Response> => {
  return easyGetRequest('booking-list', {
    page,
    pageSize,
    isExport,
    ...searchParams
  })
}

export const cancelBooking = async (bookingId: number): Promise<Response> => {
  return easyPostRequest('cancel-booking', {
    bookingId
  })
}