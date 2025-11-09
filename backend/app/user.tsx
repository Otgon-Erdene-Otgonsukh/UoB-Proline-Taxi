'use server';

import { searchUser } from '@/backend/access/user_access'
import { User } from '@/generated/prisma/browser';

export const userLogin = async (email: string, password: string): Promise<String> => {
  const userDetail: User | null = await searchUser(email);
  // need encryption
  if (userDetail && userDetail.password === password) {
    return 'success'
  } else {
    return 'fail'
  }
}


