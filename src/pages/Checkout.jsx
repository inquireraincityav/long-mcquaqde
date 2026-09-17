import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { useCart } from '../context/CartContext';
import useOrders from '../hooks/useOrders';
import { resolveFulfillment } from '../utils/fulfillment';
import { daysBetween, computeItemTotal, formatPrice } from '../utils/pricing';
import { getDisplayData } from '../utils/displayData';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, dateRange, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [fulfillMethod, setFulfillMethod] = useState('pickup');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [hasCreditCard, setHasCreditCard] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', card: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(null);

  const fulfillment = useMemo(() => resolveFulfillment(items), [items]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let hasTbd = false;
    for (const ci of items) {
      if (!ci.rentalDay) { hasTbd = true; continue; }
      const d = daysBetween(ci.dateRange?.start, ci.dateRange?.end);
      const it = computeItemTotal(ci, d);
      if (it !== null) subtotal += it * ci.qty;
      else hasTbd = true;
    }
    const deposit = hasCreditCard ? 0 : 20;
    const delivery = fulfillMethod === 'delivery' ? 45 : 0;
    return { subtotal, deposit, delivery, total: subtotal + deposit + delivery, hasTbd };
  }, [items, hasCreditCard, fulfillMethod]);

  function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  }

  function handleField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) e.phone = '10-digit phone required';
    if (!form.card.trim() || form.card.replace(/\D/g, '').length < 15) e.card = 'Valid card number required';
    if (!form.expiry.trim() || !/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = 'MM/YY format';
    if (!form.cvv.trim() || form.cvv.length < 3) e.cvv = '3-4 digits';
    return e;
  }

  function handlePlaceOrder() {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const order = addOrder({
      items: items.map((ci) => ({
        product: ci.product,
        qty: ci.qty,
        dateRange: ci.dateRange,
        rentalDay: ci.rentalDay,
        rentalMonth: ci.rentalMonth,
      })),
      dateRange,
      fulfillment: {
        type: fulfillment.type,
        locations: fulfillment.locations,
        method: fulfillMethod,
      },
      totals: { ...totals },
    });
    setConfirmed(order);
    clearCart();
  }

  if (confirmed) {
    return (
      <div className="page-enter">
        <AppHeader title="Order Confirmed" />
        <div style={styles.body}>
          <div style={styles.confirmCard}>
            <div style={styles.confirmCheck}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="var(--color-success-light)" />
                <polyline points="16 24 22 30 32 18" fill="none" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={styles.confirmTitle}>Reservation confirmed</h2>
            <p style={styles.confirmSub}>
              Your rental reservation has been placed. You'll receive a confirmation email shortly.
            </p>
            <div style={styles.confirmId}>{confirmed.id}</div>
            <div style={styles.confirmDetails}>
              <div style={styles.confirmRow}>
                <span style={styles.confirmLabel}>Items</span>
                <span>{confirmed.items.length} items</span>
              </div>
              <div style={styles.confirmRow}>
                <span style={styles.confirmLabel}>Pickup</span>
                <span>
                  {dateRange?.start
                    ? formatDateShort(dateRange.start)
                    : 'TBD'}
                </span>
              </div>
              <div style={styles.confirmRow}>
                <span style={styles.confirmLabel}>Return</span>
                <span>
                  {dateRange?.end
                    ? formatDateShort(dateRange.end)
                    : 'TBD'}
                </span>
              </div>
              {fulfillment.locations?.[0] && (
                <div style={styles.confirmRow}>
                  <span style={styles.confirmLabel}>Location</span>
                  <span>{fulfillment.locations[0].name}</span>
                </div>
              )}
              <div style={styles.confirmDivider} />
              <div style={styles.confirmRow}>
                <span style={{ fontWeight: 700 }}>Total charged</span>
                <span style={{ fontWeight: 700 }}>{formatPrice(confirmed.totals.total)}</span>
              </div>
            </div>
          </div>
          <button
            className="btn-primary"
            style={styles.navBtn}
            onClick={() => navigate('/orders')}
          >
            View My Orders
          </button>
          <button
            className="btn-outline-accent"
            style={styles.browseBtn}
            onClick={() => navigate('/browse')}
          >
            Continue Browsing
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-enter">
        <AppHeader title="Checkout" backTo="/cart" />
        <div style={styles.body}>
          <div style={styles.emptyWrap}>
            <h3 style={styles.emptyTitle}>Nothing to check out</h3>
            <p style={styles.emptyMsg}>Your cart is empty. Add some gear first.</p>
            <button
              className="btn-outline-accent"
              style={{ marginTop: 16, padding: '8px 24px', textDecoration: 'none' }}
              onClick={() => navigate('/browse')}
            >
              Browse Gear
            </button>
          </div>
        </div>
      </div>
    );
  }

  const dateLabel = dateRange?.start && dateRange?.end
    ? `${formatDateShort(dateRange.start)} – ${formatDateShort(dateRange.end)}`
    : '';

  return (
    <div className="page-enter">
      <AppHeader title="Checkout" backTo="/cart" />

      <div style={styles.body}>
        {/* Order Summary */}
        <div style={styles.section}>
          <button style={styles.sectionToggle} onClick={() => setSummaryOpen(!summaryOpen)}>
            <div>
              <span style={styles.sectionTitle}>Order Summary</span>
              <span style={styles.sectionSub}>
                {items.length} item{items.length !== 1 ? 's' : ''}
                {dateLabel ? ` · ${dateLabel}` : ''}
              </span>
            </div>
            <span style={styles.chevron}>{summaryOpen ? '▲' : '▼'}</span>
          </button>
          {summaryOpen && (
            <div style={styles.summaryItems}>
              {items.map((ci) => {
                const d = getDisplayData(ci.product);
                const days = daysBetween(ci.dateRange?.start, ci.dateRange?.end);
                const lineTotal = ci.rentalDay ? computeItemTotal(ci, days) : null;
                return (
                  <div key={ci.product} style={styles.summaryLine}>
                    <span style={styles.summaryQty}>{ci.qty}x</span>
                    <span style={styles.summaryName}>{d.shortName}</span>
                    <span style={styles.summaryPrice}>
                      {lineTotal !== null ? formatPrice(lineTotal * ci.qty) : 'TBD'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Fulfillment method */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Fulfillment</h3>
          {fulfillment.locations?.[0] && (
            <div style={styles.locationInfo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{fulfillment.locations.map((l) => l.name).join(', ')}</span>
            </div>
          )}
          <div style={styles.fulfillToggle}>
            <button
              style={{
                ...styles.fulfillOption,
                ...(fulfillMethod === 'pickup' ? styles.fulfillActive : {}),
              }}
              onClick={() => setFulfillMethod('pickup')}
            >
              <span style={styles.fulfillIcon}>🏪</span>
              <div>
                <span style={styles.fulfillLabel}>Store Pickup</span>
                <span style={styles.fulfillDesc}>Free · Ready at scheduled time</span>
              </div>
            </button>
            <button
              style={{
                ...styles.fulfillOption,
                ...(fulfillMethod === 'delivery' ? styles.fulfillActive : {}),
              }}
              onClick={() => setFulfillMethod('delivery')}
            >
              <span style={styles.fulfillIcon}>🚚</span>
              <div>
                <span style={styles.fulfillLabel}>Delivery</span>
                <span style={styles.fulfillDesc}>$45 flat fee · Vancouver metro</span>
              </div>
            </button>
          </div>
        </div>

        {/* Deposit terms */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Deposit & Terms</h3>
          <div style={styles.termsList}>
            <div style={styles.termItem}>
              <span style={styles.termBullet}>•</span>
              Valid government-issued ID required at pickup
            </div>
            <div style={styles.termItem}>
              <span style={styles.termBullet}>•</span>
              Hold fee may apply for advance reservations
            </div>
            <div style={styles.termItem}>
              <span style={styles.termBullet}>•</span>
              Damage review within 48 hrs of return
            </div>
          </div>
          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={!hasCreditCard}
              onChange={(e) => setHasCreditCard(!e.target.checked)}
              style={styles.checkbox}
              id="no-cc"
            />
            <span style={styles.checkboxLabel}>
              I don't have a credit card on file
              {!hasCreditCard && (
                <span style={styles.depositNote}> — $20 refundable deposit applies</span>
              )}
            </span>
          </label>
        </div>

        {/* Payment form (mocked) */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Payment</h3>
          <p style={styles.mockNotice}>
            Demo only — no real payment is processed
          </p>
          <div style={styles.fieldGroup}>
            <div style={styles.field}>
              <label style={styles.fieldLabel} htmlFor="co-name">Full Name</label>
              <input
                id="co-name"
                style={{ ...styles.fieldInput, ...(errors.name ? styles.fieldError : {}) }}
                type="text"
                placeholder="Jane Doe"
                value={form.name}
                onChange={(e) => handleField('name', e.target.value)}
              />
              {errors.name && <span style={styles.errorMsg}>{errors.name}</span>}
            </div>
            <div style={styles.fieldRow}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.fieldLabel} htmlFor="co-email">Email</label>
                <input
                  id="co-email"
                  style={{ ...styles.fieldInput, ...(errors.email ? styles.fieldError : {}) }}
                  type="email"
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={(e) => handleField('email', e.target.value)}
                />
                {errors.email && <span style={styles.errorMsg}>{errors.email}</span>}
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.fieldLabel} htmlFor="co-phone">Phone</label>
                <input
                  id="co-phone"
                  style={{ ...styles.fieldInput, ...(errors.phone ? styles.fieldError : {}) }}
                  type="tel"
                  placeholder="604-555-0123"
                  value={form.phone}
                  onChange={(e) => handleField('phone', e.target.value)}
                />
                {errors.phone && <span style={styles.errorMsg}>{errors.phone}</span>}
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.fieldLabel} htmlFor="co-card">Card Number</label>
              <input
                id="co-card"
                style={{ ...styles.fieldInput, ...(errors.card ? styles.fieldError : {}) }}
                type="text"
                placeholder="4242 4242 4242 4242"
                value={form.card}
                onChange={(e) => handleField('card', e.target.value)}
                maxLength={19}
              />
              {errors.card && <span style={styles.errorMsg}>{errors.card}</span>}
            </div>
            <div style={styles.fieldRow}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.fieldLabel} htmlFor="co-expiry">Expiry</label>
                <input
                  id="co-expiry"
                  style={{ ...styles.fieldInput, ...(errors.expiry ? styles.fieldError : {}) }}
                  type="text"
                  placeholder="12/27"
                  value={form.expiry}
                  onChange={(e) => handleField('expiry', e.target.value)}
                  maxLength={5}
                />
                {errors.expiry && <span style={styles.errorMsg}>{errors.expiry}</span>}
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.fieldLabel} htmlFor="co-cvv">CVV</label>
                <input
                  id="co-cvv"
                  style={{ ...styles.fieldInput, ...(errors.cvv ? styles.fieldError : {}) }}
                  type="text"
                  placeholder="123"
                  value={form.cvv}
                  onChange={(e) => handleField('cvv', e.target.value)}
                  maxLength={4}
                />
                {errors.cvv && <span style={styles.errorMsg}>{errors.cvv}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Itemized total */}
        <div style={styles.totalCard}>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Equipment subtotal</span>
            <span style={styles.totalValue}>{formatPrice(totals.subtotal)}</span>
          </div>
          {totals.deposit > 0 && (
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>
                Refundable deposit
                <span style={styles.depositTag}>no CC on file</span>
              </span>
              <span style={styles.totalValue}>{formatPrice(totals.deposit)}</span>
            </div>
          )}
          {totals.delivery > 0 && (
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Delivery fee</span>
              <span style={styles.totalValue}>{formatPrice(totals.delivery)}</span>
            </div>
          )}
          {totals.hasTbd && (
            <p style={styles.tbdNote}>Some items have unconfirmed pricing</p>
          )}
          <div style={styles.totalDivider} />
          <div style={styles.totalRow}>
            <span style={styles.grandLabel}>Total</span>
            <span style={styles.grandValue}>{formatPrice(totals.total)}</span>
          </div>
        </div>

        <button
          className="btn-primary"
          style={styles.placeOrderBtn}
          onClick={handlePlaceOrder}
        >
          Place Order — {formatPrice(totals.total)}
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
    paddingBottom: 'calc(var(--bottom-nav-height) + var(--space-lg))',
  },
  section: {
    background: 'var(--color-surface-raised)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--glass-shadow)',
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  sectionToggle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    padding: 0,
    color: 'var(--color-text)',
  },
  sectionTitle: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    display: 'block',
  },
  sectionSub: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
    display: 'block',
    marginTop: 2,
  },
  chevron: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-tertiary)',
  },
  summaryItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginTop: 'var(--space-sm)',
    borderTop: '1px solid var(--color-border)',
    paddingTop: 'var(--space-sm)',
  },
  summaryLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    fontSize: 'var(--text-sm)',
  },
  summaryQty: {
    fontWeight: 600,
    color: 'var(--color-accent)',
    minWidth: 28,
  },
  summaryName: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  summaryPrice: {
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    flexShrink: 0,
  },
  locationInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  fulfillToggle: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  fulfillOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--color-border)',
    background: 'var(--color-surface-solid)',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    color: 'var(--color-text)',
    transition: 'border-color 0.15s',
  },
  fulfillActive: {
    borderColor: 'var(--color-accent)',
    background: 'var(--color-accent-light)',
  },
  fulfillIcon: {
    fontSize: '1.5rem',
    flexShrink: 0,
  },
  fulfillLabel: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    display: 'block',
  },
  fulfillDesc: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
    display: 'block',
    marginTop: 2,
  },
  termsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  termItem: {
    display: 'flex',
    gap: 8,
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  },
  termBullet: {
    color: 'var(--color-text-tertiary)',
    flexShrink: 0,
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-sm)',
    marginTop: 'var(--space-xs)',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: 'var(--color-accent)',
    marginTop: 3,
    flexShrink: 0,
  },
  checkboxLabel: {
    fontSize: 'var(--text-sm)',
    lineHeight: 1.5,
  },
  depositNote: {
    color: 'var(--color-warning)',
    fontWeight: 600,
  },
  mockNotice: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-tertiary)',
    fontStyle: 'italic',
    margin: 0,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  fieldRow: {
    display: 'flex',
    gap: 'var(--space-sm)',
  },
  fieldLabel: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  fieldInput: {
    padding: '10px 12px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    background: 'var(--color-surface-solid)',
    color: 'var(--color-text)',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    width: '100%',
  },
  fieldError: {
    borderColor: 'var(--color-danger, #dc2626)',
  },
  errorMsg: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-danger, #dc2626)',
  },
  totalCard: {
    background: 'var(--color-surface-raised)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--glass-shadow)',
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 'var(--text-sm)',
  },
  totalLabel: {
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  totalValue: {
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  depositTag: {
    fontSize: '10px',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-warning-light)',
    color: 'var(--color-warning)',
  },
  totalDivider: {
    height: 1,
    background: 'var(--color-border)',
  },
  grandLabel: {
    fontWeight: 700,
    fontSize: 'var(--text-base)',
    color: 'var(--color-text)',
  },
  grandValue: {
    fontWeight: 700,
    fontSize: 'var(--text-lg)',
    color: 'var(--color-text)',
    fontVariantNumeric: 'tabular-nums',
  },
  tbdNote: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-warning)',
    margin: 0,
  },
  placeOrderBtn: {
    width: '100%',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--text-base)',
    fontWeight: 700,
  },
  confirmCard: {
    background: 'var(--color-surface-raised)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--glass-shadow)',
    padding: 'var(--space-xl) var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 'var(--space-sm)',
  },
  confirmCheck: {
    marginBottom: 'var(--space-sm)',
  },
  confirmTitle: {
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
  },
  confirmSub: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
    maxWidth: 320,
    margin: 0,
  },
  confirmId: {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--color-accent)',
    padding: '8px 20px',
    background: 'var(--color-accent-light)',
    borderRadius: 'var(--radius-full)',
    marginTop: 'var(--space-sm)',
    fontVariantNumeric: 'tabular-nums',
  },
  confirmDetails: {
    width: '100%',
    marginTop: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
    textAlign: 'left',
  },
  confirmRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 'var(--text-sm)',
  },
  confirmLabel: {
    color: 'var(--color-text-secondary)',
  },
  confirmDivider: {
    height: 1,
    background: 'var(--color-border)',
  },
  navBtn: {
    width: '100%',
    borderRadius: 'var(--radius-lg)',
  },
  browseBtn: {
    width: '100%',
    padding: '12px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    border: '1.5px solid var(--color-accent)',
    borderRadius: 'var(--radius-lg)',
    background: 'transparent',
    color: 'var(--color-accent)',
    fontWeight: 600,
    fontSize: 'var(--text-sm)',
  },
  emptyWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px 16px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
    marginBottom: 8,
  },
  emptyMsg: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
};
