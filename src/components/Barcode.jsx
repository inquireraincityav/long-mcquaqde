import { useMemo } from 'react';

export default function Barcode({ value, width = 220, height = 50 }) {
  const pattern = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < value.length; i++) {
      seed = ((seed << 5) - seed) + value.charCodeAt(i);
      seed |= 0;
    }
    seed = Math.abs(seed);

    function next() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed;
    }

    const modules = [2, 1];
    for (let i = 0; i < 36; i++) {
      modules.push((next() % 3) + 1);
    }
    modules.push(1, 2);
    return modules;
  }, [value]);

  const totalModules = pattern.reduce((s, m) => s + m, 0);
  const moduleWidth = width / totalModules;

  let x = 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
        {pattern.map((m, i) => {
          const w = m * moduleWidth;
          const el = i % 2 === 0 ? (
            <rect key={i} x={x} y={0} width={w} height={height} fill="var(--color-text)" />
          ) : null;
          x += w;
          return el;
        })}
      </svg>
      <span style={{
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        letterSpacing: '0.15em',
        color: 'var(--color-text-secondary)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
    </div>
  );
}
