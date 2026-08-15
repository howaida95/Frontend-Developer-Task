import { memo } from 'react';
import Button from '@shared/ui/Button';
import { t } from '@shared/i18n';
import styles from './ErrorFallback.module.scss';

function ErrorFallback({ error, resetErrorBoundary, lang = 'en', as = 'main' }) {
  const FallbackElement = as;
  return (
    <FallbackElement className={styles.errorFallback} role="alert" aria-live="assertive">
      <div className={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          !
        </span>
        <h1>{t('unexpectedError', lang)}</h1>
        <p>{t('unexpectedErrorHint', lang)}</p>
        {import.meta.env.DEV && error?.message && <pre>{error.message}</pre>}
        <Button onClick={resetErrorBoundary}>{t('tryAgain', lang)}</Button>
      </div>
    </FallbackElement>
  );
}

export default memo(ErrorFallback);
