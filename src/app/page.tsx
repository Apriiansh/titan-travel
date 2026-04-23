import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import PackagesSection from "@/components/PackagesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { getPersonalizedRecommendations } from "@/lib/actions/recommendation";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch from DB
  const [settings, testimonials, gallery, rankedPackages] = await Promise.all([
    prisma.setting.findMany(),
    prisma.testimonial.findMany({ where: { isPublished: true } }),
    prisma.galeryImage.findMany(),
    getPersonalizedRecommendations({ priority: "balanced", prefTime: 1 })
  ]);

  const getSetting = (key: string) => settings.find(s => s.key === key)?.value || {};

  // rankedPackages already has serialized prices and topsisScore from the action
  const packages = rankedPackages.slice(0, 6);

  return (
    <>
      <Navbar data={getSetting("navbar")} />
      <main>
        <HeroSection data={getSetting("hero")} />
        <AboutSection data={getSetting("about")} />
        <ServicesSection data={getSetting("services")} />
        <PackagesSection dbData={packages} settingsData={getSetting("packages")} />
        <TestimonialsSection dbData={testimonials} settingsData={getSetting("testimonials")} />
        <GallerySection dbData={gallery} settingsData={getSetting("gallery")} />
        <ContactSection data={getSetting("contact")} packages={packages} />
      </main>
      <Footer data={getSetting("footer")} />
    </>
  );
}
