'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { InspectionForm } from '@/components/admin/InspectionForm';
import { ItemForm } from '@/components/admin/ItemForm';
import { StatusPill } from '@/components/ui/ConditionBadge';
import { adminApi } from '@/lib/api';
import { readToken } from '@/lib/session';
import type { ItemDetail } from '@/lib/types';

function EditItem() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = readToken();
    if (!token) return;
    adminApi
      .item(token, Number(params.id))
      .then(setItem)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không tải được cây đàn.'));
  }, [params.id]);

  if (error) {
    return (
      <AdminShell title="Sửa cây đàn">
        <div className="notice">{error}</div>
      </AdminShell>
    );
  }

  if (!item) {
    return (
      <AdminShell title="Sửa cây đàn">
        <div className="skeleton" style={{ height: 480 }} />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={item.card.title}
      subtitle={`SKU ${item.card.sku}${item.serialNo ? ` · serial ${item.serialNo}` : ''}`}
      actions={
        <>
          <StatusPill status={item.card.status} />
          <Link href={`/dan/${item.card.slug}`} className="btn btn-alt btn-sm" target="_blank">
            Xem trang khách ↗
          </Link>
          <Link href="/admin/dan" className="btn btn-alt btn-sm">
            ← Về kho
          </Link>
        </>
      }
    >
      {search.get('saved') && (
        <div className="notice notice-ok" style={{ marginBottom: 'var(--sp-5)' }}>
          Đã lưu.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
        <ItemForm existing={item} />
        <InspectionForm item={item} onSaved={setItem} />
      </div>
    </AdminShell>
  );
}

export default function EditItemPage() {
  return (
    <Suspense fallback={<div className="skeleton" style={{ height: '100vh' }} />}>
      <EditItem />
    </Suspense>
  );
}
