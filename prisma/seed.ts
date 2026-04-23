import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import bcrypt from "bcrypt";
import { translations } from "../src/lib/translations";

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});
const prisma = new PrismaClient({ adapter });

type JsonValue = Prisma.InputJsonValue;

interface MultiLang {
    en: string;
    id: string;
    ms: string;
}

interface PackageItem {
    title: string;
    location: string;
    duration: string;
    capacity: string;
    facilityScore: number;
    departureScore: number;
    durationDays: number;
    image: string;
    desc: string;
    priceTiers: { minPax: number; maxPax: number; price: number; originalPrice?: number }[];
}

const translationCache: Record<string, string> = {};
// ... (skip translation functions for brevity in replacement, will keep them)
async function translate(text: string, target: string): Promise<string> {
    if (!text || typeof text !== "string") return text;
    if (target === "en") return text;
    const cacheKey = `${target}:${text}`;
    if (translationCache[cacheKey]) return translationCache[cacheKey];

    try {
        await new Promise((resolve) => setTimeout(resolve, 150));
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        const data = await res.json() as unknown[][][];
        
        let translated = text;
        if (data && Array.isArray(data[0])) {
            translated = data[0].map((item) => (Array.isArray(item) ? String(item[0]) : "")).join("");
        }
        
        translationCache[cacheKey] = translated;
        return translated;
    } catch (error) {
        console.error(`❌ Translation failed for (${target}):`, text.substring(0, 30), error);
        return text;
    }
}

async function translateDeep(data: unknown, target: string): Promise<unknown> {
    if (typeof data === "string") return await translate(data, target);
    if (Array.isArray(data)) return await Promise.all(data.map((item) => translateDeep(item, target)));
    if (data !== null && typeof data === "object") {
        const result: Record<string, unknown> = {};
        const entries = Object.entries(data);
        for (const [key, value] of entries) {
            result[key] = await translateDeep(value, target);
        }
        return result;
    }
    return data;
}

async function toAutoMultiLang(enText: string): Promise<MultiLang> {
    if (!enText) return { en: "", id: "", ms: "" };
    const [id, ms] = await Promise.all([translate(enText, "id"), translate(enText, "ms")]);
    return { en: enText, id, ms };
}

async function main() {
    console.log("🚀 Starting 100% Type-Safe Titan Travel Seeder...");

    // 1. Seed Users
    const adminPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
        where: { email: "admin@gmail.com" },
        update: { password: adminPassword },
        create: {
            name: "Titan Admin",
            email: "admin@gmail.com",
            password: adminPassword,
            role: "ADMIN",
        },
    });
    console.log("✅ Admin user seeded");

    // 2. Seed Settings
    const settingKeys = ["navbar", "hero", "about", "services", "packages", "testimonials", "gallery", "contact", "footer"] as const;
    for (const key of settingKeys) {
        console.log(`⏳ Seeding setting: ${key}...`);
        const enSource = (translations.en as Record<string, unknown>)[key];
        const [idVal, msVal] = await Promise.all([
            translateDeep(enSource, "id"),
            translateDeep(enSource, "ms")
        ]);
        
        const langValue = { en: enSource, id: idVal, ms: msVal };
        
        await prisma.setting.upsert({
            where: { key },
            update: { value: langValue as unknown as JsonValue },
            create: { key, value: langValue as unknown as JsonValue },
        });
    }

    // 3. Seed TOPSIS Criteria
    console.log("⏳ Seeding TOPSIS criteria...");
    const criteria = [
        { code: "C1", name: "Harga", weight: 0.35, type: "COST" },
        { code: "C2", name: "Fasilitas", weight: 0.25, type: "BENEFIT" },
        { code: "C3", name: "Waktu Keberangkatan", weight: 0.20, type: "COST" },
        { code: "C4", name: "Durasi Perjalanan", weight: 0.20, type: "COST" },
    ];

    for (const c of criteria) {
        await prisma.topsisCriterion.upsert({
            where: { code: c.code },
            update: { name: c.name, weight: c.weight, type: c.type },
            create: { code: c.code, name: c.name, weight: c.weight, type: c.type },
        });
    }
    console.log("✅ TOPSIS criteria seeded");

    // 4. Seed Realistic Tour Packages
    console.log("⏳ Cleaning up and seeding packages...");
    await prisma.tourPackage.deleteMany({});
    
    const packageItems: PackageItem[] = [
        {
            title: "Bali Spiritual & Cultural Journey 4H3M",
            location: "Ubud & Kuta, Bali",
            duration: "4 Days 3 Nights",
            capacity: "Max 20 Pax",
            facilityScore: 5,
            departureScore: 1,
            durationDays: 4,
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
            desc: "Discover the soul of Bali. Visit hidden temples and world-class resorts.",
            priceTiers: [
                { minPax: 1, maxPax: 5, price: 3500000, originalPrice: 4200000 },
                { minPax: 6, maxPax: 12, price: 3000000, originalPrice: 3800000 },
                { minPax: 13, maxPax: 20, price: 2500000, originalPrice: 3500000 }
            ]
        },
        {
            title: "Lombok Exotic Beach Tour 3H2M",
            location: "Mandalika, Lombok",
            duration: "3 Days 2 Nights",
            capacity: "Max 15 Pax",
            facilityScore: 4,
            departureScore: 2,
            durationDays: 3,
            image: "https://images.unsplash.com/photo-1564221937071-06f02e8c0ba8",
            desc: "Experience the pristine beaches of Mandalika and the unique Sasak culture.",
            priceTiers: [
                { minPax: 1, maxPax: 4, price: 2800000, originalPrice: 3500000 },
                { minPax: 5, maxPax: 10, price: 2400000, originalPrice: 3000000 },
                { minPax: 11, maxPax: 15, price: 2000000, originalPrice: 2800000 }
            ]
        },
        {
            title: "Kuala Lumpur City Escape 4H3M",
            location: "Kuala Lumpur, Malaysia",
            duration: "4 Days 3 Nights",
            capacity: "Max 12 Pax",
            facilityScore: 4,
            departureScore: 1,
            durationDays: 4,
            image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07",
            desc: "The ultimate shopping and dining experience in the heart of Malaysia.",
            priceTiers: [
                { minPax: 1, maxPax: 4, price: 4500000, originalPrice: 5000000 },
                { minPax: 5, maxPax: 8, price: 4000000, originalPrice: 4500000 },
                { minPax: 9, maxPax: 12, price: 3500000, originalPrice: 4200000 }
            ]
        },
        {
            title: "Singapore Modern Vibes 3H2M",
            location: "Marina Bay, Singapore",
            duration: "3 Days 2 Nights",
            capacity: "Max 10 Pax",
            facilityScore: 5,
            departureScore: 3,
            durationDays: 3,
            image: "https://images.unsplash.com/photo-1496939376851-89342e90adcd",
            desc: "Enjoy the futuristic skyline and world-class attractions of Singapore.",
            priceTiers: [
                { minPax: 1, maxPax: 3, price: 5500000, originalPrice: 6500000 },
                { minPax: 4, maxPax: 6, price: 5000000, originalPrice: 6000000 },
                { minPax: 7, maxPax: 10, price: 4500000, originalPrice: 5500000 }
            ]
        },
        {
            title: "Yogyakarta Heritage & Culture 2H1M",
            location: "Malioboro, Yogyakarta",
            duration: "2 Days 1 Night",
            capacity: "Max 30 Pax",
            facilityScore: 3,
            departureScore: 2,
            durationDays: 2,
            image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa",
            desc: "Affordable trip to the cultural heart of Java. Visit Borobudur and Malioboro.",
            priceTiers: [
                { minPax: 1, maxPax: 10, price: 1500000, originalPrice: 2000000 },
                { minPax: 11, maxPax: 20, price: 1200000, originalPrice: 1800000 },
                { minPax: 21, maxPax: 30, price: 1000000, originalPrice: 1500000 }
            ]
        }
    ];

    for (const pkg of packageItems) {
        console.log(`⏳ Seeding package: ${pkg.title}...`);
        const slug = pkg.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        await prisma.tourPackage.create({
            data: {
                slug,
                title: await toAutoMultiLang(pkg.title) as unknown as JsonValue,
                description: await toAutoMultiLang(pkg.desc) as unknown as JsonValue,
                location: await toAutoMultiLang(pkg.location) as unknown as JsonValue,
                duration: await toAutoMultiLang(pkg.duration) as unknown as JsonValue,
                capacity: await toAutoMultiLang(pkg.capacity) as unknown as JsonValue,
                facilityScore: pkg.facilityScore,
                departureScore: pkg.departureScore,
                durationDays: pkg.durationDays,
                images: [pkg.image] as unknown as JsonValue,
                isPublished: true,
                rating: 4.5 + Math.random() * 0.5,
                reviews: Math.floor(Math.random() * 100),
                priceTiers: {
                    create: pkg.priceTiers
                }
            },
        });
    }
    console.log("✅ All tour packages seeded");

    // 5. Seed Testimonials
    console.log("⏳ Seeding testimonials...");
    await prisma.testimonial.deleteMany({});
    const testimonialSource = [
        { name: "Jasurjon", role: "Backpacker", text: "Aplikasi ini sangat membantu saya dalam memilih paket wisata paling murah tapi durasinya mantap!" },
        { name: "Siti Rahayu", role: "Family Traveler", text: "Rekomendasi TOPSIS-nya akurat. Saya pilih paket Bali dan sangat puas dengan fasilitasnya." }
    ];
    for (const t of testimonialSource) {
        await prisma.testimonial.create({
            data: {
                name: t.name,
                role: await toAutoMultiLang(t.role) as unknown as JsonValue,
                text: await toAutoMultiLang(t.text) as unknown as JsonValue,
                avatar: `https://i.pravatar.cc/150?u=${t.name}`,
                rating: 5,
                isPublished: true,
            }
        });
    }
    console.log("🏁 Seeding completed successfully!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Seeding failed:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
