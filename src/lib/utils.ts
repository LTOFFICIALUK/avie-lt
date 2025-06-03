import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDateDiffInDays(date1: Date, date2: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  return Math.round(
    (Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()) -
      Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate())) /
      MS_PER_DAY
  );
}

export function getDateDiffInHours(date1: Date, date2: Date): number {
  const MS_PER_HOUR = 1000 * 60 * 60;

  return Math.round((date1.getTime() - date2.getTime()) / MS_PER_HOUR);
}

export function getDateDiffInMinutes(date1: Date, date2: Date): number {
  const MS_PER_MINUTE = 1000 * 60;

  return Math.round((date1.getTime() - date2.getTime()) / MS_PER_MINUTE);
}
