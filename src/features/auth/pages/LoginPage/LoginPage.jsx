import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@features/auth/authSlice';
import { t } from '@shared/i18n';
import Logo from '@shared/components/Logo/index.js';
import { Button, Input } from '@shared/ui';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.language.value);
  const auth = useSelector((state) => state.auth);
  const [email, setEmail] = useState('admin@riverside.example');
  const [password, setPassword] = useState('Passw0rd!');

  const submit = (event) => {
    event.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <section className={styles.card} aria-labelledby="signin-title">
      <div className={styles.brand}>
        <Logo />
        <div>
          <strong>{t('brand', lang)}</strong>
          <span>Club Administration</span>
        </div>
      </div>
      <div className={styles.intro}>
        <h1 id="signin-title">{t('signInTitle', lang)}</h1>
        <p>{t('signInSubtitle', lang)}</p>
      </div>
      <form onSubmit={submit} noValidate>
        <Input
          label={t('email', lang)}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
        <Input
          label={t('password', lang)}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {auth.error && (
          <div className={styles.formError} role="alert">
            {auth.error}
          </div>
        )}
        <Button type="submit" loading={auth.status === 'loading'}>
          {auth.status === 'loading' ? t('signingIn', lang) : t('signIn', lang)}
        </Button>
      </form>
      <div className={styles.demoCredentials} aria-label={t('demo', lang)}>
        <strong>{t('demo', lang)}</strong>
        <span>admin@riverside.example</span>
        <span>Passw0rd!</span>
      </div>
    </section>
  );
}
