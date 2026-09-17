import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/browse', label: 'Browse' },
  { to: '/kit-builder', label: 'Kit Builder' },
  { to: '/orders', label: 'Orders' },
];

export default function Navbar() {
  const location = useLocation();
  const { itemCount } = useCart();

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoMark}>L&M</span>
          <span style={styles.logoText}>Gear Rental</span>
        </Link>

        <div style={styles.links}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                ...styles.link,
                ...(location.pathname === link.to ? styles.linkActive : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link to="/cart" style={styles.cartBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'var(--nav-height)',
    background: 'rgba(255, 255, 255, 0.72)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid var(--color-border)',
    zIndex: 100,
  },
  inner: {
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    padding: '0 var(--space-md)',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-lg)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    textDecoration: 'none',
    color: 'var(--color-text)',
    flexShrink: 0,
  },
  logoMark: {
    fontWeight: 700,
    fontSize: 'var(--text-lg)',
    color: 'var(--color-accent)',
  },
  logoText: {
    fontWeight: 500,
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  links: {
    display: 'flex',
    gap: 'var(--space-xs)',
    flex: 1,
  },
  link: {
    padding: '6px 14px',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    transition: 'background 0.15s, color 0.15s',
  },
  linkActive: {
    background: 'var(--color-accent-light)',
    color: 'var(--color-accent)',
  },
  cartBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-full)',
    color: 'var(--color-text)',
    textDecoration: 'none',
    transition: 'background 0.15s',
    flexShrink: 0,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    background: 'var(--color-accent)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  },
};
