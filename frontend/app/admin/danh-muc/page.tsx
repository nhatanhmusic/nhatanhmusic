'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { ApiRequestError, adminApi } from '@/lib/api';
import { readToken } from '@/lib/session';
import type { BrandRow, CategoryRow } from '@/lib/types';

type Draft = { id: number | null; name: string; slug: string; sortOrder: string };

const EMPTY: Draft = { id: null, name: '', slug: '', sortOrder: '0' };

export default function TaxonomyPage() {
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [brandDraft, setBrandDraft] = useState<Draft>(EMPTY);
  const [categoryDraft, setCategoryDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = readToken();
    if (!token) return;
    try {
      const [b, c] = await Promise.all([adminApi.brands(token), adminApi.categories(token)]);
      setBrands(b);
      setCategories(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được dữ liệu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function run(action: () => Promise<unknown>, after?: () => void) {
    setError(null);
    try {
      await action();
      after?.();
      await load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Thao tác không thành công.');
    }
  }

  const saveBrand = () => {
    const token = readToken();
    if (!token || !brandDraft.name.trim()) return;
    run(
      () =>
        adminApi.saveBrand(token, brandDraft.id, {
          name: brandDraft.name,
          slug: brandDraft.slug || null,
        }),
      () => setBrandDraft(EMPTY),
    );
  };

  const saveCategory = () => {
    const token = readToken();
    if (!token || !categoryDraft.name.trim()) return;
    run(
      () =>
        adminApi.saveCategory(token, categoryDraft.id, {
          name: categoryDraft.name,
          slug: categoryDraft.slug || null,
          sortOrder: Number(categoryDraft.sortOrder) || 0,
        }),
      () => setCategoryDraft(EMPTY),
    );
  };

  return (
    <AdminShell
      title="Hãng & danh mục"
      subtitle="Danh mục quyết định menu trên web — thêm ở đây là menu tự có thêm mục"
    >
      {error && <div className="notice" style={{ marginBottom: 'var(--sp-5)' }}>{error}</div>}

      {loading ? (
        <div className="skeleton" style={{ height: 360 }} />
      ) : (
        <div className="grid-2" style={{ alignItems: 'start', gap: 'var(--sp-6)' }}>
          {/* ── Danh mục ── */}
          <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>Danh mục</h2>
              <p className="field-hint" style={{ paddingTop: 4 }}>
                Thứ tự nhỏ hiện trước. Danh mục còn model thì không xóa được.
              </p>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Đường dẫn</th>
                  <th>Thứ tự</th>
                  <th>Model</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ color: 'var(--color-muted)' }}>{c.slug}</td>
                    <td>{c.sortOrder}</td>
                    <td style={{ textAlign: 'center' }}>{c.modelCount}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="pill"
                        style={{ marginRight: 6 }}
                        onClick={() =>
                          setCategoryDraft({
                            id: c.id,
                            name: c.name,
                            slug: c.slug,
                            sortOrder: String(c.sortOrder),
                          })
                        }
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="pill"
                        disabled={c.modelCount > 0}
                        title={c.modelCount > 0 ? 'Còn model thuộc danh mục này' : undefined}
                        onClick={() => {
                          const token = readToken();
                          if (token && confirm(`Xóa danh mục "${c.name}"?`)) {
                            run(() => adminApi.deleteCategory(token, c.id));
                          }
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span className="field-label">
                {categoryDraft.id ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 90px', gap: 8 }}>
                <input
                  className="input"
                  placeholder="Tên, ví dụ Ukulele"
                  value={categoryDraft.name}
                  onChange={(e) => setCategoryDraft({ ...categoryDraft, name: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="đường dẫn (tự sinh)"
                  value={categoryDraft.slug}
                  onChange={(e) => setCategoryDraft({ ...categoryDraft, slug: e.target.value })}
                />
                <input
                  className="input"
                  inputMode="numeric"
                  value={categoryDraft.sortOrder}
                  onChange={(e) => setCategoryDraft({ ...categoryDraft, sortOrder: e.target.value })}
                  aria-label="Thứ tự"
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-sm" onClick={saveCategory}>
                  {categoryDraft.id ? 'Lưu' : 'Thêm'}
                </button>
                {categoryDraft.id && (
                  <button type="button" className="btn btn-alt btn-sm" onClick={() => setCategoryDraft(EMPTY)}>
                    Hủy
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* ── Hãng ── */}
          <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>Hãng</h2>
              <p className="field-hint" style={{ paddingTop: 4 }}>
                Hiện ở dải &quot;Mua theo hãng&quot; trang chủ và bộ lọc danh sách.
              </p>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Đường dẫn</th>
                  <th>Model</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {brands.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.name}</td>
                    <td style={{ color: 'var(--color-muted)' }}>{b.slug}</td>
                    <td style={{ textAlign: 'center' }}>{b.modelCount}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="pill"
                        style={{ marginRight: 6 }}
                        onClick={() =>
                          setBrandDraft({ id: b.id, name: b.name, slug: b.slug, sortOrder: '0' })
                        }
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="pill"
                        disabled={b.modelCount > 0}
                        title={b.modelCount > 0 ? 'Còn model thuộc hãng này' : undefined}
                        onClick={() => {
                          const token = readToken();
                          if (token && confirm(`Xóa hãng "${b.name}"?`)) {
                            run(() => adminApi.deleteBrand(token, b.id));
                          }
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span className="field-label">{brandDraft.id ? 'Sửa hãng' : 'Thêm hãng mới'}</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input
                  className="input"
                  placeholder="Tên, ví dụ Martin"
                  value={brandDraft.name}
                  onChange={(e) => setBrandDraft({ ...brandDraft, name: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="đường dẫn (tự sinh)"
                  value={brandDraft.slug}
                  onChange={(e) => setBrandDraft({ ...brandDraft, slug: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-sm" onClick={saveBrand}>
                  {brandDraft.id ? 'Lưu' : 'Thêm'}
                </button>
                {brandDraft.id && (
                  <button type="button" className="btn btn-alt btn-sm" onClick={() => setBrandDraft(EMPTY)}>
                    Hủy
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
