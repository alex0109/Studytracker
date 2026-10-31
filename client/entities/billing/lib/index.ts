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

// How much a year saves against twelve months, in whole percent; null without both prices
export const yearlySaving = (prices: IBillingPrice[]) => {
  const month = prices.find((x) => x.interval === "Month");
  const year = prices.find((x) => x.interval === "Year");
  if (!month || !year || month.currency !== year.currency) return null;

  const saving = Math.round((1 - year.amount / (month.amount * 12)) * 100);
  return saving > 0 ? saving : null;
};
