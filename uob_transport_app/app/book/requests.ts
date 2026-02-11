import { easyGetRequest } from "@/utils/easyRequest"

export async function getDepartments() {
  return easyGetRequest("/departments", {})
}