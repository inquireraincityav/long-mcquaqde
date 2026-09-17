import inventory from '../data/inventory.json' assert { type: 'json' };

const displayData = {
  'Yorkville Sound YXL12P 12 Inch 1000 Watt Powered Loudspeaker': { shortName: 'Yorkville YXL12P Speaker', specs: '700W · 12" woofer' },
  'JBL EON715 15 Inch Powered PA Speaker with Bluetooth': { shortName: 'JBL EON715 Speaker', specs: '1300W · 15" · Bluetooth' },
  'QSC K12.2 12 Inch 2000W Powered Loudspeaker': { shortName: 'QSC K12.2 Speaker', specs: '2000W · 12" · DSP' },
  'Shure SM58 Unidirectional/Cardioid Dynamic Microphone': { shortName: 'Shure SM58', specs: 'Cardioid dynamic' },
  'Pioneer CDJ-2000NXS2 Professional Multi Player': { shortName: 'Pioneer CDJ-2000NXS2', specs: 'Pro DJ media player' },
};

function searchInventory(query) {
  if (!query || query.length < 2) return inventory.slice(0, 20);

  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = inventory.map((item) => {
    const text = `${item.product} ${item.category}`.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (text.includes(term)) score += 1;
      if (item.product.toLowerCase().startsWith(term)) score += 2;
    }
    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.item);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { q, category, limit = '50' } = req.query;

  try {
    let results = searchInventory(q);

    if (category && category !== 'all') {
      results = results.filter((item) => item.category === category);
    }

    const maxResults = Math.min(parseInt(limit) || 50, 100);
    results = results.slice(0, maxResults);

    return res.status(200).json({
      results,
      total: results.length,
      source: 'local',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Search failed' });
  }
}
