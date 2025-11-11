import { easyPostRequest } from "@/src/utils/easyRequest";

export const userLogin = async (email: string, password: string): Promise<Response> => {
  return easyPostRequest('login', {
    email,
    password
  }, false)
}
