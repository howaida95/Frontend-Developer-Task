import { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AuthLayout from '@layouts/AuthLayout/index.js';
import DashboardLayout from '@layouts/DashboardLayout/index.js';
import PageSkeleton from '@shared/ui/PageSkeleton';

const LoginPage = lazy(() => import('@features/auth/pages/LoginPage/index.js'));
const DashboardPage = lazy(() => import('@features/dashboard/pages/DashboardPage/index.js'));
const NotFoundPage = lazy(() => import('@routes/NotFoundPage/index.js'));

const AUTH_PATHS = new Set(['/', '/login']);
const DASHBOARD_PATHS = new Set(['/', '/dashboard', '/members']);

function DashboardFallback() {
  return <PageSkeleton />;
}

function AuthFallback() {
  return null;
}

export default function AppRoutes() {
  const authenticated = false; // Replace with actual authentication logic
  const pathname = usePathname();
  const isKnownPath = authenticated ? DASHBOARD_PATHS.has(pathname) : AUTH_PATHS.has(pathname);

  return (
    <>
      {!isKnownPath ? (
        authenticated ? (
          <Suspense fallback={<DashboardFallback />}>
            <DashboardLayout>
              <NotFoundPage />
            </DashboardLayout>
          </Suspense>
        ) : (
          <Suspense fallback={<AuthFallback />}>
            <AuthLayout>
              <NotFoundPage />
            </AuthLayout>
          </Suspense>
        )
      ) : authenticated ? (
        <Suspense fallback={<DashboardFallback />}>
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        </Suspense>
      ) : (
        <Suspense fallback={<AuthFallback />}>
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        </Suspense>
      )}
    </>
  );
}

function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', updatePathname);
    window.addEventListener('riverside:navigation', updatePathname);
    return () => {
      window.removeEventListener('popstate', updatePathname);
      window.removeEventListener('riverside:navigation', updatePathname);
    };
  }, []);

  return pathname;
}
