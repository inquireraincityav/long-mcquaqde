import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const tabs = [
  {
    to: '/browse',
    label: 'Browse',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : '#999'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.5" cy="10.5" r="7.5" />
        <line x1="21" y1="21" x2="15.8" y2="15.8" />
      </svg>
    ),
  },
  {
    to: '/kit-builder',
    label: 'GearGenie',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : '#999'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l1.09 3.26L16 6l-2.18 1.74L14.54 11 12 9.27 9.46 11l.72-3.26L8 6l2.91-.74z" />
        <path d="M5 15l.55 1.63L7.18 17.5 5.82 18.37 6.36 20 5 19.14 3.64 20l.54-1.63L3 17.5l1.63-.87z" />
        <path d="M19 15l.55 1.63 1.63.87-1.36.87.54 1.63L19 19.14 17.64 20l.54-1.63L17 17.5l1.63-.87z" />
      </svg>
    ),
  },
  {
    to: '/cart',
    label: 'Cart',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : '#999'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    hasBadge: true,
  },
  {
    to: '/orders',
    label: 'Orders',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : '#999'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
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

  const hideOnPaths = ['/checkout', '/pickup-return', '/sign-in', '/sign-up', '/profile'];
  if (hideOnPaths.some((p) => location.pathname.startsWith(p))) return null;

  return (
    <nav style={styles.nav}>
      {tabs.map((tab) => {
        const active = isTabActive(tab.to);
        return (
          <Link key={tab.to} to={tab.to} style={{ ...styles.tab, color: active ? 'var(--color-accent)' : '#999' }}>
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
    background: 'var(--color-bg)',
    borderTop: '1px solid var(--color-border-strong)',
    boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
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
