import { seededRandom } from "@/lib/utilities";

/**
 * HeroGraphic — "ideas becoming systems".
 *
 * A field of points drifts loosely on the left (questions, hunches) and settles onto a precise grid on
 * the right, where connections become orthogonal and routed (a system). One accent path traces a single
 * idea from loose to structured. Draws in once on load; the final frame is the static fallback.
 * Purely decorative: aria-hidden, no text the page depends on.
 */

const COLS = 7;
const ROWS = 6;
const STEP = 76;
const OX = 38;
const OY = 40;

interface Node {
  id: number;
  c: number;
  r: number;
  x: number;
  y: number;
  t: number; // 0 = loose, 1 = structured
}

function buildGraph(seed: number) {
  const rand = seededRandom(seed);
  const nodes: Node[] = [];
  let id = 0;
  for (let c = 0; c < COLS; c++) {
    const t = c / (COLS - 1);
    for (let r = 0; r < ROWS; r++) {
      // Occupancy rises toward the structured side; rows 2–3 are always occupied so an idea can
      // travel the full width.
      const spineRow = r === 2 + (c % 2);
      if (!spineRow && rand() > 0.5 + t * 0.3) continue;
      const jitter = (1 - t) ** 1.6 * STEP * 0.62;
      const x = OX + c * STEP + (rand() - 0.5) * 2 * jitter;
      const y = OY + r * STEP + (rand() - 0.5) * 2 * jitter;
      nodes.push({ id: id++, c, r, x, y, t });
    }
  }

  const loose: string[] = [];
  const routed: string[] = [];
  for (const a of nodes) {
    // Connect each node to its nearest neighbour in the next column.
    const next = nodes
      .filter((b) => b.c === a.c + 1)
      .sort((p, q) => Math.abs(p.r - a.r) - Math.abs(q.r - a.r))[0];
    if (!next) continue;
    if (a.t < 0.45) {
      const mx = (a.x + next.x) / 2;
      const my = Math.min(a.y, next.y) - 9 * (1 - a.t);
      loose.push(
        `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${next.x.toFixed(1)} ${next.y.toFixed(1)}`,
      );
    } else {
      const mx = (a.x + next.x) / 2;
      routed.push(
        `M${a.x.toFixed(1)} ${a.y.toFixed(1)} H${mx.toFixed(1)} V${next.y.toFixed(1)} H${next.x.toFixed(1)}`,
      );
    }
  }

  // The accent path: follow one idea from the far left to the far right, column by column.
  const spine: Node[] = [];
  let current: Node | undefined = nodes.find((n) => n.c === 0 && n.r === 2);
  while (current) {
    spine.push(current);
    const from: Node = current;
    current = nodes.filter((n) => n.c === from.c + 1 && n.r === 2 + (n.c % 2))[0];
  }
  const spineD = spine
    .map((n, i) => {
      if (i === 0) return `M${n.x.toFixed(1)} ${n.y.toFixed(1)}`;
      const prev = spine[i - 1];
      const mx = ((prev.x + n.x) / 2).toFixed(1);
      return prev.t < 0.45
        ? `Q${mx} ${(Math.min(prev.y, n.y) - 9 * (1 - prev.t)).toFixed(1)} ${n.x.toFixed(1)} ${n.y.toFixed(1)}`
        : `H${mx} V${n.y.toFixed(1)} H${n.x.toFixed(1)}`;
    })
    .join(" ");

  return { nodes, loose, routed, spineD, spine };
}

export function HeroGraphic({ className }: { className?: string }) {
  const { nodes, loose, routed, spineD, spine } = buildGraph(11);
  const width = OX * 2 + STEP * (COLS - 1);
  const height = OY * 2 + STEP * (ROWS - 1) + 28;
  const spineIds = new Set(spine.map((n) => n.id));
  const last = spine[spine.length - 1];

  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="hero-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--color-steel)" stopOpacity="0.15" />
          <stop offset="1" stopColor="var(--color-steel)" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Registration grid: only drawn where structure exists */}
      <g stroke="var(--color-line)" strokeWidth="1">
        {Array.from({ length: COLS }, (_, c) =>
          c >= 3 ? (
            <line
              key={`v${c}`}
              x1={OX + c * STEP}
              x2={OX + c * STEP}
              y1={OY - 16}
              y2={OY + STEP * (ROWS - 1) + 16}
            />
          ) : null,
        )}
      </g>

      <g fill="none" stroke="url(#hero-fade)" strokeWidth="1" className="hero-lines">
        {loose.map((d, i) => (
          <path key={`l${i}`} d={d} pathLength={1} style={{ ["--i" as string]: i }} />
        ))}
        {routed.map((d, i) => (
          <path
            key={`r${i}`}
            d={d}
            pathLength={1}
            strokeLinejoin="round"
            style={{ ["--i" as string]: loose.length + i }}
          />
        ))}
      </g>

      <path
        d={spineD}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={1}
        className="hero-spine"
      />

      <g className="hero-nodes">
        {nodes.map((n) => {
          const onSpine = spineIds.has(n.id);
          const structured = n.t >= 0.45;
          return structured ? (
            <rect
              key={n.id}
              x={n.x - 3.5}
              y={n.y - 3.5}
              width="7"
              height="7"
              rx="1"
              fill={onSpine ? "var(--color-accent)" : "var(--color-bg)"}
              stroke={onSpine ? "var(--color-accent)" : "var(--color-steel)"}
              strokeWidth="1.25"
              style={{ ["--t" as string]: n.t }}
            />
          ) : (
            <circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r={onSpine ? 3.5 : 2.25}
              fill={onSpine ? "var(--color-accent)" : "var(--color-steel)"}
              fillOpacity={onSpine ? 1 : 0.35 + n.t}
              style={{ ["--t" as string]: n.t }}
            />
          );
        })}
      </g>

      {last && (
        <circle
          cx={last.x}
          cy={last.y}
          r="9"
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity="0.5"
          className="hero-target"
        />
      )}

      <g className="type-meta" fill="var(--color-subtle)" fontSize="11" fontFamily="var(--font-mono)">
        <text x={OX - 4} y={height - 6}>
          question
        </text>
        <text x={width - OX + 4} y={height - 6} textAnchor="end">
          system
        </text>
      </g>
    </svg>
  );
}
