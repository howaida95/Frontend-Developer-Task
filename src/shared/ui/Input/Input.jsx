import { forwardRef, memo, useId } from 'react';
import styles from './Input.module.scss';

const Input = forwardRef(function Input(
  { label, error, hint, id, className = '', required = false, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={inputId}>
          {label}
          {required ? ' *' : ''}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={[styles.input, error ? styles.error : '', className].filter(Boolean).join(' ')}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        required={required}
        {...props}
      />
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className={styles.fieldError} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

export default memo(Input);
