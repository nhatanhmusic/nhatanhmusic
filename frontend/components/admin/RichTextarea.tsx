'use client';

import { useRef, useState } from 'react';
import { RichBlock } from '@/lib/richtext';

/**
 * Ô nhập có thanh công cụ: đậm, nghiêng, link, gạch đầu dòng, và xem trước.
 *
 * Bên dưới vẫn là textarea với cú pháp **đậm** _nghiêng_ — nghĩa là nội dung
 * lưu ra là chữ thuần, đọc được trong database, không phải HTML. Bôi đen rồi bấm
 * nút, hoặc dùng Ctrl+B / Ctrl+I như trong Word.
 */
export function RichTextarea({
  value,
  onChange,
  placeholder,
  minHeight = 120,
  single = false,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  minHeight?: number;
  /** Một dòng (tiêu đề, nhãn): không có gạch đầu dòng, không xem trước. */
  single?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  /** Bọc phần đang bôi đen bằng before/after; không bôi đen thì chèn mẫu. */
  function wrap(before: string, after: string, sample: string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || sample;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function bullet() {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', end);
    const block = value.slice(lineStart, lineEnd === -1 ? value.length : lineEnd);
    const toggled = block
      .split('\n')
      .map((l) => (/^-\s+/.test(l) ? l.replace(/^-\s+/, '') : `- ${l}`))
      .join('\n');
    onChange(value.slice(0, lineStart) + toggled + value.slice(lineEnd === -1 ? value.length : lineEnd));
    requestAnimationFrame(() => el.focus());
  }

  function link() {
    const url = prompt('Đường dẫn (ví dụ /dan hoặc https://…):', '/dan');
    if (!url) return;
    wrap('[', `](${url})`, 'chữ hiện ra');
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.key === 'b') {
      e.preventDefault();
      wrap('**', '**', 'chữ đậm');
    } else if (e.key === 'i') {
      e.preventDefault();
      wrap('_', '_', 'chữ nghiêng');
    } else if (e.key === 'k') {
      e.preventDefault();
      link();
    }
  }

  const btn: React.CSSProperties = {
    height: 30,
    minWidth: 30,
    padding: '0 8px',
    border: '1px solid var(--color-line)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-paper)',
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    cursor: 'pointer',
    color: 'var(--color-ink-2)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" style={{ ...btn, fontWeight: 700 }} title="Đậm (Ctrl+B)" onClick={() => wrap('**', '**', 'chữ đậm')}>
          B
        </button>
        <button type="button" style={{ ...btn, fontStyle: 'italic' }} title="Nghiêng (Ctrl+I)" onClick={() => wrap('_', '_', 'chữ nghiêng')}>
          I
        </button>
        <button type="button" style={btn} title="Chèn link (Ctrl+K)" onClick={link}>
          🔗 Link
        </button>
        {!single && (
          <button type="button" style={btn} title="Gạch đầu dòng" onClick={bullet}>
            • Danh sách
          </button>
        )}
        <div style={{ flexGrow: 1 }} />
        {!single && (
          <button
            type="button"
            style={{ ...btn, background: preview ? 'var(--color-green)' : btn.background, color: preview ? 'var(--color-cream)' : btn.color }}
            onClick={() => setPreview(!preview)}
          >
            {preview ? 'Đang xem trước' : 'Xem trước'}
          </button>
        )}
      </div>

      {preview && !single ? (
        <div
          className="card"
          style={{ padding: '12px 14px', minHeight, fontSize: 'var(--text-base)', color: 'var(--color-ink-2)' }}
          onClick={() => setPreview(false)}
          title="Bấm để quay lại sửa"
        >
          {value.trim() ? <RichBlock text={value} /> : <span className="field-hint">(trống)</span>}
        </div>
      ) : (
        <textarea
          ref={ref}
          className="input"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          style={{ minHeight: single ? 44 : minHeight, resize: 'vertical' }}
          rows={single ? 1 : undefined}
        />
      )}

      {!single && (
        <span className="field-hint">
          Dòng trống = đoạn mới. Bắt đầu dòng bằng &quot;- &quot; = gạch đầu dòng. Cỡ chữ và màu đi theo
          vị trí trên trang, không cần chọn.
        </span>
      )}
    </div>
  );
}
