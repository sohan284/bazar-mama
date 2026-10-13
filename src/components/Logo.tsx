/** Brand mark, kept in sync with src/app/icon.svg (the favicon). */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#16a34a" />
      <path d="M25 25v-4a7 7 0 0 1 14 0v4" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M15 25h34l-2.6 24.6A4 4 0 0 1 42.4 53H21.6a4 4 0 0 1-4-3.4Z" fill="#fff" />
      <path d="M32 48c-7.5-2-8.5-11-1-17 1.5 3 6 4.5 7.5 8.5C40 44 36.5 48 32 48Z" fill="#16a34a" />
      <path d="M32 48c0-5 .5-8.5 3-12" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
