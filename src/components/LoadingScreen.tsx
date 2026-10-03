import { useEffect, useState } from "react";
import { ThunderLogo } from "./ThunderLogo";
import "../styles/zap-home.css";

interface LoadingScreenProps {
  onDone: () => void;
  /** When false, the screen holds at 90% instead of finishing (e.g. while an API call is still in flight). */
  ready?: boolean;
}

export default function LoadingScreen({ onDone, ready = true }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [flash, setFlash] = useState(false);
  const [rampDone, setRampDone] = useState(false);

  // Phase 1: animate up to 90% on a fixed timer, regardless of data readiness.
  useEffect(() => {
    const start = performance.now();
    const duration = 1200;

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
    const duration = 250;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setProgress(90 + Math.round(t * 10));
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setFlash(true);
        setTimeout(onDone, 320);
      }
    };
    requestAnimationFrame(tick);
  }, [rampDone, ready, onDone]);

  return (
    <div
      className={`zap-loading-screen${flash ? " flash" : ""}`}
      aria-label="Loading"
      role="status"
    >
      <div className="zap-loading-blob zap-loading-blob-1" />
      <div className="zap-loading-blob zap-loading-blob-2" />
      <div className="zap-loading-sky-flash" />

      <div className="zap-loading-inner">
        <div className="zap-loading-logo-wrap">
          <span className="zap-loading-strike-burst" />
          <svg className="zap-loading-bolt-strike" viewBox="0 0 60 120" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <path d="M33 0 L18 50 L30 50 L15 120 L45 44 L31 44 Z" fill="hsl(50 100% 75%)" />
          </svg>
          <h1
            className="font-black tracking-tight flex items-center justify-center gap-2 whitespace-nowrap"
            style={{ fontSize: "3rem", fontFamily: "'Playfair Display', serif" }}
          >
            <span
              className="flex items-center"
              style={{
                background: "linear-gradient(135deg, hsl(158, 84%, 46%), hsl(200, 100%, 50%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Z<ThunderLogo className="w-10 h-10 text-amber-400 zap-lightning-bolt" />P
            </span>
          </h1>
        </div>

        <p className="zap-loading-tagline">Accelerating Careers</p>

        <div
          className="zap-loading-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="zap-loading-fill" style={{ width: `${progress}%` }}>
            <div className="zap-loading-shimmer" />
          </div>
        </div>

        <p className="zap-loading-pct">{progress}%</p>
      </div>
    </div>
  );
}
