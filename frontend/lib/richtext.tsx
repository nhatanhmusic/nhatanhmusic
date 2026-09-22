import { Fragment, type ReactNode } from 'react';

/**
 * Định dạng chữ cho nội dung nhập từ trang quản trị.
 *
 * Cú pháp (cố ý ít, để người trong shop không phải học):
 *   **in đậm**        _in nghiêng_        [chữ](đường-dẫn)
 *   Dòng trống        = đoạn mới
 *   Xuống dòng        = ngắt dòng trong đoạn
 *   Dòng bắt đầu "- " = gạch đầu dòng
 *
 * Cỡ chữ và màu KHÔNG cho chỉnh — chúng đi theo vị trí trên trang (tiêu đề, đoạn
 * dẫn, chú thích) để cả web nhìn như một thể. Trình soạn thảo cho chọn cỡ chữ tùy
 * ý thì sau vài tháng trang chủ thành tờ rơi.
 *
 * Không dùng dangerouslySetInnerHTML: nội dung tuy do người trong shop nhập nhưng
 * vẫn không có lý do gì để mở đường cho HTML lọt vào trang.
 */

const INLINE = /(\*\*[^*\n]+\*\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\s]+\))/g;

function safeHref(raw: string): string | null {
  const href = raw.trim();
  if (href.startsWith('/') || href.startsWith('#')) return href;
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  return null;
}

function renderInline(text: string, keyPrefix = ''): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}${i}`;
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <b key={key}>{part.slice(2, -2)}</b>;
    }
    if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
      return <i key={key}>{part.slice(1, -1)}</i>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeHref(link[2]);
      return href ? (
        <a key={key} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener">
          {link[1]}
        </a>
      ) : (
        <Fragment key={key}>{link[1]}</Fragment>
      );
    }
    // Xuống dòng đơn trong một đoạn -> <br>
    const lines = part.split('\n');
    return lines.map((line, j) => (
      <Fragment key={`${key}-${j}`}>
        {j > 0 && <br />}
        {line}
      </Fragment>
    ));
  });
}

/** Chèn {count}, {city}… từ một bảng giá trị. Thiếu biến thì để nguyên. */
export function fill(text: string, vars: Record<string, string | number | undefined>): string {
  return text.replace(/\{(\w+)\}/g, (whole, name: string) => {
    const v = vars[name];
    return v === undefined || v === null ? whole : String(v);
  });
}

/** Một dòng, không tạo khối — dùng cho tiêu đề, nhãn, câu ngắn. */
export function RichText({ text, vars }: { text: string; vars?: Record<string, string | number | undefined> }) {
  if (!text) return null;
  const src = vars ? fill(text, vars) : text;
  return <>{renderInline(src.replace(/\n+/g, ' '))}</>;
}

/** Nhiều đoạn — dùng cho mô tả, đoạn giới thiệu. Tự tạo <p> và <ul>. */
export function RichBlock({
  text,
  vars,
  className,
  style,
}: {
  text: string;
  vars?: Record<string, string | number | undefined>;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (!text) return null;
  const src = vars ? fill(text, vars) : text;
  const blocks = src.replace(/\r\n/g, '\n').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: '0.7em', ...style }}>
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        if (lines.every((l) => /^-\s+/.test(l))) {
          return (
            <ul key={i} style={{ margin: 0, paddingLeft: '1.2em', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^-\s+/, ''), `${i}-${j}-`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{renderInline(block, `${i}-`)}</p>;
      })}
    </div>
  );
}
