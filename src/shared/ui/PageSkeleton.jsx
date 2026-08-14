import { memo } from 'react';
import Skeleton from '@shared/ui/Skeleton';
import styles from './PageSkeleton.module.scss';

export function SidebarSkeleton() {
  return (
    <aside className={styles.sidebar} aria-hidden="true">
      <div className={styles.sidebarHeader}>
        <div className={styles.brand}>
          <Skeleton className={styles.sidebarLogo} />
          <div className={styles.sidebarBrandText}>
            <Skeleton className={styles.sidebarBrand} />
            <Skeleton className={styles.sidebarSubtitle} />
          </div>
        </div>
      </div>
      <nav className={styles.sidebarNav}>
        <Skeleton className={styles.sidebarNavItem} />
        <Skeleton className={[styles.sidebarNavItem, styles.sidebarNavItemShort].join(' ')} />
      </nav>
      <div className={styles.sidebarFooter}>
        <div className={styles.sidebarUser}>
          <Skeleton className={styles.sidebarAvatar} />
          <div>
            <Skeleton className={styles.sidebarUserName} />
            <Skeleton className={styles.sidebarEmail} />
          </div>
        </div>
        <Skeleton className={styles.sidebarLogout} />
      </div>
    </aside>
  );
}

function PageSkeleton() {
  return (
    <div className={styles.shell} aria-hidden="true">
      <SidebarSkeleton />
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <Skeleton className={styles.eyebrow} />
            <Skeleton className={styles.title} />
            <Skeleton className={styles.subtitle} />
          </div>
          <Skeleton className={styles.action} />
        </div>
        <section className={styles.statsGrid}>
          {Array.from({ length: 4 }, (_, index) => (
            <div className={styles.statCard} key={index}>
              <Skeleton className={styles.line} />
              <Skeleton className={styles.number} />
            </div>
          ))}
        </section>
        <section className={styles.membersCard}>
          <div className={styles.toolbar}>
            <Skeleton className={styles.search} />
            <Skeleton className={styles.filter} />
            <Skeleton className={styles.filter} />
          </div>
          <div className={styles.tableWrap}>
            <TableSkeleton rows={7} columns={6} />
          </div>
        </section>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6, columns = 6 }) {
  return (
    <div className={styles.table} aria-hidden="true">
      <div className={[styles.tableRow, styles.tableHeader].join(' ')}>
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className={[styles.tableCell, styles.tableHeaderCell].join(' ')} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div className={styles.tableRow} key={rowIndex}>
          {Array.from({ length: columns }, (_, columnIndex) => (
            <Skeleton key={columnIndex} className={styles.tableCell} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default memo(PageSkeleton);
