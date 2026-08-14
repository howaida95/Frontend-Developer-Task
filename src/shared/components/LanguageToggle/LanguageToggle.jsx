import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '@shared/store';
import { t } from '@shared/i18n';
import GbFlag from '@/assets/icons/gb.svg?react';
import SaFlag from '@/assets/icons/sa.svg?react';
import styles from './LanguageToggle.module.scss';

const languageOptions = [
  { value: 'en', label: 'en', Icon: GbFlag, alt: 'English' },
  { value: 'ar', label: 'Ar', Icon: SaFlag, alt: 'Arabic' },
];

function LanguageToggle() {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.language.value);
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef(null);
  const currentOption =
    languageOptions.find((option) => option.value === lang) ?? languageOptions[0];
  const CurrentIcon = currentOption.Icon;
  const ariaLabel = lang === 'en' ? t('switchToArabic', lang) : t('switchToEnglish', lang);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!toggleRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const handleSelect = (value) => {
    dispatch(setLanguage(value));
    setIsOpen(false);
  };

  return (
    <div
      className={[styles.languageToggle, lang === 'ar' ? styles.rtl : '']
        .filter(Boolean)
        .join(' ')}
      ref={toggleRef}
    >
      <button
        type="button"
        className={styles.toggleButton}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <CurrentIcon className={styles.flag} />
        <span className={styles.label}>{currentOption.label}</span>
        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </button>
      {isOpen && (
        <div className={styles.options} role="listbox" aria-label={ariaLabel}>
          {languageOptions.map((option) => {
            const OptionIcon = option.Icon;
            return (
              <button
                key={option.value}
                type="button"
                className={[styles.option, option.value === lang ? styles.optionActive : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={option.value === lang}
              >
                <OptionIcon className={styles.flag} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(LanguageToggle);
