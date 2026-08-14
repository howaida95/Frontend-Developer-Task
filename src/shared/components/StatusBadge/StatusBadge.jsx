import { memo } from 'react';
import { t } from '@shared/i18n';
import styles from './StatusBadge.module.scss';

function StatusBadge({ value, lang }) {
  return (
    <span className={[styles.status, styles[value]].filter(Boolean).join(' ')}>
      <span className={styles.dot} aria-hidden="true" />
      {t(value, lang)}
    </span>
  );
}

export default memo(StatusBadge);
