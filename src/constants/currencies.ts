export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
};

export const getCurrencyLabel = (code: Currency): string =>
  `${code} (${CURRENCY_SYMBOLS[code]})`;

export const getDefaultCurrencyLabel = (code?: string): string =>
  getCurrencyLabel(
    (code && CURRENCIES.includes(code as Currency) ? code : 'USD') as Currency
  );
