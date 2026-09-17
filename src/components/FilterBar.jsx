import DateRangePicker from './DateRangePicker';
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
  sortBy,
  onSortChange,
}) {
  return (
    <div style={styles.bar}>
      <div style={styles.row}>
        <div style={styles.searchWrapper}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search gear..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={styles.select}
        >
          <option value="all">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={location || ''}
          onChange={(e) => onLocationChange(e.target.value || null)}
          style={styles.select}
        >
          <option value="">Any nearby location</option>
          {LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={styles.select}
        >
          <option value="relevance">Sort: Relevance</option>
          <option value="price-asc">Sort: Price (low)</option>
          <option value="price-desc">Sort: Price (high)</option>
        </select>
      </div>

      <div style={styles.dateRow}>
        <span style={styles.dateLabel}>Rental dates</span>
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} compact />
      </div>
    </div>
  );
}

const styles = {
  bar: {
    background: 'var(--color-surface)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--glass-shadow)',
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  row: {
    display: 'flex',
    gap: 'var(--space-sm)',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchWrapper: {
    position: 'relative',
    flex: '1 1 200px',
    minWidth: 180,
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px 8px 34px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-sm)',
    background: 'var(--color-surface-solid)',
    outline: 'none',
    color: 'var(--color-text)',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-sm)',
    background: 'var(--color-surface-solid)',
    color: 'var(--color-text)',
    outline: 'none',
    cursor: 'pointer',
    minWidth: 140,
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    flexWrap: 'wrap',
  },
  dateLabel: {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    whiteSpace: 'nowrap',
  },
};
