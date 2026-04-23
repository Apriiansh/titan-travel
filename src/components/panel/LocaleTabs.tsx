"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranslateButton } from "@/components/panel/TranslateButton";
import { LOCALE_LABELS, type Locale } from "@/lib/types/cms";

interface LocaleTabsProps {
  /** Called when the user clicks "Translate from English" */
  onTranslate: () => void;
  isTranslating: boolean;
  /** Disable translate button when EN source is empty */
  canTranslate?: boolean;
  /** Render prop: receives the current locale and renders the tab content */
  children: (lang: Locale) => React.ReactNode;
}

/**
 * Reusable locale tabs wrapper for EN / ID / MS form sections.
 * Includes the TranslateButton in the header. Replaces identical Tabs
 * markup in HeroForm, AboutForm, ContactForm, GlobalSettingsForm.
 */
export function LocaleTabs({
  onTranslate,
  isTranslating,
  canTranslate = true,
  children,
}: LocaleTabsProps) {
  const locales: Locale[] = ["en", "id", "ms"];

  return (
    <Tabs defaultValue="en" className="w-full">
      <div className="flex items-center justify-between mb-2">
        <TabsList className="grid w-[400px] grid-cols-3 bg-muted/50 p-1 rounded-md">
          {locales.map((lang) => (
            <TabsTrigger key={lang} value={lang} className="rounded-sm">
              {LOCALE_LABELS[lang]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TranslateButton
          isTranslating={isTranslating}
          onClick={onTranslate}
          disabled={!canTranslate}
        />
      </div>

      {locales.map((lang) => (
        <TabsContent
          key={lang}
          value={lang}
          className="mt-0 space-y-4 animate-in fade-in-50 duration-300"
        >
          {children(lang)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
