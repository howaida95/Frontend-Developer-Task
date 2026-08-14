import { describe, it, expect } from 'vitest';
import { number, decimal, percentage, currency, date, dateTime, dateFullFormat, time } from '@shared/utils/format';

describe('number formatting with localization', () => {
  it('formats numbers in English with comma separators', () => {
    expect(number(1000, 'en')).toBe('1,000');
    expect(number(1234567, 'en')).toBe('1,234,567');
  });

  it('formats numbers in Arabic with Arabic numerals', () => {
    const arabicNumber = number(1000, 'ar');
    expect(arabicNumber).toContain('٠'); // Should contain Arabic numeral
    expect(arabicNumber).toContain('١'); // Should contain Arabic 1
  });

  it('formats decimals in English', () => {
    expect(decimal(2.5, 'en')).toBe('2.5');
    expect(decimal(1000.75, 'en')).toBe('1,000.8'); // Rounded to 1 decimal place
  });

  it('formats decimals in Arabic with Arabic numerals', () => {
    const arabicDecimal = decimal(2.5, 'ar');
    expect(arabicDecimal).toContain('٢'); // Should contain Arabic numeral
  });

  it('formats percentages in English', () => {
    expect(percentage(15.5, 'en')).toBe('15.5%');
    expect(percentage(100, 'en')).toBe('100.0%');
  });

  it('formats percentages in Arabic with Arabic numerals', () => {
    const arabicPercentage = percentage(15.5, 'ar');
    expect(arabicPercentage).toContain('١'); // Should contain Arabic numerals
    expect(arabicPercentage).toContain('%'); // Standard percent sign
  });

  it('can disable Arabic numerals when requested', () => {
    // When useArabicNumerals is false, should return Western numerals
    const englishNumber = number(1000, 'en', false);
    expect(englishNumber).toBe('1,000');
    // English locale always uses Western numerals regardless
    const arabicWithWestern = number(1000, 'ar', false);
    expect(arabicWithWestern).toBe('1,000');
  });

  it('formats currency in English', () => {
    const usd = currency(1234.56, 'en', 'USD');
    expect(usd).toContain('$');
    expect(usd).toContain('1,234.56');
  });

  it('formats currency in Arabic with Arabic numerals', () => {
    const sar = currency(1234.56, 'ar', 'SAR');
    expect(sar).toBeTruthy();
    // The format should contain Arabic numerals
    expect(sar).toMatch(/[٠-٩]/);
  });
});

describe('date formatting with localization', () => {
  const testDate = '2024-01-15';
  const testDateTime = '2024-01-15T14:30:00Z';

  it('formats dates in English', () => {
    const formatted = date(testDate, 'en');
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
  });

  it('formats dates in Arabic', () => {
    const formatted = date(testDate, 'ar');
    expect(formatted).toBeTruthy();
    // Should contain month name in Arabic or date representation
  });

  it('formats date-time in English', () => {
    const formatted = dateTime(testDateTime, 'en');
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
  });

  it('formats date-time in Arabic', () => {
    const formatted = dateTime(testDateTime, 'ar');
    expect(formatted).toBeTruthy();
  });

  it('formats full date in English', () => {
    const formatted = dateFullFormat(testDate, 'en');
    expect(formatted).toContain('January');
    expect(formatted).toContain('2024');
  });

  it('formats full date in Arabic', () => {
    const formatted = dateFullFormat(testDate, 'ar');
    expect(formatted).toBeTruthy();
  });

  it('formats time in English', () => {
    const formatted = time(testDateTime, 'en');
    expect(formatted).toMatch(/\d{2}:\d{2}/);
  });

  it('formats time in Arabic', () => {
    const formatted = time(testDateTime, 'ar');
    expect(formatted).toBeTruthy();
  });
});
