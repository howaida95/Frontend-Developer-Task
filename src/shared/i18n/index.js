import ar from '@shared/i18n/locales/ar';
import en from '@shared/i18n/locales/en';

export const translations = { en, ar };

export const t = (key, lang = 'en', vars = {}) => {
  const value = translations[lang]?.[key] ?? translations.en[key] ?? key;
  return value.replace(/\{(\w+)\}/g, (_, variable) => vars[variable] ?? '');
};
