import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import QuantityStepper from '../components/QuantityStepper';
import BottomSheet from '../components/BottomSheet';
import { useCart } from '../context/CartContext';
import { buildKit } from '../utils/kitMatcher';
import { daysBetween, computeItemTotal, formatPrice, } from '../utils/pricing';
import { getDisplayData, getWeeklyRate } from '../utils/displayData';
import { getCategoryPlaceholder } from '../utils/categoryPlaceholders';

const EVENT_TYPES = [
  { value: 'corporate_panel', label: 'Corporate Conference' },
  { value: 'dj_set', label: 'DJ / Dance Party' },
  { value: 'wedding_ceremony', label: 'Wedding Ceremony' },
  { value: 'product_launch', label: 'Product Launch' },
  { value: 'town_hall', label: 'Town Hall Meeting' },
  { value: 'live_concert', label: 'Live Concert' },
  { value: 'custom', label: 'Custom' },
];

export default function KitBuilder() {
  const navigate = useNavigate();
  const { addKit } = useCart();

  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState(150);
  const [venue, setVenue] = useState('Indoor');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [result, setResult] = useState(null);
  const [whyOpen, setWhyOpen] = useState(false);
  const [eventSheetOpen, setEventSheetOpen] = useState(false);

  const canGenerate = eventType && guestCount > 0 && dateRange.start && dateRange.end;
  const days = daysBetween(dateRange.start, dateRange.end);

  function handleGenerate() {
    if (!canGenerate) return;
    setResult(buildKit(eventType, guestCount, venue));
    setWhyOpen(false);
  }

  function handleRemoveItem(product) {
    if (!result) return;
    setResult({
      ...result,
      items: result.items.filter((i) => i.product !== product),
    });
  }

  function handleUpdateQty(product, qty) {
    if (!result) return;
    setResult({
      ...result,
      items: result.items.map((i) =>
        i.product === product ? { ...i, qty } : i
      ),
    });
  }

  function handleAddToCart() {
    if (!result || !result.items.length) return;
    addKit({ items: result.items, dateRange });
    navigate('/cart');
  }

  const kitTotals = useMemo(() => {
    if (!result || !result.items.length) return null;
    let dayTotal = 0;
    let hasTbd = false;
    let itemCount = 0;
    for (const item of result.items) {
      itemCount += item.qty;
      if (!item.rentalDay) { hasTbd = true; continue; }
      dayTotal += item.rentalDay * item.qty;
    }
    const weekTotal = dayTotal * 4;
    const rentalTotal = days > 0 ? (() => {
      let t = 0;
      for (const item of result.items) {
        if (!item.rentalDay) continue;
        const it = computeItemTotal(item, days);
        if (it !== null) t += it * item.qty;
      }
      return t;
    })() : null;
    return { dayTotal, weekTotal, rentalTotal, hasTbd, itemCount };
  }, [result, days]);

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100dvh - var(--bottom-nav-height))' }}>
      <AppHeader
        title="GearGenie"
        subtitle="AI-suggested gear for your event"
      />

      {!result && <div style={{ flex: 1 }} />}

      <div style={styles.body}>
        {/* Form */}
        <div style={styles.formCard}>
          <div style={styles.formRow}>
            <div style={styles.fieldWide}>
              <label style={styles.label}>Event Type</label>
              <button
                style={styles.sheetTrigger}
                onClick={() => setEventSheetOpen(true)}
              >
                <span style={{ color: eventType ? 'var(--color-text)' : 'var(--color-text-tertiary)' }}>
                  {eventType ? EVENT_TYPES.find((e) => e.value === eventType)?.label : 'Select event type…'}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
            <div style={styles.fieldNarrow}>
              <label style={styles.label}>Guests</label>
              <div style={styles.guestStepper}>
                <button
                  style={styles.stepBtn}
                  onClick={() => setGuestCount(Math.max(10, guestCount - 10))}
                >
                  -
                </button>
                <span style={styles.guestValue}>{guestCount}</span>
                <button
                  style={styles.stepBtn}
                  onClick={() => setGuestCount(guestCount + 10)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <label style={styles.label}>Venue</label>
            <div style={styles.toggleRow}>
              <button
                style={{
                  ...styles.toggleBtn,
                  ...(venue === 'Indoor' ? styles.toggleActive : {}),
                }}
                onClick={() => setVenue('Indoor')}
              >
                Indoor
              </button>
              <button
                style={{
                  ...styles.toggleBtn,
                  ...(venue === 'Outdoor' ? styles.toggleActive : {}),
                }}
                onClick={() => setVenue('Outdoor')}
              >
                Outdoor
              </button>
            </div>
          </div>

          <div>
            <label style={{ ...styles.label, color: 'var(--color-accent)' }}>
              Date Range
            </label>
            <div style={styles.dateRow}>
              <label htmlFor="kit-start" style={styles.calLabel}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </label>
              <input
                id="kit-start"
                type="date"
                className={dateRange.start ? '' : 'date-empty'}
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                style={styles.dateInput}
              />
              <span style={{ color: 'var(--color-text-tertiary)' }}>-</span>
              <input
                type="date"
                className={dateRange.end ? '' : 'date-empty'}
                value={dateRange.end}
                min={dateRange.start || ''}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                style={styles.dateInput}
              />
            </div>
          </div>

          <button
            className="btn-primary"
            style={styles.generateBtn}
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Generate Kit
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={styles.results}>
            {result.type === 'no_match' ? (
              <div style={styles.noMatch}>
                <div style={styles.noMatchIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 style={styles.noMatchTitle}>{result.label}</h3>
                <p style={styles.noMatchText}>{result.message}</p>
              </div>
            ) : (
              <>
                {/* Match label */}
                <div style={styles.matchRow}>
                  <span style={styles.matchBadge}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {result.label}
                  </span>
                  <button
                    style={styles.whyBtn}
                    onClick={() => setWhyOpen(!whyOpen)}
                  >
                    {whyOpen ? 'Hide' : 'Why this list'}
                  </button>
                </div>

                {/* Why disclosure */}
                {whyOpen && result.rule && (
                  <div style={styles.whyBox}>
                    <p style={styles.whyText}>
                      {result.rule.wattsPerGuest}W/guest, {result.rule.venue.toLowerCase()},{' '}
                      {result.rule.guestCount} guests. {result.rule.speakerCount} speaker(s),{' '}
                      {result.rule.wirelessMics} wireless + {result.rule.wiredMics} wired mic(s),{' '}
                      {result.rule.mixerChannelsMin}+ mixer channels.
                    </p>
                  </div>
                )}

                {whyOpen && result.type === 'template' && (
                  <div style={styles.whyBox}>
                    <p style={styles.whyText}>
                      This matches our pre-built {result.template.name}. Items and quantities are based on real packages quoted by Long & McQuade for similar events.
                    </p>
                  </div>
                )}

                {result.tierLabel && (
                  <p style={styles.tierLabel}>{result.tierLabel}</p>
                )}

                {/* Item thumbnails - horizontal scroll */}
                <div style={styles.thumbRow}>
                  {result.items.map((item) => {
                    const d = getDisplayData(item.product);
                    return (
                      <div key={item.product} style={styles.thumbCard}>
                        <img
                          src={item.imageSource || getCategoryPlaceholder(item.category)}
                          alt={d.shortName}
                          style={styles.thumbImg}
                          onError={(e) => { e.target.src = getCategoryPlaceholder(item.category); }}
                        />
                        <button
                          style={styles.thumbRemove}
                          onClick={() => handleRemoveItem(item.product)}
                          aria-label={`Remove ${d.shortName}`}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Item list */}
                <div style={styles.itemList}>
                  {result.items.map((item) => {
                    const d = getDisplayData(item.product);
                    const lineTotal = days > 0 && item.rentalDay
                      ? computeItemTotal(item, days) * item.qty
                      : null;
                    return (
                      <div key={item.product} style={styles.itemRow}>
                        <div style={styles.itemInfo}>
                          <span style={styles.itemName}>{d.shortName}</span>
                          <span style={styles.itemPrice}>
                            {item.rentalDay
                              ? lineTotal !== null
                                ? `${formatPrice(lineTotal)} (${item.qty} x ${formatPrice(item.rentalDay)}/day)`
                                : `${formatPrice(item.rentalDay)}/day x ${item.qty}`
                              : 'Price to be confirmed'}
                          </span>
                        </div>
                        <QuantityStepper
                          value={item.qty}
                          onChange={(q) => handleUpdateQty(item.product, q)}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                {kitTotals && (
                  <div style={styles.totalSection}>
                    <div style={styles.totalMain}>
                      <div>
                        <span style={styles.totalLabel}>Kit total</span>
                        <div style={styles.totalAmount}>
                          {kitTotals.rentalTotal !== null
                            ? formatPrice(kitTotals.rentalTotal)
                            : formatPrice(kitTotals.dayTotal)}
                          <span style={styles.totalPer}>
                            {kitTotals.rentalTotal !== null
                              ? ` for ${days} day${days !== 1 ? 's' : ''}`
                              : '/day'}
                          </span>
                        </div>
                      </div>
                      <div style={styles.totalSide}>
                        <span style={styles.totalSideText}>
                          {formatPrice(kitTotals.weekTotal)}/week
                        </span>
                        <span style={styles.totalSideText}>
                          {kitTotals.itemCount} item{kitTotals.itemCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    {kitTotals.hasTbd && (
                      <p style={styles.tbdNote}>
                        Some items have unconfirmed pricing
                      </p>
                    )}
                  </div>
                )}

                {/* CTA */}
                <button
                  className="btn-primary"
                  style={styles.addKitBtn}
                  onClick={handleAddToCart}
                  disabled={!result.items.length}
                >
                  Add Full Kit to Cart
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <BottomSheet
        open={eventSheetOpen}
        onClose={() => setEventSheetOpen(false)}
        title="Event Type"
        options={EVENT_TYPES}
        value={eventType}
        onChange={setEventType}
      />
    </div>
  );
}

const styles = {
  body: {
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  formCard: {
    background: 'var(--color-surface-raised)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--glass-shadow)',
    padding: 'var(--space-lg)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  formRow: {
    display: 'flex',
    gap: 'var(--space-md)',
    alignItems: 'flex-start',
  },
  fieldWide: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
  },
  fieldNarrow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
    flexShrink: 0,
  },
  label: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  sheetTrigger: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    background: 'var(--color-surface-solid)',
    color: 'var(--color-text)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-sm)',
    textAlign: 'left',
  },
  guestStepper: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    height: 40,
  },
  stepBtn: {
    width: 36,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--color-accent)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  guestValue: {
    minWidth: 40,
    textAlign: 'center',
    fontSize: 'var(--text-base)',
    fontWeight: 600,
  },
  toggleRow: {
    display: 'flex',
    gap: 0,
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    border: '1.5px solid var(--color-accent)',
  },
  toggleBtn: {
    flex: 1,
    padding: '10px 20px',
    background: 'transparent',
    color: 'var(--color-text)',
    fontWeight: 500,
    fontSize: 'var(--text-sm)',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  },
  toggleActive: {
    background: 'var(--color-accent)',
    color: '#fff',
    fontWeight: 600,
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    padding: '8px 12px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-surface-solid)',
    marginTop: 'var(--space-xs)',
  },
  calLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  dateInput: {
    border: 'none',
    background: 'transparent',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text)',
    outline: 'none',
    flex: 1,
    padding: 0,
    minWidth: 0,
  },
  generateBtn: {
    width: '100%',
    gap: 'var(--space-sm)',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--text-base)',
    fontWeight: 700,
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  matchRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 'var(--space-sm)',
  },
  matchBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    background: 'var(--color-success-light)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-success)',
  },
  whyBtn: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-accent)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  whyBox: {
    background: 'var(--color-accent-light)',
    border: '1px solid rgba(246,139,30,0.15)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
  },
  whyText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
    margin: 0,
  },
  tierLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
    margin: 0,
    fontStyle: 'italic',
  },
  thumbRow: {
    display: 'flex',
    gap: 'var(--space-sm)',
    overflowX: 'auto',
    paddingBottom: 4,
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  thumbCard: {
    position: 'relative',
    width: 120,
    height: 90,
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    background: '#1a1520',
    flexShrink: 0,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 'var(--radius-full)',
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-sm)',
    padding: 'var(--space-sm) 0',
    borderBottom: '1px solid var(--color-border)',
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  itemPrice: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
  },
  totalSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
  },
  totalMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
  },
  totalAmount: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  totalPer: {
    fontSize: 'var(--text-sm)',
    fontWeight: 400,
    color: 'var(--color-text-secondary)',
  },
  totalSide: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  totalSideText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  tbdNote: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-warning)',
    margin: 0,
  },
  addKitBtn: {
    width: '100%',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--text-base)',
    fontWeight: 700,
  },
  noMatch: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'var(--space-xl) var(--space-md)',
    textAlign: 'center',
  },
  noMatchIcon: {
    width: 56,
    height: 56,
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'var(--space-md)',
  },
  noMatchTitle: {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    marginBottom: 'var(--space-xs)',
  },
  noMatchText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    maxWidth: 320,
    lineHeight: 1.5,
  },
};
