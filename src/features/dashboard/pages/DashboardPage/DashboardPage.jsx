import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSummary } from '@features/dashboard/summarySlice';
import { fetchMembers } from '@features/members/membersSlice';
import MembersPage from '@features/members/pages/MembersPage/index.js';
import MemberDetail from '@features/members/components/MemberDetail/index.js';
import StatCard from '@shared/components/StatCard/index.js';
import LanguageToggle from '@shared/components/LanguageToggle/index.js';
import { t } from '@shared/i18n';
import { number, decimal } from '@shared/utils/format';
import styles from './DashboardPage.module.scss';

function DashboardPage() {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.language.value);
  const summary = useSelector((state) => state.summary);
  const query = useSelector((state) => state.members.query);
  const members = useSelector((state) => state.members.data);
  const [selected, setSelected] = useStateFromHash(members);
  const lastPromise = useRef(null);

  useEffect(() => {
    dispatch(fetchSummary());
  }, [dispatch]);

  useEffect(() => {
    lastPromise.current?.abort?.();
    lastPromise.current = dispatch(fetchMembers(query));
    return () => lastPromise.current?.abort?.();
  }, [dispatch, query]);

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>{t('dashboard', lang)}</p>
          <h1>{t('welcome', lang)}</h1>
          <p>{t('subtitle', lang)}</p>
        </div>
        <div className={styles.headerActions}>
          <LanguageToggle />
        </div>
      </div>
      <section className={styles.statsGrid} aria-label={t('dashboard', lang)}>
        <StatCard
          label={t('totalMembers', lang)}
          value={number(summary.data?.totalMembers, lang)}
          loading={summary.status === 'loading' && !summary.data}
          error={summary.status === 'failed' ? t('summaryError', lang) : null}
          onRetry={() => dispatch(fetchSummary())}
        />
        <StatCard
          label={t('activeMembers', lang)}
          value={number(summary.data?.activeMembers, lang)}
          loading={summary.status === 'loading' && !summary.data}
          error={summary.status === 'failed' ? t('summaryError', lang) : null}
          onRetry={() => dispatch(fetchSummary())}
        />
        <StatCard
          label={t('sessionsMonth', lang)}
          value={number(summary.data?.sessionsThisMonth, lang)}
          loading={summary.status === 'loading' && !summary.data}
          error={summary.status === 'failed' ? t('summaryError', lang) : null}
          onRetry={() => dispatch(fetchSummary())}
        />
        <StatCard
          label={t('avgSessions', lang)}
          value={decimal(summary.data?.averageSessionsPerMember, lang)}
          meta={
            summary.data
              ? `+${decimal(summary.data.changeVsLastMonth, lang)}% ${t('change', lang)}`
              : null
          }
          loading={summary.status === 'loading' && !summary.data}
          error={summary.status === 'failed' ? t('summaryError', lang) : null}
          onRetry={() => dispatch(fetchSummary())}
        />
      </section>
      <MembersPage onSelect={setSelected} />
      {selected && <MemberDetail id={selected.id} onClose={() => setSelected(null)} />}
    </>
  );
}

function useStateFromHash(members) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const updateFromHash = () => {
      const match = window.location.hash.match(/^#member-(.+)$/);
      const memberNumber = match ? decodeURIComponent(match[1]) : null;
      if (!memberNumber) {
        setValue(null);
        return;
      }

      const member = members.find((item) => item.memberNumber === memberNumber);
      if (member) setValue({ id: member.id, memberNumber: member.memberNumber });
    };

    updateFromHash();
    window.addEventListener('hashchange', updateFromHash);
    return () => window.removeEventListener('hashchange', updateFromHash);
  }, [members]);

  const set = (member) => {
    if (member) {
      window.history.pushState(
        null,
        '',
        `/members#member-${encodeURIComponent(member.memberNumber)}`,
      );
      window.dispatchEvent(new Event('riverside:navigation'));
      setValue({ id: member.id, memberNumber: member.memberNumber });
    } else {
      window.history.replaceState(null, '', '/members');
      window.dispatchEvent(new Event('riverside:navigation'));
      setValue(null);
    }
  };

  return [value, set];
}
export default memo(DashboardPage);
