"use client";

import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TranslateButtonProps {
  isTranslating: boolean;
  onClick: () => void;
  /** Disables the button if source content is empty */
  disabled?: boolean;
}

/**
 * Reusable "Translate from English" button with spinner state.
 * Replaces the identical button JSX repeated across 5+ CMS form components.
 */
export function TranslateButton({ isTranslating, onClick, disabled }: TranslateButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isTranslating || disabled}
      className="gap-2 text-xs h-9 rounded-md border-primary-100 hover:bg-primary-50 hover:text-primary-600 transition-all"
    >
      {isTranslating ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-primary-500" />
      )}
      Translate from English
    </Button>
  );
}
