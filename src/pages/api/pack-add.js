export const prerender = false;
import { env } from 'cloudflare:workers';

export async function POST({ request, redirect }) {
  const db = env.henro_db;
  const formData = await request.formData();
  const item = formData.get('item');
  const category = formData.get('category');

  await db.prepare(
    "INSERT INTO packing_items (category, item, packed) VALUES (?, ?, 0)"
  ).bind(category, item).run();

  return redirect('/henro/pack', 302);
}