# Pedagogy & Design Guidelines for ZAP (codezap.in)

## 1. Tinker-First Active Pedagogy
- **Never replace interactive simulations with passive text walls**: If an algorithm can be visualized through pointer manipulation, sliders, or step-by-step state playback, build an interactive visualizer.
- **The 4-Beat Story Arc**:
  1. *Disaster*: High-stakes real-world engineering failure or constraint.
  2. *The Trap*: The instinctive naive attempt ($O(N^2)$ timeout).
  3. *The Epiphany*: Spatial/geometric visual trick.
  4. *The Blueprint*: Reusable 10-line boilerplate formula.

## 2. Sensory Feedback & Audio Synthesis
- Zero-asset Web Audio API: Do not introduce heavy `.mp3` or `.wav` files. Use `soundEffects.play(...)` from `src/lib/soundEffects.ts`.
- Check user interaction context before audio playback to comply with browser autoplay policies.

## 3. UI, Mobile Responsiveness & Themes
- **Mobile Viewports**: Test components on small screens (~390px width / Pixel / iPhone).
- **Portal Rendering**: Overlays and fullscreen players (like `AlgoReelsPlayer`) must render via `createPortal(..., document.body)` with `100dvh` to escape parent CSS `overflow`, `contain`, or `transform` clipping.
- **Theme Contrast**: Always use semantic Tailwind classes (`bg-background text-foreground border-border`) or custom tokens. Avoid hardcoded hex colors that fail in light mode.
