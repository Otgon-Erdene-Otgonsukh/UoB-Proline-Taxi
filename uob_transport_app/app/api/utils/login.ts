import { NextRequest } from "next/server";

// export const loginRequired = async (request: NextRequest) => {
//   const token = request.headers.get('token')
//   if (token) {
//     const userDetail = await getUserByTokenAccess(token)
//     return userDetail
//   } else {
//     return null
//   }
// }