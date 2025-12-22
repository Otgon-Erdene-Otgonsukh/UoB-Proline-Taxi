import { easyPostRequest, easyGetRequest } from "@/utils/easyRequest";

export const getUserResetByUuid = async (uuid: string): Promise<Response> => {
  return easyGetRequest('reset-email', {
    uuid,
  })
}

export const resetPassword = async (uuid: string, password: string): Promise<Response> => {
  return easyPostRequest('reset-password', {
    uuid,
    password
  })
}
