import { compare, hash } from 'bcrypt';

export async function hashPassword(password: string) {
  const SALT_ROUND = 10;
  return await hash(password, SALT_ROUND).catch((err) => {
    console.error('Error while Password hashing error:', err);
    throw new Error('Error hashing password');
  });
}

export async function checkPassword(password: string, hash: string) {
  return await compare(password, hash).catch((err) => {
    console.error('Error while Password checking error:', err);
    throw new Error('Error while matching hash passwords');
  });
}
