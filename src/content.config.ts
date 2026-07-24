import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ddia = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ddia' }),
  schema: z.object({
    title: z.string(),
    chapter: z.number(),
    date: z.string(),
    summary: z.string(),
  }),
});

export const collections = { ddia };