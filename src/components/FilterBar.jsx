import { useState } from 'react';
import BottomSheet from './BottomSheet';

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.5 }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function FilterBar({
  category,
  onCategoryChange,
  categories,
  dateRange,
  onDateRangeChange,
  search,
  onSearchChange,
}) {
  const [catOpen, setCatOpen] = useState(false);

  const catOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  const catLabel = category === 'all' ? 'All Categories' : category;

  return (
    <div style={styles.bar}>
      <div style={styles.searchWrapper}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.searchIcon}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search gear, specs, categories…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.pills}>
        <button style={styles.pill} onClick={() => setCatOpen(true)}>
          {catLabel}
          <ChevronDown />
        </button>

        <div style={styles.pill}>
          <label htmlFor="browse-start" style={styles.calLabel}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </label>
          <input
            id="browse-start"
            type="date"
            className={dateRange?.start ? '' : 'date-empty'}
            value={dateRange?.start || ''}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            style={styles.dateInput}
            aria-label="Start date"
          />
          <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>-</span>
          <input
            type="date"
            className={dateRange?.end ? '' : 'date-empty'}
            value={dateRange?.end || ''}
            min={dateRange?.start || ''}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            style={styles.dateInput}
            aria-label="End date"
          />
        </div>
      </div>

      <BottomSheet
        open={catOpen}
        onClose={() => setCatOpen(false)}
        title="Category"
        options={catOptions}
        value={category}
        onChange={onCategoryChange}
      />
    </div>
  );
}

const styles = {
  bar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
    padding: '0 var(--space-md)',
  },
  searchWrapper: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 13,
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.5,
  },
  searchInput: {
    width: '100%',
    padding: '11px 16px 11px 38px',
    border: '1px solid var(--color-border-glass)',
    borderRadius: '14px',
    fontSize: '14px',
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    outline: 'none',
    color: 'var(--color-text)',
    boxShadow: 'var(--glass-highlight)',
  },
  pills: {
    display: 'flex',
    gap: 'var(--space-sm)',
    overflowX: 'auto',
    paddingBottom: 'var(--space-md)',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 13px',
    border: '1px solid var(--color-border-glass)',
    borderRadius: 'var(--radius-xl)',
    fontSize: '13px',
    fontWeight: 500,
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    color: 'var(--color-text)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    boxShadow: 'var(--glass-shadow), var(--glass-highlight)',
  },
  calLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  dateInput: {
    border: 'none',
    background: 'transparent',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text)',
    outline: 'none',
    width: 95,
    padding: 0,
  },
};
