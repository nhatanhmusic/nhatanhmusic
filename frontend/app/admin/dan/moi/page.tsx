'use client';

import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { ItemForm } from '@/components/admin/ItemForm';

export default function NewItemPage() {
  return (
    <AdminShell
      title="Thêm cây đàn"
      subtitle="Một cây đàn = một dòng. Serial riêng, cân nặng riêng, ảnh riêng."
      actions={
        <Link href="/admin/dan" className="btn btn-alt btn-sm">
          ← Về kho
        </Link>
      }
    >
      <ItemForm />
    </AdminShell>
  );
}
