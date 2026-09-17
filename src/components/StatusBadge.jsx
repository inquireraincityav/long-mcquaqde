const statusStyles = {
  upcoming: {
    background: 'var(--color-warning-light)',
    color: 'var(--color-warning)',
  },
  'in-progress': {
    background: 'var(--color-accent-light)',
    color: 'var(--color-accent)',
  },
  completed: {
    background: 'var(--color-success-light)',
    color: 'var(--color-success)',
  },
};

const labels = {
  upcoming: 'Upcoming',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles.upcoming;
  const label = labels[status] || status;

  return (
    <span style={{ ...styles.badge, ...style }}>
      {label}
    </span>
  );
}

const styles = {
  badge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
    whiteSpace: 'nowrap',
  },
};
