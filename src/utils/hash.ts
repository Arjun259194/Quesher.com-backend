import { compare, hash } from "bcrypt";

export async function hashPassword(password: string) {
  const SALT_ROUND = 10;
  return await hash(password, SALT_ROUND).catch(err => {
    throw new Error("Error hashing password");
  });
}

export async function checkPassword(password: string, hash: string) {
  return await compare(password, hash).catch(err => {
    throw new Error("Error while matching hash passwords");
  });
}
