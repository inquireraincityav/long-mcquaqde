import { useState } from 'react';
import FilterBar from '../components/FilterBar';
import GearCard from '../components/GearCard';
import GearDetailDrawer from '../components/GearDetailDrawer';
import EmptyState from '../components/EmptyState';
import useInventory from '../hooks/useInventory';

export default function BrowseSearch() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [location, setLocation] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedItem, setSelectedItem] = useState(null);

  const { items, categories } = useInventory({ category, search, location });

  const sorted = [...items].sort((a, b) => {
    if (sortBy === 'price-asc') return (a.rentalDay || 999) - (b.rentalDay || 999);
    if (sortBy === 'price-desc') return (b.rentalDay || 0) - (a.rentalDay || 0);
    return 0;
  });

  const hasDateRange = !!(dateRange.start && dateRange.end);

  return (
    <div className="page-enter" style={styles.page}>
      <div className="container">
        <div style={styles.header}>
          <h1 style={styles.title}>Browse Gear</h1>
          <p style={styles.subtitle}>
            {hasDateRange
              ? `Showing availability for your selected dates`
              : 'Set dates to see real-time availability'}
          </p>
        </div>

        <FilterBar
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          location={location}
          onLocationChange={setLocation}
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {sorted.length === 0 ? (
          <EmptyState
            title="No items match"
            message="Try adjusting your filters or dates to see available gear."
          />
        ) : (
          <div style={styles.grid}>
            {sorted.map((item) => (
              <GearCard
                key={item.product}
                item={item}
                hasDateRange={hasDateRange}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <GearDetailDrawer
          item={selectedItem}
          dateRange={hasDateRange ? dateRange : undefined}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: 'var(--space-lg) 0 var(--space-3xl)',
  },
  header: {
    marginBottom: 'var(--space-lg)',
  },
  title: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    marginTop: 'var(--space-xs)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 'var(--space-md)',
    marginTop: 'var(--space-lg)',
  },
};
