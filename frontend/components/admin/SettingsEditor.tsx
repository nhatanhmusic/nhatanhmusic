'use client';

import { useState } from 'react';
import { RichTextarea } from '@/components/admin/RichTextarea';
import { ApiRequestError, adminApi } from '@/lib/api';
import { readToken } from '@/lib/session';
import { SCHEMAS, type Field, type SettingSchema } from '@/lib/settingSchemas';
import type { SettingView } from '@/lib/types';

type Obj = Record<string, unknown>;

/** Sửa một ô trong một đối tượng mà không đụng vào bản gốc. */
function withKey(obj: Obj, key: string, value: unknown): Obj {
  return { ...obj, [key]: value };
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  if (field.kind === 'stringList') {
    const list = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="field">
        <span className="field-label">{field.label}</span>
        {field.hint && <span className="field-hint">{field.hint}</span>}
        {list.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 8 }}>
            <input
              className="input"
              value={line}
              onChange={(e) => {
                const next = [...list];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              className="pill"
              style={{ height: 'var(--control-h)' }}
              onClick={() => onChange(list.filter((_, j) => j !== i))}
              aria-label="Xóa dòng"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-alt btn-sm"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => onChange([...list, ''])}
        >
          + Thêm dòng
        </button>
      </div>
    );
  }

  if (field.kind === 'objectList') {
    const list = Array.isArray(value) ? (value as Obj[]) : [];
    return (
      <div className="field">
        <span className="field-label">{field.label}</span>
        {list.map((row, i) => (
          <div
            key={i}
            className="card"
            style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {field.fields.map((sub) => (
              <FieldInput
                key={sub.key}
                field={sub}
                value={row[sub.key]}
                onChange={(next) => {
                  const copy = [...list];
                  copy[i] = withKey(row, sub.key, next);
                  onChange(copy);
                }}
              />
            ))}
            <button
              type="button"
              className="pill"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => onChange(list.filter((_, j) => j !== i))}
            >
              ✕ Xóa mục này
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-alt btn-sm"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => onChange([...list, {}])}
        >
          + Thêm mục
        </button>
      </div>
    );
  }

  if (field.kind === 'boolean') {
    return (
      <label className="frow" style={{ gap: 10 }}>
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        <span className="box">{value ? '✓' : ''}</span>
        {field.label}
      </label>
    );
  }

  if (field.kind === 'select') {
    return (
      <label className="field">
        <span className="field-label">{field.label}</span>
        <select className="input" value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.kind === 'textarea') {
    return (
      <div className="field">
        <span className="field-label">{field.label}</span>
        {field.hint && <span className="field-hint">{field.hint}</span>}
        <RichTextarea value={String(value ?? '')} onChange={(next) => onChange(next)} />
      </div>
    );
  }

  if (field.kind === 'group') {
    const obj = (value ?? {}) as Obj;
    return (
      <fieldset
        style={{
          border: '1px solid var(--color-line)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px 18px',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <legend style={{ padding: '0 6px', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--color-green-dark)' }}>
          {field.label}
        </legend>
        {field.hint && <span className="field-hint">{field.hint}</span>}
        {field.fields.map((sub) => (
          <FieldInput
            key={sub.key}
            field={sub}
            value={obj[sub.key]}
            onChange={(next) => onChange(withKey(obj, sub.key, next))}
          />
        ))}
      </fieldset>
    );
  }

  return (
    <label className="field">
      <span className="field-label">{field.label}</span>
      <input
        className="input"
        inputMode={field.kind === 'number' ? 'numeric' : undefined}
        value={value === undefined || value === null ? '' : String(value)}
        placeholder={field.kind === 'text' ? field.placeholder : undefined}
        onChange={(e) =>
          onChange(
            field.kind === 'number'
              ? Number(e.target.value.replace(/\D/g, '')) || 0
              : e.target.value,
          )
        }
      />
      {field.hint && <span className="field-hint">{field.hint}</span>}
    </label>
  );
}

function SchemaForm({
  schema,
  value,
  onChange,
}: {
  schema: SettingSchema;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  if (schema.shape === 'object') {
    const obj = (value ?? {}) as Obj;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {schema.fields.map((f) => (
          <FieldInput
            key={f.key}
            field={f}
            value={obj[f.key]}
            onChange={(next) => onChange(withKey(obj, f.key, next))}
          />
        ))}
      </div>
    );
  }

  if (schema.shape === 'map') {
    const obj = (value ?? {}) as Obj;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {schema.entries.map((entry) => (
          <label className="field" key={entry.key}>
            <span className="field-label">{entry.label}</span>
            <textarea
              className="input"
              style={{ minHeight: 64 }}
              value={String(obj[entry.key] ?? '')}
              onChange={(e) => onChange(withKey(obj, entry.key, e.target.value))}
            />
          </label>
        ))}
      </div>
    );
  }

  if (schema.shape === 'stringList') {
    return (
      <FieldInput
        field={{ kind: 'stringList', key: 'root', label: `Các ${schema.itemNoun}` }}
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <FieldInput
      field={{
        kind: 'objectList',
        key: 'root',
        label: `Các ${schema.itemNoun}`,
        titleKey: schema.titleKey,
        fields: schema.fields,
      }}
      value={value}
      onChange={onChange}
    />
  );
}

/** Khối chưa khai báo lược đồ: vẫn sửa được, chỉ là bằng JSON thô. */
function RawJsonForm({ value, onChange }: { value: unknown; onChange: (next: unknown) => void }) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [error, setError] = useState<string | null>(null);

  return (
    <label className="field">
      <span className="field-label">JSON</span>
      <textarea
        className="input"
        style={{ minHeight: 220, fontFamily: 'ui-monospace, monospace', fontSize: 13 }}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          try {
            onChange(JSON.parse(e.target.value));
            setError(null);
          } catch {
            setError('JSON chưa hợp lệ — chưa lưu được.');
          }
        }}
      />
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

export function SettingBlock({ setting }: { setting: SettingView }) {
  const [value, setValue] = useState<unknown>(setting.value);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  const schema = SCHEMAS[setting.key];
  const dirty = JSON.stringify(value) !== JSON.stringify(setting.value);

  async function save() {
    const token = readToken();
    if (!token) return;
    setBusy(true);
    setStatus(null);
    try {
      await adminApi.saveSetting(token, setting.key, value);
      setStatus({ ok: true, message: 'Đã lưu. Trang khách cập nhật trong vòng 30 giây.' });
    } catch (err) {
      setStatus({
        ok: false,
        message: err instanceof ApiRequestError ? err.message : 'Không lưu được.',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>{setting.label}</h2>
        {setting.description && (
          <p className="field-hint" style={{ paddingTop: 4 }}>
            {setting.description}
          </p>
        )}
      </div>

      {schema ? (
        <SchemaForm schema={schema} value={value} onChange={setValue} />
      ) : (
        <RawJsonForm value={value} onChange={setValue} />
      )}

      {status && (
        <div className={`notice${status.ok ? ' notice-ok' : ''}`}>{status.message}</div>
      )}

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button type="button" className="btn btn-sm" onClick={save} disabled={busy || !dirty}>
          {busy ? 'Đang lưu…' : 'Lưu khối này'}
        </button>
        {dirty && <span className="field-hint">Có thay đổi chưa lưu.</span>}
      </div>
    </section>
  );
}
