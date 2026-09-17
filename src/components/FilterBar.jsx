import { LOCATIONS } from '../utils/availability';

export default function FilterBar({
  category,
  onCategoryChange,
  categories,
  dateRange,
  onDateRangeChange,
  location,
  onLocationChange,
  search,
  onSearchChange,
}) {
  return (
    <div style={styles.bar}>
      <div style={styles.searchWrapper}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.searchIcon}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search gear, specs, categories..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.pills}>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={styles.pill}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div style={styles.pill}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <input
            type="date"
            value={dateRange?.start || ''}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            style={styles.dateInput}
            aria-label="Start date"
          />
          <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>-</span>
          <input
            type="date"
            value={dateRange?.end || ''}
            min={dateRange?.start || ''}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            style={styles.dateInput}
            aria-label="End date"
          />
        </div>

        <select
          value={location || ''}
          onChange={(e) => onLocationChange(e.target.value || null)}
          style={styles.pill}
        >
          <option value="">Any nearby</option>
          {LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>
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
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 40px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--text-sm)',
    background: 'var(--color-surface-solid)',
    outline: 'none',
    color: 'var(--color-text)',
    boxShadow: 'var(--glass-shadow)',
  },
  pills: {
    display: 'flex',
    gap: 'var(--space-sm)',
    overflowX: 'auto',
    paddingBottom: 2,
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '8px 14px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-xs)',
    background: 'var(--color-surface-solid)',
    color: 'var(--color-text)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
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
