export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="mtg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#59c2ff" />
          <stop offset="100%" stopColor="#7cf9c4" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill="rgba(15,23,39,0.85)" />
      <path
        d="M22 78 L42 38 L62 68 L82 28 L98 48"
        stroke="url(#mtg)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="38" r="9" fill="#59c2ff" />
      <circle cx="82" cy="28" r="9" fill="#7cf9c4" />
      <circle cx="62" cy="68" r="6" fill="#59c2ff" opacity="0.85" />
    </svg>
  );
}

