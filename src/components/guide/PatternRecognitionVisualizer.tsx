import { useState, useMemo } from "react";
import {
  CONSTRAINT_ZONES,
  INPUT_FORMAT_GUIDES,
  OUTPUT_FORMAT_GUIDES,
  KEYWORD_TRIGGERS,
  PRESET_PROBLEMS,
  TRIVIA_QUESTIONS,
  type PresetProblem,
} from "../../data/patternRecognitionGuide";
import { soundEffects } from "../../lib/soundEffects";
import {
  isTriviaFeatureEnabled,
  setTriviaFeatureOverride,
} from "../../config/features";

export default function PatternRecognitionVisualizer() {
  // Navigation / Tab state within visualizer
  const [activeTab, setActiveTab] = useState<
    "compass" | "scanner" | "trivia"
  >("compass");

  // Step 1: Constraint Calculator State
  const [sliderExp, setSliderExp] = useState<number>(5); // 10^sliderExp
  const constraintN = useMemo(() => Math.pow(10, sliderExp), [sliderExp]);

  // Step 2 & 3: Selected Input & Output
  const [selectedInputId, setSelectedInputId] = useState<string>("string");
  const [selectedOutputId, setSelectedOutputId] = useState<string>("single_number");

  // Step 4: Keyword search filter
  const [keywordQuery, setKeywordQuery] = useState<string>("");

  // Preset problem in Scanner
  const [selectedProblem, setSelectedProblem] = useState<PresetProblem>(
    PRESET_PROBLEMS[0]
  );
  const [codeLang, setCodeLang] = useState<"python" | "java">("python");

  // Trivia state
  const [triviaEnabled, setTriviaEnabled] = useState<boolean>(
    isTriviaFeatureEnabled()
  );
  const [triviaIndex, setTriviaIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [bubbles, setBubbles] = useState<number>(3); // 3 lives
  const [triviaFinished, setTriviaFinished] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Toggle trivia feature flag dynamically for experimentation
  const handleToggleTriviaFlag = () => {
    const nextVal = !triviaEnabled;
    setTriviaFeatureOverride(nextVal);
    setTriviaEnabled(nextVal);
    soundEffects.playPop();
  };

  // Big-O calculations for Step 1
  const bigOEvaluations = useMemo(() => {
    const budget = 1e8; // Standard 10^8 ops per second
    const n = constraintN;

    // O(2^N)
    const opsExp = n <= 30 ? Math.pow(2, n) : Infinity;
    // O(N^2)
    const opsN2 = n * n;
    // O(N log N)
    const opsNLogN = n * (Math.log2(n) || 1);
    // O(N)
    const opsN = n;
    // O(log N)
    const opsLogN = Math.log2(n) || 1;

    const getStatus = (ops: number) => {
      if (ops <= 5e6) return { label: "Instant (< 50ms)", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
      if (ops <= budget) return { label: "Passes (< 1.0s)", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
      if (ops <= budget * 3) return { label: "Borderline / TLE Risk", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
      return { label: "TIME LIMIT EXCEEDED", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
    };

    return [
      { name: "O(2^N) / O(N!)", ops: opsExp, status: getStatus(opsExp), note: "Backtracking / Subsets" },
      { name: "O(N²)", ops: opsN2, status: getStatus(opsN2), note: "Nested loops / Matrix" },
      { name: "O(N log N)", ops: opsNLogN, status: getStatus(opsNLogN), note: "Sorting / Heap" },
      { name: "O(N)", ops: opsN, status: getStatus(opsN), note: "Sliding Window / Two Pointers / HashMap" },
      { name: "O(log N)", ops: opsLogN, status: getStatus(opsLogN), note: "Binary Search" },
      { name: "O(1)", ops: 1, status: getStatus(1), note: "Math Formula / Hash Lookup" },
    ];
  }, [constraintN]);

  // Filtered keywords
  const filteredKeywords = useMemo(() => {
    if (!keywordQuery.trim()) return KEYWORD_TRIGGERS;
    const q = keywordQuery.toLowerCase();
    return KEYWORD_TRIGGERS.filter(
      (k) =>
        k.pattern.toLowerCase().includes(q) ||
        k.keywords.some((w) => w.toLowerCase().includes(q)) ||
        k.classicProblem.toLowerCase().includes(q)
    );
  }, [keywordQuery]);

  // Selected input object
  const currentInput = useMemo(
    () => INPUT_FORMAT_GUIDES.find((i) => i.id === selectedInputId) || INPUT_FORMAT_GUIDES[0],
    [selectedInputId]
  );

  // Selected output object
  const currentOutput = useMemo(
    () => OUTPUT_FORMAT_GUIDES.find((o) => o.id === selectedOutputId) || OUTPUT_FORMAT_GUIDES[0],
    [selectedOutputId]
  );

  // Trivia handling
  const currentQuestion = TRIVIA_QUESTIONS[triviaIndex];

  const handleSelectAnswer = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
    soundEffects.playPop();
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    if (selectedAnswer === currentQuestion.correctIndex) {
      soundEffects.playSuccess();
      setScore((prev) => prev + 100);
    } else {
      soundEffects.playError();
      setBubbles((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setTriviaFinished(true);
        }
        return next;
      });
    }
  };

  const handleNextQuestion = () => {
    if (triviaIndex + 1 < TRIVIA_QUESTIONS.length) {
      setTriviaIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
      soundEffects.playWhoosh();
    } else {
      setTriviaFinished(true);
    }
  };

  const handleRestartTrivia = () => {
    setTriviaIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setBubbles(3);
    setTriviaFinished(false);
    setShowHint(false);
    soundEffects.playPop();
  };

  return (
    <div className="w-full my-8 bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Ocean Header / Hero Banner */}
      <div className="relative p-6 sm:p-8 bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-b border-border/60 text-white overflow-hidden">
        {/* Decorative bubbles / background elements */}
        <div className="absolute top-2 right-6 text-6xl opacity-15 select-none pointer-events-none animate-pulse">
          🐠 🫧 🌊
        </div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 mb-2">
              <span>Finding Nemo Edition</span>
              <span>•</span>
              <span>4-Step Radar Pipeline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Finding Nemo&apos;s Patterns</span>
              <span className="text-3xl">🧭</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mt-1">
              Navigate 3,000+ LeetCode problems without memorization. Use the 4-step mental sonar:
              <strong> Constraints (N)</strong> → <strong>Input Radar</strong> → <strong>Output Decoder</strong> → <strong>Trigger Lexicon</strong>.
            </p>
          </div>

          {/* Feature Flag Runtime Controller */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-black/40 border border-cyan-500/30 rounded-xl p-3 text-xs">
            <div>
              <div className="font-semibold text-cyan-200 flex items-center gap-1.5">
                <span>🧪 Flag:</span>
                <code>courses.showTrivia</code>
              </div>
              <div className="text-slate-400 text-[11px]">
                {triviaEnabled ? "Trivia game unlocked" : "Trivia hidden"}
              </div>
            </div>
            <button
              onClick={handleToggleTriviaFlag}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                triviaEnabled
                  ? "bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500"
              }`}
              title="Toggle feature flag in features.ts / localStorage"
            >
              {triviaEnabled ? "Enabled (ON)" : "Disabled (OFF)"}
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside Visualizer */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => {
              setActiveTab("compass");
              soundEffects.playPop();
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "compass"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <span>🧭</span>
            <span>4-Step Sonar Compass</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("scanner");
              soundEffects.playPop();
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "scanner"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <span>🔬</span>
            <span>Deep-Sea Problem Scanner</span>
          </button>

          {/* Gated Trivia Tab */}
          {triviaEnabled ? (
            <button
              onClick={() => {
                setActiveTab("trivia");
                soundEffects.playPop();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "trivia"
                  ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25 font-bold"
                  : "bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
              }`}
            >
              <span>🫧</span>
              <span>Nemo&apos;s Coral Trivia Quest</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200">
                Active Flag
              </span>
            </button>
          ) : (
            <div
              className="px-3 py-2 rounded-xl text-xs text-slate-400 bg-white/5 border border-white/5 flex items-center gap-2 select-none cursor-not-allowed opacity-60"
              title="Enable the 'courses.showTrivia' feature flag above to play the trivia game!"
            >
              <span>🔒</span>
              <span>Trivia Mode (Flag Off)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Body */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* ============================================================ */}
        {/* TAB 1: 4-STEP SONAR COMPASS                                  */}
        {/* ============================================================ */}
        {activeTab === "compass" && (
          <div className="space-y-10">
            {/* -------------------------------------------------------- */}
            {/* STEP 1: CONSTRAINTS SLIDER & BIG-O GAUGE                 */}
            {/* -------------------------------------------------------- */}
            <div className="p-5 sm:p-6 rounded-2xl bg-muted/40 border border-border space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-500 uppercase tracking-wider">
                    <span>Step 1 of 4</span>
                    <span>•</span>
                    <span>The Depth Gauge</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mt-0.5">
                    <span>Check Constraints (N)</span>
                    <span className="text-base text-muted-foreground font-normal">
                      — Before writing a single line of code
                    </span>
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-xl border border-border text-sm font-mono font-semibold">
                  <span className="text-muted-foreground">Input Size N:</span>
                  <span className="text-cyan-500 font-bold">
                    {sliderExp === 1
                      ? "10"
                      : sliderExp === 2
                      ? "100"
                      : `10^${sliderExp}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({constraintN.toLocaleString()})
                  </span>
                </div>
              </div>

              {/* Slider Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Tiny (N = 10)</span>
                  <span>Medium (N = 10⁴)</span>
                  <span>Huge (N = 10⁶)</span>
                  <span>Gigantic (N = 10⁹)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="9"
                  step="1"
                  value={sliderExp}
                  onChange={(e) => {
                    setSliderExp(Number(e.target.value));
                    soundEffects.playPop();
                  }}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-muted-foreground self-center">
                    Quick Ocean Depths:
                  </span>
                  {[
                    { label: "N = 15 (Subsets)", exp: 1 },
                    { label: "N = 500 (Grid/Matrix)", exp: 3 },
                    { label: "N = 10⁵ (Standard LeetCode)", exp: 5 },
                    { label: "N = 10⁹ (Binary Search Only)", exp: 9 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setSliderExp(preset.exp);
                        soundEffects.playPop();
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        sliderExp === preset.exp
                          ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold"
                          : "bg-card hover:bg-muted border-border text-muted-foreground"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time Big-O Survival Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {bigOEvaluations.map((evalItem) => (
                  <div
                    key={evalItem.name}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${evalItem.status.color}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm">
                          {evalItem.name}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-current">
                          {evalItem.status.label}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {evalItem.note}
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] font-mono opacity-80">
                      Ops:{" "}
                      {evalItem.ops === Infinity
                        ? "> 10³⁰ (Instant Crash)"
                        : evalItem.ops > 1e12
                        ? `${(evalItem.ops / 1e12).toFixed(1)} Trillion`
                        : evalItem.ops > 1e6
                        ? `${(evalItem.ops / 1e6).toFixed(1)} Million`
                        : Math.round(evalItem.ops).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Deep Sea Zone Lore */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/60">
                {CONSTRAINT_ZONES.map((zone) => {
                  const isCurrent =
                    (zone.id === "small" && sliderExp <= 2) ||
                    (zone.id === "medium" && sliderExp >= 3 && sliderExp <= 6) ||
                    (zone.id === "large" && sliderExp >= 7);

                  return (
                    <div
                      key={zone.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrent
                          ? "bg-card border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500"
                          : "bg-card/50 border-border opacity-70"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-foreground">
                          {zone.name}
                        </span>
                        <span className="text-xs font-mono text-cyan-500 font-semibold">
                          {zone.range}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        {zone.description}
                      </p>
                      <div className="text-[11px] p-2 rounded-lg bg-muted/60 text-muted-foreground italic border border-border/40">
                        {zone.oceanMetaphor}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* STEP 2 & 3: INPUT FORMAT RADAR & OUTPUT DECODER          */}
            {/* -------------------------------------------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Step 2: Input Format */}
              <div className="p-5 sm:p-6 rounded-2xl bg-muted/40 border border-border space-y-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
                    Step 2 of 4 • Input Structure
                  </div>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">
                    What does the data look like?
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select an input data structure to reveal the mandatory algorithms:
                  </p>

                  {/* Input Selector Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {INPUT_FORMAT_GUIDES.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedInputId(item.id);
                          soundEffects.playPop();
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          selectedInputId === item.id
                            ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/15"
                            : "bg-card text-foreground border-border hover:border-cyan-500/50"
                        }`}
                      >
                        <div className="text-lg">{item.emoji}</div>
                        <div className="text-xs mt-1 truncate font-medium">
                          {item.type.split("/")[0]}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Active Input Details */}
                  <div className="mt-4 p-4 rounded-xl bg-card border border-border space-y-3">
                    <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                      <span>{currentInput.emoji}</span>
                      <span>{currentInput.type}</span>
                    </div>

                    <div className="space-y-2">
                      {currentInput.techniques.map((tech) => (
                        <div
                          key={tech.pattern}
                          className="p-2.5 rounded-lg bg-muted/50 border border-border/50 text-xs"
                        >
                          <div className="font-semibold text-cyan-500">
                            {tech.pattern}
                          </div>
                          <div className="text-muted-foreground mt-0.5">
                            <strong>Use for:</strong> {tech.useCase}
                          </div>
                          <div className="text-slate-400 text-[11px] mt-0.5 italic">
                            Why: {tech.whyItWorks}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] p-2 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      ⚠️ <strong>Watch Out:</strong> {currentInput.watchOut}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Output Format Decoder */}
              <div className="p-5 sm:p-6 rounded-2xl bg-muted/40 border border-border space-y-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
                    Step 3 of 4 • Output Format
                  </div>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">
                    What are you returning?
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    The return type alone eliminates 80% of wrong algorithms:
                  </p>

                  {/* Output Selector Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {OUTPUT_FORMAT_GUIDES.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedOutputId(item.id);
                          soundEffects.playPop();
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          selectedOutputId === item.id
                            ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/15"
                            : "bg-card text-foreground border-border hover:border-cyan-500/50"
                        }`}
                      >
                        <div className="text-lg">{item.emoji}</div>
                        <div className="text-xs mt-1 font-medium leading-snug line-clamp-1">
                          {item.outputType.split("(")[0]}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Active Output Details */}
                  <div className="mt-4 p-4 rounded-xl bg-card border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                        <span>{currentOutput.emoji}</span>
                        <span>{currentOutput.outputType}</span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {currentOutput.targetPattern}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {currentOutput.decisionRule}
                    </p>

                    <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 border border-cyan-500/20 overflow-x-auto">
                      <pre>{currentOutput.codeSnippet}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------- */}
            {/* STEP 4: TRIGGER WORD LEXICON                             */}
            {/* -------------------------------------------------------- */}
            <div className="p-5 sm:p-6 rounded-2xl bg-muted/40 border border-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <div className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
                    Step 4 of 4 • Trigger Word Lexicon
                  </div>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">
                    Keyword Pattern Reflex
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Phrases in problem statements that scream an exact template:
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search keywords (e.g. median, ways, palindrome)..."
                    value={keywordQuery}
                    onChange={(e) => setKeywordQuery(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-card border border-border text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {filteredKeywords.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-card border border-border hover:border-cyan-500/50 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                        <span>{item.emoji}</span>
                        <span>{item.pattern}</span>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                        {item.typicalComplexity}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60 font-medium"
                        >
                          &ldquo;{kw}&rdquo;
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-slate-400 italic pt-1">
                      {item.mentalTrigger}
                    </div>

                    <div className="text-[11px] text-muted-foreground font-mono pt-1 border-t border-border/40">
                      Examples: {item.classicProblem}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: DEEP-SEA PROBLEM SCANNER                              */}
        {/* ============================================================ */}
        {activeTab === "scanner" && (
          <div className="space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Interactive Problem Scanner
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select a classic problem and observe the 4-step radar execute instantly:
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {PRESET_PROBLEMS.map((prob) => (
                  <button
                    key={prob.id}
                    onClick={() => {
                      setSelectedProblem(prob);
                      soundEffects.playPop();
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                      selectedProblem.id === prob.id
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20"
                        : "bg-card text-muted-foreground border-border hover:border-cyan-500/50"
                    }`}
                  >
                    {prob.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Problem Breakdown Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Problem Metadata & 4-Step Breakdown */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                        {selectedProblem.source}
                      </span>
                      <h4 className="text-xl font-extrabold text-foreground mt-1">
                        {selectedProblem.title}
                      </h4>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        selectedProblem.difficulty === "Easy"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : selectedProblem.difficulty === "Medium"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {selectedProblem.difficulty}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {selectedProblem.description}
                  </p>

                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      🎯 Recommended Pattern Reflex:
                    </span>
                    <span className="text-sm font-bold text-cyan-400">
                      {selectedProblem.recommendedPattern}
                    </span>
                  </div>
                </div>

                {/* The 4-Step Radar Pipeline */}
                <div className="space-y-3">
                  {[
                    { step: "Step 1: Check Constraints", text: selectedProblem.stepBreakdown.step1, emoji: "⏱️" },
                    { step: "Step 2: Input Structure", text: selectedProblem.stepBreakdown.step2, emoji: "📥" },
                    { step: "Step 3: Output Format", text: selectedProblem.stepBreakdown.step3, emoji: "📤" },
                    { step: "Step 4: Trigger Keywords", text: selectedProblem.stepBreakdown.step4, emoji: "🎯" },
                  ].map((s, idx) => (
                    <div
                      key={s.step}
                      className="p-4 rounded-xl bg-card border border-border flex items-start gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <span>{s.emoji}</span>
                          <span>{s.step}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {s.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Template Preview */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Pattern Blueprint
                    </span>
                    <div className="flex gap-1 bg-muted p-1 rounded-lg">
                      <button
                        onClick={() => {
                          setCodeLang("python");
                          soundEffects.playPop();
                        }}
                        className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                          codeLang === "python"
                            ? "bg-cyan-500 text-slate-950"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Python
                      </button>
                      <button
                        onClick={() => {
                          setCodeLang("java");
                          soundEffects.playPop();
                        }}
                        className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                          codeLang === "java"
                            ? "bg-cyan-500 text-slate-950"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Java
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 font-mono text-xs text-slate-200 overflow-x-auto max-h-[480px]">
                    <pre>
                      {codeLang === "python"
                        ? selectedProblem.pythonSnippet
                        : selectedProblem.javaSnippet}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: NEMO'S CORAL REEF TRIVIA QUEST (GATED BY FEATURE FLAG)*/}
        {/* ============================================================ */}
        {activeTab === "trivia" && triviaEnabled && (
          <div className="max-w-2xl mx-auto space-y-6">
            {!triviaFinished ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-card via-card to-muted/40 border border-cyan-500/40 shadow-xl space-y-6 relative overflow-hidden">
                {/* Header: Score & Oxygen Bubbles */}
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
                    <span>Question {triviaIndex + 1} of {TRIVIA_QUESTIONS.length}</span>
                  </div>

                  {/* Oxygen Bubbles (Lives) */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-base">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <span
                          key={i}
                          className={`transition-all ${
                            i < bubbles
                              ? "opacity-100 scale-100 filter drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]"
                              : "opacity-20 scale-90 grayscale"
                          }`}
                        >
                          🫧
                        </span>
                      ))}
                    </div>
                    <div className="text-xs font-mono font-bold bg-muted px-2.5 py-1 rounded-lg border border-border">
                      Score: <span className="text-cyan-400">{score}</span>
                    </div>
                  </div>
                </div>

                {/* Character Dialogue Box */}
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-start gap-3">
                  <span className="text-2xl">
                    {currentQuestion.character === "Nemo"
                      ? "🐠"
                      : currentQuestion.character === "Dory"
                      ? "🐟"
                      : currentQuestion.character === "Marlin"
                      ? "🐡"
                      : currentQuestion.character === "Crush"
                      ? "🐢"
                      : "🦈"}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-cyan-300">
                      {currentQuestion.character} says:
                    </div>
                    <div className="text-xs text-slate-300 italic mt-0.5">
                      &ldquo;{currentQuestion.characterQuote}&rdquo;
                    </div>
                  </div>
                </div>

                {/* Question Text */}
                <h4 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                  {currentQuestion.question}
                </h4>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((option, idx) => {
                    let btnStyle = "bg-card border-border hover:border-cyan-500/60 text-foreground";
                    if (isAnswerSubmitted) {
                      if (idx === currentQuestion.correctIndex) {
                        btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                      } else if (idx === selectedAnswer) {
                        btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 line-through";
                      } else {
                        btnStyle = "bg-card border-border text-muted-foreground opacity-50";
                      }
                    } else if (selectedAnswer === idx) {
                      btnStyle = "bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold ring-1 ring-cyan-400";
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {isAnswerSubmitted && idx === currentQuestion.correctIndex && (
                          <span className="text-emerald-400 font-bold ml-2">✓ Correct</span>
                        )}
                        {isAnswerSubmitted && idx === selectedAnswer && idx !== currentQuestion.correctIndex && (
                          <span className="text-rose-400 font-bold ml-2">✗ Wrong</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Hint & Explanation */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-xl bg-muted/60 border border-border text-xs space-y-1.5 animate-fadeIn">
                    <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                      <span>💡 Sonar Breakdown:</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {showHint && !isAnswerSubmitted && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                    💡 <strong>Hint:</strong> {currentQuestion.hint}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  {!isAnswerSubmitted && !showHint && (
                    <button
                      onClick={() => {
                        setShowHint(true);
                        soundEffects.playPop();
                      }}
                      className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors underline"
                    >
                      Need a hint?
                    </button>
                  )}
                  <div />

                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        selectedAnswer !== null
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      Lock In Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all"
                    >
                      {triviaIndex + 1 < TRIVIA_QUESTIONS.length
                        ? "Next Question →"
                        : "Finish Quest →"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Trivia Completion Card */
              <div className="p-8 rounded-2xl bg-gradient-to-b from-card to-muted border border-cyan-500/40 text-center space-y-5">
                <div className="text-6xl animate-bounce">
                  {bubbles > 0 ? "🏆" : "🫧"}
                </div>
                <h3 className="text-2xl font-extrabold text-foreground">
                  {bubbles > 0 ? "You Rescued Nemo!" : "Oxygen Depleted!"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {bubbles > 0
                    ? `Outstanding work! You navigated the coral reefs of DSA with a score of ${score} pts.`
                    : "You ran out of oxygen bubbles in the Mariana Trench! Brush up on the 4-step radar and dive back in."}
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-sm font-bold">
                  <span>Badge:</span>
                  <span>
                    {score >= 800
                      ? "👑 Master Ocean Navigator"
                      : score >= 500
                      ? "🐢 EAC Current Surfer"
                      : "🐠 Reef Explorer"}
                  </span>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleRestartTrivia}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all"
                  >
                    Play Again 🔄
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
