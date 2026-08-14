import { useSelector } from 'react-redux';
import { t } from '@shared/i18n';
import styles from './NotFoundPage.module.scss';

export default function NotFoundPage() {
  const lang = useSelector((state) => state.language.value);
  const authenticated = useSelector((state) => state.session.authenticated);

  return (
    <section className={styles.page} aria-labelledby="not-found-title">
      <p className={styles.code}>404</p>
      <h1 id="not-found-title">{t('notFoundTitle', lang)}</h1>
      <p>{t('notFoundMessage', lang)}</p>
      <a className={styles.link} href={authenticated ? '/dashboard' : '/'}>
        {t('notFoundAction', lang)}
      </a>
    </section>
  );
}
