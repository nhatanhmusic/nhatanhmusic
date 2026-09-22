import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ItemCard } from '@/components/catalog/ItemCard';
import { ActiveFilterChips, FilterSidebar, SortControl } from '@/components/catalog/FilterSidebar';
import { Pagination } from '@/components/ui/Pagination';
import { SiteFooter, SiteHeader, TrustStrip, UtilityBar } from '@/components/ui/SiteChrome';
import { catalogApi, safe } from '@/lib/api';
import { RichText } from '@/lib/richtext';
import { getSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Đàn & gear đang có sẵn',
  description:
    'Toàn bộ đàn đang có tại shop, mỗi cây một trang riêng với ảnh thật, cân nặng thật và danh sách khuyết điểm.',
};

type SearchParams = Record<string, string | string[] | undefined>;

const PAGE_SIZE = 9;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function many(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function ItemListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Number(one(sp.page) ?? 0) || 0;

  const query = {
    category: one(sp.category),
    brand: many(sp.brand),
    grade: many(sp.grade),
    priceMin: one(sp.priceMin),
    priceMax: one(sp.priceMax),
    weightMax: one(sp.weightMax),
    q: one(sp.q),
    sort: one(sp.sort) ?? 'newest',
    page,
    size: PAGE_SIZE,
  };

  const [{ data: result, error }, { data: facets }, settings] = await Promise.all([
    safe(catalogApi.items(query)),
    safe(catalogApi.filters()),
    getSettings(),
  ]);
  const text = settings.catalog_page;

  const items = result?.content ?? [];
  const total = result?.totalElements ?? 0;
  const categoryName = facets?.categories.find((c) => c.value === query.category)?.label;
  const heading = categoryName ?? text.title;
  const firstIndex = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const lastIndex = Math.min((page + 1) * PAGE_SIZE, total);

  return (
    <>
      <UtilityBar />
      <SiteHeader />
      <TrustStrip />

      <div className="container" style={{ padding: '24px var(--container-pad) 20px' }}>
        <nav
          style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', display: 'flex', gap: 8 }}
          aria-label="Đường dẫn"
        >
          <Link href="/" style={{ color: 'var(--color-muted)' }}>
            Trang chủ
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-ink)' }}>{heading}</span>
        </nav>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 'var(--sp-6)',
            paddingTop: 14,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h1 style={{ fontSize: 'var(--h1-page)', fontWeight: 700 }}>{heading}</h1>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-muted)' }}>
              <RichText text={text.subtitle} vars={{ count: total }} />
            </p>
          </div>
        </div>
      </div>

      <div
        className="container listing-grid"
        style={{
          padding: '0 var(--container-pad) 56px',
          display: 'grid',
          gridTemplateColumns: '264px minmax(0, 1fr)',
          gap: 34,
          alignItems: 'start',
        }}
      >
        {facets ? (
          <Suspense fallback={<div className="card skeleton" style={{ height: 620 }} />}>
            <FilterSidebar facets={facets} />
          </Suspense>
        ) : (
          <div className="card" style={{ padding: 20 }}>
            <p className="field-hint">Chưa tải được bộ lọc.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {facets && (
              <Suspense fallback={null}>
                <ActiveFilterChips facets={facets} />
              </Suspense>
            )}
            <div style={{ flexGrow: 1 }} />
            <span style={{ fontSize: 13.5, color: 'var(--color-muted)' }}>
              {total === 0 ? 'Không có cây nào' : `${firstIndex}–${lastIndex} trong ${total} cây`}
            </span>
            <Suspense fallback={null}>
              <SortControl />
            </Suspense>
          </div>

          {error ? (
            <div className="notice">
              <b>Không tải được danh sách.</b>
              <br />
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="empty">
              <b>{text.emptyTitle}</b>
              <span style={{ color: 'var(--color-muted)' }}>
                <RichText text={text.emptyBody} />
              </span>
              <Link href="/dan" className="btn btn-alt btn-sm">
                Xóa hết bộ lọc
              </Link>
            </div>
          ) : (
            <div className="grid-3">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={result?.totalPages ?? 0}
            basePath="/dan"
            params={sp}
          />
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
