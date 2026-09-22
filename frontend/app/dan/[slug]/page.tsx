import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ItemGrid } from '@/components/catalog/ItemCard';
import { Gallery } from '@/components/catalog/Gallery';
import {
  BuyBox,
  FlawList,
  InspectionChecklist,
  ItemFactsBar,
  SpecTable,
} from '@/components/catalog/ItemDetailParts';
import { SectionHeading, SiteFooter, SiteHeader, TrustStrip, UtilityBar } from '@/components/ui/SiteChrome';
import { catalogApi, safe } from '@/lib/api';
import { formatWeight } from '@/lib/format';
import { RichBlock } from '@/lib/richtext';
import { getSettings } from '@/lib/settings';
import { SHOP } from '@/lib/shop';
import { GRADE_LABEL } from '@/lib/types';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

/**
 * Mục 10 — render ở server, og:image trỏ tới ẢNH THẬT của đúng cây này
 * để dán link vào Zalo/Facebook là hiện ảnh.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: item } = await safe(catalogApi.item(slug));
  if (!item) return { title: 'Không tìm thấy cây đàn' };

  const weight = formatWeight(item.card.weightGrams);
  const title = `${item.card.title} — ${GRADE_LABEL[item.card.conditionGrade]}${weight ? `, ${weight}` : ''}`;
  const description =
    item.summary ??
    `${item.card.title} đang bán tại ${SHOP.shortName}. Ảnh chụp đúng cây này, ghi rõ khuyết điểm, đã qua kiểm tra 32 điểm.`;
  const image = item.photos[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `/dan/${item.card.slug}` },
    openGraph: {
      title: `${title} | ${SHOP.shortName}`,
      description,
      type: 'website',
      url: `/dan/${item.card.slug}`,
      images: image ? [{ url: image, alt: item.photos[0]?.altText ?? item.card.title }] : undefined,
    },
  };
}

export default async function ItemDetailPage({ params }: Props) {
  const { slug } = await params;
  const { data: item, error } = await safe(catalogApi.item(slug));

  if (error && !item) {
    // Phân biệt "chưa chạy backend" với "không có cây này"
    if (error.includes('Không tìm thấy')) notFound();
    return (
      <>
        <UtilityBar />
        <SiteHeader />
        <div className="container" style={{ padding: '60px var(--container-pad)' }}>
          <div className="notice">
            <b>Không tải được cây đàn này.</b>
            <br />
            {error}
          </div>
        </div>
        <SiteFooter />
      </>
    );
  }
  if (!item) notFound();

  const [{ data: related }, settings] = await Promise.all([
    safe(catalogApi.related(item.card.id, 4)),
    getSettings(),
  ]);
  const text = settings.product_page;

  // schema.org/Product — mục 10
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.card.title,
    description: item.summary ?? item.modelDescription ?? undefined,
    sku: item.card.sku,
    ...(item.serialNo ? { serialNumber: item.serialNo } : {}),
    ...(item.card.brandName ? { brand: { '@type': 'Brand', name: item.card.brandName } } : {}),
    image: item.photos.map((p) => p.url),
    ...(item.card.weightGrams
      ? { weight: { '@type': 'QuantitativeValue', value: item.card.weightGrams, unitCode: 'GRM' } }
      : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: item.card.priceVnd,
      itemCondition:
        item.card.conditionGrade === 'NEW'
          ? 'https://schema.org/NewCondition'
          : 'https://schema.org/UsedCondition',
      availability:
        item.card.status === 'AVAILABLE'
          ? 'https://schema.org/InStock'
          : item.card.status === 'SOLD'
            ? 'https://schema.org/SoldOut'
            : 'https://schema.org/LimitedAvailability',
      url: `${SHOP.siteUrl}/dan/${item.card.slug}`,
      seller: { '@type': 'Organization', name: SHOP.name },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <UtilityBar />
      <SiteHeader />
      <TrustStrip />

      <nav
        className="container"
        style={{
          padding: '22px var(--container-pad) 0',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-muted)',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}
        aria-label="Đường dẫn"
      >
        <Link href="/" style={{ color: 'var(--color-muted)' }}>
          Trang chủ
        </Link>
        <span>/</span>
        <Link href={`/dan?category=${item.card.categorySlug}`} style={{ color: 'var(--color-muted)' }}>
          {item.card.categoryName}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--color-ink)' }}>{item.modelName}</span>
      </nav>

      <section
        className="container detail-grid"
        style={{
          padding: '24px var(--container-pad) 0',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 452px',
          gap: 48,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <Gallery
            photos={item.photos}
            title={item.card.title}
            grade={item.card.conditionGrade}
            serialNo={item.serialNo}
          />
          <ItemFactsBar item={item} />
        </div>

        <BuyBox
          item={item}
          promises={settings.buybox_promises}
          shop={settings.shop_contact}
          text={text}
        />
      </section>

      <section className="container" style={{ padding: '52px var(--container-pad) 0' }}>
        <FlawList flaws={item.flaws} grade={item.card.conditionGrade} text={text} />
      </section>

      {item.inspection && <InspectionChecklist inspection={item.inspection} text={text} />}

      <section className="container" style={{ padding: '52px var(--container-pad) 0' }}>
        <div className="grid-2" style={{ gap: 48, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700 }}>{text.descriptionTitle}</h2>
            {item.summary && (
              <RichBlock
                text={item.summary}
                style={{ fontSize: 'var(--text-md)', color: 'var(--color-ink-2)' }}
              />
            )}
            {item.modelDescription && (
              <RichBlock
                text={item.modelDescription}
                style={{ fontSize: 'var(--text-md)', color: 'var(--color-ink-2)' }}
              />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700 }}>{text.specsTitle}</h2>
            <SpecTable item={item} />
          </div>
        </div>
      </section>

      {related && related.length > 0 && (
        <section className="container" style={{ padding: '52px var(--container-pad) 0' }}>
          <SectionHeading
            eyebrow={item.card.status === 'SOLD' ? text.relatedEyebrowSold : text.relatedEyebrow}
            title={text.relatedTitle}
            href={`/dan?category=${item.card.categorySlug}`}
            linkLabel={text.relatedLinkLabel}
          />
          <ItemGrid items={related} columns={4} />
        </section>
      )}

      <SiteFooter />
    </>
  );
}
