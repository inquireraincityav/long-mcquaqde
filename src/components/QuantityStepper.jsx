export default function QuantityStepper({ value, onChange, min = 1, max }) {
  return (
    <div style={styles.wrapper}>
      <button
        style={styles.btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span style={styles.value}>{value}</span>
      <button
        style={styles.btn}
        onClick={() => onChange(max ? Math.min(max, value + 1) : value + 1)}
        disabled={max !== undefined && value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0,
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    height: 32,
  },
  btn: {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.1s',
  },
  value: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
  },
};
