export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { kitResult, eventType, guestCount, venue } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are a gear rental assistant for Long & McQuade. A customer needs equipment for their event.

Event details:
- Type: ${eventType}
- Guest count: ${guestCount}
- Venue: ${venue}

The system has already selected this gear list based on our inventory and heuristic rules:
${JSON.stringify(kitResult.items.map(i => ({ product: i.product, qty: i.qty, pricePerDay: i.rentalDay })), null, 2)}

${kitResult.type === 'template' ? `This matches our "${kitResult.template.name}" package.` : `This was suggested based on the ${kitResult.tierLabel}.`}

Write a brief (2-3 sentence) natural-language summary explaining why this gear list fits their event. Mention the key specs (total wattage, mic count) and any practical tips. If any items show "Price TBD," note that they should confirm pricing with the store. Be helpful and concise — this is for an event professional who knows gear.`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'LLM request failed' });
    }

    const summary = data.content?.[0]?.text || '';
    return res.status(200).json({ summary });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate summary' });
  }
}
