import { useCallback, useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  t: number;
}
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  text: string;
  size: number;
}
interface Bolt {
  id: number;
  life: number;
  points: { x: number; y: number }[];
}

const CODE_SNIPPETS = [
  "O(n)", "O(1)", "O(log n)", "{}", "[]", "=>",
  "fn()", "BFS", "DFS", "dp[]", "if()", "for", "++i",
  "&&", "||", "null", "true", "01", "10", "∑", "n!", "π", "λ", "∞", "Δ",
];

const MAX_TRAIL = 28;

function genBolt(cx: number, cy: number) {
  const pts: { x: number; y: number }[] = [{ x: cx, y: cy - 30 }];
  let x = cx;
  let y = cy - 30;
  for (let i = 0; i < 7; i++) {
    x += (Math.random() - 0.5) * 22;
    y += 9 + Math.random() * 8;
    pts.push({ x, y });
  }
  return pts;
}

// Decorative graph that lights up near the cursor.
const NODES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: 15 + (i % 6) * 16 + (Math.random() * 4 - 2),
  y: 20 + Math.floor(i / 6) * 30 + (Math.random() * 6 - 3),
}));
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
  [12, 13], [13, 14], [14, 15], [15, 16], [16, 17],
  [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11],
  [6, 12], [7, 13], [8, 14], [9, 15], [10, 16], [11, 17],
  [1, 8], [3, 10], [7, 14], [9, 16],
];

export default function HomeMouseFX({
  containerRef,
}: Readonly<{ containerRef: React.RefObject<HTMLElement | null> }>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<Point[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const boltsRef = useRef<Bolt[]>([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef(0);
  const pidRef = useRef(0);
  const bidRef = useRef(0);
  const frameRef = useRef(0);

  const spawnParticle = useCallback((x: number, y: number) => {
    const life = 60 + Math.random() * 80;
    particlesRef.current.push({
      id: pidRef.current++,
      x, y,
      vx: (Math.random() - 0.5) * 1.4,
      vy: -0.6 - Math.random() * 1.2,
      life, maxLife: life,
      text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
      size: 9 + Math.floor(Math.random() * 7),
    });
    if (particlesRef.current.length > 60) particlesRef.current.shift();
  }, []);

  const spawnBolt = useCallback((x: number, y: number) => {
    boltsRef.current.push({
      id: bidRef.current++,
      life: 18 + Math.floor(Math.random() * 10),
      points: genBolt(x, y),
    });
    if (boltsRef.current.length > 8) boltsRef.current.shift();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = { x, y };
      trailRef.current.push({ x, y, t: Date.now() });
      if (trailRef.current.length > MAX_TRAIL) trailRef.current.shift();

      if (frameRef.current % 3 === 0) spawnParticle(x, y);
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnBolt(x, y);
      spawnBolt(x, y);
      for (let i = 0; i < 5; i++) spawnParticle(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40);
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("click", onClick);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      frameRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const W = canvas.width;
      const H = canvas.height;

      const nodesPx = NODES.map((n) => ({ id: n.id, x: (n.x / 100) * W, y: (n.y / 100) * H }));

      ctx.lineWidth = 0.8;
      for (const [a, b] of EDGES) {
        const na = nodesPx[a];
        const nb = nodesPx[b];
        const midX = (na.x + nb.x) / 2;
        const midY = (na.y + nb.y) / 2;
        const dist = Math.hypot(mx - midX, my - midY);
        const proximity = Math.max(0, 1 - dist / 260);
        const alpha = 0.03 + proximity * 0.4;
        const g = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
        g.addColorStop(0, `hsla(158,84%,46%,${alpha})`);
        g.addColorStop(0.5, `hsla(200,100%,60%,${alpha + proximity * 0.2})`);
        g.addColorStop(1, `hsla(158,84%,46%,${alpha})`);
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      }

      for (const n of nodesPx) {
        const dist = Math.hypot(mx - n.x, my - n.y);
        const proximity = Math.max(0, 1 - dist / 220);
        const r = 2 + proximity * 5;
        const alpha = 0.1 + proximity * 0.8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = proximity > 0.4 ? `hsla(158,84%,65%,${alpha})` : `hsla(200,100%,60%,${alpha})`;
        ctx.fill();
        if (proximity > 0.6) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = `hsla(158,84%,50%,${proximity})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      const trail = trailRef.current;
      if (trail.length > 2) {
        const now = Date.now();
        for (let i = 1; i < trail.length; i++) {
          const age = now - trail[i].t;
          const a = Math.max(0, 1 - age / 320) * (i / trail.length);
          const w = (i / trail.length) * 2.5;
          ctx.strokeStyle = `hsla(158,84%,50%,${a * 0.7})`;
          ctx.lineWidth = w;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.stroke();
        }
      }

      if (mx > 0) {
        ctx.beginPath();
        ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(158,84%,80%,0.95)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "hsl(158,84%,50%)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      boltsRef.current = boltsRef.current.filter((b) => b.life > 0);
      for (const b of boltsRef.current) {
        b.life--;
        const a = (b.life / 20) * 0.9;
        const pts = b.points;
        ctx.save();
        ctx.strokeStyle = `hsla(158,84%,80%,${a})`;
        ctx.lineWidth = 1.5 + a;
        ctx.shadowBlur = 16;
        ctx.shadowColor = `hsla(158,84%,50%,${a})`;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        ctx.restore();
      }

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      for (const p of particlesRef.current) {
        p.life--;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.012;
        const a = p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = a * 0.85;
        ctx.font = `${p.size}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = a > 0.6 ? "hsl(158,84%,65%)" : "hsl(200,100%,70%)";
        ctx.shadowBlur = 6 * a;
        ctx.shadowColor = "hsl(158,84%,50%)";
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("click", onClick);
    };
  }, [containerRef, spawnParticle, spawnBolt]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
