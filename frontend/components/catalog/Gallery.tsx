'use client';

import { useState } from 'react';
import { ConditionBadge } from '@/components/ui/ConditionBadge';
import { IconCamera } from '@/components/ui/Icons';
import type { ConditionGrade, PhotoView } from '@/lib/types';

/** design/screens/chi-tiet-san-pham.html — ảnh lớn + 5 góc bên dưới. */
export function Gallery({
  photos,
  title,
  grade,
  serialNo,
}: {
  photos: PhotoView[];
  title: string;
  grade: ConditionGrade;
  serialNo?: string | null;
}) {
  const [active, setActive] = useState(0);
  const current = photos[active];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div
        className="media"
        style={{
          height: 452,
          border: '1px solid var(--color-line)',
          borderRadius: 'var(--radius-md)',
          position: 'relative',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current?.url ?? '/media/placeholder/main-1.webp'}
          alt={current?.altText ?? `${title} — ảnh chụp tại shop`}
          style={{ objectFit: 'contain', background: 'var(--color-paper)' }}
        />
        <ConditionBadge grade={grade} style={{ position: 'absolute', top: 15, left: 15 }} />
        {serialNo && (
          <div
            style={{
              position: 'absolute',
              bottom: 15,
              left: 15,
              background: 'var(--color-green-dark)',
              color: 'var(--color-cream)',
              borderRadius: 'var(--radius)',
              padding: '7px 11px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <IconCamera size={14} />
            Serial {serialNo} · đúng cây bạn sẽ nhận
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(photos.length, 6)}, minmax(0,1fr))`,
            gap: 10,
          }}
        >
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Xem ảnh ${photo.kindLabel}`}
              aria-pressed={i === active}
              className="media"
              style={{
                height: 84,
                padding: 0,
                cursor: 'pointer',
                border:
                  i === active
                    ? '1.5px solid var(--color-green)'
                    : '1px solid var(--color-line)',
                borderRadius: 'var(--radius)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.altText ?? photo.kindLabel} loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
