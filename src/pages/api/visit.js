export const prerender = false;
import { env } from 'cloudflare:workers';

export async function POST({ request, redirect }) {
  const db = env.henro_db;
  const formData = await request.formData();
  const templeNumber = parseInt(formData.get('temple_number'));
  const action = formData.get('action');

  if (action === 'visit') {
    await db.prepare(
      "INSERT OR IGNORE INTO temple_visits (temple_number, visited_at) VALUES (?, ?)"
    ).bind(templeNumber, new Date().toISOString()).run();
  } else {
    await db.prepare(
      "DELETE FROM temple_visits WHERE temple_number = ?"
    ).bind(templeNumber).run();
  }

  return redirect('/henro/temples', 302);
}