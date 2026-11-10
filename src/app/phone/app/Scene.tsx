/**
 * Drone stills and thumbnails, drawn in code instead of photos.
 * Drop real drone photos into public/photos/ and pass `src` to <Photo> to use them instead.
 */
export type SceneKind = "herdNight" | "laborIR" | "calfIR" | "herdDay" | "pasture";

const cow = "M10 30C10 22 18 18 30 18H62C70 18 74 14 80 12C84 11 88 13 88 17C88 21 85 23 82 24L80 32C80 38 76 40 72 40V54H67L66 42H40L38 54H33L32 41C24 41 20 46 18 54H13L14 40C11 37 10 34 10 30Z";

function Cow({ x, y, s = 1, fill, flip }: { x: number; y: number; s?: number; fill: string; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d={cow} fill={fill} />
    </g>
  );
}

/** Small herd scattered across a pasture, deterministic so it never jumps between renders. */
function Herd({ fill, y0, y1, count, size }: { fill: string; y0: number; y1: number; count: number; size: number }) {
  const cows = [];
  for (let i = 0; i < count; i++) {
    const x = ((i * 73) % 340) + 4;
    const y = y0 + (((i * 37) % 100) / 100) * (y1 - y0);
    const s = size * (0.7 + (y - y0) / (y1 - y0 || 1) * 0.6);
    cows.push(<Cow key={i} x={x} y={y} s={s} fill={fill} flip={i % 3 === 0} />);
  }
  return <>{cows}</>;
}

export function Scene({ kind }: { kind: SceneKind }) {
  switch (kind) {
    case "herdNight":
      return (
        <svg viewBox="0 0 354 170" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs>
            <linearGradient id="sky-n" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3b4046" />
              <stop offset="1" stopColor="#5a5f5c" />
            </linearGradient>
          </defs>
          <rect width="354" height="170" fill="url(#sky-n)" />
          <path d="M0 92C40 70 90 62 140 74S240 60 290 66 354 80 354 80V170H0Z" fill="#2d322f" />
          <path d="M0 110C80 100 160 104 354 98V170H0Z" fill="#3a3f36" />
          <Herd fill="#15181a" y0={104} y1={150} count={26} size={0.16} />
          <rect width="354" height="170" fill="#0a0d17" opacity="0.5" />
        </svg>
      );
    case "laborIR":
      return (
        <svg viewBox="0 0 354 170" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <rect width="354" height="170" fill="#1d201f" />
          <path d="M0 120C90 108 220 112 354 104V170H0Z" fill="#2b2f2c" />
          <g transform="translate(60 4) scale(2.9)">
            <path d={cow} fill="#3a3d3b" />
          </g>
          <path d="M236 70c8 4 10 20 6 34l-6 2c2-12 2-24 0-36z" fill="#8c908b" />
          <ellipse cx="238" cy="112" rx="5" ry="9" fill="#d9dcd6" />
          <ellipse cx="248" cy="114" rx="5" ry="9" fill="#cfd2cc" />
          <rect width="354" height="170" fill="#0a0d17" opacity="0.35" />
        </svg>
      );
    case "calfIR":
      return (
        <svg viewBox="0 0 354 170" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <rect width="354" height="170" fill="#3a3f39" />
          <path d="M210 0C260 30 300 40 354 36V0Z" fill="#232622" />
          <path d="M150 60C220 70 280 100 354 96V120C280 120 220 96 150 88Z" fill="#1c1f1d" opacity="0.8" />
          <path d="M0 112C100 104 200 118 354 110V170H0Z" fill="#4b5049" />
          <g transform="translate(78 44) scale(1.25)">
            <path d={cow} fill="#1a1c1b" />
          </g>
          <ellipse cx="200" cy="124" rx="20" ry="9" fill="#202220" />
          <circle cx="216" cy="118" r="6" fill="#202220" />
          <rect width="354" height="170" fill="#0a0d17" opacity="0.15" />
        </svg>
      );
    case "herdDay":
      return (
        <svg viewBox="0 0 64 44" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <rect width="64" height="44" fill="#7a9a3a" />
          <rect width="64" height="10" fill="#9bab78" />
          {[[4, 14], [18, 10], [34, 16], [48, 12], [10, 26], [26, 28], [42, 30], [54, 24]].map(([x, y], i) => (
            <Cow key={i} x={x} y={y} s={0.09} fill={i % 3 ? "#2a2220" : "#5a3a2a"} flip={i % 2 === 0} />
          ))}
        </svg>
      );
    case "pasture":
      return (
        <svg viewBox="0 0 354 170" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs>
            <linearGradient id="sky-d" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9fa9ad" />
              <stop offset="1" stopColor="#c8ccc4" />
            </linearGradient>
          </defs>
          <rect width="354" height="170" fill="url(#sky-d)" />
          <path d="M0 84C50 60 110 56 170 70S270 58 354 70V170H0Z" fill="#5f6a5c" />
          <path d="M0 108C90 100 200 104 354 96V170H0Z" fill="#6f7d4a" />
          <Herd fill="#1d1a18" y0={106} y1={150} count={22} size={0.15} />
          <rect width="354" height="170" fill="#0a0d17" opacity="0.4" />
        </svg>
      );
  }
}
