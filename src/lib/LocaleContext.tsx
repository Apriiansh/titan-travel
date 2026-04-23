"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    startTransition
} from "react";

export type Locale = "en" | "id" | "ms";

interface LocaleContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    // Helper to get string from { en, id, ms } object based on current locale
    dt: (data: Record<string, any> | string | unknown, fallback?: string) => string;
    // Helper to get the FULL locale sub-object (for nested arrays/objects like stats, services)
    dObj: <T = Record<string, any>>(data: Record<string, any> | null | undefined) => T;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
    // English is the primary source, but we can default to Indonesian for now 
    // depending on preference, user originally asked for ID fallback but english input in CMS.
    // Let's use 'en' as default or detect from browser later. For now 'id'.
    const [locale, setLocaleState] = useState<Locale>("en");

    const setLocale = (newLocale: Locale) => {
        startTransition(() => {
            setLocaleState(newLocale);
        });
    };

    // dt = Dynamic Translate helper (returns string)
    const dt = (data: Record<string, any> | string | unknown, fallback = ""): string => {
        if (!data) return fallback;
        if (typeof data === "string") return data;
        
        const obj = data as Record<string, any>;
        if (obj[locale]) return obj[locale];
        if (obj["en"]) return obj["en"]; // fallback to EN
        if (obj["id"]) return obj["id"]; // fallback to ID
        return fallback;
    };

    // dObj = Dynamic Object helper (returns full locale sub-object for nested data)
    const dObj = <T = Record<string, any>>(data: Record<string, any> | null | undefined): T => {
        if (!data) return {} as T;
        return (data[locale] ?? data["en"] ?? data["id"] ?? {}) as T;
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale, dt, dObj }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale(): LocaleContextValue {
    const ctx = useContext(LocaleContext);
    if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
    return ctx;
}

