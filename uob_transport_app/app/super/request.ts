import { UserRecord } from "@/model/models";
import { easyGetRequest, easyPostRequest } from "@/utils/easyRequest";

export const getUsersAsAdmin = async (searchParams: {
  name?: string,
  role?: string,
  user_status?: number,
  page: number,
  pageSize: number
}): Promise<Response> => {
  const getParams: { [key: string]: string | number } = {}
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined) {
      getParams[key] = value
    }
  }
  return easyGetRequest('user-manage', getParams)
}

export const updateUserAsAdmin = async (userData: UserRecord): Promise<Response> => {
  return easyPostRequest('user-manage', { userData })
}

export const getBookingList = async (page: number, pageSize: number, searchParams: { from?: string, to?: string, bookingStatus?: string, pickUpTimeFrom?: string, pickUpTimeTo?: string }): Promise<Response> => {
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