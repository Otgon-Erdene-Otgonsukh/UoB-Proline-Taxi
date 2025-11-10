import { getUserByToken } from "@/backend/app/user";
import { NextRequest } from "next/server";

export const loginRequired = async (request: NextRequest) => {
  const token = request.headers.get('token')
  if (token) {
    const userDetail = await getUserByToken(token)
    return userDetail
  } else {
    return null
  }
}