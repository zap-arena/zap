import type { ApproachRunner, VizStep } from "./AlgoVisualizer";

export const containsDuplicateApproaches: Partial<
  Record<"brute" | "sub" | "optimal", ApproachRunner>
> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 compare every pair",
    code: [
      "for (let i = 0; i < n; i++) {",
      "  for (let j = i + 1; j < n; j++) {",
      "    if (nums[i] === nums[j]) return true;",
      "  }",
      "}",
      "return false;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const n = input.length;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (input[i] === input[j]) {
            steps.push({
              description: `nums[${i}] (${input[i]}) == nums[${j}] (${input[j]}) \u2014 duplicate found, return true`,
              array: input,
              highlights: [
                { index: i, role: "match" },
                { index: j, role: "match" },
              ],
              variables: { i, j, result: "true" },
              headline: `${input[i]} == ${input[j]}`,
              tag: { label: "Duplicate Found", tone: "success" },
              codeLine: 3,
              done: true,
            });
            return steps;
          }
          steps.push({
            description: `Compare nums[${i}] (${input[i]}) with nums[${j}] (${input[j]})`,
            array: input,
            highlights: [
              { index: i, role: "i" },
              { index: j, role: "j" },
            ],
            variables: { i, j },
            headline: `${input[i]} \u2260 ${input[j]}`,
            tag: { label: "Compare", tone: "info" },
            codeLine: 3,
          });
        }
      }
      steps.push({
        description: "No duplicate pair found, return false",
        array: input,
        highlights: [],
        variables: { result: "false" },
        headline: "No duplicates",
        tag: { label: "Not Found", tone: "danger" },
        codeLine: 6,
        done: true,
      });
      return steps;
    },
  },
  sub: {
    label: "Sub-Optimal",
    complexity:
      "Time: O(n log n) \u00b7 Space: O(1) extra \u2014 sort, then check neighbours",
    code: [
      "nums.sort((a, b) => a - b);",
      "for (let i = 1; i < n; i++) {",
      "  if (nums[i] === nums[i - 1]) return true;",
      "}",
      "return false;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const sorted = [...input].sort((a, b) => a - b);
      steps.push({
        description: "Sort the array first",
        array: sorted,
        highlights: sorted.map((_, idx) => ({
          index: idx,
          role: "sorted" as const,
        })),
        variables: {},
        headline: "Sort the array",
        tag: { label: "Sort First", tone: "info" },
        codeLine: 1,
      });
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === sorted[i - 1]) {
          steps.push({
            description: `sorted[${i - 1}] (${sorted[i - 1]}) == sorted[${i}] (${sorted[i]}) \u2014 duplicate found, return true`,
            array: sorted,
            highlights: [
              { index: i - 1, role: "match" },
              { index: i, role: "match" },
            ],
            variables: { i, result: "true" },
            headline: `${sorted[i - 1]} == ${sorted[i]}`,
            tag: { label: "Duplicate Found", tone: "success" },
            codeLine: 3,
            done: true,
          });
          return steps;
        }
        steps.push({
          description: `Compare neighbours sorted[${i - 1}] (${sorted[i - 1]}) and sorted[${i}] (${sorted[i]})`,
          array: sorted,
          highlights: [
            { index: i - 1, role: "lo" },
            { index: i, role: "hi" },
          ],
          variables: { i },
          headline: `${sorted[i - 1]} \u2260 ${sorted[i]}`,
          tag: { label: "Compare Neighbours", tone: "info" },
          codeLine: 3,
        });
      }
      steps.push({
        description: "No equal neighbours found, return false",
        array: sorted,
        highlights: [],
        variables: { result: "false" },
        headline: "No duplicates",
        tag: { label: "Not Found", tone: "danger" },
        codeLine: 5,
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 hash set, one pass, stop the moment a value repeats",
    code: [
      "const seen = new Set();",
      "for (const num of nums) {",
      "  if (seen.has(num)) return true;",
      "  seen.add(num);",
      "}",
      "return false;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const seen = new Set<number>();
      for (let i = 0; i < input.length; i++) {
        const num = input[i];
        if (seen.has(num)) {
          steps.push({
            description: `nums[${i}] (${num}) is already in the set \u2014 duplicate found, return true`,
            array: input,
            highlights: [{ index: i, role: "match" }],
            structure: { label: "seen", entries: [...seen] },
            variables: { i, num, result: "true" },
            headline: `${num} in set?  YES`,
            tag: { label: "Duplicate Found", tone: "success" },
            codeLine: 3,
            done: true,
          });
          return steps;
        }
        seen.add(num);
        steps.push({
          description: `nums[${i}] (${num}) not seen before \u2014 add it to the set`,
          array: input,
          highlights: [{ index: i, role: "current" }],
          structure: { label: "seen", entries: [...seen] },
          variables: { i, num },
          headline: `${num} in set?  NO`,
          tag: { label: "Mark Seen", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: "Reached the end with no repeats, return false",
        array: input,
        highlights: [],
        structure: { label: "seen", entries: [...seen] },
        variables: { result: "false" },
        headline: "No duplicates",
        tag: { label: "Not Found", tone: "danger" },
        codeLine: 6,
        done: true,
      });
      return steps;
    },
  },
};

export const twoSumApproaches: Partial<
  Record<"brute" | "sub" | "optimal", ApproachRunner>
> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 check every pair",
    code: [
      "for (let i = 0; i < n; i++) {",
      "  for (let j = i + 1; j < n; j++) {",
      "    if (nums[i] + nums[j] === target) return [i, j];",
      "  }",
      "}",
      "return [-1, -1];",
    ],
    run: (input, target = 0): VizStep[] => {
      const steps: VizStep[] = [];
      const n = input.length;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const sum = input[i] + input[j];
          if (sum === target) {
            steps.push({
              description: `nums[${i}] + nums[${j}] = ${sum} == target (${target}) \u2014 return [${i}, ${j}]`,
              array: input,
              highlights: [
                { index: i, role: "match" },
                { index: j, role: "match" },
              ],
              variables: { i, j, sum, result: `[${i}, ${j}]` },
              headline: `${input[i]} + ${input[j]} = ${sum}`,
              tag: { label: "Target Found", tone: "success" },
              codeLine: 3,
              done: true,
            });
            return steps;
          }
          steps.push({
            description: `nums[${i}] + nums[${j}] = ${sum} \u2260 target (${target})`,
            array: input,
            highlights: [
              { index: i, role: "i" },
              { index: j, role: "j" },
            ],
            variables: { i, j, sum },
            headline: `${input[i]} + ${input[j]} = ${sum}`,
            tag: { label: "Compare", tone: "info" },
            codeLine: 3,
          });
        }
      }
      steps.push({
        description: "No pair sums to target, return [-1, -1]",
        array: input,
        highlights: [],
        variables: { result: "[-1, -1]" },
        headline: "No matching pair",
        tag: { label: "Not Found", tone: "danger" },
        codeLine: 6,
        done: true,
      });
      return steps;
    },
  },
  sub: {
    label: "Sub-Optimal",
    complexity:
      "Time: O(n log n) \u00b7 Space: O(n) \u2014 sort with original indices, then two pointers",
    code: [
      "const idx = nums.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);",
      "let lo = 0, hi = n - 1;",
      "while (lo < hi) {",
      "  const sum = idx[lo][0] + idx[hi][0];",
      "  if (sum === target) return [idx[lo][1], idx[hi][1]];",
      "  else if (sum < target) lo++;",
      "  else hi--;",
      "}",
    ],
    run: (input, target = 0): VizStep[] => {
      const steps: VizStep[] = [];
      const indexed = input
        .map((value, idx) => ({ value, idx }))
        .sort((a, b) => a.value - b.value);
      const sortedArray = indexed.map((p) => p.value);
      steps.push({
        description: "Sort values, keeping track of their original indices",
        array: sortedArray,
        highlights: sortedArray.map((_, idx) => ({
          index: idx,
          role: "sorted" as const,
        })),
        variables: {},
        headline: "Sort the array",
        tag: { label: "Sort First", tone: "info" },
        codeLine: 1,
      });
      let lo = 0;
      let hi = indexed.length - 1;
      while (lo < hi) {
        const sum = indexed[lo].value + indexed[hi].value;
        if (sum === target) {
          steps.push({
            description: `indexed[lo] + indexed[hi] = ${sum} == target (${target}) \u2014 return original indices [${indexed[lo].idx}, ${indexed[hi].idx}]`,
            array: sortedArray,
            highlights: [
              { index: lo, role: "match" },
              { index: hi, role: "match" },
            ],
            variables: {
              lo,
              hi,
              sum,
              result: `[${indexed[lo].idx}, ${indexed[hi].idx}]`,
            },
            headline: `${indexed[lo].value} + ${indexed[hi].value} = ${sum}`,
            tag: { label: "Target Found", tone: "success" },
            codeLine: 5,
            done: true,
          });
          return steps;
        }
        steps.push({
          description: `lo+hi sum = ${sum} ${sum < target ? "< target, move lo forward" : "> target, move hi backward"}`,
          array: sortedArray,
          highlights: [
            { index: lo, role: "lo" },
            { index: hi, role: "hi" },
          ],
          variables: { lo, hi, sum },
          headline: `${sum} ${sum < target ? "<" : ">"} ${target}`,
          tag: {
            label: sum < target ? "Move lo \u2192" : "\u2190 Move hi",
            tone: "info",
          },
          codeLine: sum < target ? 6 : 7,
        });
        if (sum < target) lo++;
        else hi--;
      }
      steps.push({
        description: "Pointers crossed with no match, return [-1, -1]",
        array: sortedArray,
        highlights: [],
        variables: { result: "[-1, -1]" },
        headline: "No matching pair",
        tag: { label: "Not Found", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 hash map of value \u2192 index, one pass",
    code: [
      "const seen = new Map();",
      "for (let i = 0; i < n; i++) {",
      "  const complement = target - nums[i];",
      "  if (seen.has(complement)) return [seen.get(complement), i];",
      "  seen.set(nums[i], i);",
      "}",
      "return [-1, -1];",
    ],
    run: (input, target = 0): VizStep[] => {
      const steps: VizStep[] = [];
      const seen = new Map<number, number>();
      for (let i = 0; i < input.length; i++) {
        const num = input[i];
        const complement = target - num;
        if (seen.has(complement)) {
          const j = seen.get(complement)!;
          steps.push({
            description: `Complement ${complement} for nums[${i}] (${num}) found at index ${j} \u2014 return [${j}, ${i}]`,
            array: input,
            highlights: [
              { index: j, role: "match" },
              { index: i, role: "match" },
            ],
            structure: {
              label: "seen (value\u2192index)",
              entries: [...seen.entries()].map(([k, v]) => `${k}:${v}`),
            },
            variables: { i, num, complement, result: `[${j}, ${i}]` },
            headline: `${num} + ${complement} = ${target}`,
            tag: { label: "Target Found", tone: "success" },
            codeLine: 4,
            done: true,
          });
          return steps;
        }
        seen.set(num, i);
        steps.push({
          description: `Complement ${complement} not seen yet \u2014 store nums[${i}] (${num}) \u2192 ${i}`,
          array: input,
          highlights: [{ index: i, role: "current" }],
          structure: {
            label: "seen (value\u2192index)",
            entries: [...seen.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { i, num, complement },
          headline: `Need ${complement}?  NO`,
          tag: { label: "Store Value", tone: "info" },
          codeLine: 5,
        });
      }
      steps.push({
        description: "No complement found, return [-1, -1]",
        array: input,
        highlights: [],
        variables: { result: "[-1, -1]" },
        headline: "No matching pair",
        tag: { label: "Not Found", tone: "danger" },
        codeLine: 7,
        done: true,
      });
      return steps;
    },
  },
};

export const validAnagramApproaches: Partial<
  Record<"brute" | "sub" | "optimal", ApproachRunner<string>>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(n) \u2014 for each letter in s, remove its first match in t",
    code: [
      "const remaining = [...t];",
      "for (const ch of s) {",
      "  const idx = remaining.indexOf(ch);",
      "  if (idx === -1) return false;",
      "  remaining.splice(idx, 1);",
      "}",
      "return true;",
    ],
    run: (input): VizStep[] => {
      const [s, t] = input.split(",");
      const steps: VizStep[] = [];
      const array = [...s];
      const remaining = [...t];
      if (s.length !== t.length) {
        steps.push({
          description: `Lengths differ (${s.length} vs ${t.length}) \u2014 return false`,
          array,
          highlights: [],
          variables: { result: "false" },
          headline: "Length mismatch",
          tag: { label: "Not Found", tone: "danger" },
          done: true,
        });
        return steps;
      }
      for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        const idx = remaining.indexOf(ch);
        if (idx === -1) {
          steps.push({
            description: `'${ch}' not found in remaining letters of t \u2014 return false`,
            array,
            highlights: [{ index: i, role: "current" }],
            structure: { label: "remaining in t", entries: remaining },
            variables: { i, ch },
            headline: `'${ch}' in t?  NO`,
            tag: { label: "Not Found", tone: "danger" },
            codeLine: 3,
            done: true,
          });
          return steps;
        }
        remaining.splice(idx, 1);
        steps.push({
          description: `'${ch}' found and removed from remaining letters of t`,
          array,
          highlights: [{ index: i, role: "match" }],
          structure: { label: "remaining in t", entries: remaining },
          variables: { i, ch },
          headline: `'${ch}' in t?  YES`,
          tag: { label: "Consume Letter", tone: "info" },
          codeLine: 5,
        });
      }
      steps.push({
        description: "All letters matched and consumed \u2014 return true",
        array,
        highlights: [],
        structure: { label: "remaining in t", entries: remaining },
        variables: { result: "true" },
        headline: "Anagram!",
        tag: { label: "Found", tone: "success" },
        codeLine: 6,
        done: true,
      });
      return steps;
    },
  },
  sub: {
    label: "Sub-Optimal",
    complexity:
      "Time: O(n log n) \u00b7 Space: O(n) \u2014 sort both strings and compare",
    code: [
      "const sa = [...s].sort();",
      "const ta = [...t].sort();",
      "return sa.join('') === ta.join('');",
    ],
    run: (input): VizStep[] => {
      const [s, t] = input.split(",");
      const steps: VizStep[] = [];
      const sorted = [...s].sort();
      const sortedT = [...t].sort().join("");
      steps.push({
        description: `Sort s \u2192 "${sorted.join("")}", sort t \u2192 "${sortedT}"`,
        array: sorted,
        highlights: sorted.map((_, idx) => ({
          index: idx,
          role: "sorted" as const,
        })),
        structure: { label: "sorted(t)", entries: [sortedT] },
        variables: {},
        headline: "Sort both strings",
        tag: { label: "Sort First", tone: "info" },
        codeLine: 1,
      });
      const match = sorted.join("") === sortedT;
      steps.push({
        description: match
          ? "sorted(s) === sorted(t) \u2014 return true"
          : "sorted(s) !== sorted(t) \u2014 return false",
        array: sorted,
        highlights: sorted.map((_, idx) => ({
          index: idx,
          role: match ? ("match" as const) : ("current" as const),
        })),
        structure: { label: "sorted(t)", entries: [sortedT] },
        variables: { result: String(match) },
        headline: match ? "Anagram!" : "Not an anagram",
        tag: {
          label: match ? "Found" : "Not Found",
          tone: match ? "success" : "danger",
        },
        codeLine: 3,
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal",
    complexity:
      "Time: O(n) \u00b7 Space: O(k) distinct characters \u2014 one hash map counting pass",
    code: [
      "const freq = new Map();",
      "for (let i = 0; i < s.length; i++) {",
      "  freq.set(s[i], (freq.get(s[i]) ?? 0) + 1);",
      "  freq.set(t[i], (freq.get(t[i]) ?? 0) - 1);",
      "}",
      "return [...freq.values()].every(c => c === 0);",
    ],
    run: (input): VizStep[] => {
      const [s, t] = input.split(",");
      const steps: VizStep[] = [];
      const array = [...s];
      if (s.length !== t.length) {
        steps.push({
          description: `Lengths differ (${s.length} vs ${t.length}) \u2014 return false`,
          array,
          highlights: [],
          variables: { result: "false" },
          headline: "Length mismatch",
          tag: { label: "Not Found", tone: "danger" },
          done: true,
        });
        return steps;
      }
      const freq = new Map<string, number>();
      for (let i = 0; i < s.length; i++) {
        freq.set(s[i], (freq.get(s[i]) ?? 0) + 1);
        freq.set(t[i], (freq.get(t[i]) ?? 0) - 1);
        steps.push({
          description: `freq['${s[i]}']++ (from s), freq['${t[i]}']-- (from t)`,
          array,
          highlights: [{ index: i, role: "current" }],
          structure: {
            label: "freq",
            entries: [...freq.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { i },
          headline: `s[${i}]='${s[i]}'  t[${i}]='${t[i]}'`,
          tag: { label: "Update Counts", tone: "info" },
          codeLine: 3,
        });
      }
      const balanced = [...freq.values()].every((c) => c === 0);
      steps.push({
        description: balanced
          ? "Every count nets to zero \u2014 return true"
          : "Some count is non-zero \u2014 return false",
        array,
        highlights: [],
        structure: {
          label: "freq",
          entries: [...freq.entries()].map(([k, v]) => `${k}:${v}`),
        },
        variables: { result: String(balanced) },
        headline: balanced ? "Anagram!" : "Not an anagram",
        tag: {
          label: balanced ? "Found" : "Not Found",
          tone: balanced ? "success" : "danger",
        },
        codeLine: 6,
        done: true,
      });
      return steps;
    },
  },
};

export const firstUniqueCharApproaches: Partial<
  Record<"brute" | "optimal", ApproachRunner<string>>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 rescan the whole string for each character",
    code: [
      "for (let i = 0; i < n; i++) {",
      "  let unique = true;",
      "  for (let j = 0; j < n; j++) {",
      "    if (i !== j && s[i] === s[j]) { unique = false; break; }",
      "  }",
      "  if (unique) return i;",
      "}",
      "return -1;",
    ],
    run: (input): VizStep[] => {
      const s = input;
      const steps: VizStep[] = [];
      const array = [...s];
      for (let i = 0; i < s.length; i++) {
        let unique = true;
        for (let j = 0; j < s.length; j++) {
          if (i !== j && s[i] === s[j]) {
            unique = false;
            steps.push({
              description: `s[${i}]='${s[i]}' also appears at index ${j} \u2014 not unique`,
              array,
              highlights: [
                { index: i, role: "i" },
                { index: j, role: "j" },
              ],
              variables: { i, j },
              headline: `'${s[i]}' repeats at ${j}`,
              tag: { label: "Repeats", tone: "info" },
              codeLine: 4,
            });
            break;
          }
        }
        if (unique) {
          steps.push({
            description: `s[${i}]='${s[i]}' never repeats \u2014 return ${i}`,
            array,
            highlights: [{ index: i, role: "match" }],
            variables: { i, result: i },
            headline: `'${s[i]}' is unique!`,
            tag: { label: "Found", tone: "success" },
            codeLine: 6,
            done: true,
          });
          return steps;
        }
      }
      steps.push({
        description: "Every character repeats \u2014 return -1",
        array,
        highlights: [],
        variables: { result: -1 },
        headline: "No unique character",
        tag: { label: "Not Found", tone: "danger" },
        codeLine: 8,
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal",
    complexity:
      "Time: O(n) \u00b7 Space: O(1) fixed alphabet \u2014 count once, scan for first count-of-1",
    code: [
      "const freq = new Map();",
      "for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);",
      "for (let i = 0; i < s.length; i++) {",
      "  if (freq.get(s[i]) === 1) return i;",
      "}",
      "return -1;",
    ],
    run: (input): VizStep[] => {
      const s = input;
      const steps: VizStep[] = [];
      const array = [...s];
      const freq = new Map<string, number>();
      for (let i = 0; i < s.length; i++) {
        freq.set(s[i], (freq.get(s[i]) ?? 0) + 1);
        steps.push({
          description: `Count '${s[i]}' \u2192 ${freq.get(s[i])}`,
          array,
          highlights: [{ index: i, role: "current" }],
          structure: {
            label: "freq",
            entries: [...freq.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { i },
          headline: `freq['${s[i]}'] = ${freq.get(s[i])}`,
          tag: { label: "Count", tone: "info" },
          codeLine: 2,
        });
      }
      for (let i = 0; i < s.length; i++) {
        if (freq.get(s[i]) === 1) {
          steps.push({
            description: `s[${i}]='${s[i]}' has count 1 \u2014 return ${i}`,
            array,
            highlights: [{ index: i, role: "match" }],
            structure: {
              label: "freq",
              entries: [...freq.entries()].map(([k, v]) => `${k}:${v}`),
            },
            variables: { i, result: i },
            headline: `'${s[i]}' is unique!`,
            tag: { label: "Found", tone: "success" },
            codeLine: 4,
            done: true,
          });
          return steps;
        }
        steps.push({
          description: `s[${i}]='${s[i]}' has count ${freq.get(s[i])} \u2014 keep scanning`,
          array,
          highlights: [{ index: i, role: "i" }],
          structure: {
            label: "freq",
            entries: [...freq.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { i },
          headline: `freq['${s[i]}'] = ${freq.get(s[i])}`,
          tag: { label: "Scan", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: "Every character repeats \u2014 return -1",
        array,
        highlights: [],
        variables: { result: -1 },
        headline: "No unique character",
        tag: { label: "Not Found", tone: "danger" },
        codeLine: 6,
        done: true,
      });
      return steps;
    },
  },
};

export const groupAnagramsApproaches: Partial<
  Record<"brute" | "sub" | "optimal", ApproachRunner<string>>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2\u00b7k) \u00b7 Space: O(n\u00b7k) \u2014 compare every string against every group's representative",
    code: [
      "for (let i = 0; i < strs.length; i++) {",
      "  if (used[i]) continue;",
      "  const group = [strs[i]];",
      "  for (let j = i + 1; j < strs.length; j++) {",
      "    if (!used[j] && isAnagram(strs[i], strs[j])) group.push(strs[j]);",
      "  }",
      "}",
    ],
    run: (input): VizStep[] => {
      const words = input.split("|");
      const steps: VizStep[] = [];
      const used = new Array(words.length).fill(false);
      const groups: string[][] = [];
      const isAnagram = (a: string, b: string) =>
        [...a].sort().join("") === [...b].sort().join("");
      for (let i = 0; i < words.length; i++) {
        if (used[i]) continue;
        const group = [words[i]];
        used[i] = true;
        for (let j = i + 1; j < words.length; j++) {
          if (!used[j] && isAnagram(words[i], words[j])) {
            group.push(words[j]);
            used[j] = true;
            steps.push({
              description: `"${words[j]}" is an anagram of "${words[i]}" \u2014 add to group`,
              array: words,
              highlights: [
                { index: i, role: "current" },
                { index: j, role: "match" },
              ],
              structure: { label: "current group", entries: group },
              variables: {},
              headline: `"${words[i]}" + "${words[j]}"`,
              tag: { label: "Grouped", tone: "success" },
              codeLine: 5,
            });
          }
        }
        groups.push(group);
      }
      steps.push({
        description: `Formed ${groups.length} group(s): ${groups.map((g) => `[${g.join(", ")}]`).join(" ")}`,
        array: words,
        highlights: [],
        variables: { groups: groups.length },
        headline: `${groups.length} groups formed`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  sub: {
    label: "Sub-Optimal",
    complexity:
      "Time: O(n\u00b7k log k) \u00b7 Space: O(n\u00b7k) \u2014 hash map keyed by the sorted string",
    code: [
      "const groups = new Map();",
      "for (const s of strs) {",
      "  const key = [...s].sort().join('');",
      "  groups.set(key, [...(groups.get(key) ?? []), s]);",
      "}",
    ],
    run: (input): VizStep[] => {
      const words = input.split("|");
      const steps: VizStep[] = [];
      const groups = new Map<string, string[]>();
      for (let i = 0; i < words.length; i++) {
        const key = [...words[i]].sort().join("");
        const list = groups.get(key) ?? [];
        list.push(words[i]);
        groups.set(key, list);
        steps.push({
          description: `sorted("${words[i]}") = "${key}" \u2014 add to that bucket`,
          array: words,
          highlights: [{ index: i, role: "current" }],
          structure: { label: `groups["${key}"]`, entries: list },
          variables: { i, key },
          headline: `key = "${key}"`,
          tag: { label: "Bucket", tone: "info" },
          codeLine: 3,
        });
      }
      steps.push({
        description: `Formed ${groups.size} group(s)`,
        array: words,
        highlights: [],
        variables: { groups: groups.size },
        headline: `${groups.size} groups formed`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal",
    complexity:
      "Time: O(n\u00b7k) \u00b7 Space: O(n\u00b7k) \u2014 hash map keyed by a count signature, no per-string sort",
    code: [
      "const groups = new Map();",
      "for (const s of strs) {",
      "  const key = countSignature(s); // e.g. '#2#0#1...'",
      "  groups.set(key, [...(groups.get(key) ?? []), s]);",
      "}",
    ],
    run: (input): VizStep[] => {
      const words = input.split("|");
      const steps: VizStep[] = [];
      const groups = new Map<string, string[]>();
      const signature = (w: string) => {
        const freq = new Map<string, number>();
        for (const ch of w) freq.set(ch, (freq.get(ch) ?? 0) + 1);
        return [...freq.entries()]
          .sort()
          .map(([k, v]) => `${k}${v}`)
          .join("#");
      };
      for (let i = 0; i < words.length; i++) {
        const key = signature(words[i]);
        const list = groups.get(key) ?? [];
        list.push(words[i]);
        groups.set(key, list);
        steps.push({
          description: `count-signature("${words[i]}") = "${key}" \u2014 add to that bucket`,
          array: words,
          highlights: [{ index: i, role: "current" }],
          structure: { label: `groups["${key}"]`, entries: list },
          variables: { i },
          headline: `signature = "${key}"`,
          tag: { label: "Bucket", tone: "info" },
          codeLine: 3,
        });
      }
      steps.push({
        description: `Formed ${groups.size} group(s)`,
        array: words,
        highlights: [],
        variables: { groups: groups.size },
        headline: `${groups.size} groups formed`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const topKFrequentApproaches: Partial<
  Record<"brute" | "sub" | "optimal", ApproachRunner>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n log n) \u00b7 Space: O(n) \u2014 count, then sort all keys by frequency",
    code: [
      "const freq = new Map();",
      "for (const num of nums) freq.set(num, (freq.get(num) ?? 0) + 1);",
      "const keys = [...freq.keys()].sort((a, b) => freq.get(b) - freq.get(a));",
      "return keys.slice(0, k);",
    ],
    run: (input, target = 2): VizStep[] => {
      const steps: VizStep[] = [];
      const freq = new Map<number, number>();
      for (let i = 0; i < input.length; i++) {
        const num = input[i];
        freq.set(num, (freq.get(num) ?? 0) + 1);
        steps.push({
          description: `Count nums[${i}] (${num}) \u2192 ${freq.get(num)}`,
          array: input,
          highlights: [{ index: i, role: "current" }],
          structure: {
            label: "freq",
            entries: [...freq.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { i },
          headline: `freq[${num}] = ${freq.get(num)}`,
          tag: { label: "Count", tone: "info" },
          codeLine: 2,
        });
      }
      const sortedKeys = [...freq.keys()].sort(
        (a, b) => (freq.get(b) ?? 0) - (freq.get(a) ?? 0),
      );
      const topK = sortedKeys.slice(0, target);
      steps.push({
        description: `Sort keys by frequency, take top ${target}: [${topK.join(", ")}]`,
        array: input,
        highlights: input
          .map((v, idx) =>
            topK.includes(v) ? { index: idx, role: "match" as const } : null,
          )
          .filter((h): h is { index: number; role: "match" } => h !== null)
          .filter(
            (h, idx, arr) => arr.findIndex((x) => x.index === h.index) === idx,
          ),
        variables: { k: target, result: `[${topK.join(", ")}]` },
        headline: `Top ${target} = [${topK.join(", ")}]`,
        tag: { label: "Found", tone: "success" },
        codeLine: 4,
        done: true,
      });
      return steps;
    },
  },
  sub: {
    label: "Sub-Optimal",
    complexity:
      "Time: O(n log k) \u00b7 Space: O(n) \u2014 count, then keep a min-heap of size k",
    code: [
      "const freq = new Map();",
      "for (const num of nums) freq.set(num, (freq.get(num) ?? 0) + 1);",
      "// keep only the k largest using a size-k min-heap",
      "return [...heap].map(([num]) => num);",
    ],
    run: (input, target = 2): VizStep[] => {
      const steps: VizStep[] = [];
      const freq = new Map<number, number>();
      for (let i = 0; i < input.length; i++) {
        const num = input[i];
        freq.set(num, (freq.get(num) ?? 0) + 1);
        steps.push({
          description: `Count nums[${i}] (${num}) \u2192 ${freq.get(num)}`,
          array: input,
          highlights: [{ index: i, role: "current" }],
          structure: {
            label: "freq",
            entries: [...freq.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { i },
          headline: `freq[${num}] = ${freq.get(num)}`,
          tag: { label: "Count", tone: "info" },
          codeLine: 2,
        });
      }
      const sortedByFreq = [...freq.entries()].sort((a, b) => a[1] - b[1]);
      const heapKept = sortedByFreq.slice(-target).map(([num]) => num);
      steps.push({
        description: `Min-heap keeps the ${target} largest-frequency keys: [${heapKept.join(", ")}]`,
        array: input,
        highlights: input
          .map((v, idx) =>
            heapKept.includes(v)
              ? { index: idx, role: "match" as const }
              : null,
          )
          .filter((h): h is { index: number; role: "match" } => h !== null)
          .filter(
            (h, idx, arr) => arr.findIndex((x) => x.index === h.index) === idx,
          ),
        variables: { k: target, result: `[${heapKept.join(", ")}]` },
        headline: `Top ${target} = [${heapKept.join(", ")}]`,
        tag: { label: "Found", tone: "success" },
        codeLine: 4,
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 bucket by frequency, no comparisons needed",
    code: [
      "const freq = new Map();",
      "for (const num of nums) freq.set(num, (freq.get(num) ?? 0) + 1);",
      "const buckets = new Array(nums.length + 1).fill(0).map(() => []);",
      "for (const [num, count] of freq) buckets[count].push(num);",
      "// read buckets from high frequency to low until k values collected",
    ],
    run: (input, target = 2): VizStep[] => {
      const steps: VizStep[] = [];
      const freq = new Map<number, number>();
      for (let i = 0; i < input.length; i++) {
        const num = input[i];
        freq.set(num, (freq.get(num) ?? 0) + 1);
        steps.push({
          description: `Count nums[${i}] (${num}) \u2192 ${freq.get(num)}`,
          array: input,
          highlights: [{ index: i, role: "current" }],
          structure: {
            label: "freq",
            entries: [...freq.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { i },
          headline: `freq[${num}] = ${freq.get(num)}`,
          tag: { label: "Count", tone: "info" },
          codeLine: 2,
        });
      }
      const buckets = new Map<number, number[]>();
      for (const [num, count] of freq) {
        const list = buckets.get(count) ?? [];
        list.push(num);
        buckets.set(count, list);
      }
      const result: number[] = [];
      for (let f = input.length; f >= 1 && result.length < target; f--) {
        for (const num of buckets.get(f) ?? []) {
          result.push(num);
          if (result.length === target) break;
        }
      }
      steps.push({
        description: `Reading buckets from highest to lowest frequency: [${result.join(", ")}]`,
        array: input,
        highlights: input
          .map((v, idx) =>
            result.includes(v) ? { index: idx, role: "match" as const } : null,
          )
          .filter((h): h is { index: number; role: "match" } => h !== null)
          .filter(
            (h, idx, arr) => arr.findIndex((x) => x.index === h.index) === idx,
          ),
        variables: { k: target, result: `[${result.join(", ")}]` },
        headline: `Top ${target} = [${result.join(", ")}]`,
        tag: { label: "Found", tone: "success" },
        codeLine: 5,
        done: true,
      });
      return steps;
    },
  },
};

export const subarraySumApproaches: Partial<
  Record<"brute" | "sub" | "optimal", ApproachRunner>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 every start index, grow the running sum",
    code: [
      "let count = 0;",
      "for (let i = 0; i < n; i++) {",
      "  let sum = 0;",
      "  for (let j = i; j < n; j++) {",
      "    sum += nums[j];",
      "    if (sum === k) count++;",
      "  }",
      "}",
    ],
    run: (input, target = 2): VizStep[] => {
      const steps: VizStep[] = [];
      let count = 0;
      for (let i = 0; i < input.length; i++) {
        let sum = 0;
        for (let j = i; j < input.length; j++) {
          sum += input[j];
          const isMatch = sum === target;
          if (isMatch) count++;
          steps.push({
            description: `sum(nums[${i}..${j}]) = ${sum}${isMatch ? ` == k (${target}) \u2014 count++` : ""}`,
            array: input,
            highlights: Array.from({ length: j - i + 1 }, (_, idx) => ({
              index: i + idx,
              role: isMatch
                ? ("match" as const)
                : idx === j - i
                  ? ("j" as const)
                  : ("i" as const),
            })),
            variables: { i, j, sum, count },
            headline: `sum = ${sum}`,
            tag: isMatch
              ? { label: "Match Found", tone: "success" }
              : { label: "Expand Window", tone: "info" },
            codeLine: isMatch ? 6 : 5,
          });
        }
      }
      steps.push({
        description: `Total subarrays summing to ${target}: ${count}`,
        array: input,
        highlights: [],
        variables: { result: count },
        headline: `Count = ${count}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  sub: {
    label: "Sub-Optimal",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(n) \u2014 precompute prefix sums, check every pair of endpoints",
    code: [
      "const prefix = [0];",
      "for (const num of nums) prefix.push(prefix.at(-1) + num);",
      "let count = 0;",
      "for (let i = 0; i < n; i++)",
      "  for (let j = i + 1; j <= n; j++)",
      "    if (prefix[j] - prefix[i] === k) count++;",
    ],
    run: (input, target = 2): VizStep[] => {
      const steps: VizStep[] = [];
      const n = input.length;
      const prefix = [0];
      for (let i = 0; i < n; i++) prefix.push(prefix[i] + input[i]);
      steps.push({
        description: `Prefix sums: [${prefix.join(", ")}]`,
        array: input,
        highlights: input.map((_, idx) => ({
          index: idx,
          role: "sorted" as const,
        })),
        variables: { prefix: `[${prefix.join(", ")}]` },
        headline: "Build prefix sums",
        tag: { label: "Precompute", tone: "info" },
        codeLine: 2,
      });
      let count = 0;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j <= n; j++) {
          const sum = prefix[j] - prefix[i];
          const isMatch = sum === target;
          if (isMatch) count++;
          steps.push({
            description: `prefix[${j}] - prefix[${i}] = ${sum}${isMatch ? ` == k (${target}) \u2014 count++` : ""}`,
            array: input,
            highlights: Array.from({ length: j - i }, (_, idx) => ({
              index: i + idx,
              role: isMatch
                ? ("match" as const)
                : idx === j - i - 1
                  ? ("j" as const)
                  : ("i" as const),
            })),
            variables: { i, j, sum, count },
            headline: `sum = ${sum}`,
            tag: isMatch
              ? { label: "Match Found", tone: "success" }
              : { label: "Check Range", tone: "info" },
            codeLine: 6,
          });
        }
      }
      steps.push({
        description: `Total subarrays summing to ${target}: ${count}`,
        array: input,
        highlights: [],
        variables: { result: count },
        headline: `Count = ${count}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 running prefix sum + hash map of prefix-sum frequencies",
    code: [
      "const prefixCount = new Map([[0, 1]]);",
      "let sum = 0, count = 0;",
      "for (const num of nums) {",
      "  sum += num;",
      "  count += prefixCount.get(sum - k) ?? 0;",
      "  prefixCount.set(sum, (prefixCount.get(sum) ?? 0) + 1);",
      "}",
    ],
    run: (input, target = 2): VizStep[] => {
      const steps: VizStep[] = [];
      const prefixCount = new Map<number, number>([[0, 1]]);
      let sum = 0;
      let count = 0;
      for (let i = 0; i < input.length; i++) {
        sum += input[i];
        const need = sum - target;
        const found = prefixCount.get(need) ?? 0;
        count += found;
        steps.push({
          description: `sum = ${sum}, need prefix ${need} seen ${found} time(s) \u2014 count ${found > 0 ? "+=" : "stays"} ${found > 0 ? found : ""}`,
          array: input,
          highlights: [{ index: i, role: found > 0 ? "match" : "current" }],
          structure: {
            label: "prefixCount",
            entries: [...prefixCount.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { i, sum, count },
          headline: `sum=${sum}  need=${need}`,
          tag:
            found > 0
              ? { label: "Match Found", tone: "success" }
              : { label: "Running Sum", tone: "info" },
          codeLine: 5,
        });
        prefixCount.set(sum, (prefixCount.get(sum) ?? 0) + 1);
      }
      steps.push({
        description: `Total subarrays summing to ${target}: ${count}`,
        array: input,
        highlights: [],
        variables: { result: count },
        headline: `Count = ${count}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const longestConsecutiveApproaches: Partial<
  Record<"brute" | "sub" | "optimal", ApproachRunner>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) (with array lookups) \u00b7 Space: O(1) \u2014 extend forward from every number",
    code: [
      "let best = 0;",
      "for (const num of nums) {",
      "  let length = 1;",
      "  while (nums.includes(num + length)) length++;",
      "  best = Math.max(best, length);",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      let best = 0;
      for (let i = 0; i < input.length; i++) {
        const num = input[i];
        let length = 1;
        while (input.includes(num + length)) length++;
        best = Math.max(best, length);
        steps.push({
          description: `From ${num}: run length ${length} (${num}..${num + length - 1})`,
          array: input,
          highlights: [
            { index: i, role: length === best ? "match" : "current" },
          ],
          variables: { num, length, best },
          headline: `${num} \u2192 run of ${length}`,
          tag:
            length === best
              ? { label: "New Best", tone: "success" }
              : { label: "Extend", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: `Longest consecutive run length: ${best}`,
        array: input,
        highlights: [],
        variables: { result: best },
        headline: `Longest run = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  sub: {
    label: "Sub-Optimal",
    complexity:
      "Time: O(n log n) \u00b7 Space: O(1) extra \u2014 sort, then scan for consecutive runs",
    code: [
      "nums.sort((a, b) => a - b);",
      "let best = 1, run = 1;",
      "for (let i = 1; i < n; i++) {",
      "  if (nums[i] === nums[i-1] + 1) run++;",
      "  else if (nums[i] !== nums[i-1]) run = 1;",
      "  best = Math.max(best, run);",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const sorted = [...input].sort((a, b) => a - b);
      steps.push({
        description: "Sort the array first",
        array: sorted,
        highlights: sorted.map((_, idx) => ({
          index: idx,
          role: "sorted" as const,
        })),
        variables: {},
        headline: "Sort the array",
        tag: { label: "Sort First", tone: "info" },
        codeLine: 1,
      });
      if (sorted.length === 0) {
        steps.push({
          description: "Empty array \u2014 longest run is 0",
          array: sorted,
          highlights: [],
          variables: { result: 0 },
          headline: "Longest run = 0",
          tag: { label: "Done", tone: "success" },
          done: true,
        });
        return steps;
      }
      let best = 1;
      let run = 1;
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === sorted[i - 1] + 1) {
          run++;
        } else if (sorted[i] !== sorted[i - 1]) {
          run = 1;
        }
        best = Math.max(best, run);
        steps.push({
          description: `sorted[${i}] (${sorted[i]}) vs sorted[${i - 1}] (${sorted[i - 1]}) \u2014 run = ${run}`,
          array: sorted,
          highlights: [
            { index: i - 1, role: "lo" },
            { index: i, role: run === best ? "match" : "hi" },
          ],
          variables: { i, run, best },
          headline: `run = ${run}`,
          tag:
            run === best
              ? { label: "New Best", tone: "success" }
              : { label: "Scan", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: `Longest consecutive run length: ${best}`,
        array: sorted,
        highlights: [],
        variables: { result: best },
        headline: `Longest run = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 hash set, only start counting from run beginnings",
    code: [
      "const set = new Set(nums);",
      "let best = 0;",
      "for (const num of set) {",
      "  if (set.has(num - 1)) continue; // not a run start",
      "  let length = 1;",
      "  while (set.has(num + length)) length++;",
      "  best = Math.max(best, length);",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const set = new Set(input);
      let best = 0;
      for (let i = 0; i < input.length; i++) {
        const num = input[i];
        if (set.has(num - 1)) {
          steps.push({
            description: `${num - 1} is also in the set \u2014 ${num} is not a run start, skip`,
            array: input,
            highlights: [{ index: i, role: "i" }],
            structure: { label: "set", entries: [...set] },
            variables: { num },
            headline: `${num} is mid-run`,
            tag: { label: "Skip", tone: "info" },
            codeLine: 4,
          });
          continue;
        }
        let length = 1;
        while (set.has(num + length)) length++;
        best = Math.max(best, length);
        steps.push({
          description: `${num} starts a run of length ${length} (${num}..${num + length - 1})`,
          array: input,
          highlights: [
            { index: i, role: length === best ? "match" : "current" },
          ],
          structure: { label: "set", entries: [...set] },
          variables: { num, length, best },
          headline: `${num} \u2192 run of ${length}`,
          tag:
            length === best
              ? { label: "New Best", tone: "success" }
              : { label: "Count Run", tone: "info" },
          codeLine: 6,
        });
      }
      steps.push({
        description: `Longest consecutive run length: ${best}`,
        array: input,
        highlights: [],
        variables: { result: best },
        headline: `Longest run = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};
