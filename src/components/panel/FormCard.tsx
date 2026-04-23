"use client";

import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

interface FormCardProps {
  title?: string;
  icon?: ElementType;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable card wrapper for admin form sections.
 * Replaces the repeated `rounded-md border border-card-border bg-card-bg shadow-sm p-6` pattern.
 */
export function FormCard({ title, icon: Icon, children, className }: FormCardProps) {
  return (
    <div className={cn("rounded-md border border-card-border bg-card-bg shadow-sm p-6 space-y-6", className)}>
      {(title || Icon) && (
        <div className="flex items-center gap-2 mb-2">
          {Icon && (
            <div className="p-2 bg-primary-500/10 rounded-md">
              <Icon className="w-4 h-4 text-primary-500" />
            </div>
          )}
          {title && (
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
