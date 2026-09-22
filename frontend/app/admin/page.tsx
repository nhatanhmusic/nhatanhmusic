'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { StatusPill } from '@/components/ui/ConditionBadge';
import { adminApi } from '@/lib/api';
import { formatDate, formatVnd } from '@/lib/format';
import { readToken } from '@/lib/session';
import type { ItemCard, ItemStatus } from '@/lib/types';

type Counts = Record<ItemStatus, number>;

const EMPTY: Counts = { DRAFT: 0, AVAILABLE: 0, RESERVED: 0, SOLD: 0, RETURNED: 0 };

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState<Counts>(EMPTY);
  const [recent, setRecent] = useState<ItemCard[]>([]);
  const [stockValue, setStockValue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = readToken();
    if (!token) return;

    (async () => {
      try {
        // Lấy toàn bộ để đếm — kho ở quy mô này còn nhỏ.
        // Khi kho lớn lên thì thay bằng /admin/reports (Giai đoạn 6).
        const all = await adminApi.items(token, { size: 60, sort: 'newest' });
        const next = { ...EMPTY };
        let value = 0;
        for (const item of all.content) {
          next[item.status] += 1;
          if (item.status === 'AVAILABLE' || item.status === 'RESERVED') value += item.priceVnd;
        }
        setCounts(next);
        setStockValue(value);
        setRecent(all.content.slice(0, 8));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không tải được dữ liệu.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const today = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());

  return (
    <AdminShell
      title="Tổng quan"
      subtitle={today}
      actions={
        <Link href="/admin/dan/moi" className="btn btn-sm">
          + Thêm cây đàn
        </Link>
      }
    >
      {error && <div className="notice" style={{ marginBottom: 'var(--sp-5)' }}>{error}</div>}

      <div className="grid-4" style={{ marginBottom: 'var(--sp-6)' }}>
        {[
          ['Đang bán', counts.AVAILABLE, 'cây đang hiện trên web'],
          ['Đang giữ chỗ', counts.RESERVED, 'chờ khách chốt'],
          ['Nháp chưa lên kệ', counts.DRAFT, 'thiếu ảnh hoặc chưa kiểm tra'],
          ['Giá trị hàng tồn', formatVnd(stockValue), 'tổng giá đang bán + giữ chỗ'],
        ].map(([label, value, hint]) => (
          <div className="kpi-tile" key={String(label)}>
            <span
              style={{
                fontSize: 12,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: 'var(--color-muted-2)',
              }}
            >
              {label}
            </span>
            <span className="kpi-value">{loading ? '…' : value}</span>
            <span className="kpi-label">{hint}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 'var(--sp-3)',
        }}
      >
        <h2 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>Cây vừa cập nhật</h2>
        <Link href="/admin/dan" style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>
          Toàn bộ kho →
        </Link>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 280 }} />
      ) : recent.length === 0 ? (
        <div className="empty">
          <b>Kho còn trống.</b>
          <span style={{ color: 'var(--color-muted)' }}>
            Thêm cây đàn đầu tiên: ảnh 5 góc, cân nặng, và danh sách khuyết điểm.
          </span>
          <Link href="/admin/dan/moi" className="btn btn-sm">
            Thêm cây đàn
          </Link>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Tên</th>
              <th>Tình trạng</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Lên kệ</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {recent.map((item) => (
              <tr key={item.id}>
                <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{item.sku}</td>
                <td>{item.title}</td>
                <td>
                  <span className={`grade g-${item.conditionGrade}`}>{item.conditionLabel}</span>
                </td>
                <td style={{ fontWeight: 600 }}>{formatVnd(item.priceVnd)}</td>
                <td>
                  <StatusPill status={item.status} />
                </td>
                <td style={{ color: 'var(--color-muted)' }}>{formatDate(item.publishedAt)}</td>
                <td style={{ textAlign: 'right' }}>
                  <Link href={`/admin/dan/${item.id}`} style={{ fontWeight: 600 }}>
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
