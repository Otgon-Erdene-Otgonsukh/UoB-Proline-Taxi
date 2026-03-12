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

export const getDepartmentsList = async (): Promise<Response> => {
  return easyGetRequest('departments', {})
}

export const getDepartmentManageList = async (): Promise<Response> => {
  return easyGetRequest('departments/manage', {})
}

export const createDepartment = async (depName: string): Promise<Response> => {
  return easyPostRequest('departments/add', {
    depName
  })
}

export const getUsersByDepId = async (depId: number): Promise<Response> => {
  return easyGetRequest('departments/user', {
    depId
  })
}

export const updateDepartmentName = async (depId: number, depName: string): Promise<Response> => {
  return easyPostRequest('departments/edit', {
    depId,
    depName
  })
}

export const deleteDepartment = async (depId: number): Promise<Response> => {
  return easyPostRequest('departments/delete', {
    depId
  })
}

export const changeDepartmentForUsers = async (userIds: number[], depId: number): Promise<Response> => {
  return easyPostRequest('departments/multi-user-change', {
    userIds,
    depId
  })
}
