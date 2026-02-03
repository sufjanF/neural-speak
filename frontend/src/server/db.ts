/**
 * Prisma database client singleton.
 * Caches client in development to prevent connection pool exhaustion during HMR.
 */
import { PrismaClient } from "@prisma/client";
import { env } from "~/env";

const createPrismaClient = () =>
  new PrismaClient({
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db; 