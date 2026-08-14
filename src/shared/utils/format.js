/* global Intl */

export const localeFor = (lang) => (lang === 'ar' ? 'ar-SA' : 'en-US');

/**
 * Convert Western numerals to Eastern Arabic numerals (٠١٢٣٤٥٦٧٨٩)
 */
const toArabicNumerals = (str) => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/\d/g, (digit) => arabicNumerals[digit]);
};

/**
 * Convert Eastern Arabic numerals back to Western numerals
 */
const toWesternNumerals = (str) => {
  const arabicToWestern = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    '٬': ',', // Arabic thousands separator to Western comma
    '٫': '.', // Arabic decimal point to Western period
  };
  return str.replace(/[٠-٩٬٫]/g, (char) => arabicToWestern[char]);
};

/**
 * Format a number with proper localization
 * English: 1,000.50
 * Arabic: ١٬٠٠٠٫٥٠ (default with Arabic numerals) or 1٬000٫50 (with useArabicNumerals: false)
 */
export const number = (value, lang, useArabicNumerals = lang === 'ar') => {
  const formatted = new Intl.NumberFormat(localeFor(lang)).format(value);
  if (lang === 'ar' && !useArabicNumerals) {
    return toWesternNumerals(formatted);
  }
  if (lang === 'ar' && useArabicNumerals) {
    return toArabicNumerals(formatted);
  }
  return formatted;
};

/**
 * Format a decimal number with up to 1 decimal place
 * English: 2.5 sessions
 * Arabic: ٢٫٥ جلسات
 */
export const decimal = (value, lang, useArabicNumerals = lang === 'ar') => {
  const formatted = new Intl.NumberFormat(localeFor(lang), { maximumFractionDigits: 1 }).format(value);
  if (lang === 'ar' && !useArabicNumerals) {
    return toWesternNumerals(formatted);
  }
  if (lang === 'ar' && useArabicNumerals) {
    return toArabicNumerals(formatted);
  }
  return formatted;
};

/**
 * Format a percentage
 * English: 15.5%
 * Arabic: ١٥٫٥٪
 */
export const percentage = (value, lang, decimals = 1, useArabicNumerals = lang === 'ar') => {
  const formatted = new Intl.NumberFormat(localeFor(lang), {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
  const withPercent = `${formatted}%`;
  if (lang === 'ar' && !useArabicNumerals) {
    return toWesternNumerals(withPercent);
  }
  if (lang === 'ar' && useArabicNumerals) {
    return toArabicNumerals(withPercent);
  }
  return withPercent;
};

/**
 * Format currency amount
 * English: $1,234.50
 * Arabic: ١٬٢٣٤٫٥٠ ر.س
 */
export const currency = (value, lang, currency = 'USD', useArabicNumerals = lang === 'ar') => {
  const formatted = new Intl.NumberFormat(localeFor(lang), {
    style: 'currency',
    currency: currency,
  }).format(value);
  if (lang === 'ar' && !useArabicNumerals) {
    return toWesternNumerals(formatted);
  }
  if (lang === 'ar' && useArabicNumerals) {
    return toArabicNumerals(formatted);
  }
  return formatted;
};

/**
 * Format a date
 * English: Jan 15, 2024
 * Arabic: ١٥ يناير ٢٠٢٤
 */
export const date = (
  value,
  lang,
  opts = { year: 'numeric', month: 'short', day: 'numeric' },
  useArabicNumerals = lang === 'ar',
) => {
  const formatted = new Intl.DateTimeFormat(localeFor(lang), opts).format(
    new Date(`${value}${value.length === 10 ? 'T00:00:00Z' : ''}`),
  );
  if (lang === 'ar' && !useArabicNumerals) {
    return toWesternNumerals(formatted);
  }
  if (lang === 'ar' && useArabicNumerals) {
    return toArabicNumerals(formatted);
  }
  return formatted;
};

/**
 * Format a full date-time
 * English: Mon, Jan 15, 02:30 PM
 * Arabic: الاثنين، ١٥ يناير، ٠٢:٣٠ م
 */
export const dateTime = (value, lang, useArabicNumerals = lang === 'ar') => {
  const formatted = new Intl.DateTimeFormat(localeFor(lang), {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
  if (lang === 'ar' && !useArabicNumerals) {
    return toWesternNumerals(formatted);
  }
  if (lang === 'ar' && useArabicNumerals) {
    return toArabicNumerals(formatted);
  }
  return formatted;
};

/**
 * Format a long date (with full month name and day of week)
 * English: Monday, January 15, 2024
 * Arabic: الاثنين، 15 يناير 2024
 */
export const dateFullFormat = (value, lang, useArabicNumerals = lang === 'ar') => {
  const formatted = new Intl.DateTimeFormat(localeFor(lang), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
  if (lang === 'ar' && !useArabicNumerals) {
    return toWesternNumerals(formatted);
  }
  if (lang === 'ar' && useArabicNumerals) {
    return toArabicNumerals(formatted);
  }
  return formatted;
};

/**
 * Format time only
 * English: 02:30 PM
 * Arabic: ٠٢:٣٠ م
 */
export const time = (value, lang, useArabicNumerals = lang === 'ar') => {
  const formatted = new Intl.DateTimeFormat(localeFor(lang), {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value));
  if (lang === 'ar' && !useArabicNumerals) {
    return toWesternNumerals(formatted);
  }
  if (lang === 'ar' && useArabicNumerals) {
    return toArabicNumerals(formatted);
  }
  return formatted;
};
