export const prerender = false;
import { env } from 'cloudflare:workers';

export async function POST({ request }) {
  const db = env.henro_db;
  const formData = await request.formData();
  const id = parseInt(formData.get('id'));

  await db.prepare(
    "DELETE FROM packing_items WHERE id = ?"
  ).bind(id).run();

  return new Response('ok', { status: 200 });
}