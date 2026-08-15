import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hydrateSession, logout } from '@features/auth/authSlice';
import AppRoutes from '@routes';
import PageSkeleton from '@shared/ui/PageSkeleton';
import { t } from '@shared/i18n';

export default function App() {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.language.value);
  const sessionStatus = useSelector((state) => state.session.status);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('brand', lang) ;
  }, [lang]);

  useEffect(() => {
    dispatch(hydrateSession());
  }, [dispatch]);

  useEffect(() => {
    const handleUnauthorized = () => dispatch(logout());
    window.addEventListener('riverside:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('riverside:unauthorized', handleUnauthorized);
  }, [dispatch]);

  if (sessionStatus === 'checking') return <PageSkeleton />;

  return <AppRoutes />;
}
