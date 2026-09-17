import { Link } from 'react-router-dom';

export default function EmptyState({ title, message, links }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.icon}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.message}>{message}</p>
      {links && (
        <div style={styles.links}>
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="btn-secondary">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-3xl) var(--space-md)',
    textAlign: 'center',
  },
  icon: {
    marginBottom: 'var(--space-md)',
    opacity: 0.5,
  },
  title: {
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
    color: 'var(--color-text)',
    marginBottom: 'var(--space-sm)',
  },
  message: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    maxWidth: 360,
    marginBottom: 'var(--space-lg)',
  },
  links: {
    display: 'flex',
    gap: 'var(--space-sm)',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
};
