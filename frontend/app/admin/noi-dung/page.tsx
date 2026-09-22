'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { SettingBlock } from '@/components/admin/SettingsEditor';
import { adminApi } from '@/lib/api';
import { readToken } from '@/lib/session';
import type { SettingView } from '@/lib/types';

export default function ContentSettingsPage() {
  const [settings, setSettings] = useState<SettingView[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = readToken();
    if (!token) return;
    adminApi
      .settings(token)
      .then(setSettings)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không tải được nội dung.'));
  }, []);

  return (
    <AdminShell
      title="Nội dung web"
      subtitle="Chữ nghĩa hiện trên trang khách — sửa ở đây, không cần đụng vào code"
    >
      {error && <div className="notice">{error}</div>}

      {!settings ? (
        <div className="skeleton" style={{ height: 420 }} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)', maxWidth: 780 }}>
          {settings.map((setting) => (
            <SettingBlock key={setting.key} setting={setting} />
          ))}
        </div>
      )}
    </AdminShell>
  );
}
