'use client';

import { useEffect, useMemo, useState } from 'react';
import { IconCheck, IconCross } from '@/components/ui/Icons';
import { ApiRequestError, adminApi } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { readToken } from '@/lib/session';
import type { ItemDetail, TemplatePoint } from '@/lib/types';

type CheckState = { passed: boolean; note: string };

/**
 * Phiếu kiểm tra 32 điểm.
 *
 * Mặc định khi tạo mới là CHƯA ĐẠT hết, kỹ thuật viên phải tự tick từng điểm.
 * Nếu mặc định là đạt sẵn thì chỉ cần bấm Lưu là web khoe "32/32" mà chẳng ai
 * soi cây đàn — đúng thứ mà quy trình này sinh ra để ngăn.
 */
export function InspectionForm({ item, onSaved }: { item: ItemDetail; onSaved: (next: ItemDetail) => void }) {
  const [template, setTemplate] = useState<TemplatePoint[] | null>(null);
  const [checks, setChecks] = useState<Record<string, CheckState>>({});
  const [note, setNote] = useState(item.inspection?.note ?? '');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = readToken();
    if (!token || !open || template) return;
    adminApi
      .inspectionTemplate(token)
      .then((points) => {
        setTemplate(points);
        const existing = new Map((item.inspection?.checks ?? []).map((c) => [c.code, c]));
        const initial: Record<string, CheckState> = {};
        for (const point of points) {
          const found = existing.get(point.code);
          initial[point.code] = { passed: found?.passed ?? false, note: found?.note ?? '' };
        }
        setChecks(initial);
      })
      .catch((err) =>
        setStatus({ ok: false, message: err instanceof Error ? err.message : 'Không tải được mẫu.' }),
      );
  }, [open, template, item.inspection]);

  const groups = useMemo(() => {
    const out: { title: string; points: TemplatePoint[] }[] = [];
    for (const point of template ?? []) {
      const existing = out.find((g) => g.title === point.groupName);
      if (existing) existing.points.push(point);
      else out.push({ title: point.groupName, points: [point] });
    }
    return out;
  }, [template]);

  const passedCount = Object.values(checks).filter((c) => c.passed).length;
  const total = template?.length ?? 0;

  function setAll(passed: boolean) {
    const next: Record<string, CheckState> = {};
    for (const point of template ?? []) {
      next[point.code] = { ...checks[point.code], passed };
    }
    setChecks(next);
  }

  async function save() {
    const token = readToken();
    if (!token || !template) return;
    setBusy(true);
    setStatus(null);
    try {
      const saved = await adminApi.saveInspection(token, item.card.id, {
        note,
        checks: template.map((point) => ({
          code: point.code,
          passed: checks[point.code]?.passed ?? false,
          note: checks[point.code]?.note || null,
        })),
      });
      onSaved(saved);
      setStatus({ ok: true, message: 'Đã ghi phiếu kiểm tra.' });
    } catch (err) {
      setStatus({
        ok: false,
        message: err instanceof ApiRequestError ? err.message : 'Không lưu được phiếu.',
      });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    const token = readToken();
    if (!token || !confirm('Xóa phiếu kiểm tra của cây này?')) return;
    try {
      await adminApi.deleteInspection(token, item.card.id);
      const fresh = await adminApi.item(token, item.card.id);
      onSaved(fresh);
      setTemplate(null);
      setOpen(false);
    } catch (err) {
      setStatus({ ok: false, message: err instanceof ApiRequestError ? err.message : 'Không xóa được.' });
    }
  }

  return (
    <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 'var(--h3)', fontWeight: 600 }}>Phiếu kiểm tra 32 điểm</h2>
          <p className="field-hint" style={{ paddingTop: 4 }}>
            {item.inspection
              ? `Đang có phiếu: đạt ${item.inspection.passedCount}/${item.inspection.totalCount} điểm, kiểm ngày ${formatDate(item.inspection.checkedAt)}.`
              : 'Cây này chưa có phiếu. Trang khách sẽ thiếu hẳn khối kiểm tra 32 điểm.'}
          </p>
        </div>
        <button type="button" className="btn btn-alt btn-sm" onClick={() => setOpen(!open)}>
          {open ? 'Thu gọn' : item.inspection ? 'Sửa phiếu' : 'Lập phiếu'}
        </button>
      </div>

      {status && <div className={`notice${status.ok ? ' notice-ok' : ''}`}>{status.message}</div>}

      {open && (
        !template ? (
          <div className="skeleton" style={{ height: 200 }} />
        ) : (
          <>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <b style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>
                Đạt {passedCount}/{total} điểm
              </b>
              <div style={{ flexGrow: 1 }} />
              <button type="button" className="pill" onClick={() => setAll(true)}>
                Tick hết
              </button>
              <button type="button" className="pill" onClick={() => setAll(false)}>
                Bỏ tick hết
              </button>
            </div>

            <div className="grid-2" style={{ gap: 'var(--sp-5)', alignItems: 'start' }}>
              {groups.map((group) => (
                <div key={group.title} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span className="field-label">{group.title}</span>
                  {group.points.map((point) => {
                    const state = checks[point.code] ?? { passed: false, note: '' };
                    return (
                      <div key={point.code} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label className="frow" style={{ alignItems: 'flex-start' }}>
                          <input
                            type="checkbox"
                            checked={state.passed}
                            onChange={(e) =>
                              setChecks({ ...checks, [point.code]: { ...state, passed: e.target.checked } })
                            }
                          />
                          <span className="box" style={{ marginTop: 3 }}>
                            {state.passed && <IconCheck size={10} color="var(--color-cream)" />}
                          </span>
                          <span style={{ color: state.passed ? 'var(--color-ink-2)' : 'var(--color-danger)' }}>
                            {point.label}
                          </span>
                        </label>
                        {!state.passed && (
                          <input
                            className="input"
                            style={{ height: 36, fontSize: 13, marginLeft: 26 }}
                            placeholder="Ghi rõ vì sao chưa đạt"
                            value={state.note}
                            onChange={(e) =>
                              setChecks({ ...checks, [point.code]: { ...state, note: e.target.value } })
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <label className="field">
              <span className="field-label">Ghi chú của kỹ thuật viên</span>
              <textarea
                className="input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Đã làm gì cho cây này: chỉnh ty, hạ action, thay dây…"
              />
            </label>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" className="btn" onClick={save} disabled={busy}>
                {busy ? 'Đang lưu…' : 'Lưu phiếu kiểm tra'}
              </button>
              {item.inspection && (
                <button
                  type="button"
                  className="btn btn-alt"
                  style={{ marginLeft: 'auto', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                  onClick={remove}
                >
                  <IconCross size={14} color="var(--color-danger)" /> Xóa phiếu
                </button>
              )}
            </div>
          </>
        )
      )}
    </section>
  );
}
