import Link from 'next/link';

/** page tính từ 0 như backend; hiển thị cho khách thì +1. */
export function Pagination({
  page,
  totalPages,
  basePath,
  params,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params: Record<string, string | string[] | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (key === 'page' || value === undefined) continue;
      if (Array.isArray(value)) value.forEach((v) => sp.append(key, v));
      else sp.set(key, value);
    }
    if (target > 0) sp.set('page', String(target));
    return `${basePath}${sp.toString() ? `?${sp}` : ''}`;
  };

  const numbers: number[] = [];
  const from = Math.max(0, Math.min(page - 2, totalPages - 5));
  for (let i = from; i < Math.min(totalPages, from + 5); i++) numbers.push(i);

  return (
    <nav className="pagination" aria-label="Phân trang">
      <Link
        className="page-link"
        href={hrefFor(page - 1)}
        aria-disabled={page === 0}
        tabIndex={page === 0 ? -1 : undefined}
      >
        ← Trước
      </Link>
      {numbers.map((n) => (
        <Link
          key={n}
          className="page-link"
          href={hrefFor(n)}
          aria-current={n === page ? 'page' : undefined}
        >
          {n + 1}
        </Link>
      ))}
      <Link
        className="page-link"
        href={hrefFor(page + 1)}
        aria-disabled={page >= totalPages - 1}
        tabIndex={page >= totalPages - 1 ? -1 : undefined}
      >
        Sau →
      </Link>
    </nav>
  );
}
