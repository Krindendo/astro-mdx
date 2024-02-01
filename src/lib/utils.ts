import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const IS_SERVER = typeof window === "undefined";

export function getProtocol() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return "https";
  }
  return "http";
}

export function getBaseUrl() {
  if (!IS_SERVER) {
    return location.origin;
  }

  const protocol = getProtocol();
  return `${protocol}://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
}

export function getAbsoluteUrl(path: string) {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}
