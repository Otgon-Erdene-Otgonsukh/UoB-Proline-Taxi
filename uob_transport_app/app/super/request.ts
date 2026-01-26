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
