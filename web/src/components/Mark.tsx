// C-1 mark: coordinate crosshair in brackets. currentColor, aria-hidden.
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 8V4h4" />
      <path d="M20 8V4h-4" />
      <path d="M4 16v4h4" />
      <path d="M20 16v4h-4" />
      <path d="M12 7.5v3" />
      <path d="M12 13.5v3" />
      <path d="M7.5 12h3" />
      <path d="M13.5 12h3" />
    </svg>
  );
}
