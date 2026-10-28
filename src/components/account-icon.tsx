export function AccountIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.25" />
      <path
        d="M5.5 19.25c1.6-3.1 3.9-4.5 6.5-4.5s4.9 1.4 6.5 4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
