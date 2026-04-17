import { easyGetRequest } from "@/utils/easyRequest";

export const getPendingBookingList = async (
  page: number,
  pageSize: number,
  searchParams: {
    from?: string;
    to?: string;
    passengerName?: string;
    pickUpTimeFrom?: string;
    pickUpTimeTo?: string;
    isFlight: boolean;
    total: boolean;
    status: boolean;
    overdue: boolean;
    price: boolean;
    withoutPrice: boolean;
  },
): Promise<Response> => {
  return easyGetRequest("get_pending_bookings", {
    page,
    pageSize,
    ...searchParams,
  });
};
