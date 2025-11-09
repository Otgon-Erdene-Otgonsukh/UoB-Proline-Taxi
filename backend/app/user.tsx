'use server';

import { searchUser, updateUserToken } from '@/backend/access/user_access'
import { User } from '@/generated/prisma/browser';
import { uuid } from '../utils/uuid';

export const userLogin = async (email: string, password: string): Promise<String> => {
  const userDetail: User | null = await searchUser(email);

  // need encryption
  if (userDetail && userDetail.password === password) {
    const token = uuid()
    updateUserToken(email, token)
    return token
  } else {
    return 'fail'
  }
}


