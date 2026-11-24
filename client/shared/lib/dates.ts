// A calendar date has no time and no zone, so it travels as "yyyy-MM-dd" and is only turned into a
// Date at local midnight to read it. new Date("2026-11-05") would be UTC and show the 4th west of it
export const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const fromIsoDate = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const todayIso = () => toIsoDate(new Date());

export const addDaysIso = (iso: string, days: number) => {
  const date = fromIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
};

export const addMonthsIso = (iso: string, months: number) => {
  const date = fromIsoDate(iso);
  const day = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + months);
  // The 31st of a shorter month stays in that month
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(day, lastDay));
  return toIsoDate(date);
};

// Weeks start on Monday in all the site's languages
export const startOfWeekIso = (iso: string) => addDaysIso(iso, -((fromIsoDate(iso).getDay() + 6) % 7));

export const startOfMonthIso = (iso: string) => `${iso.slice(0, 7)}-01`;

export const endOfMonthIso = (iso: string) => {
  const date = fromIsoDate(iso);
  return toIsoDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
};

// Every day from one to the other, both included
export const daysBetweenIso = (from: string, to: string) => {
  const days: string[] = [];
  for (let day = from; day <= to; day = addDaysIso(day, 1)) days.push(day);
  return days;
};

// The days of a month laid out in full weeks, so it also shows the edges of the months around it
export const monthGridIso = (iso: string) =>
  daysBetweenIso(startOfWeekIso(startOfMonthIso(iso)), addDaysIso(startOfWeekIso(endOfMonthIso(iso)), 6));

// Short names of the weekdays from Monday, in the language of the page
export const weekdayNames = (language: string, width: "narrow" | "short" = "short") => {
  const format = new Intl.DateTimeFormat(language, { weekday: width });
  // 2 November 2026 is a Monday
  return Array.from({ length: 7 }, (_, index) => format.format(new Date(2026, 10, 2 + index)));
};

export const formatIsoDate = (iso: string, language: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(language, options).format(fromIsoDate(iso));

export const formatFullDate = (iso: string, language: string) =>
  formatIsoDate(iso, language, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// "in 3 hours", "in 2 days": when something comes back, with the language's own plural rules
export const formatTimeUntil = (when: Date | string, language: string, now = Date.now()) => {
  const format = new Intl.RelativeTimeFormat(language, { numeric: "auto" });
  const diff = new Date(when).getTime() - now;

  return diff < DAY
    ? format.format(Math.max(1, Math.round(diff / HOUR)), "hour")
    : format.format(Math.round(diff / DAY), "day");
};

// A moment with its time, "5 Nov 2026, 14:30" by default, in the page's language
export const formatDateTime = (
  when: Date | string,
  language: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" },
) => new Date(when).toLocaleString(language, options);

// A day of a moment, "5 November 2026" by default, in the page's language
export const formatDate = (
  when: Date | string,
  language: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
) => new Date(when).toLocaleDateString(language, options);
