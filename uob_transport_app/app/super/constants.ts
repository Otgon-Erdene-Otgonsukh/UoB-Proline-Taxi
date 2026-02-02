export const userStatusToIntMap = {
  pending: 0,
  approved: 1,
  rejected: 2
}

export const userStatusToStrMap = ['Pending', 'Approved', 'Rejected']

export const roleStrMap = {
  normalUser: 'normal_user',
  financeStaff: 'finance_staff',
  prolineStaff: 'proline_staff'
}

export const roleReadableStrMap: { [key: string]: string } = {
  normal_user: 'Normal User',
  finance_staff: 'Finance Staff',
  proline_staff: 'Proline Staff'
}

export const roles = [roleStrMap.normalUser, roleStrMap.financeStaff, roleStrMap.prolineStaff]
