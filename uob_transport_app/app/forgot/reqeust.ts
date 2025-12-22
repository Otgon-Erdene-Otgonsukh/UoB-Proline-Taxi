import { easyPostRequest } from "@/utils/easyRequest";

export const sendResetEmail = async (email: string): Promise<Response> => {
  return easyPostRequest('reset-email', {
    email
  })
}
