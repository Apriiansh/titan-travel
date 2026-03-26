import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt";

// Inisialisasi adapter & client langsung di sini,
// bukan import dari lib/prisma agar seeder berdiri sendiri (tidak bergantung Next.js runtime).
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Mulai proses seeding...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  // upsert: buat jika belum ada, skip jika sudah ada (idempotent)
  const admin = await prisma.user.upsert({
    where: { email: "admin@titantravel.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@titantravel.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@titantravel.com" },
    update: {},
    create: {
      name: "Manager Operasional",
      email: "manager@titantravel.com",
      password: await bcrypt.hash("manager123", 10),
      role: "MANAGER",
    },
  });

  console.log(`✅ Admin   → ${admin.email}`);
  console.log(`✅ Manager → ${manager.email}`);
  console.log("🌱 Seeding selesai.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding gagal:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
