'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { IconCheck, IconCross } from '@/components/ui/Icons';
import { formatVnd } from '@/lib/format';
import type { ItemFilters } from '@/lib/types';

/**
 * Bộ lọc nằm trên URL để chia sẻ link được (design/FRONTEND.md).
 * Bấm là điều hướng luôn — không cần nút "Áp dụng" cho bộ lọc đơn giản,
 * riêng khoảng giá thì có nút vì gõ số xong mới biết là xong.
 */
export function FilterSidebar({ facets }: { facets: ItemFilters }) {
  const router = useRouter();
  const params = useSearchParams();

  const current = useMemo(
    () => ({
      category: params.get('category') ?? '',
      brands: params.getAll('brand'),
      grades: params.getAll('grade'),
      priceMin: params.get('priceMin') ?? '',
      priceMax: params.get('priceMax') ?? '',
      weightMax: params.get('weightMax') ?? '',
    }),
    [params],
  );

  const push = useCallback(
    (next: URLSearchParams) => {
      next.delete('page'); // đổi bộ lọc thì về trang 1
      router.push(`/dan${next.toString() ? `?${next}` : ''}`, { scroll: false });
    },
    [router],
  );

  const toggleMulti = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    const existing = next.getAll(key);
    next.delete(key);
    const after = existing.includes(value)
      ? existing.filter((v) => v !== value)
      : [...existing, value];
    after.forEach((v) => next.append(key, v));
    push(next);
  };

  const setSingle = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || next.get(key) === value) next.delete(key);
    else next.set(key, value);
    push(next);
  };

  const applyPrice = (formData: FormData) => {
    const next = new URLSearchParams(params.toString());
    for (const key of ['priceMin', 'priceMax']) {
      const raw = String(formData.get(key) ?? '').replace(/\D/g, '');
      if (raw) next.set(key, raw);
      else next.delete(key);
    }
    push(next);
  };

  return (
    <aside className="card" style={{ padding: '4px 20px 20px' }} aria-label="Bộ lọc sản phẩm">
      <div className="fgroup">
        <div className="fhead">Loại sản phẩm</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {facets.categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              className={`pill${current.category === cat.value ? ' pill-on' : ''}`}
              onClick={() => setSingle('category', cat.value)}
              aria-pressed={current.category === cat.value}
            >
              {cat.label}
              <span style={{ color: 'var(--color-muted-2)', marginLeft: 5 }}>{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="fgroup">
        <div className="fhead">Tình trạng</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {facets.grades.map((grade) => {
            const checked = current.grades.includes(grade.value);
            return (
              <label className="frow" key={grade.value}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleMulti('grade', grade.value)}
                />
                <span className="box">{checked && <IconCheck size={10} color="var(--color-cream)" />}</span>
                {grade.label}
                <span className="count">{grade.count}</span>
              </label>
            );
          })}
          <a href="/thang-tinh-trang" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, paddingTop: 2 }}>
            Thang đánh giá nghĩa là gì?
          </a>
        </div>
      </div>

      <div className="fgroup">
        <div className="fhead">Khoảng giá</div>
        <form action={applyPrice} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
            <input
              className="input"
              name="priceMin"
              inputMode="numeric"
              defaultValue={current.priceMin}
              placeholder={String(facets.minPriceVnd)}
              aria-label="Giá thấp nhất"
              style={{ height: 38, fontSize: 'var(--text-sm)' }}
            />
            <span style={{ color: 'var(--color-muted-2)' }}>–</span>
            <input
              className="input"
              name="priceMax"
              inputMode="numeric"
              defaultValue={current.priceMax}
              placeholder={String(facets.maxPriceVnd)}
              aria-label="Giá cao nhất"
              style={{ height: 38, fontSize: 'var(--text-sm)' }}
            />
          </div>
          <span className="field-hint">
            Đang có từ {formatVnd(facets.minPriceVnd)} đến {formatVnd(facets.maxPriceVnd)}
          </span>
          <button type="submit" className="btn btn-alt btn-sm">
            Áp dụng khoảng giá
          </button>
        </form>
      </div>

      <div className="fgroup">
        <div className="fhead">Cân nặng</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            ['2500', 'Dưới 2,5 kg'],
            ['3500', 'Dưới 3,5 kg'],
            ['4000', 'Dưới 4,0 kg'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`pill${current.weightMax === value ? ' pill-on' : ''}`}
              onClick={() => setSingle('weightMax', value)}
              aria-pressed={current.weightMax === value}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="field-hint" style={{ paddingTop: 10 }}>
          Cân từng cây bằng cân thật — người đau vai chọn đàn bằng đúng con số này.
        </p>
      </div>

      <div className="fgroup" style={{ borderBottom: 'none' }}>
        <div className="fhead">Thương hiệu</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {facets.brands.map((brand) => {
            const checked = current.brands.includes(brand.value);
            return (
              <label className="frow" key={brand.value}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleMulti('brand', brand.value)}
                />
                <span className="box">{checked && <IconCheck size={10} color="var(--color-cream)" />}</span>
                {brand.label}
                <span className="count">{brand.count}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ paddingTop: 18 }}>
        <button
          type="button"
          className="btn btn-alt btn-sm"
          style={{ width: '100%' }}
          onClick={() => router.push('/dan')}
        >
          <IconCross /> Xóa hết bộ lọc
        </button>
      </div>
    </aside>
  );
}

/** Chip cho từng bộ lọc đang bật, bấm chữ X là bỏ. */
export function ActiveFilterChips({ facets }: { facets: ItemFilters }) {
  const router = useRouter();
  const params = useSearchParams();

  const labelOf = (key: string, value: string) => {
    const source =
      key === 'brand' ? facets.brands : key === 'grade' ? facets.grades : facets.categories;
    return source.find((o) => o.value === value)?.label ?? value;
  };

  const chips: { key: string; value: string; label: string }[] = [];
  for (const key of ['category', 'brand', 'grade'] as const) {
    for (const value of params.getAll(key)) {
      chips.push({ key, value, label: labelOf(key, value) });
    }
  }
  const priceMin = params.get('priceMin');
  const priceMax = params.get('priceMax');
  if (priceMin || priceMax) {
    chips.push({
      key: 'price',
      value: '',
      label: `${priceMin ? formatVnd(Number(priceMin)) : 'từ đầu'} – ${priceMax ? formatVnd(Number(priceMax)) : 'trở lên'}`,
    });
  }
  const weightMax = params.get('weightMax');
  if (weightMax) {
    chips.push({ key: 'weightMax', value: weightMax, label: `Dưới ${Number(weightMax) / 1000} kg` });
  }
  const q = params.get('q');
  if (q) chips.push({ key: 'q', value: q, label: `Tìm: ${q}` });

  if (chips.length === 0) return null;

  const remove = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (key === 'price') {
      next.delete('priceMin');
      next.delete('priceMax');
    } else if (key === 'brand' || key === 'grade') {
      const rest = next.getAll(key).filter((v) => v !== value);
      next.delete(key);
      rest.forEach((v) => next.append(key, v));
    } else {
      next.delete(key);
    }
    next.delete('page');
    router.push(`/dan${next.toString() ? `?${next}` : ''}`, { scroll: false });
  };

  return (
    <>
      <span style={{ fontSize: 13.5, color: 'var(--color-muted)' }}>Đang lọc:</span>
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.value}`}
          type="button"
          className="chip"
          onClick={() => remove(chip.key, chip.value)}
          aria-label={`Bỏ lọc ${chip.label}`}
        >
          {chip.label}
          <IconCross />
        </button>
      ))}
    </>
  );
}

const SORTS = [
  ['newest', 'Mới về trước'],
  ['price_asc', 'Giá thấp → cao'],
  ['price_desc', 'Giá cao → thấp'],
  ['weight_asc', 'Nhẹ nhất'],
] as const;

export function SortControl() {
  const router = useRouter();
  const params = useSearchParams();
  const value = params.get('sort') ?? 'newest';

  const change = (next: string) => {
    const sp = new URLSearchParams(params.toString());
    if (next === 'newest') sp.delete('sort');
    else sp.set('sort', next);
    sp.delete('page');
    router.push(`/dan${sp.toString() ? `?${sp}` : ''}`, { scroll: false });
  };

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        border: '1px solid var(--color-line)',
        background: 'var(--color-paper)',
        borderRadius: 'var(--radius)',
        height: 40,
        padding: '0 13px',
        fontSize: 13.5,
        fontWeight: 500,
      }}
    >
      Sắp xếp:
      <select
        value={value}
        onChange={(e) => change(e.target.value)}
        style={{
          border: 0,
          background: 'transparent',
          fontFamily: 'var(--font-body)',
          fontSize: 13.5,
          fontWeight: 600,
          color: 'var(--color-ink)',
          outline: 'none',
        }}
      >
        {SORTS.map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
