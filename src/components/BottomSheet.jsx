import { useEffect, useRef } from 'react';

export default function BottomSheet({ open, onClose, title, options, value, onChange }) {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  function handleSelect(val) {
    onChange(val);
    onClose();
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div ref={sheetRef} style={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.handleWrap}>
          <div style={styles.handle} />
        </div>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.options}>
          {options.map((opt) => {
            const isActive = opt.value === value;
            return (
              <button
                key={opt.value}
                style={{ ...styles.option, ...(isActive ? styles.optionActive : {}) }}
                onClick={() => handleSelect(opt.value)}
              >
                <span style={styles.optionLabel}>{opt.label}</span>
                {isActive && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  sheet: {
    width: '100%',
    maxWidth: 'var(--max-width)',
    background: 'var(--color-surface-solid)',
    borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
    boxShadow: 'var(--glass-shadow-xl)',
    paddingBottom: 'env(safe-area-inset-bottom, 24px)',
    animation: 'slideUp 0.2s ease-out',
  },
  handleWrap: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0 6px',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    background: 'rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '17px',
    fontWeight: 700,
    padding: '4px var(--space-lg) var(--space-md)',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px var(--space-lg)',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    borderTop: '1px solid var(--color-border)',
    transition: 'background 0.1s',
  },
  optionActive: {
    background: 'var(--color-accent-lighter)',
  },
  optionLabel: {
    fontSize: '15px',
    fontWeight: 500,
    color: 'var(--color-text)',
  },
};
