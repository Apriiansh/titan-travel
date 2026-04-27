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
    slug: string;
    title: MultiLang;
    location: MultiLang;
    duration: MultiLang;
    desc: MultiLang;
    capacity: number;
    facilityScore: number;
    departureScore: number;
    durationDays: number;
    image: string;
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
            name: "Mint",
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
    await prisma.booking.deleteMany({});
    await prisma.priceTier.deleteMany({});
    await prisma.tourPackage.deleteMany({});
    
    const packageItems: PackageItem[] = [
        // ═══════════════════ DOMESTIK ═══════════════════
        {
            slug: "bali-spiritual-cultural-journey-4h3m",
            title: { en: "Bali Spiritual & Cultural Journey 4D3N", id: "Wisata Spiritual & Budaya Bali 4H3M", ms: "Lawatan Rohani & Budaya Bali 4H3M" },
            location: { en: "Ubud & Kuta, Bali", id: "Ubud & Kuta, Bali", ms: "Ubud & Kuta, Bali" },
            duration: { en: "4 Days 3 Nights", id: "4 Hari 3 Malam", ms: "4 Hari 3 Malam" },
            desc: { en: "Discover the soul of Bali through hidden temples, rice terraces, and world-class resorts.", id: "Temukan jiwa Bali melalui pura tersembunyi, terasering sawah, dan resort kelas dunia.", ms: "Temui jiwa Bali melalui kuil tersembunyi, teres padi, dan resort bertaraf dunia." },
            capacity: 20, facilityScore: 5, departureScore: 1, durationDays: 4,
            image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 5, price: 3500000, originalPrice: 4200000 },
                { minPax: 6, maxPax: 12, price: 3000000, originalPrice: 3800000 },
                { minPax: 13, maxPax: 20, price: 2500000, originalPrice: 3500000 },
            ],
        },
        {
            slug: "lombok-exotic-beach-tour-3h2m",
            title: { en: "Lombok Exotic Beach Tour 3D2N", id: "Wisata Pantai Eksotis Lombok 3H2M", ms: "Lawatan Pantai Eksotik Lombok 3H2M" },
            location: { en: "Mandalika, Lombok", id: "Mandalika, Lombok", ms: "Mandalika, Lombok" },
            duration: { en: "3 Days 2 Nights", id: "3 Hari 2 Malam", ms: "3 Hari 2 Malam" },
            desc: { en: "Explore pristine beaches and the unique Sasak culture of Lombok.", id: "Jelajahi pantai perawan dan budaya Sasak yang unik di Lombok.", ms: "Teroka pantai yang masih asli dan budaya Sasak yang unik di Lombok." },
            capacity: 15, facilityScore: 4, departureScore: 2, durationDays: 3,
            image: "https://images.unsplash.com/photo-1564221937071-06f02e8c0ba8?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 4, price: 2800000, originalPrice: 3500000 },
                { minPax: 5, maxPax: 10, price: 2400000, originalPrice: 3000000 },
                { minPax: 11, maxPax: 15, price: 2000000, originalPrice: 2800000 },
            ],
        },
        {
            slug: "yogyakarta-heritage-culture-2h1m",
            title: { en: "Yogyakarta Heritage & Culture 2D1N", id: "Wisata Warisan & Budaya Yogyakarta 2H1M", ms: "Lawatan Warisan & Budaya Yogyakarta 2H1M" },
            location: { en: "Malioboro, Yogyakarta", id: "Malioboro, Yogyakarta", ms: "Malioboro, Yogyakarta" },
            duration: { en: "2 Days 1 Night", id: "2 Hari 1 Malam", ms: "2 Hari 1 Malam" },
            desc: { en: "Visit the majestic Borobudur temple, stroll through Malioboro, and savor authentic Javanese cuisine.", id: "Kunjungi kemegahan Candi Borobudur, jalan-jalan di Malioboro, dan nikmati kuliner Jawa asli.", ms: "Lawati keagungan Candi Borobudur, berjalan-jalan di Malioboro, dan nikmati masakan Jawa asli." },
            capacity: 30, facilityScore: 3, departureScore: 2, durationDays: 2,
            image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 10, price: 1500000, originalPrice: 2000000 },
                { minPax: 11, maxPax: 20, price: 1200000, originalPrice: 1800000 },
                { minPax: 21, maxPax: 30, price: 1000000, originalPrice: 1500000 },
            ],
        },
        {
            slug: "bandung-highland-getaway-3h2m",
            title: { en: "Bandung Highland Getaway 3D2N", id: "Liburan Dataran Tinggi Bandung 3H2M", ms: "Percutian Tanah Tinggi Bandung 3H2M" },
            location: { en: "Lembang, Bandung", id: "Lembang, Bandung", ms: "Lembang, Bandung" },
            duration: { en: "3 Days 2 Nights", id: "3 Hari 2 Malam", ms: "3 Hari 2 Malam" },
            desc: { en: "Escape to the cool highlands of Bandung. Enjoy tea plantations, volcanic craters, and local culinary delights.", id: "Nikmati sejuknya dataran tinggi Bandung. Kunjungi kebun teh, kawah gunung, dan kuliner khas lokal.", ms: "Nikmati kesejukan tanah tinggi Bandung. Kunjungi ladang teh, kawah gunung berapi, dan kelazatan kuliner tempatan." },
            capacity: 20, facilityScore: 4, departureScore: 1, durationDays: 3,
            image: "https://images.unsplash.com/photo-1575986767340-5d17ae767ab0?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 5, price: 1800000, originalPrice: 2500000 },
                { minPax: 6, maxPax: 12, price: 1500000, originalPrice: 2200000 },
                { minPax: 13, maxPax: 20, price: 1200000, originalPrice: 1800000 },
            ],
        },
        {
            slug: "lampung-way-kambas-adventure-3h2m",
            title: { en: "Lampung Way Kambas Adventure 3D2N", id: "Petualangan Way Kambas Lampung 3H2M", ms: "Pengembaraan Way Kambas Lampung 3H2M" },
            location: { en: "Way Kambas, Lampung", id: "Way Kambas, Lampung", ms: "Way Kambas, Lampung" },
            duration: { en: "3 Days 2 Nights", id: "3 Hari 2 Malam", ms: "3 Hari 2 Malam" },
            desc: { en: "Get close with Sumatran elephants and explore the tropical rainforest of Way Kambas National Park.", id: "Berinteraksi dengan gajah Sumatera dan jelajahi hutan hujan tropis Taman Nasional Way Kambas.", ms: "Berinteraksi dengan gajah Sumatera dan teroka hutan hujan tropika Taman Negara Way Kambas." },
            capacity: 15, facilityScore: 3, departureScore: 2, durationDays: 3,
            image: "https://images.unsplash.com/photo-1581852017103-68ac65514cf7?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 5, price: 2200000, originalPrice: 2800000 },
                { minPax: 6, maxPax: 10, price: 1800000, originalPrice: 2400000 },
                { minPax: 11, maxPax: 15, price: 1500000, originalPrice: 2000000 },
            ],
        },
        {
            slug: "komodo-island-expedition-4h3m",
            title: { en: "Komodo Island Expedition 4D3N", id: "Ekspedisi Pulau Komodo 4H3M", ms: "Ekspedisi Pulau Komodo 4H3M" },
            location: { en: "Labuan Bajo, NTT", id: "Labuan Bajo, NTT", ms: "Labuan Bajo, NTT" },
            duration: { en: "4 Days 3 Nights", id: "4 Hari 3 Malam", ms: "4 Hari 3 Malam" },
            desc: { en: "Sail through the stunning Komodo islands. See the legendary dragons, dive at Pink Beach, and witness breathtaking sunsets.", id: "Berlayar menyusuri kepulauan Komodo yang memukau. Lihat komodo legendaris, selam di Pink Beach, dan saksikan sunset yang menakjubkan.", ms: "Belayar menyusuri kepulauan Komodo yang mempesonakan. Lihat komodo lagenda, selam di Pink Beach, dan saksikan matahari terbenam yang menakjubkan." },
            capacity: 12, facilityScore: 4, departureScore: 3, durationDays: 4,
            image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 4, price: 5500000, originalPrice: 6500000 },
                { minPax: 5, maxPax: 8, price: 4800000, originalPrice: 5800000 },
                { minPax: 9, maxPax: 12, price: 4200000, originalPrice: 5200000 },
            ],
        },
        // ═══════════════════ LUAR NEGERI ═══════════════════
        {
            slug: "kuala-lumpur-city-escape-4h3m",
            title: { en: "Kuala Lumpur City Escape 4D3N", id: "Jelajah Kota Kuala Lumpur 4H3M", ms: "Percutian Bandaraya Kuala Lumpur 4H3M" },
            location: { en: "Kuala Lumpur, Malaysia", id: "Kuala Lumpur, Malaysia", ms: "Kuala Lumpur, Malaysia" },
            duration: { en: "4 Days 3 Nights", id: "4 Hari 3 Malam", ms: "4 Hari 3 Malam" },
            desc: { en: "Shop at Bukit Bintang, visit the iconic Petronas Towers, and enjoy diverse Malaysian street food.", id: "Belanja di Bukit Bintang, kunjungi Menara Petronas yang ikonik, dan nikmati aneka street food Malaysia.", ms: "Membeli-belah di Bukit Bintang, melawat Menara Petronas yang ikonik, dan nikmati pelbagai makanan jalanan Malaysia." },
            capacity: 12, facilityScore: 4, departureScore: 1, durationDays: 4,
            image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 4, price: 4500000, originalPrice: 5200000 },
                { minPax: 5, maxPax: 8, price: 4000000, originalPrice: 4700000 },
                { minPax: 9, maxPax: 12, price: 3500000, originalPrice: 4200000 },
            ],
        },
        {
            slug: "singapore-modern-vibes-3h2m",
            title: { en: "Singapore Modern Vibes 3D2N", id: "Nuansa Modern Singapura 3H2M", ms: "Suasana Moden Singapura 3H2M" },
            location: { en: "Marina Bay, Singapore", id: "Marina Bay, Singapura", ms: "Marina Bay, Singapura" },
            duration: { en: "3 Days 2 Nights", id: "3 Hari 2 Malam", ms: "3 Hari 2 Malam" },
            desc: { en: "Experience the futuristic skyline at Marina Bay, ride the Singapore Flyer, and explore Gardens by the Bay.", id: "Rasakan suasana futuristik di Marina Bay, naik Singapore Flyer, dan jelajahi Gardens by the Bay.", ms: "Rasai suasana futuristik di Marina Bay, naik Singapore Flyer, dan teroka Gardens by the Bay." },
            capacity: 10, facilityScore: 5, departureScore: 3, durationDays: 3,
            image: "https://images.unsplash.com/photo-1496939376851-89342e90adcd?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 3, price: 5500000, originalPrice: 6500000 },
                { minPax: 4, maxPax: 6, price: 5000000, originalPrice: 6000000 },
                { minPax: 7, maxPax: 10, price: 4500000, originalPrice: 5500000 },
            ],
        },
        {
            slug: "bangkok-pattaya-adventure-5h4m",
            title: { en: "Bangkok & Pattaya Adventure 5D4N", id: "Petualangan Bangkok & Pattaya 5H4M", ms: "Pengembaraan Bangkok & Pattaya 5H4M" },
            location: { en: "Bangkok & Pattaya, Thailand", id: "Bangkok & Pattaya, Thailand", ms: "Bangkok & Pattaya, Thailand" },
            duration: { en: "5 Days 4 Nights", id: "5 Hari 4 Malam", ms: "5 Hari 4 Malam" },
            desc: { en: "Explore the Grand Palace, float through Damnoen Saduak market, and enjoy the vibrant nightlife of Pattaya.", id: "Jelajahi Grand Palace, susuri pasar terapung Damnoen Saduak, dan nikmati kehidupan malam Pattaya yang meriah.", ms: "Teroka Grand Palace, menyusuri pasar terapung Damnoen Saduak, dan nikmati kehidupan malam Pattaya yang meriah." },
            capacity: 15, facilityScore: 4, departureScore: 2, durationDays: 5,
            image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 4, price: 5800000, originalPrice: 7000000 },
                { minPax: 5, maxPax: 10, price: 5200000, originalPrice: 6500000 },
                { minPax: 11, maxPax: 15, price: 4600000, originalPrice: 5800000 },
            ],
        },
        {
            slug: "tokyo-osaka-japan-highlights-7h6m",
            title: { en: "Tokyo & Osaka Japan Highlights 7D6N", id: "Highlights Jepang Tokyo & Osaka 7H6M", ms: "Sorotan Jepun Tokyo & Osaka 7H6M" },
            location: { en: "Tokyo & Osaka, Japan", id: "Tokyo & Osaka, Jepang", ms: "Tokyo & Osaka, Jepun" },
            duration: { en: "7 Days 6 Nights", id: "7 Hari 6 Malam", ms: "7 Hari 6 Malam" },
            desc: { en: "Visit Mt. Fuji, explore Shibuya & Akihabara, ride the bullet train, and taste authentic ramen in Osaka.", id: "Kunjungi Gunung Fuji, jelajahi Shibuya & Akihabara, naik kereta peluru, dan rasakan ramen asli di Osaka.", ms: "Lawati Gunung Fuji, teroka Shibuya & Akihabara, naik kereta peluru, dan rasa ramen asli di Osaka." },
            capacity: 10, facilityScore: 5, departureScore: 3, durationDays: 7,
            image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 3, price: 15000000, originalPrice: 18000000 },
                { minPax: 4, maxPax: 6, price: 13500000, originalPrice: 16000000 },
                { minPax: 7, maxPax: 10, price: 12000000, originalPrice: 14500000 },
            ],
        },
        {
            slug: "seoul-nami-korea-delight-5h4m",
            title: { en: "Seoul & Nami Korea Delight 5D4N", id: "Pesona Korea Seoul & Nami 5H4M", ms: "Keindahan Korea Seoul & Nami 5H4M" },
            location: { en: "Seoul & Nami Island, South Korea", id: "Seoul & Pulau Nami, Korea Selatan", ms: "Seoul & Pulau Nami, Korea Selatan" },
            duration: { en: "5 Days 4 Nights", id: "5 Hari 4 Malam", ms: "5 Hari 4 Malam" },
            desc: { en: "Visit Gyeongbokgung Palace, stroll the trendy streets of Myeongdong, and enjoy the scenic beauty of Nami Island.", id: "Kunjungi Istana Gyeongbokgung, jalan-jalan di Myeongdong yang trendi, dan nikmati keindahan Pulau Nami.", ms: "Lawati Istana Gyeongbokgung, berjalan-jalan di Myeongdong yang bergaya, dan nikmati keindahan Pulau Nami." },
            capacity: 12, facilityScore: 5, departureScore: 2, durationDays: 5,
            image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 4, price: 12000000, originalPrice: 14000000 },
                { minPax: 5, maxPax: 8, price: 10500000, originalPrice: 12500000 },
                { minPax: 9, maxPax: 12, price: 9500000, originalPrice: 11500000 },
            ],
        },
        // ═══════════════════ ROMBONGAN / CUSTOM ═══════════════════
        {
            slug: "study-tour-jogja-solo-3h2m",
            title: { en: "Study Tour Jogja & Solo 3D2N", id: "Study Tour Jogja & Solo 3H2M", ms: "Lawatan Pelajar Jogja & Solo 3H2M" },
            location: { en: "Yogyakarta & Solo, Central Java", id: "Yogyakarta & Solo, Jawa Tengah", ms: "Yogyakarta & Solo, Jawa Tengah" },
            duration: { en: "3 Days 2 Nights", id: "3 Hari 2 Malam", ms: "3 Hari 2 Malam" },
            desc: { en: "Educational tour for students covering Borobudur, Prambanan, Keraton Solo, and batik workshops.", id: "Wisata edukatif untuk pelajar mencakup Borobudur, Prambanan, Keraton Solo, dan workshop batik.", ms: "Lawatan pendidikan untuk pelajar merangkumi Borobudur, Prambanan, Keraton Solo, dan bengkel batik." },
            capacity: 50, facilityScore: 3, departureScore: 1, durationDays: 3,
            image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 15, price: 1800000, originalPrice: 2200000 },
                { minPax: 16, maxPax: 30, price: 1500000, originalPrice: 1900000 },
                { minPax: 31, maxPax: 50, price: 1200000, originalPrice: 1600000 },
            ],
        },
        {
            slug: "corporate-outing-bali-3h2m",
            title: { en: "Corporate Outing Bali 3D2N", id: "Outing Kantor Bali 3H2M", ms: "Outing Korporat Bali 3H2M" },
            location: { en: "Nusa Dua, Bali", id: "Nusa Dua, Bali", ms: "Nusa Dua, Bali" },
            duration: { en: "3 Days 2 Nights", id: "3 Hari 2 Malam", ms: "3 Hari 2 Malam" },
            desc: { en: "Team building at a luxury resort. Includes ATV ride, beach games, gala dinner, and custom itinerary.", id: "Team building di resort mewah. Termasuk ATV ride, beach games, gala dinner, dan itinerary custom.", ms: "Pembinaan pasukan di resort mewah. Termasuk ATV, permainan pantai, makan malam gala, dan itinerari tersuai." },
            capacity: 40, facilityScore: 5, departureScore: 1, durationDays: 3,
            image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 10, price: 4500000, originalPrice: 5500000 },
                { minPax: 11, maxPax: 25, price: 3800000, originalPrice: 4800000 },
                { minPax: 26, maxPax: 40, price: 3200000, originalPrice: 4200000 },
            ],
        },
        // ═══════════════════ TIKET + HOTEL ═══════════════════
        {
            slug: "singapore-flight-hotel-package-3h2m",
            title: { en: "Singapore Flight + Hotel Package 3D2N", id: "Paket Tiket + Hotel Singapura 3H2M", ms: "Pakej Tiket + Hotel Singapura 3H2M" },
            location: { en: "Orchard, Singapore", id: "Orchard, Singapura", ms: "Orchard, Singapura" },
            duration: { en: "3 Days 2 Nights", id: "3 Hari 2 Malam", ms: "3 Hari 2 Malam" },
            desc: { en: "Round-trip flight and 4-star hotel in Orchard Road. Free to explore Singapore at your own pace.", id: "Tiket pesawat PP dan hotel bintang 4 di Orchard Road. Bebas menjelajah Singapura sesuka hati.", ms: "Tiket penerbangan pergi-balik dan hotel 4 bintang di Orchard Road. Bebas meneroka Singapura mengikut kesesuaian anda." },
            capacity: 8, facilityScore: 4, departureScore: 2, durationDays: 3,
            image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 2, price: 4200000, originalPrice: 5000000 },
                { minPax: 3, maxPax: 5, price: 3800000, originalPrice: 4500000 },
                { minPax: 6, maxPax: 8, price: 3500000, originalPrice: 4200000 },
            ],
        },
        {
            slug: "kuala-lumpur-flight-hotel-3h2m",
            title: { en: "KL Flight + Hotel Combo 3D2N", id: "Paket Tiket + Hotel KL 3H2M", ms: "Pakej Tiket + Hotel KL 3H2M" },
            location: { en: "KLCC, Kuala Lumpur", id: "KLCC, Kuala Lumpur", ms: "KLCC, Kuala Lumpur" },
            duration: { en: "3 Days 2 Nights", id: "3 Hari 2 Malam", ms: "3 Hari 2 Malam" },
            desc: { en: "Round-trip flight and central hotel near KLCC. Perfect for independent travelers who love shopping and food.", id: "Tiket pesawat PP dan hotel pusat kota dekat KLCC. Cocok untuk traveler mandiri yang suka belanja dan kuliner.", ms: "Tiket penerbangan pergi-balik dan hotel pusat bandar berhampiran KLCC. Sesuai untuk pelancong bebas yang suka membeli-belah dan makan." },
            capacity: 8, facilityScore: 4, departureScore: 1, durationDays: 3,
            image: "https://images.unsplash.com/photo-1508913599540-3d0e60c24e2a?auto=format&fit=crop&w=1600&q=80",
            priceTiers: [
                { minPax: 1, maxPax: 2, price: 3500000, originalPrice: 4200000 },
                { minPax: 3, maxPax: 5, price: 3000000, originalPrice: 3800000 },
                { minPax: 6, maxPax: 8, price: 2800000, originalPrice: 3500000 },
            ],
        },
    ];

    for (const pkg of packageItems) {
        console.log(`⏳ Seeding package: ${pkg.title.id}...`);
        await prisma.tourPackage.create({
            data: {
                slug: pkg.slug,
                title: pkg.title as unknown as JsonValue,
                description: pkg.desc as unknown as JsonValue,
                location: pkg.location as unknown as JsonValue,
                duration: pkg.duration as unknown as JsonValue,
                capacity: pkg.capacity,
                facilityScore: pkg.facilityScore,
                departureScore: pkg.departureScore,
                durationDays: pkg.durationDays,
                images: [pkg.image] as unknown as JsonValue,
                isPublished: true,
                rating: 4.5 + Math.random() * 0.5,
                reviews: Math.floor(20 + Math.random() * 180),
                priceTiers: {
                    create: pkg.priceTiers,
                },
            },
        });
    }
    console.log("✅ All tour packages seeded");

    // 5. Seed Testimonials
    console.log("⏳ Seeding testimonials...");
    await prisma.testimonial.deleteMany({});
    const testimonialSource = [
        { name: "Sujaina", role: "Backpacker", text: "Travel nya bagus, menganggap pelanggan seperti saudara, sdh 3 kali pakai jasa titan travel tidak pernah mengecewakan, guide nya ramah2, harga jauh lebih murah dbanding travel lain." },
        { name: "Lia Lia", role: "Family Traveler", text: "Sangat keren banget titan travel love banget pokoknya the best semua." },
        { name: "Erda Yanti Bunda Naura", role: "Traveler", text: "Bagus tempat nya mudah dicari, sesuai maps, karyawannya ramah2 enak diajak ngobrol dan tanya2 , terimaksih titan👍." },
        { name: "Kicau Mania", role: "Dao Cultivator", text: "Gokils" }
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
    // 6. Seed Gallery Images
    console.log("⏳ Seeding gallery images...");
    await prisma.galeryImage.deleteMany({});

    const galleryItems = [
        {
            imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
            titleEn: "Bali Temple at Sunset",
            categoryEn: "Bali",
        },
        {
            imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1600&q=80",
            titleEn: "Rice Terraces of Ubud",
            categoryEn: "Bali",
        },
        {
            imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=80",
            titleEn: "Petronas Twin Towers",
            categoryEn: "Malaysia",
        },
        {
            imageUrl: "https://images.unsplash.com/photo-1496939376851-89342e90adcd?auto=format&fit=crop&w=1600&q=80",
            titleEn: "Marina Bay Sands Skyline",
            categoryEn: "Singapore",
        },
        {
            imageUrl: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1600&q=80",
            titleEn: "Borobudur at Dawn",
            categoryEn: "Yogyakarta",
        },
        {
            imageUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1600&q=80",
            titleEn: "Komodo Island Paradise",
            categoryEn: "NTT",
        },
        {
            imageUrl: "https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?auto=format&fit=crop&w=1600&q=80",
            titleEn: "Tropical Beach Escape",
            categoryEn: "Lombok",
        },
        {
            imageUrl: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1600&q=80",
            titleEn: "Overwater Bungalow Retreat",
            categoryEn: "Maldives",
        },
    ];

    for (const item of galleryItems) {
        const title = await toAutoMultiLang(item.titleEn);
        const category = await toAutoMultiLang(item.categoryEn);
        await prisma.galeryImage.create({
            data: {
                imageUrl: item.imageUrl,
                title: title as unknown as JsonValue,
                category: category as unknown as JsonValue,
            },
        });
    }
    console.log("✅ Gallery images seeded");

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
