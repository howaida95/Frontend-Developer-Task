import { memo, useEffect, useRef } from 'react';
import CloseIcon from '@/assets/icons/close.svg?react';
import styles from './Modal.module.scss';

function getFocusable(container) {
  return (
    container?.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) || []
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
  placement = 'right',
  labelledBy,
  className = '',
}) {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    previousFocus.current = document.activeElement;
    dialogRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
      if (event.key !== 'Tab') return;
      const focusable = [...getFocusable(dialogRef.current)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('modalOpen');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('modalOpen');
      previousFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={[styles.modal, styles[placement]].filter(Boolean).join(' ')} role="presentation">
      <button
        className={styles.backdrop}
        aria-label="Close dialog"
        onClick={onClose}
        tabIndex="-1"
      />
      <section
        ref={dialogRef}
        className={[styles.dialog, className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex="-1"
      >
        <header className={styles.header}>
          <h2 id={labelledBy}>{title}</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close dialog">
            <CloseIcon />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </section>
    </div>
  );
}

export default memo(Modal);
