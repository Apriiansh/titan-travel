"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    startTransition,
} from "react";
import { translations, Locale } from "./translations";

// Use the union of both locale shapes — TypeScript will handle narrowing at use sites
type LocaleTranslations = typeof translations[Locale];

interface LocaleContextValue {
    locale: Locale;
    t: LocaleTranslations;
    setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("id");

    const setLocale = (newLocale: Locale) => {
        startTransition(() => {
            setLocaleState(newLocale);
        });
    };

    return (
        <LocaleContext.Provider value={{ locale, t: translations[locale], setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale(): LocaleContextValue {
    const ctx = useContext(LocaleContext);
    if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
    return ctx;
}
