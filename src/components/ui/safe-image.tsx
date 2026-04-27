"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const ALLOWED_HOSTS = [
  "images.unsplash.com",
  "i.pravatar.cc",
  "lh3.googleusercontent.com",
];

function isOptimizable(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return ALLOWED_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

type SafeImageProps = Omit<ImageProps, "onError"> & {
  fallbackSrc?: string;
};

export default function SafeImage({ src, fallbackSrc = "/placeholder.jpg", alt, className, fill, width, height, sizes, priority, ...rest }: SafeImageProps) {
  const [error, setError] = useState(false);
  const srcStr = typeof src === "string" ? src : "";

  if (!srcStr || error || !isOptimizable(srcStr)) {
    const imgSrc = error ? fallbackSrc : (srcStr || fallbackSrc);
    return fill ? (
      <img src={imgSrc} alt={alt || ""} className={`absolute inset-0 w-full h-full ${className || ""}`} />
    ) : (
      <img src={imgSrc} alt={alt || ""} className={className} width={typeof width === "number" ? width : undefined} height={typeof height === "number" ? height : undefined} />
    );
  }

  return (
    <Image
      src={srcStr}
      alt={alt || ""}
      className={className}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
      {...rest}
    />
  );
}
