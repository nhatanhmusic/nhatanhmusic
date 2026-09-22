import { GRADE_LABEL, type ConditionGrade, type ItemStatus, STATUS_LABEL } from '@/lib/types';

/** Đúng 6 mức, màu lấy từ tokens.css. Không thêm bớt mức. */
export function ConditionBadge({
  grade,
  label,
  style,
}: {
  grade: ConditionGrade;
  label?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`grade g-${grade}`} style={style}>
      {label ?? GRADE_LABEL[grade]}
    </span>
  );
}

export function StatusPill({ status }: { status: ItemStatus }) {
  return <span className={`status-pill s-${status}`}>{STATUS_LABEL[status]}</span>;
}
