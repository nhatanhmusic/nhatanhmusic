import Link from 'next/link';
import { ConditionBadge } from '@/components/ui/ConditionBadge';
import { discountPercent, formatVnd, formatWeight, monthlyInstallment } from '@/lib/format';
import type { ItemCard as ItemCardType } from '@/lib/types';

/** Thẻ đàn — design/screens/danh-sach-dan.html, khối "KẾT QUẢ". */
export function ItemCard({ item, imageHeight = 224 }: { item: ItemCardType; imageHeight?: number }) {
  const weight = formatWeight(item.weightGrams);
  const off = discountPercent(item.priceVnd, item.compareAtPriceVnd);
  const sold = item.status === 'SOLD';

  return (
    <Link href={`/dan/${item.slug}`} className="card item-card" style={{ color: 'inherit' }}>
      <div style={{ position: 'relative' }}>
        <div className="media" style={{ height: imageHeight }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.mainPhotoUrl ?? '/media/placeholder/item.webp'}
            alt={`${item.title} — ảnh chụp tại shop`}
            loading="lazy"
          />
        </div>
        <ConditionBadge
          grade={item.conditionGrade}
          style={{ position: 'absolute', top: 11, left: 11 }}
        />
        {/* Chỉ gắn nhãn khi có thông tin thật để nói. Cả web đều là hàng một cây
            nên "Chỉ còn 1 cây" dán khắp nơi thành ra vô nghĩa. */}
        {sold ? (
          <span className="tag tag-danger" style={{ position: 'absolute', bottom: 11, left: 11 }}>
            Đã bán
          </span>
        ) : item.status === 'RESERVED' ? (
          <span className="tag tag-brass" style={{ position: 'absolute', bottom: 11, left: 11 }}>
            Đang giữ chỗ
          </span>
        ) : item.source === 'CONSIGNMENT' ? (
          <span className="tag tag-green" style={{ position: 'absolute', bottom: 11, left: 11 }}>
            Ký gửi
          </span>
        ) : null}
      </div>

      <div className="item-body">
        {item.brandName && <span className="item-brand">{item.brandName}</span>}
        <h4 className="item-title">{item.title}</h4>

        <div className="item-meta">
          {item.yearMade && <span>{item.yearMade}</span>}
          {weight && (
            <>
              <span>·</span>
              <span>{weight}</span>
            </>
          )}
          {item.madeIn && (
            <>
              <span>·</span>
              <span>{item.madeIn}</span>
            </>
          )}
        </div>

        <div className="item-price-row">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, flexWrap: 'wrap' }}>
            <span className="price">{formatVnd(item.priceVnd)}</span>
            {item.compareAtPriceVnd && (
              <span className="price-was">{formatVnd(item.compareAtPriceVnd)}</span>
            )}
            {off && <span className="tag tag-discount">-{off}%</span>}
          </div>
          <span className="item-note">
            {sold
              ? 'Đã bán — xem cây tương tự'
              : item.acceptsOffers
                ? `Nhận trả giá · ${monthlyInstallment(item.priceVnd)}/tháng`
                : `${monthlyInstallment(item.priceVnd)}/tháng · 12 tháng`}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ItemGrid({ items, columns = 4 }: { items: ItemCardType[]; columns?: 3 | 4 }) {
  return (
    <div className={columns === 3 ? 'grid-3' : 'grid-4'}>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} imageHeight={columns === 3 ? 224 : 208} />
      ))}
    </div>
  );
}
