import { useState } from 'react';
import AppHeader from '../components/AppHeader';
import FilterBar from '../components/FilterBar';
import GearCard from '../components/GearCard';
import GearDetailDrawer from '../components/GearDetailDrawer';
import EmptyState from '../components/EmptyState';
import useInventory from '../hooks/useInventory';

export default function BrowseSearch() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedItem, setSelectedItem] = useState(null);

  const { items, categories } = useInventory({ category, search });

  const sorted = [...items].sort((a, b) => (a.rentalDay || 999) - (b.rentalDay || 999));

  const hasDateRange = !!(dateRange.start && dateRange.end);

  return (
    <div className="page-enter">
      <AppHeader />

      <div style={styles.filterSection}>
        <FilterBar
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      <div style={styles.body}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            {category === 'all' ? 'All Gear' : category}
          </h2>
          <span style={styles.count}>{sorted.length} items</span>
        </div>

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
  filterSection: {
    marginTop: 'var(--space-md)',
  },
  body: {
    padding: '0 var(--space-md)',
    marginTop: 'var(--space-lg)',
    paddingBottom: 'var(--space-lg)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 'var(--space-md)',
  },
  sectionTitle: {
    fontSize: '19px',
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  count: {
    fontSize: '12.5px',
    color: 'var(--color-text-secondary)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
};
