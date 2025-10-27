'use server';

import { searchUser } from '@/backend/access/user_access'
import { User } from '@/generated/prisma/browser';

export const userLogin = async (email: string, password: string): Promise<String> => {
  console.log(email, password);

  const userDetail: User | null = await searchUser(email);
  // need encryption
  if (userDetail && userDetail.password === password) {
    console.log('success');
    return 'success'
  } else {
    console.log('fail');
    return 'fail'
  }
}


