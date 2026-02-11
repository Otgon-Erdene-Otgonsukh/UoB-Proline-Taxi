import { easyGetRequest } from "@/utils/easyRequest";

export const getDepartmentsList = async (): Promise<Response> => {
  return easyGetRequest('departments', {})
}
