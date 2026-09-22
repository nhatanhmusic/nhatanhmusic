/** SVG lấy nguyên từ design/screens — giữ đúng nét và tỉ lệ của bản thiết kế. */

type IconProps = { size?: number; color?: string; className?: string };

export function IconCheck({ size = 16, color = 'var(--color-green-mid)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCross({ size = 12, color = 'var(--color-muted)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function IconStar({ size = 16, color = 'var(--color-brass)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.6l1.1-6L3.4 9.4l6-.8z" />
    </svg>
  );
}

export function IconSearch({ size = 17, color = 'var(--color-muted)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconHeart({ size = 19, color = 'var(--color-green)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} aria-hidden>
      <path d="M12 19.5C6.5 15.6 4 12.9 4 9.9A3.9 3.9 0 0112 7.6a3.9 3.9 0 018 2.3c0 3-2.5 5.7-8 9.6z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconUser({ size = 19, color = 'var(--color-green)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} aria-hidden>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c.6-4 3.7-6 7.5-6s6.9 2 7.5 6" strokeLinecap="round" />
    </svg>
  );
}

export function IconCart({ size = 19, color = 'var(--color-green)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} aria-hidden>
      <path d="M4 7h15l-1.4 9.5a2 2 0 01-2 1.7H7.4a2 2 0 01-2-1.7L4 7z" strokeLinejoin="round" />
      <path d="M9 7V5.6A3 3 0 0112 3a3 3 0 013 2.6V7" strokeLinecap="round" />
    </svg>
  );
}

export function IconCamera({ size = 15, color = '#D4B784' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} aria-hidden>
      <rect x="3" y="6.5" width="18" height="13" rx="2.5" />
      <circle cx="12" cy="13" r="3.6" />
      <path d="M8.5 6.5l1.4-2.3h4.2l1.4 2.3" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowRight({ size = 17, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} aria-hidden>
      <path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconWrench({ size = 21, color = 'var(--color-brass)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} aria-hidden>
      <path d="M14.5 5.5a3.8 3.8 0 004.9 4.9L21 12l-9 9-3-3 9-9-1.6-1.6z" strokeLinejoin="round" />
      <path d="M6.5 3.5l3 3-2 2-3-3z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTruck({ size = 19, color = 'var(--color-green-mid)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} aria-hidden>
      <rect x="2.5" y="7" width="12" height="9" rx="1.5" />
      <path d="M14.5 10h3.5l3 3v3h-6.5z" strokeLinejoin="round" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17.5" cy="17.5" r="1.8" />
    </svg>
  );
}

export function IconShield({ size = 19, color = 'var(--color-green-mid)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} aria-hidden>
      <path d="M12 3l7.5 3v5.5c0 4.3-3 7.8-7.5 9.5-4.5-1.7-7.5-5.2-7.5-9.5V6z" strokeLinejoin="round" />
      <path d="M9 12l2.2 2.2L15.5 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconReturn({ size = 19, color = 'var(--color-green-mid)' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} aria-hidden>
      <path d="M3.5 8.5h13M6.5 5.5l-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.5 15.5h-13M17.5 12.5l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconInfo({ size = 19, color = '#D4B784' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8v.3" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevronDown({ size = 12, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} aria-hidden>
      <path d="M6 9.5l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
