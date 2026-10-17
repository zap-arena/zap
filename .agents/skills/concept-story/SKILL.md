---
name: concept-story
description: >-
  Use this skill when authoring, modifying, or gating 4-beat concept story decks
  for algorithm curricula in src/data/conceptStories.ts or guide pages.
---

# 4-Beat Concept Story Workflow

This skill outlines the process for building 4-beat narrative mental model decks.

## The 4 Beats Framework

Each story must strictly follow the 4-beat model:
1. **Beat 1 (Disaster)**: Real-world engineering failure or high-stakes constraint (e.g. streaming packet drop, memory blowup).
2. **Beat 2 (The Trap)**: The intuitive naive solution ($O(N^2)$) and why it breaks under load.
3. **Beat 3 (The Epiphany)**: The spatial/geometric breakthrough with a clear mental anchor.
4. **Beat 4 (The Blueprint)**: The 10-line reusable boilerplate formula.

## Schema Requirements (`src/data/conceptStories.ts`)

```typescript
export interface ConceptStoryCard {
  step: 1 | 2 | 3 | 4;
  badge: string;
  badgeTone: "danger" | "warning" | "accent" | "success";
  title: string;
  subtitle?: string;
  body: string;
  visual: React.ReactNode;
  keyTakeaway: string;
  codeSnippet?: string;
}

export interface ConceptStory {
  topicId: string;
  topicTitle: string;
  hook: string;
  cards: [ConceptStoryCard, ConceptStoryCard, ConceptStoryCard, ConceptStoryCard];
}
```

## Feature Flag Gating
When embedding `ConceptStoryDeck` in any page, gate both navigation links and the section behind:
```tsx
{FEATURES.conceptStory.showDeck && (
  <ConceptStoryDeck storyId="topic-id" ... />
)}
```
Always verify with `pnpm tsc --noEmit`.
