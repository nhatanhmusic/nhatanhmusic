'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { RichTextarea } from '@/components/admin/RichTextarea';
import { ApiRequestError, adminApi } from '@/lib/api';
import { formatVnd } from '@/lib/format';
import { readToken } from '@/lib/session';
import type { BrandRow, CategoryRow, ModelView } from '@/lib/types';

type SpecRow = { key: string; value: string };

type Draft = {
  id: number | null;
  categoryId: string;
  brandId: string;
  name: string;
  slug: string;
  description: string;
  unique: boolean;
  stockQuantity: string;
  listPriceVnd: string;
  specs: SpecRow[];
};

const EMPTY: Draft = {
  id: null,
  categoryId: '',
  brandId: '',
  name: '',
  slug: '',
  description: '',
  unique: true,
  stockQuantity: '',
  listPriceVnd: '',
  specs: [],
};

export default function ModelsPage() {
  const [models, setModels] = useState<ModelView[]>([]);
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = readToken();
    if (!token) return;
    try {
      const [m, b, c] = await Promise.all([
        adminApi.modelRows(token),
        adminApi.brands(token),
        adminApi.categories(token),
      ]);
      setModels(m);
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

  function startNew() {
    setDraft({ ...EMPTY, categoryId: String(categories[0]?.id ?? '') });
    setEditing(true);
    setError(null);
  }

  function startEdit(model: ModelView) {
    setDraft({
      id: model.id,
      categoryId: String(model.categoryId),
      brandId: model.brandId ? String(model.brandId) : '',
      name: model.name,
      slug: model.slug,
      description: model.description ?? '',
      unique: model.unique,
      stockQuantity: model.stockQuantity != null ? String(model.stockQuantity) : '',
      listPriceVnd: model.listPriceVnd != null ? String(model.listPriceVnd) : '',
      specs: Object.entries(model.specs ?? {}).map(([key, value]) => ({ key, value })),
    });
    setEditing(true);
    setError(null);
  }

  async function save() {
    const token = readToken();
    if (!token) return;
    setError(null);

    const specs: Record<string, string> = {};
    for (const row of draft.specs) {
      if (row.key.trim()) specs[row.key.trim()] = row.value;
    }

    const digits = (s: string) => (s.replace(/\D/g, '') ? Number(s.replace(/\D/g, '')) : null);

    try {
      await adminApi.saveModel(token, draft.id, {
        categoryId: Number(draft.categoryId),
        brandId: draft.brandId ? Number(draft.brandId) : null,
        name: draft.name,
        slug: draft.slug || null,
        description: draft.description || null,
        specs,
        unique: draft.unique,
        stockQuantity: draft.unique ? null : digits(draft.stockQuantity),
        listPriceVnd: draft.unique ? null : digits(draft.listPriceVnd),
      });
      setEditing(false);
      setDraft(EMPTY);
      await load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Không lưu được.');
    }
  }

  async function remove(model: ModelView) {
    const token = readToken();
    if (!token || !confirm(`Xóa model "${model.name}"?`)) return;
    try {
      await adminApi.deleteModel(token, model.id);
      await load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Không xóa được.');
    }
  }

  return (
    <AdminShell
      title="Model sản phẩm"
      subtitle="Thông tin chung của một dòng đàn. Từng cây có thật nằm ở Kho đàn & gear."
      actions={
        !editing && (
          <button type="button" className="btn btn-sm" onClick={startNew}>
            + Thêm model
          </button>
        )
      }
    >
      {error && <div className="notice" style={{ marginBottom: 'var(--sp-5)' }}>{error}</div>}

      {editing ? (
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
          <h2 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>
            {draft.id ? 'Sửa model' : 'Model mới'}
          </h2>

          <label className="field">
            <span className="field-label">Tên model *</span>
            <input
              className="input"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Fender Player Stratocaster MIM"
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="field">
              <span className="field-label">Danh mục *</span>
              <select
                className="input"
                value={draft.categoryId}
                onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}
              >
                <option value="">— chọn —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Hãng</span>
              <select
                className="input"
                value={draft.brandId}
                onChange={(e) => setDraft({ ...draft, brandId: e.target.value })}
              >
                <option value="">— không có —</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="field">
            <span className="field-label">Mô tả chung</span>
            <RichTextarea
              value={draft.description}
              onChange={(next) => setDraft({ ...draft, description: next })}
              placeholder="Mô tả cho cả dòng đàn này, không phải cho một cây cụ thể."
            />
          </div>

          <label className="frow" style={{ gap: 10 }}>
            <input
              type="checkbox"
              checked={draft.unique}
              onChange={(e) => setDraft({ ...draft, unique: e.target.checked })}
            />
            <span className="box">{draft.unique ? '✓' : ''}</span>
            Là nhạc cụ — mỗi cây một dòng riêng, có serial và ảnh riêng
          </label>
          <span className="field-hint" style={{ marginTop: -8 }}>
            Bỏ tick nếu là phụ kiện bán theo số lượng (dây, pick, capo).
          </span>

          {!draft.unique && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label className="field">
                <span className="field-label">Số lượng tồn *</span>
                <input
                  className="input"
                  inputMode="numeric"
                  value={draft.stockQuantity}
                  onChange={(e) => setDraft({ ...draft, stockQuantity: e.target.value })}
                />
              </label>
              <label className="field">
                <span className="field-label">Giá bán (đồng)</span>
                <input
                  className="input"
                  inputMode="numeric"
                  value={draft.listPriceVnd}
                  onChange={(e) => setDraft({ ...draft, listPriceVnd: e.target.value })}
                />
              </label>
            </div>
          )}

          <div className="field">
            <span className="field-label">Thông số kỹ thuật</span>
            <span className="field-hint">
              Hiện thành bảng ở trang chi tiết. Ví dụ: Thân — Alder, Mặt phím — Rosewood.
            </span>
            {draft.specs.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 44px', gap: 8 }}>
                <input
                  className="input"
                  value={row.key}
                  placeholder="Tên thông số"
                  onChange={(e) => {
                    const next = [...draft.specs];
                    next[i] = { ...row, key: e.target.value };
                    setDraft({ ...draft, specs: next });
                  }}
                />
                <input
                  className="input"
                  value={row.value}
                  placeholder="Giá trị"
                  onChange={(e) => {
                    const next = [...draft.specs];
                    next[i] = { ...row, value: e.target.value };
                    setDraft({ ...draft, specs: next });
                  }}
                />
                <button
                  type="button"
                  className="pill"
                  style={{ height: 'var(--control-h)' }}
                  onClick={() => setDraft({ ...draft, specs: draft.specs.filter((_, j) => j !== i) })}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-alt btn-sm"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => setDraft({ ...draft, specs: [...draft.specs, { key: '', value: '' }] })}
            >
              + Thêm thông số
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn" onClick={save}>
              {draft.id ? 'Lưu thay đổi' : 'Tạo model'}
            </button>
            <button
              type="button"
              className="btn btn-alt"
              onClick={() => {
                setEditing(false);
                setDraft(EMPTY);
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="skeleton" style={{ height: 320 }} />
      ) : models.length === 0 ? (
        <div className="empty">
          <b>Chưa có model nào.</b>
          <span style={{ color: 'var(--color-muted)' }}>
            Tạo model trước, rồi mới thêm được từng cây đàn vào kho.
          </span>
          <button type="button" className="btn btn-sm" onClick={startNew}>
            Thêm model
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Hãng</th>
              <th>Kiểu</th>
              <th>Cây trong kho</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.id}>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td>{m.categoryName}</td>
                <td>{m.brandName ?? '—'}</td>
                <td>
                  {m.unique ? (
                    <span className="tag tag-green">Nhạc cụ</span>
                  ) : (
                    <span className="tag tag-brass">
                      Phụ kiện · tồn {m.stockQuantity ?? 0}
                      {m.listPriceVnd ? ` · ${formatVnd(m.listPriceVnd)}` : ''}
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>{m.itemCount}</td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button type="button" className="pill" style={{ marginRight: 6 }} onClick={() => startEdit(m)}>
                    Sửa
                  </button>
                  <button
                    type="button"
                    className="pill"
                    disabled={m.itemCount > 0}
                    title={m.itemCount > 0 ? 'Còn cây đàn thuộc model này' : undefined}
                    onClick={() => remove(m)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
