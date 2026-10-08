import { useCallback, useEffect, useRef } from "react";
import { ThunderLogo } from "../ThunderLogo";

const WATERFALL_COLS = 14;

const FRAGMENTS = [
  "function",
  "const",
  "let",
  "return",
  "class",
  "import",
  "export",
  "if(n==0)",
  "while(lo",
  "<=hi)",
  "for(i=0",
  "null",
  "true",
  "async",
  "await",
  "=>",
  "{}",
  "[]",
  "BFS()",
  "DFS()",
  "O(n²)",
  "O(log n)",
  "O(1)",
  "dp[i]",
  "memo",
  "stack",
  "queue",
  "graph",
  "tree",
  "node",
  "parseInt",
  ".map()",
  ".filter",
  ".reduce",
  "&&",
  "||",
  "!==",
  "0x1A",
  "0b1010",
  "NaN",
  "void",
  "break",
  "continue",
  "throw",
  "try{",
  "}catch",
  "new Map",
  "Set()",
  "arr[]",
  "++i",
  "i--",
];

interface Column {
  x: number;
  y: number;
  baseSpeed: number;
  fragments: string[];
  fontSize: number;
  opacity: number;
  baseOpacity: number;
  gap: number;
  boost: number;
  glow: number;
  hueShift: number;
}

function makeColumns(W: number, H: number): Column[] {
  const cols: Column[] = [];
  const colW = W / WATERFALL_COLS;
  for (let i = 0; i < WATERFALL_COLS; i++) {
    const frags: string[] = [];
    const count = 8 + Math.floor(Math.random() * 8);
    for (let j = 0; j < count; j++) {
      frags.push(FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)]);
    }
    const baseSpeed = 0.5 + Math.random() * 1.4;
    const baseOpacity = 0.06 + Math.random() * 0.14;
    cols.push({
      x: colW * i + colW * 0.1 + Math.random() * colW * 0.4,
      y: -Math.random() * H * 1.5,
      baseSpeed,
      fragments: frags,
      fontSize: 10 + Math.floor(Math.random() * 5),
      opacity: baseOpacity,
      baseOpacity,
      gap: 20 + Math.floor(Math.random() * 14),
      boost: 1,
      glow: 0,
      hueShift: 0,
    });
  }
  return cols;
}

const MOUSE_RADIUS = 180;

function WaterfallCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colsRef = useRef<Column[]>([]);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      colsRef.current = makeColumns(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isLight = document.documentElement.classList.contains("light");
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const col of colsRef.current) {
        const dx = mx - col.x;
        const dy = my - (col.y + (col.fragments.length * col.gap) / 2);
        const dist = Math.hypot(dx, dy);
        const proximity = mx > -999 ? Math.max(0, 1 - dist / MOUSE_RADIUS) : 0;

        const targetBoost = 1 + proximity * 3.5;
        const targetGlow = proximity;
        col.boost += (targetBoost - col.boost) * 0.08;
        col.glow += (targetGlow - col.glow) * 0.08;
        col.hueShift += (proximity * 42 - col.hueShift) * 0.08;

        col.y += col.baseSpeed * col.boost;

        const totalH = col.fragments.length * col.gap;
        if (col.y > canvas.height + totalH) {
          col.y = -totalH - Math.random() * 200;
          col.fragments = col.fragments.map(
            () => FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)],
          );
        }

        col.opacity = col.baseOpacity + col.glow * 0.28;
        const opacityBoost = isLight ? 2.4 : 1;

        ctx.font = `${col.fontSize}px 'JetBrains Mono', monospace`;
        col.fragments.forEach((frag, idx) => {
          const fy = col.y + idx * col.gap;
          if (fy < -20 || fy > canvas.height + 20) return;

          const fadeT = Math.min(1, fy / 120);
          const fadeB = Math.min(1, (canvas.height - fy) / 120);
          const fade = Math.min(fadeT, fadeB);
          const alpha = Math.min(col.opacity * fade * opacityBoost, 1);

          const isLead = idx === col.fragments.length - 1;
          const hue = 158 + col.hueShift;
          const sat = isLight ? 75 + col.glow * 16 : 84 + col.glow * 16;
          const lit = isLight ? 28 + col.glow * 12 : 55 + col.glow * 20;

          if (isLead) {
            const leadAlpha = Math.min(alpha * (3.5 + col.glow * 2), 0.95);
            ctx.fillStyle = `hsla(${hue},${sat}%,${isLight ? lit + 8 : lit + 15}%,${leadAlpha})`;
            ctx.shadowBlur = 8 + col.glow * 22;
            ctx.shadowColor = `hsla(${hue},${sat}%,${lit}%,${0.6 + col.glow * 0.4})`;
          } else {
            ctx.fillStyle = `hsla(${hue},${sat}%,${lit}%,${alpha})`;
            ctx.shadowBlur = col.glow > 0.1 ? col.glow * 10 : 0;
            ctx.shadowColor = `hsla(${hue},${sat}%,${lit}%,0.4)`;
          }

          ctx.fillText(frag, col.x, fy);
          ctx.shadowBlur = 0;
        });
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [onMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default function HomeHeroSection() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary opacity-[0.08] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent opacity-[0.06] blur-3xl pointer-events-none" />

      <WaterfallCanvas />

      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-16 animate-slide-up max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-10">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-xs font-mono font-medium tracking-widest uppercase">
            India's Premier DSA Bootcamp
          </span>
        </div>

        <h1
          className="font-black leading-none tracking-tight mb-6 flex items-center justify-center gap-2 whitespace-nowrap"
          style={{
            fontSize: "clamp(2.2rem, 9vw, 6rem)",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          <span className="text-foreground">We are</span>
          <span className="text-gradient-primary flex items-center ml-3">
            Z
            <ThunderLogo className="w-10 h-10 sm:w-16 sm:h-16 text-amber-400 animate-pulse" />
            P
          </span>
        </h1>

        <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-md">
          Code harder. Think sharper. Land better.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            type="button"
            onClick={() => scrollTo("#programs")}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-base shadow-glow hover:opacity-90 hover:scale-105 transition-all duration-200"
          >
            Explore Programs
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-muted-foreground text-xs font-mono">
          scroll down
        </span>
        <div className="w-5 h-8 rounded-full border border-muted-foreground/40 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
}
