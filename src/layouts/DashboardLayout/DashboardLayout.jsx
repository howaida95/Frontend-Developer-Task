import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '@shared/components/Sidebar/index.js';
import LanguageToggle from '@shared/components/LanguageToggle/index.js';
import { t } from '@shared/i18n';
import styles from './DashboardLayout.module.scss';

export default function DashboardLayout({ children }) {
  const lang = useSelector((state) => state.language.value);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((open) => !open), []);

  useEffect(() => {
    closeSidebar();
  }, [lang, closeSidebar]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeSidebar();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarOpen, closeSidebar]);

  return (
    <>
      <a className="skipLink" href="#main-content">
        {t('skipToContent', lang)}
      </a>
      <div className={styles.appShell}>
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />
        <main
          className={[styles.main, lang === 'ar' ? styles.mainRtl : ''].filter(Boolean).join(' ')}
          id="main-content"
          tabIndex="-1"
        >
          <header className={styles.mobileTop}>
            <button
              type="button"
              className={styles.burgerButton}
              onClick={toggleSidebar}
              aria-expanded={sidebarOpen}
              aria-controls="primary-sidebar"
              aria-label={sidebarOpen ? t('closeMenu', lang) : t('menu', lang)}
            >
              <span aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
            <strong>{t('brand', lang)}</strong>
            <LanguageToggle />
          </header>
          {children}
        </main>
      </div>
    </>
  );
}
