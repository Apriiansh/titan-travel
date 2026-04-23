"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Wallet, 
  Gem, 
  Clock, 
  Sun, 
  SunMedium, 
  Moon, 
  RotateCcw,
  Loader2,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { getPersonalizedRecommendations, UserPreference } from "@/lib/actions/recommendation";
import { useLocale } from "@/lib/LocaleContext";

const CONTENT = {
  id: {
    title: "Asisten Travel Pintar",
    subtitle: "Temukan paket paling pas dengan algoritma TOPSIS",
    step1: "1. Apa yang paling penting bagi Anda?",
    step2: "2. Kapan waktu keberangkatan yang Anda inginkan?",
    priorities: [
      { id: "price", label: "Harga Termurah", desc: "Fokus pada penghematan budget." },
      { id: "facility", label: "Fasilitas Mewah", desc: "Fokus pada kenyamanan & servis." },
      { id: "balanced", label: "Keseimbangan", desc: "Pilihan paling populer & adil." },
    ],
    times: [
      { id: 1, label: "Pagi Hari", desc: "06:00 - 10:00" },
      { id: 2, label: "Siang Hari", desc: "11:00 - 15:00" },
      { id: 3, label: "Malam Hari", desc: "18:00 - 22:00" },
    ],
    back: "Kembali",
    analyzing: "Menganalisis Paket...",
    comparing: "Membandingkan alternatif menggunakan kriteria TOPSIS",
    btnView: "Lihat Rekomendasi",
    found: "Rekomendasi Ditemukan!",
    foundDesc: (p: string, t: string) => `Berikut adalah paket yang paling sesuai dengan preferensi ${p} dan keberangkatan ${t}.`,
    searchAgain: "Cari lagi",
    priorityLabels: { price: "Hemat", facility: "Mewah", balanced: "Seimbang" },
    timeLabels: { 1: "Pagi", 2: "Siang", 3: "Malam" }
  },
  en: {
    title: "Smart Travel Assistant",
    subtitle: "Find the perfect package with TOPSIS algorithm",
    step1: "1. What is most important to you?",
    step2: "2. When would you like to depart?",
    priorities: [
      { id: "price", label: "Lowest Price", desc: "Focus on budget savings." },
      { id: "facility", label: "Luxury Facilities", desc: "Focus on comfort & service." },
      { id: "balanced", label: "Balanced", desc: "The most popular & fair choice." },
    ],
    times: [
      { id: 1, label: "Morning", desc: "06:00 - 10:00" },
      { id: 2, label: "Afternoon", desc: "11:00 - 15:00" },
      { id: 3, label: "Evening", desc: "18:00 - 22:00" },
    ],
    back: "Back",
    analyzing: "Analyzing Packages...",
    comparing: "Comparing alternatives using TOPSIS criteria",
    btnView: "View Recommendations",
    found: "Recommendation Found!",
    foundDesc: (p: string, t: string) => `Here are the packages that best match your ${p} preference and ${t} departure.`,
    searchAgain: "Search again",
    priorityLabels: { price: "Budget", facility: "Luxury", balanced: "Balanced" },
    timeLabels: { 1: "Morning", 2: "Afternoon", 3: "Evening" }
  },
  ms: {
    title: "Asisten Perjalanan Pintar",
    subtitle: "Cari pakej terbaik dengan algoritma TOPSIS",
    step1: "1. Apa yang paling penting bagi anda?",
    step2: "2. Bilakah masa berlepas yang anda inginkan?",
    priorities: [
      { id: "price", label: "Harga Terendah", desc: "Fokus pada penjimatan bajet." },
      { id: "facility", label: "Fasiliti Mewah", desc: "Fokus pada keselesaan & servis." },
      { id: "balanced", label: "Seimbang", desc: "Pilihan paling popular & adil." },
    ],
    times: [
      { id: 1, label: "Pagi", desc: "06:00 - 10:00" },
      { id: 2, label: "Tengah Hari", desc: "11:00 - 15:00" },
      { id: 3, label: "Malam", desc: "18:00 - 22:00" },
    ],
    back: "Kembali",
    analyzing: "Menganalisis Pakej...",
    comparing: "Membandingkan alternatif menggunakan kriteria TOPSIS",
    btnView: "Lihat Cadangan",
    found: "Cadangan Ditemui!",
    foundDesc: (p: string, t: string) => `Berikut adalah pakej yang paling sesuai dengan pilihan ${p} dan waktu berlepas ${t}.`,
    searchAgain: "Cari lagi",
    priorityLabels: { price: "Bajet", facility: "Mewah", balanced: "Seimbang" },
    timeLabels: { 1: "Pagi", 2: "Tengah Hari", 3: "Malam" }
  }
};

export default function RecommendationFinder({ onResult }: { onResult: (packages: any[]) => void }) {
  const { locale } = useLocale();
  const t = CONTENT[locale as keyof typeof CONTENT] || CONTENT.en;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pref, setPref] = useState<UserPreference>({
    priority: "balanced",
    prefTime: 1
  });

  const handleSearch = async () => {
    setLoading(true);
    setTimeout(async () => {
      const results = await getPersonalizedRecommendations(pref);
      onResult(results);
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  const reset = () => {
    setStep(1);
    onResult([]);
  };

  const PRIO_ICONS: Record<string, any> = { price: Wallet, facility: Gem, balanced: CheckCircle2 };
  const TIME_ICONS: Record<number, any> = { 1: Sun, 2: SunMedium, 3: Moon };

  return (
    <div className="w-full max-w-4xl mx-auto mb-16">
      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground font-(family-name:--font-playfair)">
                {t.title}
              </h3>
              <p className="text-xs text-foreground-secondary">
                {t.subtitle}
              </p>
            </div>
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <p className="text-sm font-semibold text-foreground mb-6">{t.step1}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {t.priorities.map((item) => {
                  const Icon = PRIO_ICONS[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPref({ ...pref, priority: item.id as any });
                        setStep(2);
                      }}
                      className={`p-6 rounded-xl border text-left transition-all group ${
                        pref.priority === item.id 
                        ? "border-primary-500 bg-primary-500/5 shadow-md" 
                        : "border-card-border bg-foreground/2 hover:border-primary-500/30"
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-4 transition-transform group-hover:scale-110 ${pref.priority === item.id ? "text-primary-500" : "text-foreground-secondary"}`} />
                      <p className="font-bold text-foreground mb-1">{item.label}</p>
                      <p className="text-[10px] text-foreground-secondary leading-relaxed">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <p className="text-sm font-semibold text-foreground mb-6">{t.step2}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {t.times.map((item) => {
                  const Icon = TIME_ICONS[item.id];
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setPref({ ...pref, prefTime: item.id });
                        setStep(3);
                      }}
                      className={`p-6 rounded-xl border text-left transition-all group ${
                        pref.prefTime === item.id 
                        ? "border-primary-500 bg-primary-500/5 shadow-md" 
                        : "border-card-border bg-foreground/2 hover:border-primary-500/30"
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-4 transition-transform group-hover:scale-110 ${pref.prefTime === item.id ? "text-primary-500" : "text-foreground-secondary"}`} />
                      <p className="font-bold text-foreground mb-1">{item.label}</p>
                      <p className="text-[10px] text-foreground-secondary leading-relaxed">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setStep(1)} className="mt-8 text-xs text-primary-500 flex items-center gap-1 hover:underline">
                <RotateCcw className="w-3 h-3" /> {t.back}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12 animate-in zoom-in-95 duration-500">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 border border-primary-500/20">
                  {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Sparkles className="w-10 h-10" />}
                </div>
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">{t.analyzing}</h4>
              <p className="text-sm text-foreground-secondary mb-8">{t.comparing}</p>
              {!loading && (
                <button
                  onClick={handleSearch}
                  className="px-8 py-3 rounded-full bg-primary-500 text-white font-bold hover:bg-primary-600 shadow-lg shadow-primary-500/25 flex items-center gap-2 mx-auto"
                >
                  {t.btnView}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-2">{t.found}</h4>
              <p className="text-sm text-foreground-secondary mb-8 text-center max-w-sm">
                {t.foundDesc(
                  t.priorityLabels[pref.priority as keyof typeof t.priorityLabels], 
                  t.timeLabels[pref.prefTime as keyof typeof t.timeLabels]
                )}
              </p>
              <button
                onClick={reset}
                className="text-xs text-foreground-secondary flex items-center gap-1 hover:text-primary-500 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> {t.searchAgain}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
