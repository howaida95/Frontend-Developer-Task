import LanguageToggle from '@shared/components/LanguageToggle/index.js';
import styles from './AuthLayout.module.scss';

export default function AuthLayout({ children }) {
  return (
    <main className={styles.loginPage}>
      <div className={styles.loginTop}>
        <LanguageToggle />
      </div>
      {children}
    </main>
  );
}
