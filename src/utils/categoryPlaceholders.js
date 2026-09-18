const CATEGORY_ICONS = {
  Speakers: {
    color: '#F68B1E',
    path: 'M60 40 L60 160 L100 140 L140 160 L140 40 L100 60 Z M80 85 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0 M90 85 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0',
  },
  Microphones: {
    color: '#4FC3F7',
    path: 'M90 40 L90 50 Q80 50 80 65 L80 95 Q80 110 100 110 Q120 110 120 95 L120 65 Q120 50 110 50 L110 40 Z M70 90 L70 105 Q70 130 100 130 Q130 130 130 105 L130 90 M100 130 L100 160',
  },
  'Mixers & Extras': {
    color: '#AB47BC',
    path: 'M70 50 L70 150 M100 50 L100 150 M130 50 L130 150 M62 80 L78 80 M62 80 L78 80 Q70 80 70 80 M92 110 L108 110 M122 70 L138 70 M65 77 h10 v6 h-10z M95 107 h10 v6 h-10z M125 67 h10 v6 h-10z',
  },
  Visual: {
    color: '#26A69A',
    path: 'M60 70 L140 70 L140 130 L60 130 Z M70 80 L130 80 L130 120 L70 120 Z M95 95 L115 105 L95 115 Z M90 130 L90 150 L110 150 L110 130',
  },
  Lighting: {
    color: '#FFD54F',
    path: 'M85 55 L115 55 L125 95 L75 95 Z M80 100 L120 100 M100 40 L100 55 M75 95 L70 110 L130 110 L125 95 M100 110 L100 130 M85 130 L115 130 M65 60 L55 50 M135 60 L145 50 M60 80 L48 80 M140 80 L152 80',
  },
  'DJ Equipment': {
    color: '#EF5350',
    path: 'M55 60 a45 45 0 1 0 90 0 a45 45 0 1 0 -90 0 M70 60 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0 M90 60 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M100 50 L100 60 M55 120 L55 155 L65 155 L65 125 M135 120 L135 155 L145 155 L145 125',
  },
  Backline: {
    color: '#FF7043',
    path: 'M75 45 L85 45 L87 90 L90 150 L80 150 L75 90 Z M80 60 L125 50 L130 52 L85 62 Z M80 80 Q65 90 65 110 L65 145 Q65 155 75 155 L125 155 Q135 155 135 145 L135 110 Q135 90 120 80 M85 120 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0',
  },
  Recording: {
    color: '#78909C',
    path: 'M65 50 Q65 35 80 35 L85 35 Q95 35 95 50 L95 80 Q95 95 85 95 L80 95 Q65 95 65 80 Z M105 50 Q105 35 120 35 L125 35 Q135 35 135 50 L135 80 Q135 95 125 95 L120 95 Q105 95 105 80 Z M65 65 L55 65 L55 85 L65 85 M135 65 L145 65 L145 85 L135 85 M95 75 L105 75 M80 95 L80 110 Q80 125 100 125 Q120 125 120 110 L120 95',
  },
};

export function getCategoryPlaceholder(category) {
  const cat = CATEGORY_ICONS[category] || CATEGORY_ICONS.Speakers;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
    <rect width="200" height="200" fill="#1a1520"/>
    <rect x="0" y="0" width="200" height="200" fill="${cat.color}" opacity="0.06"/>
    <g stroke="${cat.color}" stroke-width="1.8" fill="none" opacity="0.45" stroke-linecap="round" stroke-linejoin="round">
      <path d="${cat.path}"/>
    </g>
    <text x="100" y="180" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="10" fill="${cat.color}" opacity="0.5">${category}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
