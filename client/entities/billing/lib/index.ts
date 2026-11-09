import { IBillingPrice } from "../model";

// Stripe keeps amounts in the smallest unit; Intl knows how many decimals each currency has
const majorUnits = (amount: number, currency: string) => {
  const digits =
    new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
  return amount / 10 ** digits;
};

export const formatPrice = (amount: number, currency: string, language: string) =>
  new Intl.NumberFormat(language, {
    style: "currency",
    currency: currency.toUpperCase(),
    // 99 kr rather than 99,00 kr; 9,50 € keeps its cents
    minimumFractionDigits: amount % 100 === 0 ? 0 : undefined,
  }).format(majorUnits(amount, currency.toUpperCase()));

// Stripe's checkout charges by where the buyer is; the browser's time zone is the nearest guess
// the page has. A currency the price doesn't have falls back to dollars, then to the price's own
const ZONE_CURRENCIES: Record<string, string> = {
  "Europe/Oslo": "nok",
  "Arctic/Longyearbyen": "nok",
  "Europe/Stockholm": "sek",
  "Europe/Copenhagen": "dkk",
  "Europe/London": "gbp",
  "Europe/Kyiv": "uah",
  "Europe/Kiev": "uah",
};

export const likelyCurrency = (timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) =>
  ZONE_CURRENCIES[timeZone] ?? (timeZone.startsWith("Europe/") ? "eur" : "usd");

export const priceIn = (price: IBillingPrice, currency: string) => {
  const amounts = price.amounts ?? { [price.currency]: price.amount };
  const code = [currency, "usd", price.currency].find((x) => amounts[x] !== undefined) ?? price.currency;
  return { amount: amounts[code] ?? price.amount, currency: code };
};

// How much a year saves against twelve months, in whole percent; null without both prices
export const yearlySaving = (prices: IBillingPrice[], currency: string) => {
  const monthPrice = prices.find((x) => x.interval === "Month");
  const yearPrice = prices.find((x) => x.interval === "Year");
  if (!monthPrice || !yearPrice) return null;

  const month = priceIn(monthPrice, currency);
  const year = priceIn(yearPrice, currency);
  if (month.currency !== year.currency) return null;

  const saving = Math.round((1 - year.amount / (month.amount * 12)) * 100);
  return saving > 0 ? saving : null;
};
