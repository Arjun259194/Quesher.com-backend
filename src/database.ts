import { PrismaClient } from '@prisma/client';

const prismaGlobalClient = new PrismaClient();

export default prismaGlobalClient;
