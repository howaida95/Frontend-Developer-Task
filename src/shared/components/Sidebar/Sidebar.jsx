import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@features/auth/authSlice';
import { t } from '@shared/i18n';
import Logo from '@shared/components/Logo/index.js';
import LanguageToggle from '@shared/components/LanguageToggle/index.js';
import Button from '@shared/ui/Button';
import LogoutIcon from '@/assets/icons/logout.svg?react';
import MembersIcon from '@/assets/icons/memebers.svg?react';
import CloseIcon from '@/assets/icons/close.svg?react';
import styles from './Sidebar.module.scss';

function Sidebar({ open = false, onClose }) {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.language.value);
  const user = useSelector((state) => state.session.user);
  const handleLogout = useCallback(() => {
    dispatch(logout());
    window.history.replaceState(null, '', '/');
    window.dispatchEvent(new Event('riverside:navigation'));
    onClose?.();
  }, [dispatch, onClose]);
  const handleNavigation = useCallback(
    (event) => {
      event.preventDefault();
      window.history.pushState(null, '', '/members');
      window.dispatchEvent(new Event('riverside:navigation'));
      onClose?.();
    },
    [onClose],
  );

  return (
    <>
      {open && (
        <button
          className={styles.backdrop}
          type="button"
          aria-label={t('closeMenu', lang)}
          onClick={onClose}
        />
      )}
      <aside
        className={[
          styles.sidebar,
          lang === 'ar' ? styles.rtl : '',
          open ? styles.open : '',
        ]
          .filter(Boolean)
          .join(' ')}
        id="primary-sidebar"
        aria-label={t('primaryNavigation', lang)}
        aria-hidden={!open}
      >
        <div className={styles.header}>
          <div className={styles.brand}>
            <Logo />
            <div>
              <strong>{t('brand', lang)}</strong>
              <small>Club Admin</small>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t('closeMenu', lang)}
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label={t('primaryNavigation', lang)}>
          <a
            className={[styles.navItem, styles.active].join(' ')}
            href="/members"
            aria-current="page"
            onClick={handleNavigation}
          >
            <span className={styles.navIcon} aria-hidden="true">
              <MembersIcon />
            </span>
            {t('members', lang)}
          </a>
        </nav>

        <div className={styles.footer}>
          <div className={styles.userCard}>
            <div className={styles.avatar} aria-hidden="true">
              {user?.name?.[lang]?.slice(0, 1)}
            </div>
            <div className={styles.userInfo}>
              <strong>{user?.name?.[lang]}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <Button variant="logout" className={styles.logout} onClick={handleLogout}>
            <span className={styles.logoutIcon} aria-hidden="true">
              <LogoutIcon />
            </span>
            <span>{t('signOut', lang)}</span>
          </Button>
        </div>
      </aside>
    </>
  );
}

export default memo(Sidebar);
