import Link from 'next/link';
import { ConditionBadge } from '@/components/ui/ConditionBadge';
import {
  IconArrowRight,
  IconCheck,
  IconCross,
  IconHeart,
  IconReturn,
  IconShield,
  IconTruck,
  IconWrench,
} from '@/components/ui/Icons';
import { discountPercent, formatDate, formatVnd, formatWeight, monthlyInstallment } from '@/lib/format';
import { RichBlock, RichText } from '@/lib/richtext';
import {
  contactVars,
  fillPlaceholders,
  type BuyBoxPromise,
  type ProductPage,
  type ShopContact,
} from '@/lib/settings';
import { GRADE_LABEL, SOURCE_LABEL, type FlawView, type InspectionView, type ItemDetail } from '@/lib/types';

/** Thanh thông số riêng của đúng cây này. */
export function ItemFactsBar({ item }: { item: ItemDetail }) {
  const facts: [string, string][] = [
    ['Cân nặng', formatWeight(item.card.weightGrams) ?? 'chưa cân'],
    ['Năm sản xuất', item.card.yearMade ? String(item.card.yearMade) : '—'],
    ['Nơi sản xuất', item.card.madeIn ?? '—'],
    ['Nguồn gốc', SOURCE_LABEL[item.card.source]],
  ];

  return (
    <div
      className="card"
      style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        marginTop: 4,
        flexWrap: 'wrap',
      }}
    >
      {facts.map(([label, value], i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          {i > 0 && <div style={{ width: 1, height: 34, background: 'var(--color-line-soft)' }} />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--color-muted-2)',
                fontWeight: 600,
              }}
            >
              {label}
            </span>
            <b style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>{value}</b>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Hộp mua. Đàn SOLD thì ẩn nút mua và gợi ý cây tương tự (design/FRONTEND.md). */
export function BuyBox({
  item,
  promises,
  shop,
  text,
}: {
  item: ItemDetail;
  promises: BuyBoxPromise[];
  shop: ShopContact;
  text: ProductPage;
}) {
  const card = item.card;
  const off = discountPercent(card.priceVnd, card.compareAtPriceVnd);
  const sold = card.status === 'SOLD';
  const reserved = card.status === 'RESERVED';
  const vars = {
    ...contactVars(shop),
    monthly: monthlyInstallment(card.priceVnd),
    passed: item.inspection?.passedCount,
    total: item.inspection?.totalCount,
    date: item.inspection ? formatDate(item.inspection.checkedAt) : undefined,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 17 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="eyebrow">
          {card.brandName ?? 'Không rõ hãng'}
          {card.madeIn ? ` · Made in ${card.madeIn}` : ''}
        </span>
        <h1 style={{ fontSize: 30, fontWeight: 700 }}>{card.title}</h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 13.5,
            color: 'var(--color-muted)',
            flexWrap: 'wrap',
          }}
        >
          <ConditionBadge grade={card.conditionGrade} />
          <Link href="/thang-tinh-trang" style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            Mức này nghĩa là gì?
          </Link>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>SKU {card.sku}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingTop: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 13, flexWrap: 'wrap' }}>
          <span className="price price-lg">{formatVnd(card.priceVnd)}</span>
          {card.compareAtPriceVnd && (
            <span className="price-was" style={{ fontSize: 17 }}>
              {formatVnd(card.compareAtPriceVnd)}
            </span>
          )}
          {off && <span className="tag tag-discount">-{off}%</span>}
        </div>
        {text.installmentLine && (
          <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-muted)' }}>
            <RichText text={text.installmentLine} vars={vars} />
          </span>
        )}
      </div>

      {sold ? (
        <div className="notice">
          <b>{text.soldTitle}</b>
          <br />
          <RichText text={text.soldBody} vars={vars} />
        </div>
      ) : reserved ? (
        <div className="notice">
          <b>{text.reservedTitle}</b>
          <br />
          <RichText text={text.reservedBody} vars={vars} />
        </div>
      ) : text.availableLine ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 'var(--text-base)',
            color: 'var(--color-green-mid)',
            fontWeight: 500,
          }}
        >
          <IconCheck size={17} />
          <RichText text={text.availableLine} vars={vars} />
        </div>
      ) : null}

      {item.inspection && (
        <div
          className="card card-accent"
          style={{ padding: '15px 17px', display: 'flex', gap: 12 }}
        >
          <IconWrench />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--color-green-dark)' }}>
              {text.inspectionBoxTitle}
            </span>
            <span style={{ fontSize: 13.5, color: 'var(--color-muted)' }}>
              <RichText text={text.inspectionBoxBody} vars={vars} />
            </span>
          </div>
        </div>
      )}

      {!sold && (
        <>
          <div style={{ display: 'flex', gap: 11, paddingTop: 4 }}>
            <button className="btn btn-brass" style={{ flexGrow: 1, minHeight: 'var(--control-h-lg)' }} disabled={reserved}>
              Mua ngay
            </button>
          </div>
          <button className="btn" style={{ width: '100%' }} disabled={reserved}>
            Thêm vào giỏ
          </button>
          <div style={{ display: 'flex', gap: 11 }}>
            {card.acceptsOffers && (
              <button className="btn btn-alt" style={{ flexGrow: 1 }}>
                Trả giá
              </button>
            )}
            <button className="btn btn-alt" style={{ flexGrow: 1 }}>
              <IconHeart size={17} /> Theo dõi
            </button>
          </div>
          <p className="field-hint">
            Giỏ hàng và trả giá thuộc Giai đoạn 2 &amp; 4 của kế hoạch build — nút đã có sẵn chỗ, chưa
            nối API.
          </p>
        </>
      )}

      {card.acceptsOffers && !sold && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            background: 'var(--color-cream-2)',
            borderRadius: 'var(--radius)',
            padding: '12px 14px',
          }}
        >
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-2)' }}>
            <RichText text={text.offerHint} vars={vars} />
          </span>
        </div>
      )}

      {promises.length > 0 && (
        <div className="card" style={{ padding: '2px 17px', marginTop: 2 }}>
          {promises.map((promise, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                padding: '13px 0',
                borderBottom: i < promises.length - 1 ? '1px solid var(--color-line-soft)' : 'none',
                fontSize: 'var(--text-base)',
              }}
            >
              <span style={{ flexShrink: 0 }}>
                {promise.icon === 'shield' ? (
                  <IconShield />
                ) : promise.icon === 'return' ? (
                  <IconReturn />
                ) : (
                  <IconTruck />
                )}
              </span>
              <span>{fillPlaceholders(promise.text, shop)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** "Khuyết điểm của đúng cây này" — cam kết hoàn tiền dựa vào danh sách này. */
export function FlawList({
  flaws,
  grade,
  text,
}: {
  flaws: FlawView[];
  grade: ItemDetail['card']['conditionGrade'];
  text: ProductPage;
}) {
  return (
    <div className="card" style={{ padding: '30px 34px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 30,
          paddingBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="eyebrow">{text.flawsEyebrow}</span>
          <h2 style={{ fontSize: 26, fontWeight: 700 }}>{text.flawsTitle}</h2>
          {text.flawsBody && (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-muted)', maxWidth: 760 }}>
              <RichText text={text.flawsBody} />
            </p>
          )}
        </div>
        <ConditionBadge grade={grade} label={`Xếp mức: ${GRADE_LABEL[grade]}`} style={{ flexShrink: 0 }} />
      </div>

      {flaws.length === 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 'var(--text-base)',
            color: 'var(--color-green-mid)',
            fontWeight: 500,
          }}
        >
          <IconCheck size={18} />
          {text.flawsNone}
        </div>
      ) : (
        <div className="grid-3">
          {flaws.map((flaw) => (
            <div key={flaw.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                className="media"
                style={{ height: 170, border: '1px solid var(--color-line)', borderRadius: 'var(--radius)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={flaw.photoUrl ?? '/media/placeholder/flaw-1.webp'}
                  alt={`Ảnh cận khuyết điểm: ${flaw.title}`}
                  loading="lazy"
                />
              </div>
              <b style={{ fontSize: 'var(--text-base)' }}>{flaw.title}</b>
              {flaw.description && (
                <p style={{ fontSize: 13.5, color: 'var(--color-muted)' }}>
                  <RichText text={flaw.description} />
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function InspectionChecklist({
  inspection,
  text,
}: {
  inspection: InspectionView;
  text: ProductPage;
}) {
  // Nhóm lấy thẳng từ dữ liệu phiếu (cột group_name), không nhóm cứng ở frontend:
  // phiếu đã ký giữ nguyên cách nhóm lúc ký, kể cả sau này mẫu có đổi.
  const groups: { title: string; checks: InspectionView['checks'] }[] = [];
  for (const check of inspection.checks) {
    const title = check.groupName || 'Khác';
    const existing = groups.find((g) => g.title === title);
    if (existing) existing.checks.push(check);
    else groups.push({ title, checks: [check] });
  }

  return (
    <section className="band-green" style={{ marginTop: 52 }}>
      <div className="container" style={{ padding: '54px var(--container-pad)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 30,
            paddingBottom: 28,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="eyebrow eyebrow-light">{text.inspectionEyebrow}</span>
            <h2 style={{ fontSize: 31, fontWeight: 700 }}>{text.inspectionTitle}</h2>
            {text.inspectionBody && (
              <p style={{ fontSize: 15.5, maxWidth: 760 }}>
                <RichText text={text.inspectionBody} />
              </p>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              alignItems: 'flex-end',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 'var(--text-sm)', color: '#B9C7BC' }}>Kết quả</span>
            <b style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--color-cream)' }}>
              Đạt {inspection.passedCount}/{inspection.totalCount} điểm
            </b>
            <span style={{ fontSize: 'var(--text-sm)', color: '#B9C7BC' }}>
              {formatDate(inspection.checkedAt)}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
          {groups.map((group) => (
            <div key={group.title} className="band-card" style={{ padding: 20, gap: 10 }}>
              <b style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--color-green-dark)' }}>
                {group.title}
              </b>
              {group.checks.map((check) => (
                <span
                  key={check.code}
                  className={`chk32${check.passed ? '' : ' chk32-fail'}`}
                  title={check.note ?? undefined}
                >
                  <span style={{ flexShrink: 0, marginTop: 3 }}>
                    {check.passed ? (
                      <IconCheck size={15} color="var(--color-success)" />
                    ) : (
                      <IconCross size={15} color="var(--color-danger)" />
                    )}
                  </span>
                  {check.label}
                </span>
              ))}
            </div>
          ))}
        </div>

        {inspection.note && (
          <p style={{ paddingTop: 22, fontSize: 'var(--text-base)', color: '#B9C7BC' }}>
            <b style={{ color: 'var(--color-cream)' }}>Ghi chú của kỹ thuật viên:</b> {inspection.note}
          </p>
        )}
      </div>
    </section>
  );
}

export function SpecTable({ item }: { item: ItemDetail }) {
  const rows: [string, string][] = [
    ['Model', item.modelName],
    ['Hãng', item.card.brandName ?? '—'],
    ['SKU', item.card.sku],
    ...(item.serialNo ? ([['Số serial', item.serialNo]] as [string, string][]) : []),
    ['Tình trạng', GRADE_LABEL[item.card.conditionGrade]],
    ['Cân nặng', formatWeight(item.card.weightGrams) ?? 'chưa cân'],
    ['Năm sản xuất', item.card.yearMade ? String(item.card.yearMade) : '—'],
    ['Nơi sản xuất', item.card.madeIn ?? '—'],
    ['Nguồn gốc', SOURCE_LABEL[item.card.source]],
    ...Object.entries(item.specs),
  ];

  return (
    <table className="spec-table">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <th scope="row">{label}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function RelatedLink() {
  return (
    <Link href="/dan" className="btn btn-alt btn-sm">
      Xem tất cả đàn đang có <IconArrowRight size={15} color="var(--color-green)" />
    </Link>
  );
}
