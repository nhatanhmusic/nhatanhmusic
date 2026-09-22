import type { MetadataRoute } from 'next';
import { catalogApi, safe } from '@/lib/api';
import { SHOP } from '@/lib/shop';

/** Mục 10 — sitemap tự sinh. Đàn đã bán không đưa vào. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SHOP.siteUrl;
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/dan`, changeFrequency: 'daily', priority: 0.9 },
  ];

  const { data } = await safe(catalogApi.items({ size: 60, sort: 'newest' }));
  const items: MetadataRoute.Sitemap = (data?.content ?? []).map((item) => ({
    url: `${base}/dan/${item.slug}`,
    lastModified: item.publishedAt ? new Date(item.publishedAt) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...items];
}
