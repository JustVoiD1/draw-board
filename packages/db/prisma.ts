import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to initialize Prisma");
}

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaNeon({ connectionString: databaseUrl }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type Prisma = PrismaClient;
export type StringFilter =
  import("./generated/prisma/commonInputTypes.js").StringFilter;
