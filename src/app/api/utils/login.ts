import { getUserByToken } from "@/backend/app/user";
import { NextRequest } from "next/server";

const loginRequired = async (request: NextRequest) => {
  const token = request.cookies.get('token')?.value
  if (token) {
    const userDetail = await getUserByToken(token)
    return userDetail
  } else {
    return null
  }
}