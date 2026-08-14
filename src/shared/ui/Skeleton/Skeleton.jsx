import { memo } from 'react';
import styles from './Skeleton.module.scss';

function Skeleton({ className = '', width, height }) {
  const style = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return (
    <span
      className={[styles.skeleton, className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    />
  );
}

export default memo(Skeleton);
