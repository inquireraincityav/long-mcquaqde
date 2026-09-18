import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function formatPhone(val) {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) { setError('Enter a valid 10-digit phone number.'); return; }
    if (!password) { setError('Enter your password.'); return; }
    const result = signIn(digits, password);
    if (result.error) { setError(result.error); return; }
    navigate('/browse');
  }

  return (
    <div className="page-enter" style={styles.page}>
      <div style={styles.header}>
        <span style={styles.brandBar} />
        <div>
          <span style={styles.brandName}>L&M Pro</span>
          <span style={styles.brandSub}>RENTALS</span>
        </div>
      </div>

      <h1 style={styles.title}>Welcome back</h1>
      <p style={styles.subtitle}>Sign in with your phone number</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Phone Number</label>
          <input
            type="tel"
            placeholder="(604) 555-1234"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            style={styles.input}
            autoComplete="tel"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn-primary" style={styles.submitBtn}>
          Sign In
        </button>
      </form>

      <p style={styles.footer}>
        Don&apos;t have an account?{' '}
        <Link to="/sign-up" style={styles.link}>Sign Up</Link>
      </p>

      <Link to="/browse" style={styles.skip}>Continue as Guest</Link>
    </div>
  );
}

const styles = {
  page: {
    padding: 'var(--space-xl) var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100dvh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    marginBottom: 'var(--space-xl)',
    marginTop: 'var(--space-xl)',
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
    fontSize: '18px',
    lineHeight: 1.05,
    letterSpacing: '-0.6px',
    color: 'var(--color-text)',
  },
  brandSub: {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '1.4px',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 700,
    marginBottom: 'var(--space-xs)',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-xl)',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 360,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  error: {
    padding: 'var(--space-sm) var(--space-md)',
    background: 'var(--color-danger-light)',
    color: 'var(--color-danger)',
    fontSize: 'var(--text-sm)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
  },
  label: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '12px 14px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-base)',
    background: 'var(--color-surface-solid)',
    color: 'var(--color-text)',
    outline: 'none',
    width: '100%',
  },
  submitBtn: {
    width: '100%',
    marginTop: 'var(--space-sm)',
    borderRadius: 'var(--radius-lg)',
  },
  footer: {
    marginTop: 'var(--space-lg)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  link: {
    color: 'var(--color-accent)',
    fontWeight: 600,
  },
  skip: {
    marginTop: 'var(--space-md)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-tertiary)',
    textDecoration: 'underline',
  },
};
