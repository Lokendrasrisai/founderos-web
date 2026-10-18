import Image from "next/image";
import type { Project } from "@/types/content";
import { cn, seededRandom } from "@/lib/utilities";

const W = 800;
const H = 500;

/**
 * Project cover. Either a real image, or original generated artwork that is deterministic per seed —
 * no stock imagery, and stable between builds.
 */
export function CoverArt({
  cover,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
}: {
  cover: Project["cover"];
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (cover.kind === "image") {
    return (
      <Image
        src={cover.src}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        sizes={sizes}
        priority={priority}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const rand = seededRandom(cover.seed);
  return (
    <svg
      role="img"
      aria-label={cover.alt}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full bg-surface", className)}
    >
      {cover.variant === "contour" && <Contour rand={rand} />}
      {cover.variant === "lattice" && <Lattice rand={rand} />}
      {cover.variant === "signal" && <Signal rand={rand} />}
      {cover.variant === "graph" && <Graph rand={rand} />}
    </svg>
  );
}

type R = { rand: () => number };

function Contour({ rand }: R) {
  const cx = 300 + rand() * 200;
  const cy = 200 + rand() * 120;
  const rings = 14;
  const wobble = Array.from({ length: 6 }, () => rand() * Math.PI * 2);
  const ring = (k: number) => {
    const pts: string[] = [];
    for (let a = 0; a <= 64; a++) {
      const th = (a / 64) * Math.PI * 2;
      const r =
        k * 34 * (1 + 0.18 * Math.sin(3 * th + wobble[0]) + 0.1 * Math.sin(5 * th + wobble[1] + k * 0.15));
      pts.push(`${(cx + r * Math.cos(th) * 1.35).toFixed(1)},${(cy + r * Math.sin(th)).toFixed(1)}`);
    }
    return `M${pts.join(" L")}Z`;
  };
  const hi = 4 + Math.floor(rand() * 4);
  return (
    <g fill="none">
      {Array.from({ length: rings }, (_, i) => (
        <path
          key={i}
          d={ring(i + 1)}
          stroke={i === hi ? "var(--color-accent)" : "var(--color-steel)"}
          strokeOpacity={i === hi ? 1 : 0.18 + (rings - i) * 0.02}
          strokeWidth={i === hi ? 2 : 1}
        />
      ))}
      <circle cx={cx} cy={cy} r="4" fill="var(--color-accent)" />
    </g>
  );
}

function Lattice({ rand }: R) {
  const size = 46;
  const cells = [];
  for (let x = 37; x <= W - 37 - size; x += size + 14) {
    for (let y = 40; y <= H - 40 - size; y += size + 14) {
      const drift = rand() < 0.22;
      const dx = drift ? (rand() - 0.5) * 22 : 0;
      const dy = drift ? (rand() - 0.5) * 22 : 0;
      cells.push({ x: x + dx, y: y + dy, drift, accent: !drift && rand() < 0.05 });
    }
  }
  return (
    <g>
      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width={size}
          height={size}
          rx="3"
          fill={c.accent ? "var(--color-accent-solid)" : "none"}
          fillOpacity={c.accent ? 0.85 : 0}
          stroke={c.drift ? "var(--color-cyan)" : "var(--color-steel)"}
          strokeOpacity={c.drift ? 0.7 : 0.25}
          strokeDasharray={c.drift ? "4 4" : undefined}
        />
      ))}
    </g>
  );
}

function Signal({ rand }: R) {
  const lines = 11;
  const phase = Array.from({ length: lines }, () => rand() * 6);
  const pick = Math.floor(lines / 2);
  const trace = (k: number) => {
    const base = 60 + k * ((H - 120) / (lines - 1));
    const pts: string[] = [];
    for (let x = 0; x <= W; x += 10) {
      const converge = k === pick ? Math.max(0, 1 - x / (W * 0.7)) : 1;
      const y =
        base + Math.sin(x / 38 + phase[k]) * 9 * converge + Math.sin(x / 11 + phase[k] * 2) * 3 * converge;
      pts.push(`${x},${y.toFixed(1)}`);
    }
    return `M${pts.join(" L")}`;
  };
  return (
    <g fill="none">
      {Array.from({ length: lines }, (_, k) => (
        <path
          key={k}
          d={trace(k)}
          stroke={k === pick ? "var(--color-accent)" : "var(--color-steel)"}
          strokeOpacity={k === pick ? 1 : 0.28}
          strokeWidth={k === pick ? 2 : 1}
        />
      ))}
      <line
        x1={W * 0.7}
        x2={W * 0.7}
        y1="30"
        y2={H - 30}
        stroke="var(--color-line-strong)"
        strokeDasharray="3 5"
      />
    </g>
  );
}

function Graph({ rand }: R) {
  const pts = Array.from({ length: 18 }, () => ({ x: 60 + rand() * (W - 120), y: 50 + rand() * (H - 100) }));
  const edges: Array<[number, number]> = [];
  pts.forEach((p, i) => {
    const nearest = pts
      .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 }))
      .filter((e) => e.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    nearest.forEach((n) => edges.push([i, n.j]));
  });
  return (
    <g>
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={pts[a].x}
          y1={pts[a].y}
          x2={pts[b].x}
          y2={pts[b].y}
          stroke="var(--color-steel)"
          strokeOpacity="0.3"
        />
      ))}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === 0 ? 6 : 3}
          fill={i === 0 ? "var(--color-accent)" : "var(--color-steel)"}
        />
      ))}
    </g>
  );
}
