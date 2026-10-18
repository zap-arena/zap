# 🏗️ ZAP Course Content Architecture & Freemium Paywall Plan
**Document Version:** 1.0.0  
**Target:** Decoupling Course Content from Monolithic TSX Files, Secure Server-Gated Freemium Architecture, and Dynamic Code Animation Schemas.

---

## 1. Context & Motivation

### Current State
Today, each curriculum guide (e.g. `HashingDsaGuidePage.tsx`, `SlidingWindowDsaGuidePage.tsx`) is a **1,400+ line monolithic React TSX file**. It bundles:
- Explanatory prose and problem statements as inline strings (`dangerouslySetInnerHTML`).
- Hardcoded syntax-highlighted HTML snippets for multiple languages.
- State machines and visualizer step runners (`twoSumApproaches`).
- Navigation logic and sidebar DOM structures.

### The Problems
1. **Security Vulnerability for Freemium / Pro Content**: Any "premium-only" content placed inside client-side TSX files is downloaded in the browser's JavaScript bundle. Tech-savvy users can inspect network requests or delete the paywall overlay in Chrome DevTools to view premium solutions.
2. **Bundle Bloat & Slow Hydration**: As ZAP expands to 50+ DSA patterns and system design topics, bundling static text into client JavaScript degrades page load performance and Core Web Vitals.
3. **High Authoring Friction**: Adding or fixing a typo requires modifying TypeScript code, recompiling, and redeploying the entire frontend application.
4. **Dynamic Animation Requirement**: Our courses use **Python Tutor execution arrows, memory frame inspections, and Keynote-style optical dissolves**. The content cannot be simple static markdown—it must drive interactive state engines.

---

## 2. Architecture Comparison: Finding the Ideal Model

| Architecture Pattern | Freemium Security | Animation / Code Execution | Authoring Speed | Performance & Scalability |
| :--- | :--- | :--- | :--- | :--- |
| **A. Static Markdown / MDX (Next.js)** | ❌ **Weak**: Paywalled code is bundled into client JS unless rendered strictly via SSR/RSC | ⚠️ **Clunky**: Complex step traces are awkward to embed inside `.md` code blocks | 🟢 **Fast**: Write standard `.md` files in Git | 🟢 **Fast**: Static HTML generation |
| **B. 100% Relational DB (SQL cells)** | 🟢 **Strong**: Backend checks user tier before returning data | 🟡 **Moderate**: Tricky to version control step-by-step animation logic in database columns | 🔴 **Slow**: Requires custom CMS admin panels to edit | 🟡 **Requires Caching**: DB query on every route change |
| **C. CDN / Object Storage JSONs (R2/S3)** | 🟡 **Medium**: Requires Signed CloudFront/Worker URLs for paid JSONs | 🟢 **Great**: Clean separation of trace files from frontend code | 🟡 **Moderate**: Requires build & sync scripts | 🟢 **Instant**: Global edge caching |
| **D. Hybrid "Interactive Block AST" (Chosen)** | 🟢 **Strongest**: Server-gated JSON payloads; public metadata pre-rendered | 🟢 **Native**: Frontend Visualizer consumes typed execution specs | 🟢 **Git-Backed**: Authors write in Git; CI compiles to DB/CDN | 🟢 **Sub-50ms**: Public blocks cached at edge, premium unlocked via auth |

---

## 3. Chosen Solution: The "Interactive Block AST" Architecture

Decouple the platform into **Content Blocks (Data)** and **Visualizer Engines (Renderers)**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CONTENT REPOSITORY (Git)                        │
│   courses/dsa/hashing/                                                 │
│     ├── 01-contains-duplicate.json                                     │
│     └── 02-two-sum.json                                                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (CI / Admin Sync)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI BACKEND & DATABASE                      │
│   • Authenticates User & checks active Subscription Tier               │
│   • Serves GET /api/v1/courses/{slug}                                  │
│   • REDACTS premium solutions/traces for free users                    │
│   • Edge-cached via Cloudflare / Redis for public blocks               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Gated JSON Payload
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        ZAP CLIENT-SIDE ENGINE                          │
│   <InteractiveCourseViewer slug="hashing" />                           │
│     ├── Markdown Prose Renderer (Typography & Intuition)               │
│     ├── CodeTutorVisualizer (Python Tutor Arrows + Keynote Dissolves)  │
│     ├── AlgoVisualizer (Array & Pointer Bars)                          │
│     └── PaywallLockCard (Rendered when server payload is redacted)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. The Content Block Schema Specification

Each course module is represented as a structured JSON/YAML document:

```typescript
export interface CourseBlock {
  id: string;               // e.g. "two-sum"
  order: number;            // 2
  title: string;            // "Two Sum"
  difficulty: "Easy" | "Medium" | "Hard";
  tier: "free" | "pro";     // Freemium access tier

  // 1. Problem Narrative (Always available for SEO & preview)
  problem: {
    prompt: string;         // Markdown formatted prompt
    examples: { input: string; output: string; explanation?: string }[];
    constraints: string[];
  };

  // 2. Interactive Simulation Spec
  simulation: {
    defaultInputs: Record<string, any>;
    needsTarget?: boolean;
    defaultTarget?: number;
    visualizerVariant: "tutor" | "array" | "grid" | "tree";
  };

  // 3. Solution & Code Execution Spec (REDACTED for free users if tier == "pro")
  solution?: {
    approaches: {
      id: "brute" | "subopt" | "optimal";
      name: string;
      complexity: { time: string; space: string };
      sourceCode: {
        python: string;
        java: string;
      };
      // High-level pedagogical notes
      explanation: string;
      // Registered trace generator ID to compute steps client-side in WASM
      traceRunnerId: string;
    }[];
  };

  // 4. Pedagogical Deep-Dive (REDACTED for free users if tier == "pro")
  proTakeaway?: {
    fourBeatStory: {
      disaster: string;
      trap: string;
      epiphany: string;
      blueprint: string;
    };
    interviewPitfalls: string[];
  };
}
```

---

## 5. Secure Freemium Paywall Enforcement

### The Vulnerability to Avoid
Never rely on client-side gating:
```tsx
// ❌ INSECURE: Premium solution is already in the browser's RAM!
{user.isPro ? <CodeTutorVisualizer code={block.solution} /> : <PaywallModal />}
```

### The Secure Approach: Server-Side Field Redaction
When `GET /api/v1/courses/hashing/blocks/two-sum` is requested:

1. **Free User (Unauthenticated or Free Tier)**:
   The backend filters the JSON response before sending:
   ```json
   {
     "id": "two-sum",
     "tier": "pro",
     "problem": { "prompt": "Given an array nums..." },
     "isLocked": true,
     "solution": null,
     "proTakeaway": null
   }
   ```
   *The browser physically never receives the solution code or execution trace.*

2. **Pro User (Subscribed / Entitled)**:
   The backend validates the JWT token against Stripe/database subscription status and returns the full JSON.

3. **Frontend Presentation**:
   - If `block.isLocked === true`, the UI displays a sleek glassmorphic preview:
     - Shows the problem statement & examples.
     - Blurs the visualizer container.
     - Renders an **"Unlock Pro to Step Through the Keynote Execution Trace"** CTA.

---

## 6. Dynamic Code Animation & Keynote Trace Engine

To keep payloads lightweight while allowing dynamic user experimentation:

### Step Generator on the Fly (Zero Payload Bloat)
Instead of storing 20,000 JSON steps for every conceivable array permutation:
- The backend stores the **algorithm source code** and **default test cases**.
- When the user changes inputs (e.g. `nums = [3, 2, 4]`, `target = 6`), the client-side Web Worker (or local tracer) runs the code against the input and generates the `VizStep[]` trace in **< 5 milliseconds**.
- Each step emits:
  - `line`: Currently executing line number.
  - `variables`: Current local stack frame.
  - `heapObjects`: Active Hash Map, Tree, or Array nodes.
  - `headline` & `explanation`: The Keynote dissolve text.

---

## 7. Database Entity Relationship Model (PostgreSQL / FastAPI)

```sql
-- Course Catalog
CREATE TABLE courses (
    id VARCHAR(64) PRIMARY KEY,          -- 'dsa-patterns'
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    category VARCHAR(64) NOT NULL,       -- 'interactive', 'dsa', 'cs', 'ai'
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Modules / Chapters
CREATE TABLE course_modules (
    id VARCHAR(64) PRIMARY KEY,          -- 'hashing'
    course_id VARCHAR(64) REFERENCES courses(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(128) NOT NULL,
    position INT NOT NULL
);

-- Individual Problems / Interactive Guides
CREATE TABLE course_blocks (
    id VARCHAR(64) PRIMARY KEY,          -- 'two-sum'
    module_id VARCHAR(64) REFERENCES course_modules(id),
    title VARCHAR(255) NOT NULL,
    tier VARCHAR(16) DEFAULT 'free',     -- 'free' | 'pro'
    position INT NOT NULL,
    public_content JSONB NOT NULL,       -- Problem statement, examples, constraints
    premium_content JSONB NOT NULL,      -- Solutions, traces, deep-dive takeaways
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Entitlements
CREATE TABLE user_subscriptions (
    user_id VARCHAR(64) PRIMARY KEY,
    status VARCHAR(32) NOT NULL,         -- 'active', 'canceled', 'trial'
    plan_tier VARCHAR(32) NOT NULL,      -- 'pro', 'enterprise'
    expires_at TIMESTAMP WITH TIME ZONE
);
```

---

## 8. Migration Execution Plan (Zero Downtime)

### Phase 1: Abstract Course Content to Structured Data (Weeks 1–2)
- Extract hardcoded HTML from `*GuidePage.tsx` into typed JSON data files in `src/data/courses/` (identical to the structure pioneered in `src/data/patternRecognitionGuide.ts`).
- Standardize visualizer components: `CodeTutorVisualizer` (Python Tutor & Keynote) and `AlgoVisualizer` (Array bars).

### Phase 2: Generic Interactive Course Player (Weeks 3–4)
- Create a reusable route component: `src/pages/course/InteractiveCoursePlayer.tsx`.
- Replace monolithic 1,500-line guide pages with a single dynamic template that loads course blocks by slug.
- Verify that light/dark themes, audio feedback, and navigation shortcuts remain 100% intact.

### Phase 3: Backend API & Subscription Redaction (Weeks 5–6)
- Implement FastAPI routes in `api/`:
  - `GET /api/v1/courses`
  - `GET /api/v1/courses/{course_slug}/{module_slug}`
- Add server-side redaction middleware: strip `premium_content` if user is not `pro`.
- Implement `PaywallCard` component on frontend.

### Phase 4: Edge Caching & Performance Optimization (Week 7)
- Enable Cloudflare Edge Caching / Stale-While-Revalidate for public course blocks.
- Pre-render public course meta-tags for Google SEO and rich social embeds.

---

*This document is archived in `future-plans/course-content-architecture-plan.md` for team architectural guidance.*
