'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PhotoUploader, useMediaStatus } from '@/components/admin/PhotoUploader';
import { RichTextarea } from '@/components/admin/RichTextarea';
import { ApiRequestError, adminApi } from '@/lib/api';
import { readToken } from '@/lib/session';
import {
  GRADE_LABEL,
  GRADE_ORDER,
  PHOTO_KIND_LABEL,
  SOURCE_LABEL,
  STATUS_LABEL,
  type ConditionGrade,
  type ItemDetail,
  type ItemSource,
  type ItemStatus,
  type ModelOption,
  type PhotoKind,
} from '@/lib/types';

type PhotoRow = { key: string; kind: PhotoKind; altText: string };
type FlawRow = { title: string; description: string };

/** 5 góc bắt buộc chụp cho mỗi cây (mục 15 của kế hoạch build). */
const REQUIRED_ANGLES: PhotoKind[] = ['MAIN', 'BACK', 'HEADSTOCK', 'BRIDGE', 'FRETBOARD'];

function emptyPhotos(): PhotoRow[] {
  return REQUIRED_ANGLES.map((kind) => ({ key: '', kind, altText: '' }));
}

export function ItemForm({ existing }: { existing?: ItemDetail }) {
  const router = useRouter();
  const [models, setModels] = useState<ModelOption[]>([]);
  const media = useMediaStatus();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    productModelId: existing ? String(models.find(() => false)?.id ?? '') : '',
    sku: existing?.card.sku ?? '',
    serialNo: existing?.serialNo ?? '',
    title: existing?.card.title ?? '',
    slug: existing?.card.slug ?? '',
    summary: existing?.summary ?? '',
    conditionGrade: (existing?.card.conditionGrade ?? 'EXCELLENT') as ConditionGrade,
    weightGrams: existing?.card.weightGrams ? String(existing.card.weightGrams) : '',
    yearMade: existing?.card.yearMade ? String(existing.card.yearMade) : '',
    madeIn: existing?.card.madeIn ?? '',
    priceVnd: existing ? String(existing.card.priceVnd) : '',
    compareAtPriceVnd: existing?.card.compareAtPriceVnd ? String(existing.card.compareAtPriceVnd) : '',
    status: (existing?.card.status ?? 'DRAFT') as ItemStatus,
    source: (existing?.card.source ?? 'PURCHASED') as ItemSource,
    acceptsOffers: existing?.card.acceptsOffers ?? false,
  });

  const [photos, setPhotos] = useState<PhotoRow[]>(
    existing && existing.photos.length > 0
      ? existing.photos.map((p) => ({ key: p.key, kind: p.kind, altText: p.altText ?? '' }))
      : emptyPhotos(),
  );

  const [flaws, setFlaws] = useState<FlawRow[]>(
    existing?.flaws.map((f) => ({ title: f.title, description: f.description ?? '' })) ?? [],
  );

  useEffect(() => {
    const token = readToken();
    if (!token) return;
    adminApi
      .models(token)
      .then((list) => {
        const unique = list.filter((m) => m.unique);
        setModels(unique);
        setForm((f) => {
          if (f.productModelId) return f;
          const match = existing
            ? unique.find((m) => m.slug === existing.modelSlug)
            : undefined;
          return { ...f, productModelId: String(match?.id ?? unique[0]?.id ?? '') };
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Không tải được danh sách model.'));
  }, [existing]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const numberOrNull = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits ? Number(digits) : null;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const token = readToken();
    if (!token) {
      router.replace('/dang-nhap');
      return;
    }

    setBusy(true);
    setError(null);
    setFieldErrors({});

    const body = {
      productModelId: form.productModelId ? Number(form.productModelId) : null,
      sku: form.sku.trim(),
      serialNo: form.serialNo.trim() || null,
      title: form.title.trim(),
      slug: form.slug.trim() || null,
      summary: form.summary.trim() || null,
      conditionGrade: form.conditionGrade,
      weightGrams: numberOrNull(form.weightGrams),
      yearMade: numberOrNull(form.yearMade),
      madeIn: form.madeIn.trim() || null,
      priceVnd: numberOrNull(form.priceVnd),
      compareAtPriceVnd: numberOrNull(form.compareAtPriceVnd),
      status: form.status,
      source: form.source,
      acceptsOffers: form.acceptsOffers,
      photos: photos
        .filter((p) => p.key.trim())
        .map((p) => ({ key: p.key.trim(), kind: p.kind, altText: p.altText.trim() || null })),
      flaws: flaws
        .filter((f) => f.title.trim())
        .map((f) => ({ title: f.title.trim(), description: f.description.trim() || null })),
    };

    try {
      const saved = existing
        ? await adminApi.update(token, existing.card.id, body)
        : await adminApi.create(token, body);
      router.push(`/admin/dan/${saved.card.id}?saved=1`);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
        if (err.fields) setFieldErrors(err.fields);
      } else {
        setError('Không lưu được. Kiểm tra backend đã chạy chưa.');
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    const token = readToken();
    if (!token || !existing) return;
    if (!confirm(`Xóa mềm cây "${existing.card.title}"? Dữ liệu vẫn giữ trong database.`)) return;
    try {
      await adminApi.remove(token, existing.card.id);
      router.push('/admin/dan');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Không xóa được.');
    }
  }

  const err = (field: string) => fieldErrors[field];

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      {error && <div className="notice">{error}</div>}

      <div className="grid-2" style={{ alignItems: 'start', gap: 'var(--sp-6)' }}>
        {/* ── Thông tin cây đàn ── */}
        <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>Cây đàn này</h2>

          <label className="field">
            <span className="field-label">Model *</span>
            <select
              className="input"
              value={form.productModelId}
              onChange={(e) => set('productModelId', e.target.value)}
              required
            >
              <option value="">— chọn model —</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.brandName ? `${m.brandName} · ` : ''}
                  {m.name}
                </option>
              ))}
            </select>
            {err('productModelId') && <span className="field-error">{err('productModelId')}</span>}
          </label>

          <label className="field">
            <span className="field-label">Tiêu đề hiển thị *</span>
            <input
              className="input"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Fender Player Stratocaster MIM — 3-Color Sunburst"
              required
            />
            {err('title') && <span className="field-error">{err('title')}</span>}
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="field">
              <span className="field-label">SKU *</span>
              <input
                className="input"
                value={form.sku}
                onChange={(e) => set('sku', e.target.value)}
                placeholder="NA-EG-0231"
                required
              />
              {err('sku') && <span className="field-error">{err('sku')}</span>}
            </label>
            <label className="field">
              <span className="field-label">Số serial</span>
              <input
                className="input"
                value={form.serialNo}
                onChange={(e) => set('serialNo', e.target.value)}
                placeholder="MX19045512"
              />
            </label>
          </div>

          <label className="field">
            <span className="field-label">Đường dẫn (slug)</span>
            <input
              className="input"
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              placeholder="để trống thì tự sinh từ tiêu đề + SKU"
            />
            <span className="field-hint">/dan/{form.slug || 'tu-sinh-tu-tieu-de-va-sku'}</span>
          </label>

          <div className="field">
            <span className="field-label">Mô tả riêng của cây này</span>
            <RichTextarea
              value={form.summary}
              onChange={(next) => set('summary', next)}
              placeholder="Cây này về từ đâu, đã làm gì cho nó, phím còn bao nhiêu…"
            />
          </div>

          <div className="field">
            <span className="field-label">Mức tình trạng *</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {GRADE_ORDER.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  className={`pill${form.conditionGrade === grade ? ' pill-on' : ''}`}
                  onClick={() => set('conditionGrade', grade)}
                  aria-pressed={form.conditionGrade === grade}
                >
                  {GRADE_LABEL[grade]}
                </button>
              ))}
            </div>
            <span className="field-hint">
              Phân vân giữa hai mức thì chọn mức thấp hơn — thà khách nhận đàn đẹp hơn mong đợi.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <label className="field">
              <span className="field-label">Cân nặng (gram)</span>
              <input
                className="input"
                inputMode="numeric"
                value={form.weightGrams}
                onChange={(e) => set('weightGrams', e.target.value)}
                placeholder="3520"
              />
              {err('weightGrams') && <span className="field-error">{err('weightGrams')}</span>}
            </label>
            <label className="field">
              <span className="field-label">Năm SX</span>
              <input
                className="input"
                inputMode="numeric"
                value={form.yearMade}
                onChange={(e) => set('yearMade', e.target.value)}
                placeholder="2019"
              />
            </label>
            <label className="field">
              <span className="field-label">Nơi SX</span>
              <input
                className="input"
                value={form.madeIn}
                onChange={(e) => set('madeIn', e.target.value)}
                placeholder="Mexico"
              />
            </label>
          </div>
          <span className="field-hint">
            Cân từng cây và ghi số vào — người đau vai chọn đàn bằng đúng con số này, và không shop
            Việt Nam nào làm.
          </span>
        </section>

        {/* ── Giá & trạng thái ── */}
        <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>Giá &amp; trạng thái</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className="field">
              <span className="field-label">Giá bán (đồng) *</span>
              <input
                className="input"
                inputMode="numeric"
                value={form.priceVnd}
                onChange={(e) => set('priceVnd', e.target.value)}
                placeholder="18900000"
                required
              />
              {err('priceVnd') && <span className="field-error">{err('priceVnd')}</span>}
            </label>
            <label className="field">
              <span className="field-label">Giá gạch ngang</span>
              <input
                className="input"
                inputMode="numeric"
                value={form.compareAtPriceVnd}
                onChange={(e) => set('compareAtPriceVnd', e.target.value)}
                placeholder="21500000"
              />
            </label>
          </div>
          <span className="field-hint">Nhập số nguyên đơn vị đồng, không dấu chấm. 18900000 = 18.900.000₫.</span>

          <label className="field">
            <span className="field-label">Trạng thái</span>
            <select
              className="input"
              value={form.status}
              onChange={(e) => set('status', e.target.value as ItemStatus)}
            >
              {(Object.keys(STATUS_LABEL) as ItemStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
            <span className="field-hint">
              Backend chỉ cho đi theo luồng DRAFT → Đang bán → Đã giữ → Đã bán. Bước sai sẽ báo lỗi.
            </span>
          </label>

          <label className="field">
            <span className="field-label">Nguồn gốc</span>
            <select
              className="input"
              value={form.source}
              onChange={(e) => set('source', e.target.value as ItemSource)}
            >
              {(Object.keys(SOURCE_LABEL) as ItemSource[]).map((s) => (
                <option key={s} value={s}>
                  {SOURCE_LABEL[s]}
                </option>
              ))}
            </select>
          </label>

          <label className="frow" style={{ gap: 10 }}>
            <input
              type="checkbox"
              checked={form.acceptsOffers}
              onChange={(e) => set('acceptsOffers', e.target.checked)}
            />
            <span className="box">{form.acceptsOffers && '✓'}</span>
            Cho khách trả giá cây này
          </label>
        </section>
      </div>

      {/* ── Ảnh ── */}
      <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>Ảnh — 5 góc</h2>
          <p className="field-hint" style={{ paddingTop: 4 }}>
            Toàn thân, lưng, đầu cần, cầu đàn, mặt phím. Đặt đàn trước tường trơn sáng màu, chụp ban
            ngày cạnh cửa sổ là đủ đẹp. Ảnh tự thu nhỏ trong trình duyệt trước khi tải lên, bản gốc
            vẫn được giữ.
          </p>
          {!existing && (
            <p className="notice" style={{ marginTop: 8 }}>
              Tạo cây đàn trước, rồi mở lại để tải ảnh — ảnh cần mã số của cây để đặt tên file.
            </p>
          )}
          {existing && media && !media.configured && (
            <p className="notice" style={{ marginTop: 8 }}>
              Chưa cấu hình kho ảnh Cloudflare R2 trên máy chủ, nên chưa tải ảnh lên được. Tạm thời
              trang sẽ hiện ô chờ ảnh. Người kỹ thuật cần điền R2_ACCOUNT_ID / R2_ACCESS_KEY /
              R2_SECRET_KEY / R2_BUCKET rồi khởi động lại backend.
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {photos.map((photo, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: existing && media?.configured ? '150px 1fr 1fr auto 44px' : '150px 1fr 1fr 44px',
                gap: 10,
                alignItems: 'end',
              }}
            >
              <label className="field">
                {i === 0 && <span className="field-label">Góc</span>}
                <select
                  className="input"
                  value={photo.kind}
                  onChange={(e) => {
                    const next = [...photos];
                    next[i] = { ...photo, kind: e.target.value as PhotoKind };
                    setPhotos(next);
                  }}
                >
                  {(Object.keys(PHOTO_KIND_LABEL) as PhotoKind[]).map((k) => (
                    <option key={k} value={k}>
                      {PHOTO_KIND_LABEL[k]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                {i === 0 && <span className="field-label">Đường dẫn ảnh (tự điền khi tải lên)</span>}
                <input
                  className="input"
                  value={photo.key}
                  onChange={(e) => {
                    const next = [...photos];
                    next[i] = { ...photo, key: e.target.value };
                    setPhotos(next);
                  }}
                  placeholder="items/1/main-1.webp"
                />
              </label>
              <label className="field">
                {i === 0 && <span className="field-label">Mô tả ảnh (alt)</span>}
                <input
                  className="input"
                  value={photo.altText}
                  onChange={(e) => {
                    const next = [...photos];
                    next[i] = { ...photo, altText: e.target.value };
                    setPhotos(next);
                  }}
                  placeholder="Fender Player Stratocaster Sunburst — mặt trước"
                />
              </label>
              {existing && media?.configured && (
                <PhotoUploader
                  itemId={existing.card.id}
                  kind={photo.kind}
                  index={i + 1}
                  onUploaded={(key) => {
                    const next = [...photos];
                    next[i] = { ...photo, key };
                    setPhotos(next);
                  }}
                />
              )}
              <button
                type="button"
                className="pill"
                style={{ height: 'var(--control-h)' }}
                onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                aria-label="Xóa dòng ảnh"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-alt btn-sm"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => setPhotos([...photos, { key: '', kind: 'OTHER', altText: '' }])}
        >
          + Thêm ảnh
        </button>
      </section>

      {/* ── Khuyết điểm ── */}
      <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>Khuyết điểm của đúng cây này</h2>
          <p className="field-hint" style={{ paddingTop: 4 }}>
            Shop cam kết: khách thấy một vết không có trong danh sách này thì shop nhận lại và hoàn
            tiền. Cam kết đó chỉ giữ được nếu ghi đủ ở đây.
          </p>
        </div>

        {flaws.length === 0 && (
          <p className="field-hint">Chưa ghi khuyết điểm nào. Cây thật sự không có vết thì để trống.</p>
        )}

        {flaws.map((flaw, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 44px', gap: 10, alignItems: 'end' }}>
            <label className="field">
              {i === 0 && <span className="field-label">Tiêu đề</span>}
              <input
                className="input"
                value={flaw.title}
                onChange={(e) => {
                  const next = [...flaws];
                  next[i] = { ...flaw, title: e.target.value };
                  setFlaws(next);
                }}
                placeholder="Xước nhẹ mặt lưng, cạnh dưới"
              />
            </label>
            <label className="field">
              {i === 0 && <span className="field-label">Mô tả</span>}
              <input
                className="input"
                value={flaw.description}
                onChange={(e) => {
                  const next = [...flaws];
                  next[i] = { ...flaw, description: e.target.value };
                  setFlaws(next);
                }}
                placeholder="Dài chừng 2cm, chỉ ở lớp sơn bóng, chưa tới gỗ."
              />
            </label>
            <button
              type="button"
              className="pill"
              style={{ height: 'var(--control-h)' }}
              onClick={() => setFlaws(flaws.filter((_, j) => j !== i))}
              aria-label="Xóa khuyết điểm"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-alt btn-sm"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => setFlaws([...flaws, { title: '', description: '' }])}
        >
          + Thêm khuyết điểm
        </button>
      </section>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Đang lưu…' : existing ? 'Lưu thay đổi' : 'Tạo cây đàn'}
        </button>
        <button type="button" className="btn btn-alt" onClick={() => router.back()}>
          Hủy
        </button>
        {existing && (
          <button
            type="button"
            className="btn btn-alt"
            style={{ marginLeft: 'auto', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
            onClick={remove}
          >
            Xóa cây này
          </button>
        )}
      </div>
    </form>
  );
}
