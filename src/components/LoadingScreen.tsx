import { useEffect, useState } from "react";
import { ThunderLogo } from "./ThunderLogo";
import "../styles/zap-home.css";

interface LoadingScreenProps {
  onDone: () => void;
  /** When false, the screen holds at 90% instead of finishing (e.g. while an API call is still in flight). */
  ready?: boolean;
}

export default function LoadingScreen({
  onDone,
  ready = true,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [flash, setFlash] = useState(false);
  const [rampDone, setRampDone] = useState(false);

  // Phase 1: animate up to 90% on a fixed timer, regardless of data readiness.
  useEffect(() => {
    const start = performance.now();
    const duration = 1100;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setProgress(Math.round(eased * 90));
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setRampDone(true);
      }
    };
    requestAnimationFrame(tick);
  }, []);

  // Phase 2: once the ramp finishes, hold at 90% until `ready`, then complete and flash out.
  useEffect(() => {
    if (!rampDone || !ready) return;

    const start = performance.now();
    const duration = 220;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setProgress(90 + Math.round(t * 10));
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setFlash(true);
        setTimeout(onDone, 300);
      }
    };
    requestAnimationFrame(tick);
  }, [rampDone, ready, onDone]);

  return (
    <div
      className={`zap-loading-screen fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-all duration-300 ${
        flash ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{ background: "#060913" }}
      aria-label="Loading ZAP"
      role="status"
    >
      {/* High-contrast atmospheric lighting sky flash */}
      <div className="zap-loading-sky-flash" />

      {/* Atmospheric glowing plasma blobs */}
      <div className="zap-loading-blob zap-loading-blob-1" style={{ background: "rgba(16, 185, 129, 0.18)" }} />
      <div className="zap-loading-blob zap-loading-blob-2" style={{ background: "rgba(0, 240, 255, 0.16)" }} />

      <div className="relative z-10 w-full max-w-md mx-4 flex flex-col items-center">
        {/* Central Electrified Logo Area */}
        <div className="zap-loading-logo-wrap relative flex items-center justify-center mb-8">
          {/* Radial strike energy burst */}
          <span className="zap-loading-strike-burst" />

          {/* High-Voltage Multi-Layer Plasma Lightning Strike SVG */}
          <svg
            className="zap-loading-bolt-strike"
            viewBox="0 0 100 200"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="zapBoltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#fef08a" />
                <stop offset="65%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#00f0ff" />
              </linearGradient>
              <filter id="zapBoltGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing electrical aura */}
            <path
              d="M55 0 L25 80 L48 80 L20 200 L85 70 L52 70 Z"
              fill="url(#zapBoltGrad)"
              filter="url(#zapBoltGlow)"
              opacity="0.95"
            />

            {/* Hot white central core */}
            <path
              d="M55 6 L28 80 L49 80 L25 188 L80 72 L53 72 Z"
              fill="#ffffff"
            />

            {/* Micro electric branching sparks */}
            <path
              d="M36 45 L14 62 M48 80 L76 106 M35 135 L8 162"
              stroke="#00f0ff"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
          </svg>

          {/* Electrified Z⚡P Wordmark with explicit theme-independent contrast */}
          <h1
            className="relative z-10 flex items-center justify-center font-black tracking-tight text-6xl sm:text-7xl select-none"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span
              className="zap-letter-z font-black"
              style={{
                color: "#10b981",
                textShadow: "0 4px 16px rgba(16, 185, 129, 0.4)",
              }}
            >
              Z
            </span>
            <ThunderLogo
              className="w-14 h-14 sm:w-16 sm:h-16 zap-lightning-bolt mx-1"
              style={{
                color: "#fbbf24",
                filter: "drop-shadow(0 0 14px #f59e0b) drop-shadow(0 0 28px rgba(251, 191, 36, 0.6))",
              }}
            />
            <span
              className="zap-letter-p font-black"
              style={{
                color: "#3b82f6",
                textShadow: "0 4px 16px rgba(59, 130, 246, 0.4)",
              }}
            >
              P
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <p
          className="zap-loading-tagline text-xs uppercase tracking-widest font-semibold mb-6"
          style={{ color: "#94a3b8" }}
        >
          Accelerating Careers
        </p>

        {/* High-tech Progress Bar with Shimmer */}
        <div
          className="zap-loading-track w-64 sm:w-72 rounded-full h-2.5 overflow-hidden p-0.5 relative mb-3"
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
          }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="zap-loading-fill h-full rounded-full relative transition-all duration-150 ease-out overflow-hidden"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #10b981 0%, #00f0ff 50%, #fbbf24 100%)",
              boxShadow: "0 0 12px rgba(0, 240, 255, 0.6)",
            }}
          >
            <div className="zap-loading-shimmer" />
          </div>
        </div>

        {/* Percentage Counter and Status readout */}
        <div
          className="w-64 sm:w-72 flex items-center justify-between text-xs font-mono"
          style={{ color: "#94a3b8" }}
        >
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ background: "#fbbf24" }}
            />
            <span className="tracking-wide text-[11px]" style={{ color: "#cbd5e1" }}>
              INITIALIZING...
            </span>
          </span>
          <span className="font-bold text-sm" style={{ color: "#ffffff" }}>
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}


