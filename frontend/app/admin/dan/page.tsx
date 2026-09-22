'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { StatusPill } from '@/components/ui/ConditionBadge';
import { adminApi } from '@/lib/api';
import { formatVnd, formatWeight } from '@/lib/format';
import { readToken } from '@/lib/session';
import { STATUS_LABEL, type ItemCard, type ItemStatus } from '@/lib/types';

const STATUSES: (ItemStatus | 'ALL')[] = ['ALL', 'DRAFT', 'AVAILABLE', 'RESERVED', 'SOLD', 'RETURNED'];

export default function AdminInventoryPage() {
  const [status, setStatus] = useState<ItemStatus | 'ALL'>('ALL');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<ItemCard[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = readToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.items(token, {
        status: status === 'ALL' ? undefined : status,
        q: q || undefined,
        size: 50,
        sort: 'newest',
      });
      setItems(res.content);
      setTotal(res.totalElements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được kho.');
    } finally {
      setLoading(false);
    }
  }, [status, q]);

  useEffect(() => {
    load();
  }, [load]);

  async function publish(item: ItemCard) {
    const token = readToken();
    if (!token) return;
    try {
      await adminApi.changeStatus(token, item.id, 'AVAILABLE');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không đổi được trạng thái.');
    }
  }

  return (
    <AdminShell
      title="Kho đàn & gear"
      subtitle={`${total} cây trong kho`}
      actions={
        <Link href="/admin/dan/moi" className="btn btn-sm">
          + Thêm cây đàn
        </Link>
      }
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', paddingBottom: 'var(--sp-5)' }}>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={`pill${status === s ? ' pill-on' : ''}`}
            onClick={() => setStatus(s)}
            aria-pressed={status === s}
          >
            {s === 'ALL' ? 'Tất cả' : STATUS_LABEL[s]}
          </button>
        ))}
        <div style={{ flexGrow: 1 }} />
        <input
          className="input"
          style={{ width: 260, height: 42 }}
          placeholder="Tìm theo tên, SKU, serial…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Tìm trong kho"
        />
      </div>

      {error && <div className="notice" style={{ marginBottom: 'var(--sp-4)' }}>{error}</div>}

      {loading ? (
        <div className="skeleton" style={{ height: 320 }} />
      ) : items.length === 0 ? (
        <div className="empty">
          <b>Không có cây nào khớp.</b>
          <span style={{ color: 'var(--color-muted)' }}>Đổi bộ lọc hoặc thêm cây mới.</span>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>SKU</th>
              <th>Tên</th>
              <th>Tình trạng</th>
              <th>Cân</th>
              <th>Giá</th>
              <th>Khuyết điểm</th>
              <th>Trạng thái</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="media" style={{ width: 56, height: 56, borderRadius: 'var(--radius)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.mainPhotoUrl ?? '/media/placeholder/main-1.webp'} alt="" />
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {item.sku}
                </td>
                <td style={{ minWidth: 220 }}>{item.title}</td>
                <td>
                  <span className={`grade g-${item.conditionGrade}`}>{item.conditionLabel}</span>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>{formatWeight(item.weightGrams) ?? '—'}</td>
                <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatVnd(item.priceVnd)}</td>
                <td style={{ textAlign: 'center' }}>{item.flawCount}</td>
                <td>
                  <StatusPill status={item.status} />
                </td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {item.status === 'DRAFT' && (
                    <button
                      type="button"
                      className="pill"
                      style={{ marginRight: 8 }}
                      onClick={() => publish(item)}
                    >
                      Lên kệ
                    </button>
                  )}
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
