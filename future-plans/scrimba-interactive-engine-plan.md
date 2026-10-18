# 🚀 ZAP Interactive Screencast Engine: Scrimba-Style Architecture Plan
**Project Codename:** `ZapCast & AutoViz Engine`  
**Target:** Interactive Code-over-Audio Screencasts, In-Browser WebAssembly (WASM) Execution, and Automatic Data Structure Visualization.

---

## 1. Executive Summary: What is Scrimba & How It Works

Most online courses record MP4 video files. **Scrimba does NOT record video.**

A traditional 10-minute 1080p coding video is ~150 MB of compressed pixels. You cannot click inside the video, select text, or run the code.

**The Scrimba Secret:**
1. **Audio Track**: A single compressed audio file (Opus/AAC, ~3 MB for 10 minutes).
2. **Editor Event Stream**: A lightweight stream of timestamped editor operations (keystrokes, cursor positions, file selections, and terminal outputs, ~150 KB).
3. **Live Browser Editor**: During playback, a real code editor (Monaco or CodeMirror) replays the keystrokes in real time while the instructor speaks.
4. **The Magic Pause**: When the user clicks the editor or hits pause, playback freezes. The editor becomes a 100% live IDE where the student can edit, experiment, and run code. When the student hits "Resume", the engine either reverts to the instructor's timeline or forks into a student workspace.

---

## 2. Core Architecture: The Three Pillars

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ZAP INTERACTIVE PLATFORM                        │
├─────────────────────────┬────────────────────────┬─────────────────────┤
│   1. ZapCast Engine     │  2. In-Browser WASM    │  3. Auto-Viz Engine │
│   (Playback & Forking)  │  (Zero-Server Exec)    │  (Runtime Detect)   │
├─────────────────────────┼────────────────────────┼─────────────────────┤
│ • Audio + Event Stream  │ • Pyodide (Python C)   │ • Frame Inspector   │
│ • Monaco Player         │ • MicroPython WASM     │ • Shape Analyzer    │
│ • Pause-to-Edit State   │ • QuickJS / WebWorker  │ • Auto-Renderers:   │
│ • "Resume" Reconciler   │ • Sub-millisecond loop │   Array, Map, Tree, │
│ • Branching History     │ • $0 Cloud Compute     │   Graph, Stack, Q   │
└─────────────────────────┴────────────────────────┴─────────────────────┘
```

---

## 3. Pillar 1: ZapCast Player (Audio + Monaco Event Stream)

### 3.1 The Event Stream Format (`.zapcast.json`)
```json
{
  "id": "two-sum-screencast-v1",
  "title": "Two Sum: Intuition to O(N) Hash Map",
  "durationMs": 345000,
  "audioUrl": "/assets/screencasts/two-sum-audio.opus",
  "initialFiles": {
    "solution.py": "def two_sum(nums, target):\n    pass\n"
  },
  "timeline": [
    { "t": 1200, "type": "cursor", "file": "solution.py", "pos": { "line": 2, "col": 5 } },
    { "t": 1850, "type": "insert", "file": "solution.py", "range": [2, 5, 2, 9], "text": "index_of = {}" },
    { "t": 3200, "type": "highlight_line", "line": 2, "color": "cyan" },
    { "t": 5100, "type": "keynote_callout", "text": "Notice: Allocating a hash table in O(1)", "tone": "info" }
  ]
}
```

### 3.2 The Playback / Fork / Resume State Machine

```
              ┌───────────────┐
              │   PLAYING     │ ──▶ (Audio plays + Monaco events applied)
              └───────┬───────┘
                      │ User clicks editor OR pauses audio
                      ▼
              ┌───────────────┐
              │    PAUSED     │
              │  (Editable)   │ ──▶ Student modifies code freely
              └───────┬───────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌───────────────┐           ┌───────────────┐
│ RESUME AUDIO  │           │ SAVE AS FORK  │
│ (Revert code  │           │ (Keep student │
│ to timeline)  │           │  sandbox)     │
└───────────────┘           └───────────────┘
```

* **When Paused**: The Monaco editor switches from read-only playback mode to interactive read-write mode.
* **When Resuming**: The player checks `diff(studentCode, timelineCode)`. If modified, a subtle toast asks:
  - *“Keep your edits (saves to Personal Playground)”* or
  - *“Catch up with instructor”*.

---

## 4. Pillar 2: In-Browser WebAssembly (WASM) Execution

Instead of sending every keystroke and test run to remote Piston/Docker containers (which incurs network latency and server cost), code executes **100% inside the student's browser tab**.

### 4.1 Technology Choices

| Language | Engine | Boot Time | Size | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **Python** | **Pyodide** (CPython in WASM) | ~800ms (cached) | ~8 MB | Full Python 3 standard library, `collections`, `heapq` |
| **Python (Lite)** | **MicroPython WASM** | ~80ms | ~400 KB | Ultra-fast instant boot for DSA algorithms |
| **JavaScript / TS** | **Web Worker Sandbox** | ~1ms | 0 KB | Instant native browser execution |
| **C++ / Java** | **Clang-WASM / CheerpJ** | ~1.5s | ~12 MB | Advanced multi-language support |

### 4.2 Sandboxed Execution Worker (`wasmWorker.ts`)
```typescript
// Runs inside an isolated Web Worker to prevent UI lockup and memory leaks
self.onmessage = async (e) => {
  const { code, inputs } = e.data;
  
  // 1. Inject instrumentation tracer
  const instrumented = injectTracer(code);
  
  // 2. Run in Pyodide WASM
  const traceLog = await pyodide.runPythonAsync(instrumented);
  
  // 3. Post back structured execution frames to main thread
  self.postMessage({ status: "success", trace: traceLog });
};
```

---

## 5. Pillar 3: Automatic Data Structure Detection & Visualizer (Auto-Viz)

The student should not have to write custom UI code. As they edit and run their code, the **Auto-Viz engine automatically inspects memory frames and projects the matching UI visualizers**.

### 5.1 Runtime Signature Pattern Matching

```
Inspect Variable in Frame ──▶ Detect Type / Shape ──▶ Mount Visualizer Component
```

| Variable Shape / Signature | Detected Data Structure | Rendered Component |
| :--- | :--- | :--- |
| `isinstance(v, list)` and elements are scalars | **1D Array** | Horizontal animated cell block with pointer arrows (`i`, `j`, `left`, `right`). |
| `isinstance(v, list)` and elements are lists | **2D Grid / Matrix** | 2D Interactive Grid with active coordinate highlighting $(r, c)$. |
| `isinstance(v, dict)` or `Counter` | **Hash Map / Frequency Table** | Key-Value Table with dynamic insert pulses and instant $O(1)$ lookup feedback. |
| `isinstance(v, set)` | **Hash Set** | Bubble/Set tags with membership status checks (`x in set`). |
| Object with `.left`, `.right`, `.val` | **Binary Tree / BST** | Interactive canvas tree with node traversals and branching edges. |
| Object with `.next`, `.val` | **Singly Linked List** | Connected circular nodes with pointer arrows (`head → n1 → n2 → null`). |
| `collections.deque` or list used with `.popleft()` | **FIFO Queue** | Horizontal queue lane with `FRONT` and `REAR` gates. |
| List with repeated `.append()` and `.pop()` | **LIFO Stack** | Vertical stack cylinder with push/pop drop animations. |
| Heap array used with `heapq` | **Priority Queue / Binary Heap** | Heap tree diagram + array representation side-by-side. |

### 5.2 The Tracer Hook (Python AST Instrumentation)
When the student clicks **"Run"**, a lightweight transformer attaches a tracer hook to line executions and mutations:
```python
# Automatic wrapper injected transparently in worker:
def __zap_trace__(line_num, var_name, var_value):
    # Sends snapshot of variable types, memory addresses, and mutations
    __zap_emit_frame__(line_num, var_name, serialize_shape(var_value))
```

---

## 6. How the Keynote Dissolve Animation Fits In

Every time the student or instructor advances a step:
1. **Auto-Viz** checks the diff between `Frame(t)` and `Frame(t+1)`.
2. Changed variables or nodes trigger `@keyframes keynoteDissolve`:
   - Value changes smoothly dissolve with optical blur and vertical drift.
   - Newly inserted hash map keys pulse with an emerald glow.
   - Pointers smoothly glide across array indices using CSS hardware-accelerated `translate3d`.

---

## 7. Recording & Authoring Tooling (Instructor Studio)

How do creators record lessons without video editing software?

```
┌────────────────────────────────────────────────────────┐
│             ZAP INSTRUCTOR STUDIO (Browser)            │
├────────────────────────────────────────────────────────┤
│  1. Hit [● Record]                                     │
│  2. Speak into microphone (Web Audio records Opus)     │
│  3. Type, explain, highlight code in Monaco            │
│  4. Hit [■ Stop]                                       │
│  5. Export: audio.opus + timeline.json (~2.5 MB total) │
└────────────────────────────────────────────────────────┘
```

* Zero video rendering wait times (no Adobe Premiere, no export rendering).
* Editing mistakes is as simple as trimming audio and adjusting JSON timestamps.

---

## 8. Phased Implementation Roadmap

### Phase 1: In-Browser WASM Runner (Foundation)
- [ ] Install `pyodide` or MicroPython WASM in a dedicated Web Worker.
- [ ] Connect Monaco editor with a local "Run" button (sub-50ms execution).
- [ ] Capture `stdout`, return values, and execution errors.

### Phase 2: Auto-Data Structure Detection (Auto-Viz)
- [ ] Implement Python frame tracer capturing local variables per executed line.
- [ ] Build shape classifiers:
  - 1D Array + Pointers
  - Hash Map / Hash Set
  - Linked List
  - Binary Tree
- [ ] Apply Keynote blur/dissolve transitions on state transitions.

### Phase 3: Screencast Audio + Event Recorder & Player
- [ ] Build `ZapCastPlayer`: synchronizes HTML5 Audio API with Monaco line edits.
- [ ] Implement Pause-to-Edit state machine.
- [ ] Implement "Resume / Catch-up" diff reconciliation.

### Phase 4: Course Production & Cloud Synchronization
- [ ] Store `.zapcast` bundles on Cloudflare R2 / AWS S3 CDN.
- [ ] Enable student personal fork saving in user profile.
- [ ] Roll out to flagship courses (Finding Nemo Pattern Recognition, Hashing, Two Pointers).

---

*This document is stored in `future-plans/scrimba-interactive-engine-plan.md` for team and development reference.*
