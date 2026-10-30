const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const Icon = {
  leaf: () => (
    <svg viewBox="0 0 32 32" {...common} aria-hidden>
      <path d="M6 26C6 14 13 6 26 6c0 13-8 20-20 20Z" />
      <path d="M6 26 18 14" />
    </svg>
  ),
  feather: () => (
    <svg viewBox="0 0 32 32" {...common} aria-hidden>
      <path d="M16 28c0-8 2-16 10-22-10 1-16 8-16 16" />
      <path d="M10 22c3 0 6-1 9-4" />
    </svg>
  ),
  hand: () => (
    <svg viewBox="0 0 32 32" {...common} aria-hidden>
      <path d="M9 17V8a2 2 0 0 1 4 0v7m0-9a2 2 0 0 1 4 0v9m0-7a2 2 0 0 1 4 0v8m0-4a2 2 0 0 1 4 0v7c0 5-4 9-9 9h-1c-3 0-5-1-7-3l-4-5a2 2 0 0 1 3-3l2 2" />
    </svg>
  ),
  drop: () => (
    <svg viewBox="0 0 32 32" {...common} aria-hidden>
      <path d="M16 4s-9 10-9 16a9 9 0 0 0 18 0c0-6-9-16-9-16Z" />
      <path d="M11 21a5 5 0 0 0 5 5" />
    </svg>
  ),
  heart: () => (
    <svg viewBox="0 0 32 32" {...common} aria-hidden>
      <path d="M16 27S4 20 4 12a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 8-12 15-12 15Z" />
    </svg>
  ),
  check: () => (
    <svg viewBox="0 0 24 24" {...common} strokeWidth={1.6} aria-hidden>
      <path d="M5 12.5 10 17 19 7" />
    </svg>
  ),
  truck: () => (
    <svg viewBox="0 0 24 24" {...common} aria-hidden>
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </svg>
  ),
  pin: () => (
    <svg viewBox="0 0 24 24" {...common} aria-hidden>
      <path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
};
