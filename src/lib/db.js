import { PrismaClient } from '@prisma/client';

const prisma = globalThis.__prisma ?? new PrismaClient();
if (globalThis) {
  globalThis.__prisma = prisma;
}

export { prisma };
