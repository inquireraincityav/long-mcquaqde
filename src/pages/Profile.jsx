import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    address: user?.address || '',
    email: user?.email || '',
  });
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  if (!user) {
    navigate('/sign-in');
    return null;
  }

  function formatPhone(digits) {
    if (!digits || digits.length !== 10) return digits;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function handleSave() {
    updateProfile({
      name: form.name.trim(),
      address: form.address.trim(),
      email: form.email.trim(),
    });
    setEditing(false);
  }

  function handleSignOut() {
    signOut();
    navigate('/browse');
  }

  function handleContactSubmit(e) {
    e.preventDefault();
    setContactSent(true);
    setContactForm({ subject: '', message: '' });
  }

  return (
    <div className="page-enter">
      <AppHeader title="Profile" backTo="/browse" />

      <div style={styles.body}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {user.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <h2 style={styles.userName}>{user.name}</h2>
          <p style={styles.userPhone}>{formatPhone(user.phone)}</p>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Account Details</h3>
            <button style={styles.editBtn} onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <div style={styles.editForm}>
              <div style={styles.field}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={styles.input}
                />
              </div>
              <button className="btn-primary" style={styles.saveBtn} onClick={handleSave}>
                Save Changes
              </button>
            </div>
          ) : (
            <div style={styles.detailsList}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Name</span>
                <span style={styles.detailValue}>{user.name}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Phone</span>
                <span style={styles.detailValue}>{formatPhone(user.phone)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Email</span>
                <span style={styles.detailValue}>{user.email}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Address</span>
                <span style={styles.detailValue}>{user.address}</span>
              </div>
              {user.card && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Card</span>
                  <span style={styles.detailValue}>{user.card.number} &middot; {user.card.expiry}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={styles.section}>
          <button
            style={styles.contactBtn}
            onClick={() => { setContactOpen(!contactOpen); setContactSent(false); }}
          >
            <div style={styles.contactBtnContent}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Contact Us</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: contactOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {contactOpen && (
            <div style={styles.contactSection}>
              {contactSent ? (
                <div style={styles.contactSuccess}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p style={styles.contactSuccessText}>
                    Message sent! Our team will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={styles.contactForm}>
                  <p style={styles.contactInfo}>
                    For refunds, order issues, or general inquiries
                  </p>
                  <div style={styles.field}>
                    <label style={styles.label}>Subject</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      style={styles.input}
                    >
                      <option value="">Select a topic...</option>
                      <option value="refund">Refund Request</option>
                      <option value="order">Order Issue</option>
                      <option value="damage">Damage Report</option>
                      <option value="billing">Billing Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Message</label>
                    <textarea
                      placeholder="Describe your issue..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      style={{ ...styles.input, minHeight: 100, resize: 'vertical' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={styles.sendBtn}
                    disabled={!contactForm.subject || !contactForm.message.trim()}
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <button style={styles.signOutBtn} onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

const styles = {
  body: {
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
    paddingBottom: 'var(--space-3xl)',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'var(--space-lg) 0',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-accent)',
    color: '#fff',
    fontSize: 'var(--text-2xl)',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'var(--space-sm)',
  },
  userName: {
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
  },
  userPhone: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  section: {
    background: 'var(--color-surface-raised)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-md)',
    borderBottom: '1px solid var(--color-border)',
  },
  sectionTitle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
  },
  editBtn: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-accent)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  detailsList: {
    padding: 0,
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--space-sm) var(--space-md)',
    borderBottom: '1px solid var(--color-border)',
  },
  detailLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  detailValue: {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-text)',
    textAlign: 'right',
    maxWidth: '60%',
    wordBreak: 'break-word',
  },
  editForm: {
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
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
    fontFamily: 'inherit',
  },
  saveBtn: {
    width: '100%',
    borderRadius: 'var(--radius-lg)',
  },
  contactBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 'var(--space-md)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
  },
  contactBtnContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  contactSection: {
    borderTop: '1px solid var(--color-border)',
    padding: 'var(--space-md)',
  },
  contactInfo: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
    margin: '0 0 var(--space-md)',
  },
  contactForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  sendBtn: {
    width: '100%',
    borderRadius: 'var(--radius-lg)',
  },
  contactSuccess: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-md)',
  },
  contactSuccessText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-success)',
    textAlign: 'center',
    margin: 0,
  },
  signOutBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-danger)',
    background: 'var(--color-danger-light)',
    color: 'var(--color-danger)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 'var(--space-sm)',
  },
};
