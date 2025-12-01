import { easyPostRequest, easyGetRequest } from "@/utils/easyRequest";

export const getUserResetByUuid = async (uuid: string): Promise<Response> => {
  return easyGetRequest('reset-email', {
    uuid,
  })
}
