import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppHeader({ title, subtitle, backTo, children }) {
  const { user } = useAuth();

  const profileIcon = (
    <Link to={user ? '/profile' : '/sign-in'} style={styles.profileBtn} aria-label="Profile">
      {user ? (
        <span style={styles.profileAvatar}>{user.name?.charAt(0)?.toUpperCase() || '?'}</span>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )}
    </Link>
  );

  if (title) {
    return (
      <div style={styles.pageHeader}>
        {backTo && (
          <Link to={backTo} style={styles.backBtn} aria-label="Go back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={styles.pageTitle}>{title}</h1>
          {subtitle && <p style={styles.pageSubtitle}>{subtitle}</p>}
        </div>
        {children}
        {profileIcon}
      </div>
    );
  }

  return (
    <div style={styles.header}>
      <Link to="/" style={styles.brand}>
        <span style={styles.brandBar} />
        <div>
          <span style={styles.brandName}>L&M Pro</span>
          <span style={styles.brandSub}>RENTALS</span>
        </div>
      </Link>
      <div style={styles.headerRight}>
        {children}
        {profileIcon}
      </div>
    </div>
  );
}

const styles = {
  header: {
    padding: 'var(--space-md) var(--space-md) 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    textDecoration: 'none',
    color: 'var(--color-text)',
  },
  brandBar: {
    width: 4,
    height: 30,
    borderRadius: 2,
    background: 'var(--color-accent)',
    flexShrink: 0,
  },
  brandName: {
    display: 'block',
    fontWeight: 800,
    fontSize: '15px',
    lineHeight: 1.05,
    letterSpacing: '-0.6px',
  },
  brandSub: {
    display: 'block',
    fontSize: '9.5px',
    fontWeight: 700,
    letterSpacing: '1.4px',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
  },
  pageHeader: {
    padding: 'var(--space-md) var(--space-md) 0',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-full)',
    color: 'var(--color-text)',
    textDecoration: 'none',
    flexShrink: 0,
  },
  pageTitle: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  pageSubtitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-full)',
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    flexShrink: 0,
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface-solid)',
  },
  profileAvatar: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#fff',
    width: 28,
    height: 28,
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
