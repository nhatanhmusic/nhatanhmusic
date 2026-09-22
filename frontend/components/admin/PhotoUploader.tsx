'use client';

import { useEffect, useRef, useState } from 'react';
import { ApiRequestError, adminApi } from '@/lib/api';
import { DISPLAY_MAX, THUMB_MAX, extensionOf, resizeToWebp } from '@/lib/image';
import { readToken } from '@/lib/session';
import type { PhotoKind } from '@/lib/types';

type Props = {
  itemId: number;
  kind: PhotoKind;
  index: number;
  onUploaded: (key: string) => void;
};

/**
 * Chọn file → thu nhỏ trong trình duyệt → PUT thẳng lên R2 qua URL đã ký.
 * Ảnh không bao giờ đi qua Spring Boot (mục 5).
 *
 * Mỗi lần chọn đẩy ba bản: display 1600px, thumb 600px, và bản gốc nguyên vẹn.
 */
export function PhotoUploader({ itemId, kind, index, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function putTo(url: string, body: Blob, contentType: string) {
    const res = await fetch(url, { method: 'PUT', body, headers: { 'Content-Type': contentType } });
    if (!res.ok) {
      throw new Error(
        `R2 từ chối (${res.status}). Kiểm tra CORS của bucket đã cho phép PUT từ domain này chưa.`,
      );
    }
  }

  async function handleFile(file: File) {
    const token = readToken();
    if (!token) return;
    setError(null);

    try {
      setBusy('Đang thu nhỏ ảnh…');
      const [display, thumb] = await Promise.all([
        resizeToWebp(file, DISPLAY_MAX),
        resizeToWebp(file, THUMB_MAX, 0.8),
      ]);

      setBusy('Đang tải bản hiển thị…');
      const d = await adminApi.presign(token, itemId, { kind, index, variant: 'display' });
      await putTo(d.uploadUrl, display, 'image/webp');

      setBusy('Đang tải bản nhỏ…');
      const t = await adminApi.presign(token, itemId, { kind, index, variant: 'thumb' });
      await putTo(t.uploadUrl, thumb, 'image/webp');

      setBusy('Đang tải bản gốc…');
      const o = await adminApi.presign(token, itemId, {
        kind,
        index,
        variant: 'original',
        contentType: file.type || 'image/jpeg',
        extension: extensionOf(file),
      });
      await putTo(o.uploadUrl, file, file.type || 'image/jpeg');

      onUploaded(d.key);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Tải ảnh không thành công.',
      );
    } finally {
      setBusy(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        className="pill"
        style={{ height: 'var(--control-h)', whiteSpace: 'nowrap' }}
        disabled={busy !== null}
        onClick={() => inputRef.current?.click()}
      >
        {busy ?? 'Chọn ảnh'}
      </button>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

/** Hỏi backend một lần: đã cấu hình R2 chưa. */
export function useMediaStatus() {
  const [status, setStatus] = useState<{ configured: boolean; publicBaseUrl: string } | null>(null);

  useEffect(() => {
    const token = readToken();
    if (!token) return;
    adminApi
      .mediaStatus(token)
      .then(setStatus)
      .catch(() => setStatus({ configured: false, publicBaseUrl: '' }));
  }, []);

  return status;
}
