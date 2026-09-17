import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={styles.page} className="page-enter">
      <div className="container">
        <div style={styles.hero}>
          <h1 style={styles.heading}>
            Professional gear rental,
            <br />
            <span style={styles.headingAccent}>simplified.</span>
          </h1>
          <p style={styles.sub}>
            Browse Long & McQuade's rental catalog with real-time availability,
            or let our kit builder assemble the right gear for your event.
          </p>

          <div style={styles.paths}>
            <Link to="/browse" style={{ textDecoration: 'none' }}>
              <div style={styles.pathCard} className="glass-panel-raised">
                <div style={styles.pathIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3 style={styles.pathTitle}>Browse & Search</h3>
                <p style={styles.pathDesc}>
                  Find specific gear by category, check availability for your
                  dates, and add items one at a time.
                </p>
                <span style={styles.pathPersona}>Great for first-time renters</span>
              </div>
            </Link>

            <Link to="/kit-builder" style={{ textDecoration: 'none' }}>
              <div style={styles.pathCard} className="glass-panel-raised">
                <div style={styles.pathIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 style={styles.pathTitle}>Kit Builder</h3>
                <p style={styles.pathDesc}>
                  Tell us your event type and guest count — we'll suggest a
                  complete gear kit based on real packages.
                </p>
                <span style={styles.pathPersona}>Built for event professionals</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100dvh - var(--nav-height))',
    display: 'flex',
    alignItems: 'center',
  },
  hero: {
    padding: 'var(--space-3xl) 0',
    textAlign: 'center',
    maxWidth: 720,
    margin: '0 auto',
  },
  heading: {
    fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
    fontWeight: 700,
    lineHeight: 1.15,
    marginBottom: 'var(--space-md)',
  },
  headingAccent: {
    color: 'var(--color-accent)',
  },
  sub: {
    fontSize: 'var(--text-lg)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.6,
    marginBottom: 'var(--space-2xl)',
    maxWidth: 540,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  paths: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 'var(--space-lg)',
    textAlign: 'left',
  },
  pathCard: {
    padding: 'var(--space-lg)',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.15s',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  pathIcon: {
    width: 56,
    height: 56,
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-accent-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'var(--space-xs)',
  },
  pathTitle: {
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
  },
  pathDesc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  },
  pathPersona: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--color-accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: 'var(--space-xs)',
  },
};
