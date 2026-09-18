import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    saveCard: false,
    cardNumber: '',
    cardExpiry: '',
    cardName: '',
  });
  const [error, setError] = useState('');

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function formatPhone(val) {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function formatExpiry(val) {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.address.trim()) { setError('Address is required.'); return; }
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length !== 10) { setError('Enter a valid 10-digit phone number.'); return; }
    if (!form.email.trim() || !form.email.includes('@')) { setError('Enter a valid email.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }

    const card = form.saveCard && form.cardNumber
      ? { number: `**** ${form.cardNumber.slice(-4)}`, expiry: form.cardExpiry, name: form.cardName }
      : null;

    const result = signUp({
      name: form.name.trim(),
      address: form.address.trim(),
      phone: digits,
      email: form.email.trim(),
      password: form.password,
      card,
    });

    if (result.error) { setError(result.error); return; }
    navigate('/browse');
  }

  return (
    <div className="page-enter" style={styles.page}>
      <Link to="/sign-in" style={styles.backLink}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </Link>

      <h1 style={styles.title}>Create Account</h1>
      <p style={styles.subtitle}>Set up your L&M Pro Rentals profile</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            style={styles.input}
            autoComplete="name"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Address</label>
          <input
            type="text"
            placeholder="123 Main St, Vancouver, BC"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            style={styles.input}
            autoComplete="street-address"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Phone Number</label>
          <input
            type="tel"
            placeholder="(604) 555-1234"
            value={form.phone}
            onChange={(e) => set('phone', formatPhone(e.target.value))}
            style={styles.input}
            autoComplete="tel"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            style={styles.input}
            autoComplete="email"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            style={styles.input}
            autoComplete="new-password"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={(e) => set('confirmPassword', e.target.value)}
            style={styles.input}
            autoComplete="new-password"
          />
        </div>

        <div style={styles.divider} />

        <button
          type="button"
          style={styles.cardToggle}
          onClick={() => set('saveCard', !form.saveCard)}
        >
          <div style={{
            ...styles.checkbox,
            ...(form.saveCard ? styles.checkboxActive : {}),
          }}>
            {form.saveCard && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span style={styles.cardToggleText}>Save card details for faster checkout</span>
        </button>

        {form.saveCard && (
          <div style={styles.cardSection}>
            <p style={styles.mockNote}>Demo only — no real charges will be made. A $100 refundable deposit applies per order.</p>
            <div style={styles.field}>
              <label style={styles.label}>Card Number</label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                value={form.cardNumber}
                onChange={(e) => set('cardNumber', e.target.value.replace(/\D/g, '').slice(0, 16))}
                style={styles.input}
                autoComplete="cc-number"
              />
            </div>
            <div style={styles.cardRow}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={form.cardExpiry}
                  onChange={(e) => set('cardExpiry', formatExpiry(e.target.value))}
                  style={styles.input}
                  autoComplete="cc-exp"
                />
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Name on Card</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.cardName}
                  onChange={(e) => set('cardName', e.target.value)}
                  style={styles.input}
                  autoComplete="cc-name"
                />
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary" style={styles.submitBtn}>
          Create Account
        </button>
      </form>

      <p style={styles.footer}>
        Already have an account?{' '}
        <Link to="/sign-in" style={styles.link}>Sign In</Link>
      </p>
    </div>
  );
}

const styles = {
  page: {
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 'var(--space-3xl)',
  },
  backLink: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    textDecoration: 'none',
    marginBottom: 'var(--space-lg)',
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
    marginBottom: 'var(--space-lg)',
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
  divider: {
    height: 1,
    background: 'var(--color-border)',
    margin: 'var(--space-xs) 0',
  },
  cardToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 0,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    border: '2px solid var(--color-border-strong)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.15s, border-color 0.15s',
  },
  checkboxActive: {
    background: 'var(--color-accent)',
    borderColor: 'var(--color-accent)',
  },
  cardToggleText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text)',
    fontWeight: 500,
  },
  cardSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
    padding: 'var(--space-md)',
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
  },
  mockNote: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-warning)',
    fontStyle: 'italic',
    margin: 0,
    textAlign: 'center',
  },
  cardRow: {
    display: 'flex',
    gap: 'var(--space-md)',
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
};
