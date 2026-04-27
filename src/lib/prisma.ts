import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

function createAdapter() {
  const url = process.env.DATABASE_URL;

  if (url && !url.includes("localhost") && !url.includes("127.0.0.1")) {
    const parsed = new URL(url);
    return new PrismaMariaDb({
      host: parsed.hostname,
      port: Number(parsed.port) || 4000,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace("/", ""),
      connectionLimit: 10,
      ssl: { rejectUnauthorized: true },
    });
  }

  return new PrismaMariaDb({
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "titan_travel_db",
    connectionLimit: 10,
  });
}

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: createAdapter(),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
export default prisma;