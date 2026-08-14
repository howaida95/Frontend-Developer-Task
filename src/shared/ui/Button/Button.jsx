import { forwardRef, memo } from 'react';
import styles from './Button.module.scss';

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    type = 'button',
    className = '',
    loading = false,
    disabled,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? '…' : children}
    </button>
  );
});

export default memo(Button);
