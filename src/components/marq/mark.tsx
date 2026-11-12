export function MarqMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M12 5.5H10.5A5 5 0 0 0 5.5 10.5v11A5 5 0 0 0 10.5 26.5h11a5 5 0 0 0 5-5V20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M18.5 5.5H22a4.5 4.5 0 0 1 4.5 4.5v3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}
