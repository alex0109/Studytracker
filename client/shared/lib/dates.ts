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

// The days of a month laid out in full weeks, so it also shows the edges of the months around it
export const monthGridIso = (iso: string) => {
  const first = startOfWeekIso(startOfMonthIso(iso));
  const last = addDaysIso(startOfWeekIso(endOfMonthIso(iso)), 6);
  const days: string[] = [];
  for (let day = first; day <= last; day = addDaysIso(day, 1)) days.push(day);
  return days;
};

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
