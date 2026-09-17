export default function DateRangePicker({ value, onChange, compact = false }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={compact ? styles.wrapperCompact : styles.wrapper}>
      <div style={styles.field}>
        {!compact && <label style={styles.label}>Pickup</label>}
        <input
          type="date"
          style={styles.input}
          value={value?.start || ''}
          min={today}
          onChange={(e) =>
            onChange({ ...value, start: e.target.value })
          }
          aria-label="Pickup date"
        />
      </div>
      <span style={styles.separator}>-</span>
      <div style={styles.field}>
        {!compact && <label style={styles.label}>Return</label>}
        <input
          type="date"
          style={styles.input}
          value={value?.end || ''}
          min={value?.start || today}
          onChange={(e) =>
            onChange({ ...value, end: e.target.value })
          }
          aria-label="Return date"
        />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 'var(--space-sm)',
  },
  wrapperCompact: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  label: {
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '6px 10px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text)',
    background: 'var(--color-surface-solid)',
    outline: 'none',
    minWidth: 130,
  },
  separator: {
    color: 'var(--color-text-tertiary)',
    fontSize: 'var(--text-sm)',
    paddingBottom: 8,
  },
};
