import kitTemplates from '../../data/kit-templates.json';
import heuristicRules from '../../data/heuristic-rules.json';
import inventory from '../../data/inventory.json';

const inventoryByProduct = Object.fromEntries(
  inventory.map((item) => [item.product, item])
);

function parseRange(str) {
  if (!str) return [0, Infinity];
  if (str === 'Any') return [0, Infinity];
  const match = str.match(/(\d+)\s*-\s*(\d+)/);
  if (match) return [parseInt(match[1]), parseInt(match[2])];
  const lt = str.match(/<\s*(\d+)/);
  if (lt) return [0, parseInt(lt[1])];
  const gt = str.match(/>\s*(\d+)/);
  if (gt) return [parseInt(gt[1]), Infinity];
  const single = parseInt(str);
  if (!isNaN(single)) return [single, single];
  return [0, Infinity];
}

const templateEventMap = {
  'wedding_ceremony': ['Standard PA Package', 'Wedding Reception Package'],
  'wedding_reception': ['Wedding Reception Package', 'Standard PA Package'],
  'corporate_panel': ['Panel/Conference Package', 'Presentation + Projector Package'],
  'dj_set': ['DJ / Dance Party Package'],
  'product_launch': ['Presentation + Projector Package'],
  'town_hall': ['Panel/Conference Package', 'Recording/Hybrid Meeting Package'],
  'live_concert': ['Live Band Package'],
  'custom': [],
};

export function matchTemplate(eventType, guestCount, venue) {
  if (eventType === 'custom') return null;

  const candidates = templateEventMap[eventType] || [];
  for (const name of candidates) {
    const template = kitTemplates.find((t) => t.name === name);
    if (template) {
      return {
        type: 'template',
        template,
        label: `Matches our ${template.name}`,
        items: template.items.map((ti) => ({
          ...ti,
          ...(inventoryByProduct[ti.product] || {}),
        })),
      };
    }
  }
  return null;
}

const eventTypeMap = {
  'wedding_ceremony': 'Wedding ceremony',
  'wedding_reception': 'Wedding reception',
  'corporate_panel': 'Corporate speech / panel',
  'dj_set': 'DJ / dance party',
  'product_launch': 'Product launch',
  'town_hall': 'Town hall meeting',
  'live_concert': 'Live concert',
  'custom': null,
};

export function matchHeuristic(eventType, guestCount, venue) {
  const mappedType = eventTypeMap[eventType];
  let candidates = heuristicRules;

  if (mappedType) {
    const typeMatches = candidates.filter((r) => r.eventType === mappedType);
    if (typeMatches.length > 0) candidates = typeMatches;
  }

  if (venue) {
    const venueMatches = candidates.filter(
      (r) => r.venue.toLowerCase() === venue.toLowerCase()
    );
    if (venueMatches.length > 0) candidates = venueMatches;
  }

  let bestRule = null;
  let bestDist = Infinity;

  for (const rule of candidates) {
    const [min, max] = parseRange(rule.guestCount);
    if (rule.guestCount === 'Any') {
      if (!bestRule) {
        bestRule = rule;
        bestDist = 0;
      }
      continue;
    }
    const mid = (min + max === Infinity) ? min : (min + max) / 2;
    const dist = Math.abs(guestCount - mid);
    if (dist < bestDist) {
      bestDist = dist;
      bestRule = rule;
    }
  }

  if (!bestRule) return null;

  const items = buildItemsFromRule(bestRule);

  const tierLabel =
    bestRule.guestCount === 'Any'
      ? 'any size'
      : `${bestRule.guestCount} guest tier`;

  return {
    type: 'heuristic',
    rule: bestRule,
    label: 'Suggested based on your event size',
    tierLabel: `Closest match: ${tierLabel}`,
    items,
  };
}

function buildItemsFromRule(rule) {
  const items = [];

  const speakerCount =
    typeof rule.speakerCount === 'string'
      ? parseInt(rule.speakerCount)
      : rule.speakerCount;

  const speakers = inventory.filter((i) => i.category === 'Speakers' && i.product.includes('Loudspeaker'));
  if (speakers.length > 0 && speakerCount > 0) {
    items.push({ ...speakers[0], qty: speakerCount });
  }

  const subCount =
    typeof rule.subCount === 'string'
      ? parseInt(rule.subCount)
      : rule.subCount;
  if (subCount > 0) {
    const subs = inventory.filter(
      (i) => i.category === 'Speakers' && (i.product.includes('Subwoofer') || i.product.includes('Sub'))
    );
    if (subs.length > 0) {
      items.push({ ...subs[0], qty: subCount });
    }
  }

  const wirelessCount =
    typeof rule.wirelessMics === 'string'
      ? parseInt(rule.wirelessMics)
      : rule.wirelessMics;
  if (wirelessCount > 0) {
    const wireless = inventory.find((i) =>
      i.product.includes('Sennheiser EW 112')
    );
    if (wireless) items.push({ ...wireless, qty: wirelessCount });
  }

  const wiredCount =
    typeof rule.wiredMics === 'string'
      ? parseInt(rule.wiredMics)
      : rule.wiredMics;
  if (wiredCount > 0) {
    const wired = inventory.find((i) => i.product.includes('SM58'));
    if (wired) items.push({ ...wired, qty: wiredCount });
  }

  const mixerMin =
    typeof rule.mixerChannelsMin === 'string'
      ? parseInt(rule.mixerChannelsMin)
      : rule.mixerChannelsMin;
  if (mixerMin > 0) {
    let mixer;
    if (mixerMin >= 16) {
      mixer = inventory.find((i) => i.product.includes('MG20XU') || i.product.includes('ProFX16'));
    } else if (mixerMin > 8) {
      mixer = inventory.find((i) => i.product.includes('14-Channel') || i.product.includes('ZED-12'));
    } else {
      mixer = inventory.find((i) => i.product.includes('8-Channel'));
    }
    if (mixer) items.push({ ...mixer, qty: 1 });
  }

  if (rule.lighting) {
    const fixCount = rule.lightingFixtures || 4;
    const parLight = inventory.find((i) => i.product.includes('SlimPAR'));
    if (parLight) items.push({ ...parLight, qty: fixCount });

    const lightStand = inventory.find((i) => i.product.includes('Lighting Stand'));
    if (lightStand) items.push({ ...lightStand, qty: Math.ceil(fixCount / 3) });
  }

  if (rule.hazer) {
    const hazer = inventory.find((i) => i.product.includes('Hurricane Haze'));
    if (hazer) items.push({ ...hazer, qty: 1 });
  }

  if (rule.projector) {
    const projector = inventory.find((i) => i.product.includes('Projector') && i.category === 'Visual');
    const screen = inventory.find((i) => i.product.includes('Projector Screen'));
    if (projector) items.push({ ...projector, qty: 1 });
    if (screen) items.push({ ...screen, qty: 1 });
  }

  const standCount = items.filter(
    (i) => i.category === 'Speakers' || i.category === 'Microphones'
  ).length;
  const stand = inventory.find((i) => i.product.includes('Tripod Boom'));
  if (stand && standCount > 0) {
    items.push({ ...stand, qty: Math.min(standCount, 6) });
  }

  return items;
}

export function buildKit(eventType, guestCount, venue) {
  if (eventType === 'custom') {
    const result = matchHeuristic(eventType, guestCount, venue);
    if (!result) {
      return {
        type: 'no_match',
        label: 'No close match found',
        message:
          'Your event parameters are outside our standard sizing tiers. We recommend contacting a Long & McQuade location directly for a custom quote.',
        items: [],
      };
    }
    return result;
  }

  const templateMatch = matchTemplate(eventType, guestCount, venue);
  if (templateMatch) return templateMatch;

  const heuristicMatch = matchHeuristic(eventType, guestCount, venue);
  if (heuristicMatch) return heuristicMatch;

  return {
    type: 'no_match',
    label: 'No close match found',
    message:
      'Your event parameters are outside our standard sizing tiers. We recommend contacting a Long & McQuade location directly for a custom quote.',
    items: [],
  };
}
