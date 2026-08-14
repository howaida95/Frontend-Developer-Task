import { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery } from '@features/members/membersSlice';
import StatusBadge from '@shared/components/StatusBadge/index.js';
import { useDebounce } from '@shared/hooks';
import { t } from '@shared/i18n';
import { number } from '@shared/utils/format';
import { Table } from '@shared/ui';
import styles from './MemberTable.module.scss';

const tiers = ['', 'basic', 'standard', 'premium'];
const statuses = ['', 'active', 'paused', 'expired'];

function MemberTable({ onSelect }) {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.language.value);
  const { data, meta, query, status, error } = useSelector((state) => state.members);
  const busy = status === 'loading';
  const [searchValue, setSearchValue] = useState(query.search);
  const debouncedSearch = useDebounce(searchValue, 300);
  const update = (payload) => dispatch(setQuery({ ...payload, page: payload.page ?? 1 }));
  const sort = (key) =>
    update({ sort: key, dir: query.sort === key && query.dir === 'asc' ? 'desc' : 'asc' });

  useEffect(() => {
    setSearchValue(query.search);
  }, [query.search]);

  useEffect(() => {
    if (debouncedSearch !== query.search) {
      dispatch(setQuery({ search: debouncedSearch, page: 1 }));
    }
  }, [debouncedSearch, dispatch, query.search]);

  const columns = useMemo(
    () => [
      {
        key: 'member',
        header: t('member', lang),
        render: (member) => (
          <div className={styles.memberCell}>
            <div className={styles.avatar} aria-hidden="true">
              {member.name[lang].slice(0, 1)}
            </div>
            <div>
              <strong>{member.name[lang]}</strong>
              <span>{member.memberNumber}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'number',
        header: t('number', lang),
        render: (member) => <span className={styles.mono}>{member.memberNumber}</span>,
      },
      {
        key: 'tier',
        header: t('tier', lang),
        render: (member) => (
          <span className={[styles.tier, styles[member.tier]].filter(Boolean).join(' ')}>
            {t(member.tier, lang)}
          </span>
        ),
      },
      {
        key: 'status',
        header: t('status', lang),
        render: (member) => <StatusBadge value={member.status} lang={lang} />,
      },
      {
        key: 'sessions',
        header: (
          <button
            className={styles.sortButton}
            onClick={() => sort('sessionsThisMonth')}
            aria-label={`${t('sortSessions', lang)}: ${query.dir === 'asc' ? t('ascending', lang) : t('descending', lang)}`}
          >
            {t('sessions', lang)}{' '}
            {query.sort === 'sessionsThisMonth' ? (query.dir === 'asc' ? '↑' : '↓') : ''}
          </button>
        ),
        render: (member) => (
          <span className={styles.numeric}>
            {number(member.sessionsThisMonth, lang)} / {number(member.monthlyGoal, lang)}
          </span>
        ),
      },
      {
        key: 'total',
        header: (
          <button
            className={styles.sortButton}
            onClick={() => sort('totalSessions')}
            aria-label={`${t('sortTotal', lang)}: ${query.dir === 'asc' ? t('ascending', lang) : t('descending', lang)}`}
          >
            {t('totalSessions', lang)}{' '}
            {query.sort === 'totalSessions' ? (query.dir === 'asc' ? '↑' : '↓') : ''}
          </button>
        ),
        render: (member) => <span className={styles.numeric}>{number(member.totalSessions, lang)}</span>,
      },
    ],
    [lang, query.sort, query.dir],
  );

  return (
    <section className={styles.card} id="members" aria-labelledby="members-title">
      <h2 id="members-title" className="visuallyHidden">
        {t('membersTitle', lang)}
      </h2>
      <div className={styles.toolbar}>
        <label className={styles.searchWrap} htmlFor="member-search">
          <span aria-hidden="true">⌕</span>
          <input
            id="member-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t('search', lang)}
          />
        </label>
        <label className="visuallyHidden" htmlFor="tier-filter">
          {t('tier', lang)}
        </label>
        <select
          id="tier-filter"
          value={query.tier}
          onChange={(e) => update({ tier: e.target.value })}
          aria-label={t('tier', lang)}
        >
          {tiers.map((tier) => (
            <option key={tier} value={tier}>
              {tier ? t(tier, lang) : `${t('tier', lang)} — ${t('all', lang)}`}
            </option>
          ))}
        </select>
        <label className="visuallyHidden" htmlFor="status-filter">
          {t('status', lang)}
        </label>
        <select
          id="status-filter"
          value={query.status}
          onChange={(e) => update({ status: e.target.value })}
          aria-label={t('status', lang)}
        >
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value ? t(value, lang) : `${t('status', lang)} — ${t('all', lang)}`}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <div className={styles.inlineError} role="alert">
          {t('loadError', lang)}{' '}
          <button onClick={() => dispatch(setQuery({ page: query.page }))}>
            {t('retry', lang)}
          </button>
        </div>
      )}
      <Table
        columns={columns}
        rows={data}
        rowKey={(member) => member.id}
        onRowClick={(member) => onSelect(member)}
        loading={busy && data.length === 0}
        empty={t('noResults', lang)}
        ariaLabel={t('membersTitle', lang)}
      />
      <div className={styles.pagination}>
        <span>
          {t('showing', lang)} {meta.total ? number((meta.page - 1) * meta.per_page + 1, lang) : 0}–
          {number(Math.min(meta.page * meta.per_page, meta.total), lang)} {t('of', lang)}{' '}
          {number(meta.total, lang)}
        </span>
        <div className={styles.pageButtons}>
          <button disabled={meta.page <= 1 || busy} onClick={() => update({ page: meta.page - 1 })}>
            {t('previous', lang)}
          </button>
          <span>
            {number(meta.page, lang)} / {number(meta.last_page, lang)}
          </span>
          <button
            disabled={meta.page >= meta.last_page || busy}
            onClick={() => update({ page: meta.page + 1 })}
          >
            {t('next', lang)}
          </button>
        </div>
      </div>
    </section>
  );
}
export default memo(MemberTable);
