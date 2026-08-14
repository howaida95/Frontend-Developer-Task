import { memo } from 'react';
import { TableSkeleton } from '@shared/ui/PageSkeleton';
import styles from './Table.module.scss';

function Table({ columns, rows, rowKey, onRowClick, empty, loading, ariaLabel }) {
  return (
    <div className={styles.scroll} aria-busy={loading || undefined}>
      {loading ? (
        <TableSkeleton rows={7} columns={columns.length} />
      ) : (
        <table className={styles.table} aria-label={ariaLabel}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className={styles.empty}>{empty}</div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={(event) => {
                    if (onRowClick && (event.key === 'Enter' || event.key === ' ')) {
                      event.preventDefault();
                      onRowClick(row);
                    }
                  }}
                >
                  {columns.map((column) => (
                    <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default memo(Table);
