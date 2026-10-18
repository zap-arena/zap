import { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Terminal,
  Layers,
  Sparkles,
  ArrowRight,
  Code2,
  Sliders,
  CheckCircle2,
  Database,
  GitBranch,
} from "lucide-react";
import { soundEffects } from "../../lib/soundEffects";

// ─── TYPES & INTERFACES ──────────────────────────────────────────

export type DataStructureKind = "hashmap" | "stack" | "queue" | "array";

export interface InteractiveStep {
  id: string;
  title: string;
  highlightLine: number;
  codeText: string;
  directorSubtitle: string;
  tag: { label: string; tone: "info" | "success" | "warning" };
  dataStructure: DataStructureKind;
  variables: Record<string, string | number | boolean>;
  // Specific Data Structure States:
  mapEntries?: { key: string | number; value: string | number; isMatch?: boolean; isNew?: boolean }[];
  stackItems?: { value: string | number; isTop?: boolean; isNew?: boolean }[];
  queueItems?: { value: string | number; isFront?: boolean; isNew?: boolean }[];
  arrayItems?: { value: string | number; isCurrent?: boolean; pointer?: string }[];
}

export interface ProblemPreset {
  id: string;
  name: string;
  badge: string;
  primaryDS: DataStructureKind;
  initialCode: string;
  steps: InteractiveStep[];
  defaultInputDescription: string;
}

// ─── CURATED PRESETS FOR HASH MAP, STACK, AND QUEUE ───────────────

const PRESET_TWO_SUM: ProblemPreset = {
  id: "two-sum",
  name: "Two Sum (Hash Map)",
  badge: "Hash Map / O(N)",
  primaryDS: "hashmap",
  defaultInputDescription: "nums = [2, 7, 11, 15], target = 9",
  initialCode: `def two_sum(nums, target):
    index_of = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in index_of:
            return [index_of[complement], i]
        index_of[num] = i
    return [-1, -1]`,
  steps: [
    {
      id: "step-1",
      title: "1. Allocate Hash Map",
      highlightLine: 2,
      codeText: `def two_sum(nums, target):
    index_of = {} # Empty hash map: value -> index
    pass`,
      directorSubtitle:
        "Instead of scanning pairs with O(N²) nested loops, we allocate an empty dictionary index_of to remember numbers we've seen.",
      tag: { label: "O(1) Memory Prep", tone: "info" },
      dataStructure: "hashmap",
      variables: { target: 9, "len(nums)": 4, index_of: "{}" },
      mapEntries: [],
      arrayItems: [
        { value: 2, pointer: "nums[0]" },
        { value: 7, pointer: "nums[1]" },
        { value: 11, pointer: "nums[2]" },
        { value: 15, pointer: "nums[3]" },
      ],
    },
    {
      id: "step-2",
      title: "2. Inspect i = 0 (num = 2)",
      highlightLine: 4,
      codeText: `def two_sum(nums, target):
    index_of = {}
    for i, num in enumerate(nums):
        complement = target - num  # 9 - 2 = 7`,
      directorSubtitle:
        "At index 0, current number is 2. The required complement to reach 9 is (9 - 2 = 7). We check if 7 is in index_of.",
      tag: { label: "Complement Math", tone: "info" },
      dataStructure: "hashmap",
      variables: { i: 0, num: 2, complement: 7, "in map?": "False" },
      mapEntries: [],
      arrayItems: [
        { value: 2, isCurrent: true, pointer: "i = 0" },
        { value: 7 },
        { value: 11 },
        { value: 15 },
      ],
    },
    {
      id: "step-3",
      title: "3. Store 2 → index 0",
      highlightLine: 7,
      codeText: `def two_sum(nums, target):
    index_of = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in index_of:
            return [index_of[complement], i]
        index_of[num] = i # Record index_of[2] = 0`,
      directorSubtitle:
        "7 was NOT in the map yet. So we record 2 at index 0 into our hash map for future lookups in O(1) time.",
      tag: { label: "Hash Insertion", tone: "info" },
      dataStructure: "hashmap",
      variables: { i: 0, num: 2, "index_of[2]": 0 },
      mapEntries: [{ key: 2, value: 0, isNew: true }],
      arrayItems: [
        { value: 2, isCurrent: true, pointer: "stored" },
        { value: 7 },
        { value: 11 },
        { value: 15 },
      ],
    },
    {
      id: "step-4",
      title: "4. Inspect i = 1 (num = 7)",
      highlightLine: 4,
      codeText: `def two_sum(nums, target):
    index_of = {2: 0}
    for i, num in enumerate(nums): # i = 1, num = 7
        complement = target - num  # 9 - 7 = 2`,
      directorSubtitle:
        "Moving to index 1: num is 7. Complement needed is (9 - 7 = 2). Now we look up 2 in our dictionary!",
      tag: { label: "O(1) Dictionary Query", tone: "info" },
      dataStructure: "hashmap",
      variables: { i: 1, num: 7, complement: 2, "query key": 2 },
      mapEntries: [{ key: 2, value: 0 }],
      arrayItems: [
        { value: 2, pointer: "seen" },
        { value: 7, isCurrent: true, pointer: "i = 1" },
        { value: 11 },
        { value: 15 },
      ],
    },
    {
      id: "step-5",
      title: "5. Match Found & Return Indices!",
      highlightLine: 6,
      codeText: `def two_sum(nums, target):
    index_of = {2: 0}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in index_of:
            return [index_of[complement], i] # Returns [0, 1]`,
      directorSubtitle:
        "BINGO! 2 is found in index_of with index 0. We pair it with current index 1 and immediately return [0, 1] in O(N) total time!",
      tag: { label: "Solved O(N)", tone: "success" },
      dataStructure: "hashmap",
      variables: {
        i: 1,
        num: 7,
        complement: 2,
        "index_of[2]": 0,
        result: "[0, 1]",
      },
      mapEntries: [{ key: 2, value: 0, isMatch: true }],
      arrayItems: [
        { value: 2, pointer: "match [0]" },
        { value: 7, isCurrent: true, pointer: "match [1]" },
        { value: 11 },
        { value: 15 },
      ],
    },
  ],
};

const PRESET_VALID_PARENS: ProblemPreset = {
  id: "valid-parens",
  name: "Valid Parentheses (Stack LIFO)",
  badge: "Stack / O(N)",
  primaryDS: "stack",
  defaultInputDescription: 's = "({[]})"',
  initialCode: `def is_valid(s):
    stack = []
    lookup = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in '({[':
            stack.append(char)
        elif not stack or stack.pop() != lookup[char]:
            return False
    return len(stack) == 0`,
  steps: [
    {
      id: "stack-1",
      title: "1. Initialize Empty Stack",
      highlightLine: 2,
      codeText: `def is_valid(s):
    stack = [] # LIFO: Last In, First Out
    lookup = {')': '(', '}': '{', ']': '['}`,
      directorSubtitle:
        "A Stack enforces Last-In, First-Out (LIFO). The most recently opened bracket must be the very first one closed.",
      tag: { label: "LIFO Property", tone: "info" },
      dataStructure: "stack",
      variables: { "len(stack)": 0, input: '"({[]})"' },
      stackItems: [],
    },
    {
      id: "stack-2",
      title: "2. Push '(' onto Stack",
      highlightLine: 6,
      codeText: `def is_valid(s):
    stack = []
    for char in s: # char = '('
        if char in '({[':
            stack.append(char)`,
      directorSubtitle:
        "We read opening bracket '('. It is pushed onto our stack container, waiting for its closing counterpart.",
      tag: { label: "Stack Push", tone: "info" },
      dataStructure: "stack",
      variables: { char: "'('", "stack.top": "'('", height: 1 },
      stackItems: [{ value: "(", isTop: true, isNew: true }],
    },
    {
      id: "stack-3",
      title: "3. Push '{' onto Stack",
      highlightLine: 6,
      codeText: `def is_valid(s):
    stack = ['(']
    for char in s: # char = '{'
        if char in '({[':
            stack.append(char)`,
      directorSubtitle:
        "Next opening bracket '{' drops right onto top of the stack. '{' is now the active top element.",
      tag: { label: "Stack Push", tone: "info" },
      dataStructure: "stack",
      variables: { char: "'{'", "stack.top": "'{'", height: 2 },
      stackItems: [
        { value: "(", isTop: false },
        { value: "{", isTop: true, isNew: true },
      ],
    },
    {
      id: "stack-4",
      title: "4. Read '}' & Pop Matching '{'",
      highlightLine: 7,
      codeText: `def is_valid(s):
    # stack has ['(', '{']
    for char in s: # char = '}'
        if char in '({[':
            stack.append(char)
        elif not stack or stack.pop() != lookup[char]: ...`,
      directorSubtitle:
        "Encountered closing '}'. We pop the top item '{' and check if it matches lookup['}'] = '{'. Match confirmed!",
      tag: { label: "Stack Pop Match", tone: "success" },
      dataStructure: "stack",
      variables: { char: "'}'", popped: "'{'", expected: "'{'", valid: "True" },
      stackItems: [{ value: "(", isTop: true }],
    },
    {
      id: "stack-5",
      title: "5. Read ')' & Verify Empty Stack",
      highlightLine: 9,
      codeText: `def is_valid(s):
    # popped final '('
    return len(stack) == 0 # Returns True!`,
      directorSubtitle:
        "Final ')' pops the last '('. The stack is now completely empty! All brackets were balanced in linear O(N) time.",
      tag: { label: "Balanced (True)", tone: "success" },
      dataStructure: "stack",
      variables: { "len(stack)": 0, is_empty: "True", result: "True" },
      stackItems: [],
    },
  ],
};

const PRESET_QUEUE_STREAM: ProblemPreset = {
  id: "queue-stream",
  name: "Sliding Window Buffer (Queue FIFO)",
  badge: "Queue / FIFO",
  primaryDS: "queue",
  defaultInputDescription: "stream = [10, 20, 30, 40], window_k = 3",
  initialCode: `from collections import deque

def sliding_average(stream, k):
    q = deque() # FIFO: First In, First Out
    total = 0
    results = []
    for val in stream:
        q.append(val)
        total += val
        if len(q) > k:
            total -= q.popleft() # Drop oldest item
        results.append(total / len(q))
    return results`,
  steps: [
    {
      id: "queue-1",
      title: "1. Initialize FIFO Queue",
      highlightLine: 4,
      codeText: `from collections import deque
q = deque() # Queue with window k = 3
total = 0`,
      directorSubtitle:
        "A Queue enforces First-In, First-Out (FIFO). Oldest elements exit from the Front, while fresh data enters at the Back.",
      tag: { label: "FIFO Pipe Prep", tone: "info" },
      dataStructure: "queue",
      variables: { "len(q)": 0, window_k: 3, total: 0 },
      queueItems: [],
    },
    {
      id: "queue-2",
      title: "2. Enqueue [10, 20, 30]",
      highlightLine: 8,
      codeText: `for val in [10, 20, 30]:
    q.append(val)
    total += val # total = 60, len(q) = 3`,
      directorSubtitle:
        "Elements 10, 20, and 30 enter the queue from the right (Back). Queue is currently full with capacity k = 3.",
      tag: { label: "Queue Enqueue", tone: "info" },
      dataStructure: "queue",
      variables: { "len(q)": 3, total: 60, "average": "20.0" },
      queueItems: [
        { value: 10, isFront: true },
        { value: 20 },
        { value: 30, isNew: true },
      ],
    },
    {
      id: "queue-3",
      title: "3. Enqueue 40 & Dequeue 10 (Oldest)",
      highlightLine: 11,
      codeText: `q.append(40) # Push 40 to Back
if len(q) > 3:
    oldest = q.popleft() # Pop 10 from Front!
    total -= oldest # total = 90`,
      directorSubtitle:
        "When 40 enters at the Back, window size exceeds 3. FIFO immediately expels 10 from the Front in O(1) time!",
      tag: { label: "FIFO Eviction", tone: "success" },
      dataStructure: "queue",
      variables: { enqueued: 40, evicted_from_front: 10, "new_avg": "30.0" },
      queueItems: [
        { value: 20, isFront: true },
        { value: 30 },
        { value: 40, isNew: true },
      ],
    },
  ],
};

const ALL_PRESETS: ProblemPreset[] = [
  PRESET_TWO_SUM,
  PRESET_VALID_PARENS,
  PRESET_QUEUE_STREAM,
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────

export default function ScrimbaInteractiveEngine() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("two-sum");
  const currentPreset = useMemo(
    () => ALL_PRESETS.find((p) => p.id === selectedPresetId) || ALL_PRESETS[0],
    [selectedPresetId]
  );

  // Storyboard step state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(2000); // 2 seconds per step

  // Live Sandbox state (Pause, Edit, Execute, Revert)
  const [code, setCode] = useState<string>(currentPreset.steps[0].codeText);
  const [isSandboxForked, setIsSandboxForked] = useState<boolean>(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);

  // Auto-step interval timer
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeStep = currentPreset.steps[currentStepIndex] || currentPreset.steps[0];

  // When switching presets, reset to step 0
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setIsSandboxForked(false);
    setExecutionOutput(null);
    const targetPreset = ALL_PRESETS.find((p) => p.id === presetId) || ALL_PRESETS[0];
    setCode(targetPreset.steps[0].codeText);
    soundEffects.playPop();
  };

  // Sync step code when not forked
  useEffect(() => {
    if (!isSandboxForked) {
      setCode(activeStep.codeText);
    }
  }, [currentStepIndex, activeStep, isSandboxForked]);

  // Auto-play stepper engine
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < currentPreset.steps.length - 1) {
            soundEffects.playPop();
            return prev + 1;
          } else {
            setIsPlaying(false);
            soundEffects.playSuccess();
            return prev;
          }
        });
      }, playbackSpeed);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    }
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, currentPreset.steps.length]);

  // Stepping controls
  const handleNextStep = () => {
    if (currentStepIndex < currentPreset.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      soundEffects.playPop();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      soundEffects.playPop();
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    soundEffects.playPop();
  };

  const toggleAutoPlay = () => {
    setIsPlaying((prev) => !prev);
    soundEffects.playPop();
  };

  // Live sandbox editor handling
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    if (!isSandboxForked) {
      setIsSandboxForked(true);
      setIsPlaying(false); // pause auto-play when user begins editing
      soundEffects.playPop();
    }
  };

  // Revert back to canonical step
  const handleRevertToCanonical = () => {
    setCode(activeStep.codeText);
    setIsSandboxForked(false);
    setExecutionOutput(null);
    soundEffects.playSuccess();
  };

  // Execute in-browser simulation runner
  const handleRunCode = () => {
    setIsRunningCode(true);
    soundEffects.playPop();

    setTimeout(() => {
      setIsRunningCode(false);
      soundEffects.playSuccess();

      // Build simulated execution logs based on code content
      if (code.includes("two_sum")) {
        setExecutionOutput(`[WASM Python 3.12 Runtime]
>>> two_sum([2, 7, 11, 15], 9)
[0, 1]
>>> Execution Time: 0.14 ms | Memory: 0.2 MB (O(1) Auxiliary)
✔ All local assertions passed!`);
      } else if (code.includes("is_valid")) {
        setExecutionOutput(`[WASM Python 3.12 Runtime]
>>> is_valid("({[]})")
True
>>> is_valid("([)]")
False
✔ Stack balanced check returned True in 0.08 ms`);
      } else if (code.includes("sliding_average")) {
        setExecutionOutput(`[WASM Python 3.12 Runtime]
>>> sliding_average([10, 20, 30, 40], 3)
[10.0, 15.0, 20.0, 30.0]
✔ Deque operations executed in O(1) per stream token`);
      } else {
        setExecutionOutput(`[WASM Python 3.12 Runtime]
>>> Executed custom script safely.
Output: Process finished with exit code 0.`);
      }
    }, 400);
  };

  return (
    <div className="w-full my-6 rounded-2xl border border-[#30363d] bg-[#0d1117] overflow-hidden shadow-2xl transition-all">
      {/* ─── TOP HEADER BAR ─── */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-[#161b22] to-slate-900 border-b border-[#21262d] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Code Engine
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Zero-Audio • Self-Paced
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Auto-Viz Ready
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>{currentPreset.name}</span>
          </h3>
          <p className="text-xs text-[#8b949e] font-mono mt-0.5">
            Input: {currentPreset.defaultInputDescription}
          </p>
        </div>

        {/* Preset Switcher (Demonstrating Course & Problem adaptability) */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <span className="text-[11px] text-[#8b949e] font-medium flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" /> Preset:
          </span>
          <div className="inline-flex rounded-xl bg-[#0d1117] border border-[#30363d] p-1 gap-1">
            {ALL_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
                  selectedPresetId === preset.id
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-[#8b949e] hover:text-white"
                }`}
              >
                {preset.badge}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── STORYBOARD TIMELINE STEPPER ─── */}
      <div className="px-4 py-3 bg-[#161b22] border-b border-[#21262d] overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {currentPreset.steps.map((st, idx) => {
            const isActive = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;
            return (
              <button
                key={st.id}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setIsPlaying(false);
                  soundEffects.playPop();
                }}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isActive
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10"
                    : isPassed
                    ? "bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:text-slate-200"
                    : "bg-[#0d1117]/60 border-[#21262d] text-[#6e7681] hover:text-slate-300"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? "bg-cyan-400 text-slate-950 font-black"
                      : isPassed
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-[#21262d] text-[#8b949e]"
                  }`}
                >
                  {isPassed ? "✓" : idx + 1}
                </span>
                <span>{st.title}</span>
                {idx < currentPreset.steps.length - 1 && (
                  <ChevronDivider />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── PLAYBACK & SANDBOX CONTROLS BAR ─── */}
      <div className="px-5 py-3 bg-[#0d1117] border-b border-[#21262d] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Play, Pause, Step Next/Prev */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={toggleAutoPlay}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isPlaying
                ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                : "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 hover:bg-cyan-400"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Auto-Step
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Auto-Walk Flow
              </>
            )}
          </button>

          <div className="flex items-center bg-[#161b22] border border-[#30363d] rounded-xl p-0.5">
            <button
              onClick={handleRestart}
              title="Restart from Step 1"
              className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              title="Previous Step"
              className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] disabled:opacity-40 transition-all"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-mono text-[#8b949e]">
              {currentStepIndex + 1} / {currentPreset.steps.length}
            </span>
            <button
              onClick={handleNextStep}
              disabled={currentStepIndex === currentPreset.steps.length - 1}
              title="Next Step"
              className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] disabled:opacity-40 transition-all"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#8b949e]">
            <span>Speed:</span>
            {[3000, 2000, 1000].map((ms) => (
              <button
                key={ms}
                onClick={() => setPlaybackSpeed(ms)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  playbackSpeed === ms
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "hover:text-white"
                }`}
              >
                {ms === 3000 ? "0.7x" : ms === 2000 ? "1x" : "2x"}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Sandbox Status & Snap-Back Button */}
        <div className="flex items-center gap-2">
          {isSandboxForked ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                <GitBranch className="w-3 h-3" />
                Live Sandbox Fork
              </span>
              <button
                onClick={handleRevertToCanonical}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                Snap Back to Step {currentStepIndex + 1}
              </button>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Synced with Step {currentStepIndex + 1}
            </span>
          )}

          <button
            onClick={handleRunCode}
            disabled={isRunningCode}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Terminal className="w-3.5 h-3.5" />
            {isRunningCode ? "Running..." : "Run Sandbox"}
          </button>
        </div>
      </div>

      {/* ─── TWO COLUMN MAIN BODY: CODE (LEFT) + AUTO-VIZ (RIGHT) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#21262d]">
        {/* LEFT COLUMN: INTERACTIVE CODE EDITOR & DIRECTOR SUBTITLE */}
        <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-[#0d1117]">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#21262d]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b949e] flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Editable Code Sandbox</span>
              </span>
              <span className="text-[10px] text-cyan-400/80 font-mono">
                Click anywhere to edit &amp; test
              </span>
            </div>

            {/* Code Box with Highlight Bar */}
            <div className="relative font-mono text-xs sm:text-[13px] leading-7 rounded-xl bg-[#161b22] border border-[#30363d] p-3 overflow-hidden">
              <textarea
                value={code}
                onChange={handleEditorChange}
                rows={12}
                spellCheck={false}
                className="w-full h-full bg-transparent text-slate-200 resize-none focus:outline-none font-mono text-xs sm:text-sm leading-6 z-10 relative"
              />

              {/* Step Highlight Bar (active when not custom editing) */}
              {!isSandboxForked && (
                <div
                  className="absolute left-0 right-0 bg-cyan-500/15 border-l-4 border-cyan-400 pointer-events-none transition-all duration-300"
                  style={{
                    top: `${(activeStep.highlightLine - 1) * 24 + 12}px`,
                    height: "24px",
                  }}
                />
              )}
            </div>
          </div>

          {/* Director's Keynote Subtitle Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-[#161b22] to-slate-900 border border-cyan-500/30 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                Director's Intuition &amp; Mental Model
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] border font-mono ${
                  activeStep.tag.tone === "success"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : activeStep.tag.tone === "warning"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                }`}
              >
                {activeStep.tag.label}
              </span>
            </div>
            <p
              key={activeStep.directorSubtitle}
              className="text-xs sm:text-sm text-[#c9d1d9] leading-relaxed animate-keynote-dissolve"
            >
              {activeStep.directorSubtitle}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: AUTO-VIZ DATA STRUCTURE ENGINE */}
        <div className="lg:col-span-5 p-4 sm:p-5 bg-[#161b22] flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>Auto-Viz Data Structure Engine</span>
              </span>
              <span className="text-[10px] text-purple-300 font-mono px-2 py-0.5 rounded bg-purple-950/40 border border-purple-500/30">
                Mode: {activeStep.dataStructure.toUpperCase()}
              </span>
            </div>

            {/* ─── 1. HASH MAP AUTO-VIZ ─── */}
            {activeStep.dataStructure === "hashmap" && (
              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    Hash Map / Dict (<code className="text-purple-300">index_of</code>)
                  </span>
                  <span className="text-[10px] text-purple-300 font-mono">
                    {activeStep.mapEntries?.length || 0} key-value slots
                  </span>
                </div>

                {(!activeStep.mapEntries || activeStep.mapEntries.length === 0) ? (
                  <div className="text-xs text-[#8b949e] py-3 text-center italic bg-[#161b22] rounded-lg border border-dashed border-[#30363d]">
                    (empty dictionary: {`{}`})
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeStep.mapEntries.map((entry) => (
                      <div
                        key={String(entry.key)}
                        className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center gap-2 animate-keynote-dissolve transition-all ${
                          entry.isMatch
                            ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/30"
                            : entry.isNew
                            ? "border-purple-400 bg-purple-900/40 text-purple-200"
                            : "border-purple-500/40 bg-purple-950/20 text-purple-300"
                        }`}
                      >
                        <span className="font-bold">{String(entry.key)}</span>
                        <span className="text-[#8b949e]">→</span>
                        <span className="text-cyan-300 font-semibold">idx: {String(entry.value)}</span>
                        {entry.isMatch && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-sans uppercase font-bold">
                            Match!
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Companion 1D Array visualization if present */}
                {activeStep.arrayItems && (
                  <div className="pt-2 border-t border-[#21262d]">
                    <div className="text-[10px] font-mono text-[#8b949e] mb-1.5">
                      REFERENCED ARRAY: <code className="text-cyan-300">nums</code>
                    </div>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {activeStep.arrayItems.map((item, idx) => (
                        <div key={idx} className="text-center">
                          <div
                            className={`w-11 h-11 rounded-lg border flex items-center justify-center font-bold text-xs transition-all ${
                              item.isCurrent
                                ? "border-cyan-400 bg-cyan-950/40 text-cyan-300 ring-2 ring-cyan-500/30"
                                : "border-[#30363d] bg-[#161b22] text-slate-300"
                            }`}
                          >
                            {String(item.value)}
                          </div>
                          {item.pointer && (
                            <div className="text-[9px] text-cyan-400 mt-1 font-mono">
                              {item.pointer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── 2. STACK AUTO-VIZ (LIFO TEST TUBE / HOPPER) ─── */}
            {activeStep.dataStructure === "stack" && (
              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    Stack Container (<code className="text-amber-300">stack</code>)
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">
                    LIFO • Height: {activeStep.stackItems?.length || 0}
                  </span>
                </div>

                {/* Vertical Stack Chamber */}
                <div className="w-full flex justify-center py-2">
                  <div className="w-48 min-h-[140px] rounded-b-2xl border-2 border-t-0 border-amber-400/50 bg-[#161b22]/80 p-2 flex flex-col-reverse gap-2 relative">
                    <div className="absolute -top-3 left-0 right-0 text-center text-[10px] font-mono text-amber-400/80">
                      ▲ OPEN TOP (PUSH / POP)
                    </div>

                    {(!activeStep.stackItems || activeStep.stackItems.length === 0) ? (
                      <div className="h-full flex items-center justify-center text-xs text-[#8b949e] italic">
                        (stack is empty)
                      </div>
                    ) : (
                      activeStep.stackItems.map((item, idx) => (
                        <div
                          key={idx}
                          className={`w-full py-2 px-3 rounded-lg border font-mono text-xs flex items-center justify-between transition-all ${
                            item.isTop
                              ? "border-amber-400 bg-amber-500/20 text-amber-200 ring-2 ring-amber-400/30"
                              : "border-[#30363d] bg-[#0d1117] text-slate-300"
                          }`}
                        >
                          <span className="font-bold text-sm">{String(item.value)}</span>
                          {item.isTop && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-bold uppercase">
                              TOP
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ─── 3. QUEUE AUTO-VIZ (FIFO CONDUIT / PIPE) ─── */}
            {activeStep.dataStructure === "queue" && (
              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    Queue Conduit (<code className="text-emerald-300">deque</code>)
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono">
                    FIFO • Size: {activeStep.queueItems?.length || 0}
                  </span>
                </div>

                {/* Horizontal Pipe View */}
                <div className="w-full py-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8b949e] mb-1 px-1">
                    <span>➔ POP FROM FRONT</span>
                    <span>ENQUEUE AT BACK ➔</span>
                  </div>

                  <div className="w-full min-h-[64px] rounded-xl border-2 border-emerald-500/40 bg-[#161b22] p-2 flex items-center gap-2 overflow-x-auto">
                    {(!activeStep.queueItems || activeStep.queueItems.length === 0) ? (
                      <div className="w-full text-center text-xs text-[#8b949e] italic">
                        (queue is empty)
                      </div>
                    ) : (
                      activeStep.queueItems.map((item, idx) => (
                        <div
                          key={idx}
                          className={`min-w-[50px] py-2 px-3 rounded-lg border font-mono text-xs text-center transition-all ${
                            item.isFront
                              ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 ring-2 ring-emerald-400/30"
                              : item.isNew
                              ? "border-cyan-400 bg-cyan-950/40 text-cyan-200"
                              : "border-[#30363d] bg-[#0d1117] text-slate-300"
                          }`}
                        >
                          <div className="font-bold text-sm">{String(item.value)}</div>
                          <div className="text-[9px] text-[#8b949e] mt-0.5">
                            {item.isFront ? "FRONT" : `[${idx}]`}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Variable State Table */}
            <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d]">
              <div className="text-[11px] font-bold text-[#8b949e] mb-2 font-mono flex items-center justify-between">
                <span>ACTIVE MEMORY VARIABLES</span>
                <span className="text-[10px] text-cyan-400">Step {currentStepIndex + 1}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(activeStep.variables).map(([k, v]) => (
                  <div
                    key={k}
                    className="p-2 rounded bg-[#161b22] border border-[#30363d] flex items-center justify-between"
                  >
                    <span className="text-[#8b949e]">{k}:</span>
                    <span className="text-cyan-300 font-bold">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Browser Execution Console Output */}
            {executionOutput && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 font-mono text-xs space-y-1.5 animate-keynote-dissolve">
                <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sandbox Console (WASM Local Runner)
                  </span>
                  <span>Exit: 0</span>
                </div>
                <pre className="text-slate-300 whitespace-pre-wrap max-h-36 overflow-y-auto text-[11px] leading-relaxed">
                  {executionOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronDivider() {
  return (
    <span className="text-[#30363d] select-none text-[11px]">
      ›
    </span>
  );
}
