import { NextRequest } from "next/server";
import { getDepartmentListIncludeManagerIdAccess } from "@/backend/access/departments_access";
import { getUsersByIdsAccess } from "@/backend/access/user_access";
import { User } from "@/generated/prisma/client";

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
  const managerIdMap: {[key: number]: User} = {}
  managers.forEach(e => {
    managerIdMap[e.user_id] = e
  })

  return new Response(JSON.stringify(departmentsList.map(e => {
    return {
      ...e,
      manager: e.manager_id ? managerIdMap[e.manager_id] : null
    }
  })), { status: 200 });

}