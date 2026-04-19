import { NextRequest } from "next/server";
import { getDepartmentListIncludeManagerIdAccess } from "@/backend/access/departments_access";
import { getUsersByIdsAccess } from "@/backend/access/user_access";

/**
 * Get a list of departments with their managers and user count. If depName query param is provided, filter departments by name.
 * @param request 
 * @returns 
 */
export async function GET(request: NextRequest) {
  // TODO Check super admin

  const searchParams = request.nextUrl.searchParams;
  const depName = searchParams.get('depName') || undefined

  const departmentsList = await getDepartmentListIncludeManagerIdAccess(depName)
  const managerIds = departmentsList.map(e => {
    return e.manager_id
  }).filter(e => {
    return e !== null
  })
  const managers = await getUsersByIdsAccess(managerIds)
  const managerIdMap: {
    [key: number]: {
      user_id: number;
      full_name: string;
      email: string;
      phone_number: string;
      role: string;
      user_status: number;
    }
  } = {}
  managers.forEach(e => {
    managerIdMap[e.user_id] = e
  })

  return new Response(JSON.stringify(departmentsList.map(e => {
    return {
      depName: e.dep_name,
      depId: e.dep_id,
      userCount: e._count.User,
      manager: e.manager_id ? managerIdMap[e.manager_id] : null
    }
  })), { status: 200 });

}
