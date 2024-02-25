import { unstable_noStore as noStore } from 'next/cache';
import postgres from 'postgres';


export const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: 'allow',
});

export async function getViewsCount(): Promise<
    { slug: string; count: number }[]
> {
    if (!process.env.POSTGRES_URL) {
        return [];
    }

    noStore();
    return sql`
    SELECT slug, count
    FROM views
  `;
}

export async function increment(slug: string) {
    noStore();
    await sql`
      INSERT INTO views (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = views.count + 1
    `;
}
