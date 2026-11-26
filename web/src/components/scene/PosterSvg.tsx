// Static poster: the same composition as the live scene, in SVG, so the swap
// between poster and canvas cannot shift a pixel. Also the reduced-motion frame
// and the fallback when WebGL is missing or the renderer throws.

const ACCENT = "#ff8a3d";
const PANEL = "#1d1613";
const RULE = "#7a6350";

export function PosterSvg() {
  const seeds = Array.from({ length: 120 }, (_, i) => ({
    r: 78 + ((i * 37) % 100) / 3,
    a: (i / 120) * Math.PI * 2 + (i % 7) * 0.31,
    y: 280 + (((i * 53) % 100) / 100 - 0.5) * 250,
    s: 0.9 + ((i * 13) % 10) / 10,
  }));
  return (
    <svg
      viewBox="0 0 400 560"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="An abstract lit wireframe core inside a field of particles"
    >
      <rect width="400" height="560" fill={PANEL} />
      <g fill={RULE}>
        {seeds.map((p, i) => (
          <circle key={i} cx={200 + Math.cos(p.a) * p.r} cy={p.y} r={p.s} />
        ))}
      </g>
      <g transform="translate(200 280)">
        <path
          d="M0 -58 L52 -29 L52 29 L0 58 L-52 29 L-52 -29 Z"
          fill={PANEL}
          stroke={ACCENT}
          strokeWidth="1.2"
          opacity="0.6"
        />
        <path
          d="M0 -86 L77 -43 L77 43 L0 86 L-77 43 L-77 -43 Z"
          fill="none"
          stroke={ACCENT}
          strokeWidth="0.6"
          opacity="0.3"
        />
      </g>
    </svg>
  );
}
