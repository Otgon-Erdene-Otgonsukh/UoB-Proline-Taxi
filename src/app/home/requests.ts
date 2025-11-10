export const getUserBookingList = async (page: number, pageSize: number): Promise<Response> => {
  const headers = new Headers()
  headers.append('token', localStorage.getItem('token')!)
  const request = new Request(`http://localhost:3000/api/booking-list?page=` + page + '&pageSize=' + pageSize, {
    method: "GET",
    headers: headers,
  });
  return fetch(request)
}
