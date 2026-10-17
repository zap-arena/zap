---
name: algo-reels
description: >-
  Use this skill when adding, updating, or reviewing AlgoReels micro-learning content,
  trivia questions, time/space complexities, or reel interactions in src/data/algoReels.ts.
---

# AlgoReels Content & Feature Workflow

Follow this procedure when adding or modifying AlgoReels micro-learning modules.

## Schema Requirements (`src/data/algoReels.ts`)

Every reel object must satisfy the `AlgoReel` interface:
```typescript
export interface AlgoReel {
  id: string; // unique slug e.g. "two-pointers"
  title: string;
  category: "Basics" | "Medium" | "Advanced";
  tag: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeComplexity: string;
  spaceComplexity: string;
  patternTip: string; // Practical "When you see X, do Y" advice
  trivia: {
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation: string;
  };
  funFact: string;
  codeSnippet: string;
  author: string;
  likes: number;
}
```

## Steps to Add a New Reel:

1. Open `src/data/algoReels.ts`.
2. Add the new topic to `ALGO_REELS` array.
3. Ensure:
   - `patternTip` gives concrete algorithmic intuition (e.g. "When you hear Top K Frequent, think Min-Heap or QuickSelect").
   - `trivia` options are challenging and test edge cases or time/space trade-offs.
   - `codeSnippet` is concise (<15 lines).
4. Run `pnpm tsc --noEmit` and `pnpm build` to verify types.
