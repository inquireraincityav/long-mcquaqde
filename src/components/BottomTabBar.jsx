import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const tabs = [
  {
    to: '/browse',
    label: 'Browse',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : '#aaa'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    to: '/kit-builder',
    label: 'Kit Builder',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : '#aaa'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    to: '/cart',
    label: 'Cart',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : '#aaa'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    hasBadge: true,
  },
  {
    to: '/orders',
    label: 'Orders',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : '#aaa'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

export default function BottomTabBar() {
  const location = useLocation();
  const { itemCount } = useCart();

  const isTabActive = (to) => {
    if (to === '/browse') return location.pathname === '/browse' || location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  const hideOnPaths = ['/checkout', '/pickup-return'];
  if (hideOnPaths.some((p) => location.pathname.startsWith(p))) return null;

  return (
    <nav style={styles.nav}>
      {tabs.map((tab) => {
        const active = isTabActive(tab.to);
        return (
          <Link key={tab.to} to={tab.to} style={{ ...styles.tab, color: active ? 'var(--color-accent)' : '#aaa' }}>
            <div style={styles.iconWrap}>
              {tab.icon(active)}
              {tab.hasBadge && itemCount > 0 && (
                <span style={styles.badge}>{itemCount}</span>
              )}
            </div>
            <span style={{ ...styles.label, fontWeight: active ? 700 : 400 }}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 'var(--bottom-nav-height)',
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    borderTop: '1px solid var(--color-border-glass)',
    boxShadow: '0 -1px 0 rgba(0,0,0,0.05), var(--glass-highlight)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 100,
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    textDecoration: 'none',
    padding: '4px 16px',
    minWidth: 64,
  },
  iconWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    background: 'var(--color-accent)',
    color: '#fff',
    fontSize: '10px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  },
  label: {
    fontSize: '10px',
    lineHeight: 1,
    letterSpacing: '0.1px',
  },
};
