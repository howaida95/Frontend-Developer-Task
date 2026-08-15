import { memo } from 'react';
import Button from '@shared/ui/Button';
import Skeleton from '@shared/ui/Skeleton';
import styles from './StatCard.module.scss';

function StatCard({ label, value, meta, loading, error, onRetry }) {
  return (
    <article
      className={[styles.card, error ? styles.error : ''].filter(Boolean).join(' ')}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <Skeleton className={styles.line} />
          <Skeleton className={styles.numberSkeleton} />
        </>
      ) : error ? (
        <div className={styles.errorContent}>
          <span className={styles.errorState}>Failed</span>
          <Button variant="ghost" className={styles.retryLink} onClick={onRetry}>
            Retry
          </Button>
          <span className={styles.errorLabel}>{error}</span>
        </div>
      ) : (
        <>
          <span className={styles.label}>{label}</span>
          <strong className={styles.value}>{value}</strong>
          {meta && <span className={styles.meta}>{meta}</span>}
        </>
      )}
    </article>
  );
}

export default memo(StatCard);
