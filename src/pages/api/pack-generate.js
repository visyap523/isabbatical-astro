export const prerender = false;
import { env } from 'cloudflare:workers';

export async function POST({ request }) {
  const db = env.henro_db;

  // Call Claude to generate a packing list
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are helping someone prepare for the Shikoku Henro pilgrimage in Japan — an 88-temple walking pilgrimage of approximately 1,200km, done in October-November. They will be walking most days but occasionally taking buses between temples.

Generate a practical packing list. Return ONLY a JSON array, no other text, no markdown. Each item should have "item" (string) and "category" (one of: Clothing, Gear, Documents, Medicine, Electronics, Pilgrimage, Other).

Example format:
[{"item": "Rain jacket", "category": "Clothing"}, {"item": "Blister plasters", "category": "Medicine"}]

Be specific and practical. Include traditional pilgrimage items like the white vest (hakui), staff (kongozue), and stamp book (nokyocho). Around 40-50 items total.`
      }]
    })
  });

  const data = await response.json();
  const text = data.content[0].text.trim();

  // Parse the JSON response
  let items;
  try {
    items = JSON.parse(text);
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to parse response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Insert all items into the database
  for (const item of items) {
    await db.prepare(
      "INSERT INTO packing_items (category, item, packed) VALUES (?, ?, 0)"
    ).bind(item.category, item.item).run();
  }

  return new Response(JSON.stringify({ count: items.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}