import { PrismaClient } from "@/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { getEnv, NODE_ENV } from "./env";

const env = getEnv();

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter, errorFormat: "pretty" });

if (env.NODE_ENV !== NODE_ENV.PRODUCTION) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
