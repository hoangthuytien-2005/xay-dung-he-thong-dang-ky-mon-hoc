import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export const DAY_NAMES: Record<number, string> = {
  2: "Thứ 2",
  3: "Thứ 3",
  4: "Thứ 4",
  5: "Thứ 5",
  6: "Thứ 6",
  7: "Thứ 7",
  8: "Chủ nhật",
};

export const PERIOD_TIMES: Record<number, { start: string; end: string }> = {
  1: { start: "07:00", end: "07:50" },
  2: { start: "08:00", end: "08:50" },
  3: { start: "09:00", end: "09:50" },
  4: { start: "10:00", end: "10:50" },
  5: { start: "11:00", end: "11:50" },
  6: { start: "12:30", end: "13:20" },
  7: { start: "13:30", end: "14:20" },
  8: { start: "14:30", end: "15:20" },
  9: { start: "15:30", end: "16:20" },
  10: { start: "16:30", end: "17:20" },
  11: { start: "18:00", end: "18:50" },
  12: { start: "19:00", end: "19:50" },
};
