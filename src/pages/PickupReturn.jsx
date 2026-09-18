import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import StatusBadge from '../components/StatusBadge';
import Barcode from '../components/Barcode';
import useOrders from '../hooks/useOrders';
import { getDisplayData } from '../utils/displayData';
import placeholderImg from '/placeholder-gear.svg';

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ItemCheckRow({ item, checked, flagged, onCheck, onFlag }) {
  const d = getDisplayData(item.product);
  return (
    <div style={styles.checkRow}>
      <div style={styles.checkThumb}>
        <img
          src={placeholderImg}
          alt={d.shortName}
          style={styles.checkImg}
        />
      </div>
      <div style={styles.checkInfo}>
        <span style={styles.checkName}>{d.shortName}</span>
        <span style={styles.checkQty}>Qty: {item.qty}</span>
      </div>
      <div style={styles.checkActions}>
        {!checked && !flagged && (
          <>
            <button style={styles.confirmBtn} onClick={onCheck}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              OK
            </button>
            <button style={styles.flagBtn} onClick={onFlag}>
              Flag
            </button>
          </>
        )}
        {checked && (
          <span style={styles.checkedBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Confirmed
          </span>
        )}
        {flagged && (
          <span style={styles.flaggedBadge}>
            Flagged for review
          </span>
        )}
      </div>
    </div>
  );
}

export default function PickupReturn() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();

  const order = useMemo(() => {
    if (orderId) return orders.find((o) => o.id === orderId);
    return orders.find((o) => o.status === 'upcoming') || orders[0] || null;
  }, [orderId, orders]);

  const [checkStates, setCheckStates] = useState({});
  const [mode, setMode] = useState('pickup');
  const [completedAt, setCompletedAt] = useState(null);

  const allItems = order?.items || [];

  const locationGroups = useMemo(() => {
    if (!order?.fulfillment?.locations?.length) {
      return [{ location: null, items: allItems }];
    }
    if (order.fulfillment.type === 'single') {
      return [{ location: order.fulfillment.locations[0], items: allItems }];
    }
    const perLoc = Math.ceil(allItems.length / order.fulfillment.locations.length);
    return order.fulfillment.locations.map((loc, i) => ({
      location: loc,
      items: allItems.slice(i * perLoc, (i + 1) * perLoc),
    }));
  }, [order, allItems]);

  const allChecked = allItems.length > 0 && allItems.every(
    (_, i) => checkStates[i] === 'checked' || checkStates[i] === 'flagged'
  );

  function handleCheck(index) {
    setCheckStates((prev) => ({ ...prev, [index]: 'checked' }));
  }
  function handleFlag(index) {
    setCheckStates((prev) => ({ ...prev, [index]: 'flagged' }));
  }

  function handleComplete() {
    const now = new Date().toISOString();
    setCompletedAt(now);
    if (order && mode === 'return') {
      updateOrderStatus(order.id, 'completed');
    }
  }

  if (!order) {
    return (
      <div className="page-enter">
        <AppHeader title="Pickup & Return" backTo="/orders" />
        <div style={styles.body}>
          <div style={styles.emptyWrap}>
            <h3 style={styles.emptyTitle}>No active orders</h3>
            <p style={styles.emptyMsg}>
              Place an order first to see the pickup and return flow.
            </p>
            <button
              className="btn-outline-accent"
              style={{ marginTop: 16, padding: '8px 24px' }}
              onClick={() => navigate('/browse')}
            >
              Browse Gear
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pickupDate = order.dateRange?.start ? formatDateShort(order.dateRange.start) : 'TBD';
  const returnDate = order.dateRange?.end ? formatDateShort(order.dateRange.end) : 'TBD';

  return (
    <div className="page-enter">
      <AppHeader
        title={mode === 'pickup' ? 'Pickup' : 'Return'}
        subtitle={order.id}
        backTo="/orders"
      />

      <div style={styles.body}>
        {/* Mode toggle */}
        <div style={styles.modeToggle}>
          <button
            style={{
              ...styles.modeBtn,
              ...(mode === 'pickup' ? styles.modeBtnActive : {}),
            }}
            onClick={() => { setMode('pickup'); setCheckStates({}); setCompletedAt(null); }}
          >
            Pickup
          </button>
          <button
            style={{
              ...styles.modeBtn,
              ...(mode === 'return' ? styles.modeBtnActive : {}),
            }}
            onClick={() => { setMode('return'); setCheckStates({}); setCompletedAt(null); }}
          >
            Return
          </button>
        </div>

        {/* Order info card */}
        <div style={styles.infoCard}>
          <div style={styles.barcodeWrap}>
            <Barcode value={order.id} width={200} height={44} />
          </div>
          <div style={styles.infoDivider} />
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>{mode === 'pickup' ? 'Pickup Date' : 'Return Date'}</span>
            <span style={styles.infoValue}>{mode === 'pickup' ? pickupDate : returnDate}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Status</span>
            <StatusBadge status={completedAt ? 'completed' : order.status} />
          </div>
          {order.fulfillment?.method && (
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Method</span>
              <span style={styles.infoValue}>
                {order.fulfillment.method === 'delivery' ? '🚚 Delivery' : '🏪 Store Pickup'}
              </span>
            </div>
          )}
        </div>

        {completedAt ? (
          <div style={styles.doneCard}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="var(--color-success-light)" />
              <polyline points="13 20 18 25 27 15" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 style={styles.doneTitle}>
              {mode === 'pickup' ? 'Pickup complete' : 'Return complete'}
            </h3>
            <p style={styles.doneSub}>
              {mode === 'pickup'
                ? 'All items checked out. Your $100 deposit has been refunded. Enjoy your event!'
                : 'All items returned. Thank you!'}
            </p>
            <div style={styles.doneTimestamp}>
              {new Date(completedAt).toLocaleString('en-CA', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </div>
            {Object.values(checkStates).some((s) => s === 'flagged') && (
              <div style={styles.flagNotice}>
                <span style={styles.flagNoticeIcon}>⚠️</span>
                Some items were flagged for staff review. A team member will follow up.
              </div>
            )}
            <button
              className="btn-primary"
              style={styles.navBtn}
              onClick={() => navigate('/orders')}
            >
              Back to Orders
            </button>
          </div>
        ) : (
          <>
            <h3 style={styles.checkTitle}>
              {mode === 'pickup' ? 'Condition Check-out' : 'Condition Check-in'}
            </h3>
            <p style={styles.checkSubtitle}>
              {mode === 'pickup'
                ? 'Confirm each item is in expected condition before leaving the store.'
                : 'Confirm each item is returned in acceptable condition.'}
            </p>

            {locationGroups.map((group, gi) => {
              const startIndex = locationGroups
                .slice(0, gi)
                .reduce((s, g) => s + g.items.length, 0);
              return (
                <div key={gi} style={styles.locationGroup}>
                  {group.location && locationGroups.length > 1 && (
                    <div style={styles.locationLabel}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {group.location.name}
                    </div>
                  )}
                  {group.items.map((item, ii) => {
                    const idx = startIndex + ii;
                    return (
                      <ItemCheckRow
                        key={idx}
                        item={item}
                        checked={checkStates[idx] === 'checked'}
                        flagged={checkStates[idx] === 'flagged'}
                        onCheck={() => handleCheck(idx)}
                        onFlag={() => handleFlag(idx)}
                      />
                    );
                  })}
                </div>
              );
            })}

            <button
              className="btn-primary"
              style={styles.completeBtn}
              disabled={!allChecked}
              onClick={handleComplete}
            >
              {allChecked
                ? (mode === 'pickup' ? 'Complete Pickup' : 'Complete Return')
                : `${Object.keys(checkStates).length} of ${allItems.length} checked`}
            </button>
          </>
        )}
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
  modeToggle: {
    display: 'flex',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    border: '1.5px solid var(--color-accent)',
  },
  modeBtn: {
    flex: 1,
    padding: '10px 20px',
    fontWeight: 500,
    fontSize: 'var(--text-sm)',
    background: 'transparent',
    color: 'var(--color-text)',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  },
  modeBtnActive: {
    background: 'var(--color-accent)',
    color: '#fff',
    fontWeight: 600,
  },
  infoCard: {
    background: 'var(--color-surface-raised)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--glass-shadow)',
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  barcodeWrap: {
    padding: 'var(--space-sm)',
    background: '#fff',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    justifyContent: 'center',
  },
  infoDivider: {
    height: 1,
    background: 'var(--color-border)',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 'var(--text-sm)',
  },
  infoLabel: {
    color: 'var(--color-text-secondary)',
  },
  infoValue: {
    fontWeight: 600,
  },
  checkTitle: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    margin: 0,
  },
  checkSubtitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    margin: 0,
    marginTop: -8,
    lineHeight: 1.5,
  },
  locationGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  locationLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    paddingLeft: 2,
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-md)',
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
  },
  checkThumb: {
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-sm)',
    background: '#f0f0ea',
    overflow: 'hidden',
    flexShrink: 0,
  },
  checkImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  checkInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  checkName: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
  },
  checkQty: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
  },
  checkActions: {
    display: 'flex',
    gap: 'var(--space-xs)',
    flexShrink: 0,
  },
  confirmBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '6px 12px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-success-light)',
    color: 'var(--color-success)',
    fontWeight: 600,
    fontSize: 'var(--text-xs)',
    border: 'none',
    cursor: 'pointer',
  },
  flagBtn: {
    padding: '6px 12px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-warning-light)',
    color: 'var(--color-warning)',
    fontWeight: 600,
    fontSize: 'var(--text-xs)',
    border: 'none',
    cursor: 'pointer',
  },
  checkedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-success)',
  },
  flaggedBadge: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-warning)',
    padding: '4px 10px',
    background: 'var(--color-warning-light)',
    borderRadius: 'var(--radius-full)',
  },
  completeBtn: {
    width: '100%',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--text-base)',
    fontWeight: 700,
  },
  doneCard: {
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
  doneTitle: {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    margin: 0,
  },
  doneSub: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    margin: 0,
  },
  doneTimestamp: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-tertiary)',
    padding: '4px 12px',
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-full)',
    fontVariantNumeric: 'tabular-nums',
  },
  flagNotice: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: 'var(--space-sm) var(--space-md)',
    background: 'var(--color-warning-light)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-warning)',
    textAlign: 'left',
    width: '100%',
    marginTop: 'var(--space-sm)',
  },
  flagNoticeIcon: {
    flexShrink: 0,
  },
  navBtn: {
    width: '100%',
    borderRadius: 'var(--radius-lg)',
    marginTop: 'var(--space-sm)',
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
