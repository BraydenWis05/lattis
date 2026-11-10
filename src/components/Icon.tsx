/** Small line icons drawn inline, so they never depend on a web font loading. */
const paths: Record<string, React.ReactNode> = {
  today: <path d="M4 10.5 12 4l8 6.5V20h-5v-5.5H9V20H4z" />,
  herd: (
    <>
      <ellipse cx="12" cy="15.5" rx="4.5" ry="3.8" />
      <circle cx="6" cy="10" r="1.8" />
      <circle cx="9.5" cy="6.5" r="1.8" />
      <circle cx="14.5" cy="6.5" r="1.8" />
      <circle cx="18" cy="10" r="1.8" />
    </>
  ),
  vet: (
    <>
      <path d="M6 4v5a4 4 0 0 0 8 0V4" />
      <path d="M10 13v2a5 5 0 0 0 10 0v-2" />
      <circle cx="20" cy="11" r="2" />
    </>
  ),
  map: (
    <>
      <path d="M9 5 4 7v13l5-2 6 2 5-2V5l-5 2z" />
      <path d="M9 5v13M15 7v13" />
    </>
  ),
  records: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M9 8.5h6M9 12h6M9 15.5h4" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3.5" width="6" height="11" rx="3" />
      <path d="M6 11.5a6 6 0 0 0 12 0M12 17.5V21" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}
