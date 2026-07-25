export const prerender = false;
import { env } from 'cloudflare:workers';

export async function POST({ request }) {
  const db = env.henro_db;
  const formData = await request.formData();
  const id = parseInt(formData.get('id'));
  const packed = parseInt(formData.get('packed'));

  await db.prepare(
    "UPDATE packing_items SET packed = ? WHERE id = ?"
  ).bind(packed, id).run();

  return new Response('ok', { status: 200 });
}