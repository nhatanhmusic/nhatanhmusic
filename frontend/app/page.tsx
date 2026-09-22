import Link from 'next/link';
import { ItemGrid } from '@/components/catalog/ItemCard';
import { IconArrowRight, IconCamera, IconCheck, IconInfo, IconStar } from '@/components/ui/Icons';
import {
  SectionHeading,
  SiteFooter,
  SiteHeader,
  TrustStrip,
  UtilityBar,
} from '@/components/ui/SiteChrome';
import { catalogApi, safe } from '@/lib/api';
import { formatVnd } from '@/lib/format';
import { RichBlock, RichText, fill } from '@/lib/richtext';
import { getSettings } from '@/lib/settings';
import { GRADE_LABEL, GRADE_ORDER } from '@/lib/types';

// Nội dung lấy từ /settings (sửa ở /admin/noi-dung), đàn lấy từ /catalog/items.
export const revalidate = 30;

export default async function HomePage() {
  const [{ data: newest, error }, { data: filters }, settings] = await Promise.all([
    safe(catalogApi.items({ size: 4, sort: 'newest' })),
    safe(catalogApi.filters()),
    getSettings(),
  ]);

  const hero = settings.home_hero;
  const sec = settings.home_sections;
  const totalItems = newest?.totalElements ?? 0;
  const brands = filters?.brands ?? [];

  return (
    <>
      <UtilityBar />
      <SiteHeader />
      <TrustStrip />

      {/* ══ HERO ══ */}
      <section
        style={{
          borderBottom: '1px solid var(--color-line)',
          background: 'linear-gradient(180deg, var(--color-cream) 0%, var(--color-cream-2) 100%)',
        }}
      >
        <div
          className="container hero-grid"
          style={{
            padding: '66px var(--container-pad) 70px',
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,1fr)',
            gap: 60,
            alignItems: 'center',
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)', alignItems: 'flex-start' }}
          >
            {hero.eyebrow && <span className="eyebrow">{hero.eyebrow}</span>}
            <h1 style={{ fontSize: 'var(--h1)', fontWeight: 700, letterSpacing: '-.025em' }}>
              {hero.titleLine1}
              {hero.titleLine2 && (
                <>
                  <br />
                  {hero.titleLine2}
                </>
              )}
            </h1>
            {hero.body && (
              <p style={{ fontSize: 'var(--text-lg)', color: '#4A5850', maxWidth: 540 }}>
                <RichText text={hero.body} />
              </p>
            )}
            <div style={{ display: 'flex', gap: 14, paddingTop: 4, flexWrap: 'wrap' }}>
              <Link href={hero.primaryHref} className="btn">
                {hero.primaryLabel} <IconArrowRight color="var(--color-cream)" />
              </Link>
              {hero.secondaryLabel && (
                <Link href={hero.secondaryHref} className="btn btn-alt">
                  {hero.secondaryLabel}
                </Link>
              )}
            </div>

            {hero.stats.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: 32,
                  paddingTop: 'var(--sp-6)',
                  borderTop: '1px solid var(--color-line)',
                  width: '100%',
                  marginTop: 6,
                  flexWrap: 'wrap',
                }}
              >
                {hero.stats.map((stat) => (
                  <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 25,
                        fontWeight: 700,
                        color: 'var(--color-green)',
                      }}
                    >
                      {stat.value}
                    </span>
                    <span style={{ fontSize: 12.5, color: 'var(--color-muted)' }}>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <div
              className="media"
              style={{ height: 420, border: '1px solid var(--color-line)', borderRadius: 'var(--radius-md)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={newest?.content[0]?.mainPhotoUrl ?? '/media/hero/main-1.webp'}
                alt={
                  newest?.content[0]
                    ? `${newest.content[0].title} — ảnh chụp tại shop`
                    : 'Ảnh thật một cây đàn đang bán tại shop'
                }
              />
            </div>
            {hero.photoBadge && (
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 16,
                  background: 'var(--color-green-dark)',
                  color: 'var(--color-cream)',
                  borderRadius: 'var(--radius)',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                }}
              >
                <IconCamera />
                {hero.photoBadge}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ MUA THEO HÃNG ══ */}
      {brands.length > 0 && (
        <section className="container" style={{ padding: '44px var(--container-pad) 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 18,
            }}
          >
            <h2 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>{sec.brands.title}</h2>
            <Link href="/dan" style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>
              {fill(sec.brands.linkLabel ?? '', { count: brands.length })} →
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 12,
            }}
          >
            {brands.map((brand) => (
              <Link
                key={brand.value}
                href={`/dan?brand=${brand.value}`}
                className="card"
                style={{
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--color-ink-2)',
                  borderRadius: 'var(--radius)',
                }}
              >
                {brand.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ══ ĐÀN MỚI VỀ ══ */}
      <section className="container" style={{ padding: '52px var(--container-pad) 0' }}>
        <SectionHeading
          eyebrow={sec.newest.eyebrow}
          title={sec.newest.title}
          href="/dan"
          linkLabel={fill(sec.newest.linkLabel ?? '', { count: totalItems })}
        />
        {error ? (
          <div className="notice">Không tải được danh sách đàn: {error}</div>
        ) : newest && newest.content.length > 0 ? (
          <ItemGrid items={newest.content} columns={4} />
        ) : (
          <div className="empty">
            <b>{sec.newest.emptyTitle}</b>
            <span style={{ color: 'var(--color-muted)' }}>{sec.newest.emptyBody}</span>
            <Link href="/admin" className="btn btn-alt btn-sm">
              Mở trang quản trị
            </Link>
          </div>
        )}
      </section>

      {/* ══ DẢI THƯƠNG HIỆU ══ */}
      <section className="container" style={{ padding: '64px var(--container-pad) 56px' }}>
        <div
          style={{
            borderTop: '1px solid var(--color-line)',
            borderBottom: '1px solid var(--color-line)',
            padding: '44px 0',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo-banner.png"
            alt="Nhật Anh — Music Gear & Service"
            style={{ width: 640, maxWidth: '100%' }}
          />
        </div>
      </section>

      {/* ══ THANG ĐÁNH GIÁ TÌNH TRẠNG ══ */}
      <section className="band-green">
        <div className="container" style={{ padding: '58px var(--container-pad)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 26 }}>
            <span className="eyebrow eyebrow-light">{sec.grades.eyebrow}</span>
            <h2 style={{ fontSize: 'var(--h2)', fontWeight: 700 }}>{sec.grades.title}</h2>
            {sec.grades.body && (
              <p style={{ fontSize: 15.5, maxWidth: 720 }}>
                <RichText text={sec.grades.body} />
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {GRADE_ORDER.map((grade) => (
              <div key={grade} className="band-card">
                <span className={`grade g-${grade}`} style={{ alignSelf: 'flex-start' }}>
                  {GRADE_LABEL[grade]}
                </span>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-2)' }}>
                  {settings.grade_meanings[grade] ?? ''}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 'var(--sp-6)', flexWrap: 'wrap' }}>
            <IconInfo />
            <span style={{ fontSize: 'var(--text-base)', color: '#B9C7BC' }}>
              <RichText text={sec.grades.footnote ?? ''} />
            </span>
            {sec.grades.linkLabel && (
              <Link
                href="/thang-tinh-trang"
                style={{ color: '#D4B784', fontWeight: 600, fontSize: 'var(--text-base)', marginLeft: 'auto' }}
              >
                {sec.grades.linkLabel} →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ══ SETUP & SỬA CHỮA ══ */}
      {settings.service_tiers.length > 0 && (
        <section className="container" style={{ padding: '60px var(--container-pad) 0' }}>
          <SectionHeading
            eyebrow={sec.services.eyebrow}
            title={sec.services.title}
            href="/dich-vu"
            linkLabel={sec.services.linkLabel}
          />
          <div className="grid-3">
            {settings.service_tiers.map((tier) => (
              <div
                key={tier.tier + tier.name}
                className={`card${tier.featured ? ' card-accent' : ''}`}
                style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="eyebrow">{tier.tier}</span>
                  {tier.featured && <span className="tag tag-brass">{sec.services.featuredTag}</span>}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 600 }}>{tier.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 26,
                      fontWeight: 700,
                      color: 'var(--color-green)',
                    }}
                  >
                    {tier.priceFrom ? 'từ ' : ''}
                    {formatVnd(tier.priceVnd)}
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted-2)' }}>
                    · {tier.duration}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                  {tier.includes.map((line) => (
                    <span key={line} style={{ fontSize: 'var(--text-base)', color: 'var(--color-ink-2)' }}>
                      ✓ {line}
                    </span>
                  ))}
                </div>
                {tier.note && (
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-muted-2)',
                      marginTop: 'auto',
                      paddingTop: 12,
                    }}
                  >
                    {tier.note}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, paddingTop: 22, flexWrap: 'wrap' }}>
            {(sec.services.trustLines ?? []).map((line) => (
              <span className="trust" key={line}>
                <IconCheck size={17} />
                {line}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ══ BÁN ĐÀN CHO SHOP ══ */}
      {settings.sell_steps.length > 0 && (
        <section className="container" style={{ padding: '60px var(--container-pad) 0' }}>
          <div className="card card-accent" style={{ padding: '40px 44px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 44,
                paddingBottom: 30,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span className="eyebrow">{sec.sell.eyebrow}</span>
                <h2 style={{ fontSize: 31, fontWeight: 700 }}>{sec.sell.title}</h2>
                {sec.sell.body && (
                  <p style={{ fontSize: 15.5, color: 'var(--color-muted)', maxWidth: 660 }}>
                    <RichText text={sec.sell.body} />
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12, flexShrink: 0, flexWrap: 'wrap' }}>
                <Link href="/ban-dan" className="btn btn-brass">
                  {sec.sell.primaryLabel}
                </Link>
                {sec.sell.secondaryLabel && (
                  <Link href="/ban-dan#so-sanh" className="btn btn-alt">
                    {sec.sell.secondaryLabel}
                  </Link>
                )}
              </div>
            </div>
            <div className="grid-4" style={{ borderTop: '1px solid #E6D9BE', paddingTop: 26 }}>
              {settings.sell_steps.map((step) => (
                <div key={step.step} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 26,
                      fontWeight: 700,
                      color: '#D8CDB4',
                      lineHeight: 1,
                    }}
                  >
                    {step.step}
                  </span>
                  <b style={{ fontSize: 15.5 }}>{step.title}</b>
                  <p style={{ fontSize: 13.5, color: 'var(--color-muted)' }}>
                    <RichText text={step.body} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ KHÓA HỌC ══ */}
      {settings.courses.length > 0 && (
        <section className="container" style={{ padding: '60px var(--container-pad) 0' }}>
          <SectionHeading
            eyebrow={sec.courses.eyebrow}
            title={sec.courses.title}
            href="/khoa-hoc"
            linkLabel={sec.courses.linkLabel}
          />
          <div className="grid-3">
            {settings.courses.map((course) => (
              <div
                key={course.name}
                className="card"
                style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              >
                <div className="media" style={{ height: 148 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/media/courses/other-1.webp" alt={`Lớp ${course.name} tại shop`} loading="lazy" />
                </div>
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, flexGrow: 1 }}>
                  <span
                    className={`tag ${course.tone === 'brass' ? 'tag-brass' : 'tag-green'}`}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    {course.tag}
                  </span>
                  <h3 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>{course.name}</h3>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-muted)' }}>
                    <RichText text={course.body} />
                  </p>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>{course.meta}</div>
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: 16,
                      borderTop: '1px solid var(--color-line-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--h3)',
                        fontWeight: 700,
                        color: 'var(--color-green)',
                      }}
                    >
                      {formatVnd(course.priceVnd)}
                    </span>
                    <Link href="/khoa-hoc" style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>
                      Chi tiết →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ ĐÁNH GIÁ ══ */}
      {settings.reviews.length > 0 && (
        <section className="container" style={{ padding: '60px var(--container-pad) 66px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 24 }}>
            <span className="eyebrow">{sec.reviews.eyebrow}</span>
            <h2 style={{ fontSize: 'var(--h2)', fontWeight: 700 }}>{sec.reviews.title}</h2>
          </div>
          <div className="grid-3">
            {settings.reviews.map((review, i) => (
              <div key={i} className="card" style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 13 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: Math.max(1, Math.min(5, review.rating)) }).map((_, s) => (
                    <IconStar key={s} />
                  ))}
                </div>
                <div style={{ fontSize: 15, color: 'var(--color-ink-2)' }}>
                  <RichBlock text={review.body} />
                </div>
                <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>{review.name}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--color-muted)' }}>{review.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </>
  );
}
