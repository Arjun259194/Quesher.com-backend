import { PrismaClient } from '@prisma/client';

export async function findUserByEmail(client: PrismaClient, email: string) {
  const query = {
    where: { email: email },
  } as const;
  return await client.user.findUnique(query);
}

export async function findLatestOptByEmail(
  client: PrismaClient,
  email: string,
) {
  // const query =  as const;
  return await client.otp.findFirst({
    where: { User: { email: email } },
    include: {
      User: true,
    },
    orderBy: { id: 'desc' },
  });
}
