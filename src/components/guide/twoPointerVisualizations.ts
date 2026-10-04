import type { ApproachRunner, VizStep } from "./AlgoVisualizer";

export const reverseStringApproaches: Partial<Record<"brute" | "optimal", ApproachRunner<string>>> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n) \u00b7 Space: O(n) \u2014 build a reversed copy, then write it back",
    code: ["const result = [...s].reverse();", "for (let i = 0; i < s.length; i++) s[i] = result[i];"],
    run: (input): VizStep[] => {
      const s = input;
      const steps: VizStep[] = [];
      const array = [...s];
      const result = [...array].reverse();
      for (let i = 0; i < array.length; i++) {
        array[i] = result[i];
        steps.push({
          description: `Write result[${i}] ('${result[i]}') into s[${i}]`,
          array: [...array],
          highlights: [{ index: i, role: "current" }],
          variables: { i },
          headline: `s[${i}] = '${result[i]}'`,
          tag: { label: "Copy Back", tone: "info" },
          codeLine: 2,
        });
      }
      steps.push({
        description: `Reversed: "${array.join("")}"`,
        array,
        highlights: [],
        variables: { result: array.join("") },
        headline: `"${array.join("")}"`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Two Pointer",
    complexity: "Time: O(n) \u00b7 Space: O(1) \u2014 swap from both ends inward",
    code: ["let left = 0, right = n - 1;", "while (left < right) {", "  [s[left], s[right]] = [s[right], s[left]];", "  left++; right--;", "}"],
    run: (input): VizStep[] => {
      const array = [...input];
      const steps: VizStep[] = [];
      let left = 0;
      let right = array.length - 1;
      while (left < right) {
        [array[left], array[right]] = [array[right], array[left]];
        steps.push({
          description: `Swap s[${left}] and s[${right}] \u2192 '${array[left]}' \u2194 '${array[right]}'`,
          array: [...array],
          highlights: [
            { index: left, role: "lo" },
            { index: right, role: "hi" },
          ],
          variables: { left, right },
          headline: `swap ${left} \u2194 ${right}`,
          tag: { label: "Swap", tone: "info" },
          codeLine: 3,
        });
        left++;
        right--;
      }
      steps.push({
        description: `Reversed: "${array.join("")}"`,
        array,
        highlights: [],
        variables: { result: array.join("") },
        headline: `"${array.join("")}"`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const validPalindromeApproaches: Partial<Record<"brute" | "optimal", ApproachRunner<string>>> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n) \u00b7 Space: O(n) \u2014 build a cleaned copy, compare to its reverse",
    code: [
      "const cleaned = [...s].filter(isAlnum).map(toLower);",
      "return cleaned.join('') === cleaned.reverse().join('');",
    ],
    run: (input): VizStep[] => {
      const s = input;
      const steps: VizStep[] = [];
      const array = [...s];
      const cleaned = [...s].filter((c) => /[a-z0-9]/i.test(c)).map((c) => c.toLowerCase());
      const reversed = [...cleaned].reverse();
      steps.push({
        description: `Cleaned: "${cleaned.join("")}"`,
        array,
        highlights: [],
        structure: { label: "cleaned", entries: cleaned },
        variables: {},
        headline: `"${cleaned.join("")}"`,
        tag: { label: "Clean", tone: "info" },
        codeLine: 1,
      });
      const isPalindrome = cleaned.join("") === reversed.join("");
      steps.push({
        description: isPalindrome ? "Cleaned string equals its reverse \u2014 palindrome!" : "Cleaned string differs from its reverse \u2014 not a palindrome",
        array,
        highlights: [],
        structure: { label: "cleaned", entries: cleaned },
        variables: { result: String(isPalindrome) },
        headline: isPalindrome ? "Palindrome!" : "Not a palindrome",
        tag: { label: isPalindrome ? "Found" : "Not Found", tone: isPalindrome ? "success" : "danger" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Two Pointer",
    complexity: "Time: O(n) \u00b7 Space: O(1) \u2014 walk in from both ends, skipping non-alphanumerics",
    code: [
      "let left = 0, right = n - 1;",
      "while (left < right) {",
      "  while (left < right && !isAlnum(s[left])) left++;",
      "  while (left < right && !isAlnum(s[right])) right--;",
      "  if (toLower(s[left]) !== toLower(s[right])) return false;",
      "  left++; right--;",
      "}",
      "return true;",
    ],
    run: (input): VizStep[] => {
      const s = input;
      const array = [...s];
      const steps: VizStep[] = [];
      const isAlnum = (c: string) => /[a-z0-9]/i.test(c);
      let left = 0;
      let right = array.length - 1;
      while (left < right) {
        while (left < right && !isAlnum(array[left])) left++;
        while (left < right && !isAlnum(array[right])) right--;
        const a = array[left].toLowerCase();
        const b = array[right].toLowerCase();
        if (a !== b) {
          steps.push({
            description: `'${array[left]}' \u2260 '${array[right]}' (case-insensitive) \u2014 not a palindrome`,
            array,
            highlights: [
              { index: left, role: "lo" },
              { index: right, role: "hi" },
            ],
            variables: { left, right, result: "false" },
            headline: `'${array[left]}' \u2260 '${array[right]}'`,
            tag: { label: "Not Found", tone: "danger" },
            codeLine: 5,
            done: true,
          });
          return steps;
        }
        steps.push({
          description: `'${array[left]}' matches '${array[right]}' \u2014 move both pointers inward`,
          array,
          highlights: [
            { index: left, role: "match" },
            { index: right, role: "match" },
          ],
          variables: { left, right },
          headline: `'${array[left]}' == '${array[right]}'`,
          tag: { label: "Match", tone: "info" },
          codeLine: 5,
        });
        left++;
        right--;
      }
      steps.push({
        description: "All characters matched \u2014 palindrome!",
        array,
        highlights: [],
        variables: { result: "true" },
        headline: "Palindrome!",
        tag: { label: "Found", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const twoSumSortedApproaches: Partial<Record<"brute" | "optimal", ApproachRunner>> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 check every pair",
    code: ["for (let i = 0; i < n; i++)", "  for (let j = i + 1; j < n; j++)", "    if (numbers[i] + numbers[j] === target) return [i + 1, j + 1];"],
    run: (input, target = 9): VizStep[] => {
      const steps: VizStep[] = [];
      for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {
          const sum = input[i] + input[j];
          const isMatch = sum === target;
          steps.push({
            description: `numbers[${i}] + numbers[${j}] = ${sum}${isMatch ? ` == target (${target})` : ""}`,
            array: input,
            highlights: [
              { index: i, role: isMatch ? "match" : "i" },
              { index: j, role: isMatch ? "match" : "j" },
            ],
            variables: { i, j, sum },
            headline: `${input[i]} + ${input[j]} = ${sum}`,
            tag: isMatch ? { label: "Target Found", tone: "success" } : { label: "Compare", tone: "info" },
            codeLine: 3,
            done: isMatch,
          });
          if (isMatch) return steps;
        }
      }
      return steps;
    },
  },
  optimal: {
    label: "Two Pointer",
    complexity: "Time: O(n) \u00b7 Space: O(1) \u2014 converge from both ends using sortedness",
    code: [
      "let left = 0, right = n - 1;",
      "while (left < right) {",
      "  const sum = numbers[left] + numbers[right];",
      "  if (sum === target) return [left + 1, right + 1];",
      "  else if (sum < target) left++;",
      "  else right--;",
      "}",
    ],
    run: (input, target = 9): VizStep[] => {
      const steps: VizStep[] = [];
      let left = 0;
      let right = input.length - 1;
      while (left < right) {
        const sum = input[left] + input[right];
        if (sum === target) {
          steps.push({
            description: `numbers[${left}] + numbers[${right}] = ${sum} == target (${target}) \u2014 return [${left + 1}, ${right + 1}]`,
            array: input,
            highlights: [
              { index: left, role: "match" },
              { index: right, role: "match" },
            ],
            variables: { left, right, result: `[${left + 1}, ${right + 1}]` },
            headline: `${input[left]} + ${input[right]} = ${sum}`,
            tag: { label: "Target Found", tone: "success" },
            codeLine: 4,
            done: true,
          });
          return steps;
        }
        steps.push({
          description: `sum = ${sum} ${sum < target ? "< target, move left \u2192" : "> target, \u2190 move right"}`,
          array: input,
          highlights: [
            { index: left, role: "lo" },
            { index: right, role: "hi" },
          ],
          variables: { left, right, sum },
          headline: `${sum} ${sum < target ? "<" : ">"} ${target}`,
          tag: { label: sum < target ? "Move left \u2192" : "\u2190 Move right", tone: "info" },
          codeLine: sum < target ? 5 : 6,
        });
        if (sum < target) left++;
        else right--;
      }
      return steps;
    },
  },
};

export const moveZeroesApproaches: Partial<Record<"brute" | "optimal", ApproachRunner>> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 bubble each zero to the end one step at a time",
    code: ["for (let i = 0; i < n; i++) {", "  if (nums[i] === 0) {", "    for (let j = i; j < n - 1; j++) [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];", "  }", "}"],
    run: (input): VizStep[] => {
      const array = [...input];
      const steps: VizStep[] = [];
      let i = 0;
      let end = array.length; // shrinks as zeros get fixed in place at the tail
      while (i < end) {
        if (array[i] === 0) {
          for (let j = i; j < end - 1; j++) {
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
          }
          end--;
          steps.push({
            description: `Bubbled the 0 at index ${i} all the way to the end`,
            array: [...array],
            highlights: [{ index: end, role: "current" }],
            variables: { i },
            headline: "Bubble 0 \u2192 end",
            tag: { label: "Shift", tone: "info" },
            codeLine: 3,
          });
        } else {
          i++;
        }
      }
      steps.push({
        description: `Result: [${array.join(", ")}]`,
        array,
        highlights: [],
        variables: { result: `[${array.join(", ")}]` },
        headline: `[${array.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Two Pointer",
    complexity: "Time: O(n) \u00b7 Space: O(1) \u2014 slow marks the next non-zero slot, fast scans",
    code: ["let slow = 0;", "for (let fast = 0; fast < n; fast++) {", "  if (nums[fast] !== 0) {", "    [nums[slow], nums[fast]] = [nums[fast], nums[slow]];", "    slow++;", "  }", "}"],
    run: (input): VizStep[] => {
      const array = [...input];
      const steps: VizStep[] = [];
      let slow = 0;
      for (let fast = 0; fast < array.length; fast++) {
        if (array[fast] !== 0) {
          [array[slow], array[fast]] = [array[fast], array[slow]];
          steps.push({
            description: `nums[${fast}] (${array[slow]}) is non-zero \u2014 swap into slot ${slow}`,
            array: [...array],
            highlights: [
              { index: slow, role: "match" },
              { index: fast, role: "hi" },
            ],
            variables: { slow, fast },
            headline: `swap \u2192 slot ${slow}`,
            tag: { label: "Keep", tone: "success" },
            codeLine: 4,
          });
          slow++;
        } else {
          steps.push({
            description: `nums[${fast}] is 0 \u2014 skip, slow stays at ${slow}`,
            array: [...array],
            highlights: [{ index: fast, role: "current" }],
            variables: { slow, fast },
            headline: "Skip 0",
            tag: { label: "Skip", tone: "info" },
            codeLine: 3,
          });
        }
      }
      steps.push({
        description: `Result: [${array.join(", ")}]`,
        array,
        highlights: [],
        variables: { result: `[${array.join(", ")}]` },
        headline: `[${array.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const removeDuplicatesApproaches: Partial<Record<"brute" | "optimal", ApproachRunner>> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n) \u00b7 Space: O(n) \u2014 build a deduped copy using a set",
    code: ["const unique = [...new Set(nums)];", "for (let i = 0; i < unique.length; i++) nums[i] = unique[i];", "return unique.length;"],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const seen = new Set<number>();
      const unique: number[] = [];
      for (let i = 0; i < input.length; i++) {
        const isNew = !seen.has(input[i]);
        if (isNew) {
          seen.add(input[i]);
          unique.push(input[i]);
        }
        steps.push({
          description: `nums[${i}] (${input[i]})${isNew ? " is new \u2014 keep it" : " already seen \u2014 skip"}`,
          array: input,
          highlights: [{ index: i, role: isNew ? "match" : "current" }],
          structure: { label: "unique so far", entries: unique },
          variables: { i },
          headline: isNew ? "Keep" : "Skip",
          tag: isNew ? { label: "Keep", tone: "success" } : { label: "Duplicate", tone: "info" },
          codeLine: 1,
        });
      }
      steps.push({
        description: `New length: ${unique.length}`,
        array: input,
        highlights: [],
        variables: { result: unique.length },
        headline: `length = ${unique.length}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Two Pointer",
    complexity: "Time: O(n) \u00b7 Space: O(1) \u2014 slow marks the last unique value written, fast scans",
    code: ["let slow = 0;", "for (let fast = 1; fast < n; fast++) {", "  if (nums[fast] !== nums[slow]) {", "    slow++;", "    nums[slow] = nums[fast];", "  }", "}", "return slow + 1;"],
    run: (input): VizStep[] => {
      const array = [...input];
      const steps: VizStep[] = [];
      if (array.length === 0) return steps;
      let slow = 0;
      for (let fast = 1; fast < array.length; fast++) {
        const isNew = array[fast] !== array[slow];
        if (isNew) {
          slow++;
          array[slow] = array[fast];
          steps.push({
            description: `nums[${fast}] (${array[fast]}) \u2260 nums[${slow - 1}] \u2014 write it to slot ${slow}`,
            array: [...array],
            highlights: [
              { index: slow, role: "match" },
              { index: fast, role: "hi" },
            ],
            variables: { slow, fast },
            headline: `write slot ${slow}`,
            tag: { label: "New Value", tone: "success" },
            codeLine: 5,
          });
        } else {
          steps.push({
            description: `nums[${fast}] (${array[fast]}) == nums[${slow}] \u2014 duplicate, skip`,
            array: [...array],
            highlights: [
              { index: slow, role: "lo" },
              { index: fast, role: "current" },
            ],
            variables: { slow, fast },
            headline: "Duplicate",
            tag: { label: "Skip", tone: "info" },
            codeLine: 3,
          });
        }
      }
      steps.push({
        description: `New length: ${slow + 1}`,
        array,
        highlights: [],
        variables: { result: slow + 1 },
        headline: `length = ${slow + 1}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const containerWithMostWaterApproaches: Partial<Record<"brute" | "optimal", ApproachRunner>> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 check every pair of lines",
    code: ["let best = 0;", "for (let i = 0; i < n; i++)", "  for (let j = i + 1; j < n; j++)", "    best = Math.max(best, Math.min(height[i], height[j]) * (j - i));"],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      let best = 0;
      for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {
          const area = Math.min(input[i], input[j]) * (j - i);
          const isBest = area > best;
          best = Math.max(best, area);
          steps.push({
            description: `Lines ${i} and ${j}: area = min(${input[i]}, ${input[j]}) \u00d7 ${j - i} = ${area}${isBest ? " \u2014 new best" : ""}`,
            array: input,
            highlights: [
              { index: i, role: isBest ? "match" : "i" },
              { index: j, role: isBest ? "match" : "j" },
            ],
            variables: { i, j, area, best },
            headline: `area = ${area}`,
            tag: isBest ? { label: "New Best", tone: "success" } : { label: "Compare", tone: "info" },
            codeLine: 4,
          });
        }
      }
      steps.push({
        description: `Most water: ${best}`,
        array: input,
        highlights: [],
        variables: { result: best },
        headline: `Max area = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Two Pointer",
    complexity: "Time: O(n) \u00b7 Space: O(1) \u2014 converge, always move the shorter line inward",
    code: [
      "let left = 0, right = n - 1, best = 0;",
      "while (left < right) {",
      "  best = Math.max(best, Math.min(height[left], height[right]) * (right - left));",
      "  if (height[left] < height[right]) left++;",
      "  else right--;",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      let left = 0;
      let right = input.length - 1;
      let best = 0;
      while (left < right) {
        const area = Math.min(input[left], input[right]) * (right - left);
        const isBest = area > best;
        best = Math.max(best, area);
        steps.push({
          description: `area = min(${input[left]}, ${input[right]}) \u00d7 ${right - left} = ${area}${isBest ? " \u2014 new best" : ""}`,
          array: input,
          highlights: [
            { index: left, role: isBest ? "match" : "lo" },
            { index: right, role: isBest ? "match" : "hi" },
          ],
          variables: { left, right, area, best },
          headline: `area = ${area}`,
          tag: isBest ? { label: "New Best", tone: "success" } : { label: "Compare", tone: "info" },
          codeLine: 3,
        });
        if (input[left] < input[right]) left++;
        else right--;
      }
      steps.push({
        description: `Most water: ${best}`,
        array: input,
        highlights: [],
        variables: { result: best },
        headline: `Max area = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const threeSumApproaches: Partial<Record<"brute" | "optimal", ApproachRunner>> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n\u00b3) \u00b7 Space: O(n) \u2014 check every triplet, dedupe with a set",
    code: ["for (let i = 0; i < n; i++)", "  for (let j = i + 1; j < n; j++)", "    for (let k = j + 1; k < n; k++)", "      if (nums[i] + nums[j] + nums[k] === 0) record([nums[i], nums[j], nums[k]]);"],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const triplets: string[] = [];
      const seen = new Set<string>();
      for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {
          for (let k = j + 1; k < input.length; k++) {
            const sum = input[i] + input[j] + input[k];
            if (sum === 0) {
              const key = [input[i], input[j], input[k]].sort((a, b) => a - b).join(",");
              const isNew = !seen.has(key);
              if (isNew) {
                seen.add(key);
                triplets.push(`[${key}]`);
              }
              steps.push({
                description: `nums[${i}]+nums[${j}]+nums[${k}] = 0${isNew ? " \u2014 new triplet" : " \u2014 duplicate triplet"}`,
                array: input,
                highlights: [
                  { index: i, role: "match" },
                  { index: j, role: "match" },
                  { index: k, role: "match" },
                ],
                structure: { label: "triplets", entries: triplets },
                variables: { i, j, k },
                headline: `${input[i]}+${input[j]}+${input[k]}=0`,
                tag: isNew ? { label: "New Triplet", tone: "success" } : { label: "Duplicate", tone: "info" },
                codeLine: 4,
              });
            }
          }
        }
      }
      steps.push({
        description: `Triplets found: ${triplets.join(" ") || "none"}`,
        array: input,
        highlights: [],
        variables: { result: triplets.length },
        headline: `${triplets.length} triplet(s)`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Two Pointer",
    complexity: "Time: O(n\u00b2) \u00b7 Space: O(n) sorted copy \u2014 sort, fix one number, two-pointer the rest",
    code: [
      "nums.sort((a, b) => a - b);",
      "for (let i = 0; i < n; i++) {",
      "  let left = i + 1, right = n - 1;",
      "  while (left < right) {",
      "    const sum = nums[i] + nums[left] + nums[right];",
      "    if (sum === 0) { record(i, left, right); left++; right--; }",
      "    else if (sum < 0) left++; else right--;",
      "  }",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const sorted = [...input].sort((a, b) => a - b);
      const triplets: string[] = [];
      steps.push({
        description: `Sort first: [${sorted.join(", ")}]`,
        array: sorted,
        highlights: sorted.map((_, idx) => ({ index: idx, role: "sorted" as const })),
        variables: {},
        headline: "Sort the array",
        tag: { label: "Sort First", tone: "info" },
        codeLine: 1,
      });
      for (let i = 0; i < sorted.length - 2; i++) {
        if (i > 0 && sorted[i] === sorted[i - 1]) continue;
        let left = i + 1;
        let right = sorted.length - 1;
        while (left < right) {
          const sum = sorted[i] + sorted[left] + sorted[right];
          if (sum === 0) {
            triplets.push(`[${sorted[i]},${sorted[left]},${sorted[right]}]`);
            steps.push({
              description: `nums[${i}]+nums[${left}]+nums[${right}] = 0 \u2014 record triplet`,
              array: sorted,
              highlights: [
                { index: i, role: "current" },
                { index: left, role: "match" },
                { index: right, role: "match" },
              ],
              structure: { label: "triplets", entries: triplets },
              variables: { i, left, right },
              headline: `${sorted[i]}+${sorted[left]}+${sorted[right]}=0`,
              tag: { label: "Triplet Found", tone: "success" },
              codeLine: 6,
            });
            left++;
            right--;
          } else {
            steps.push({
              description: `sum = ${sum} ${sum < 0 ? "< 0, move left \u2192" : "> 0, \u2190 move right"}`,
              array: sorted,
              highlights: [
                { index: i, role: "current" },
                { index: left, role: "lo" },
                { index: right, role: "hi" },
              ],
              variables: { i, left, right, sum },
              headline: `sum = ${sum}`,
              tag: { label: sum < 0 ? "Move left \u2192" : "\u2190 Move right", tone: "info" },
              codeLine: 7,
            });
            if (sum < 0) left++;
            else right--;
          }
        }
      }
      steps.push({
        description: `Triplets found: ${triplets.join(" ") || "none"}`,
        array: sorted,
        highlights: [],
        variables: { result: triplets.length },
        headline: `${triplets.length} triplet(s)`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const trappingRainWaterApproaches: Partial<Record<"brute" | "optimal", ApproachRunner>> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 for each bar, scan left and right for the tallest wall",
    code: ["for (let i = 0; i < n; i++) {", "  const leftMax = Math.max(...height.slice(0, i + 1));", "  const rightMax = Math.max(...height.slice(i));", "  total += Math.min(leftMax, rightMax) - height[i];", "}"],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      let total = 0;
      for (let i = 0; i < input.length; i++) {
        const leftMax = Math.max(...input.slice(0, i + 1));
        const rightMax = Math.max(...input.slice(i));
        const water = Math.min(leftMax, rightMax) - input[i];
        total += water;
        steps.push({
          description: `At ${i}: leftMax=${leftMax}, rightMax=${rightMax} \u2014 traps ${water} unit(s)`,
          array: input,
          highlights: [{ index: i, role: water > 0 ? "match" : "current" }],
          variables: { i, leftMax, rightMax, water, total },
          headline: `traps ${water}`,
          tag: water > 0 ? { label: "Traps Water", tone: "success" } : { label: "Scan", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: `Total water trapped: ${total}`,
        array: input,
        highlights: [],
        variables: { result: total },
        headline: `Total = ${total}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Two Pointer",
    complexity: "Time: O(n) \u00b7 Space: O(1) \u2014 converge, always process the side with the smaller max",
    code: [
      "let left = 0, right = n - 1, leftMax = 0, rightMax = 0, total = 0;",
      "while (left < right) {",
      "  if (height[left] < height[right]) {",
      "    leftMax = Math.max(leftMax, height[left]); total += leftMax - height[left]; left++;",
      "  } else {",
      "    rightMax = Math.max(rightMax, height[right]); total += rightMax - height[right]; right--;",
      "  }",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      let left = 0;
      let right = input.length - 1;
      let leftMax = 0;
      let rightMax = 0;
      let total = 0;
      while (left < right) {
        if (input[left] < input[right]) {
          leftMax = Math.max(leftMax, input[left]);
          const water = leftMax - input[left];
          total += water;
          steps.push({
            description: `height[${left}] < height[${right}] \u2014 process left: traps ${water} unit(s)`,
            array: input,
            highlights: [
              { index: left, role: water > 0 ? "match" : "lo" },
              { index: right, role: "hi" },
            ],
            variables: { left, right, leftMax, total },
            headline: `traps ${water}`,
            tag: { label: "Process Left", tone: "info" },
            codeLine: 4,
          });
          left++;
        } else {
          rightMax = Math.max(rightMax, input[right]);
          const water = rightMax - input[right];
          total += water;
          steps.push({
            description: `height[${right}] \u2264 height[${left}] \u2014 process right: traps ${water} unit(s)`,
            array: input,
            highlights: [
              { index: left, role: "lo" },
              { index: right, role: water > 0 ? "match" : "hi" },
            ],
            variables: { left, right, rightMax, total },
            headline: `traps ${water}`,
            tag: { label: "Process Right", tone: "info" },
            codeLine: 6,
          });
          right--;
        }
      }
      steps.push({
        description: `Total water trapped: ${total}`,
        array: input,
        highlights: [],
        variables: { result: total },
        headline: `Total = ${total}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const squaresOfSortedArrayApproaches: Partial<Record<"brute" | "optimal", ApproachRunner>> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n log n) \u00b7 Space: O(n) \u2014 square everything, then sort",
    code: ["const squares = nums.map(x => x * x);", "squares.sort((a, b) => a - b);"],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const squares = input.map((x) => x * x);
      steps.push({
        description: `Squared every element: [${squares.join(", ")}]`,
        array: squares,
        highlights: squares.map((_, idx) => ({ index: idx, role: "current" as const })),
        variables: {},
        headline: "Square all",
        tag: { label: "Square", tone: "info" },
        codeLine: 1,
      });
      const sorted = [...squares].sort((a, b) => a - b);
      steps.push({
        description: `Sorted: [${sorted.join(", ")}]`,
        array: sorted,
        highlights: sorted.map((_, idx) => ({ index: idx, role: "sorted" as const })),
        variables: { result: `[${sorted.join(", ")}]` },
        headline: `[${sorted.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        codeLine: 2,
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Two Pointer",
    complexity: "Time: O(n) \u00b7 Space: O(n) output \u2014 fill result from the back, comparing both ends",
    code: [
      "const result = new Array(n);",
      "let left = 0, right = n - 1;",
      "for (let i = n - 1; i >= 0; i--) {",
      "  if (Math.abs(nums[left]) > Math.abs(nums[right])) { result[i] = nums[left] ** 2; left++; }",
      "  else { result[i] = nums[right] ** 2; right--; }",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const n = input.length;
      const result = new Array<number>(n);
      let left = 0;
      let right = n - 1;
      for (let i = n - 1; i >= 0; i--) {
        const useLeft = Math.abs(input[left]) > Math.abs(input[right]);
        const value = useLeft ? input[left] ** 2 : input[right] ** 2;
        result[i] = value;
        steps.push({
          description: `|${input[left]}| vs |${input[right]}| \u2014 use ${useLeft ? "left" : "right"} (${useLeft ? input[left] : input[right]}), write ${value} at result[${i}]`,
          array: input,
          highlights: [
            { index: left, role: useLeft ? "match" : "lo" },
            { index: right, role: useLeft ? "hi" : "match" },
          ],
          structure: { label: "result (back-filled)", entries: result.filter((v) => v !== undefined) },
          variables: { left, right, i },
          headline: `result[${i}] = ${value}`,
          tag: { label: "Fill", tone: "info" },
          codeLine: useLeft ? 4 : 5,
        });
        if (useLeft) left++;
        else right--;
      }
      steps.push({
        description: `Result: [${result.join(", ")}]`,
        array: input,
        highlights: [],
        variables: { result: `[${result.join(", ")}]` },
        headline: `[${result.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const sortColorsApproaches: Partial<Record<"brute" | "optimal", ApproachRunner>> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n log n) \u00b7 Space: O(1) \u2014 just sort it",
    code: ["nums.sort((a, b) => a - b);"],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const sorted = [...input].sort((a, b) => a - b);
      steps.push({
        description: `Sorted: [${sorted.join(", ")}]`,
        array: sorted,
        highlights: sorted.map((_, idx) => ({ index: idx, role: "sorted" as const })),
        variables: { result: `[${sorted.join(", ")}]` },
        headline: `[${sorted.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        codeLine: 1,
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Two Pointer",
    complexity: "Time: O(n) \u00b7 Space: O(1) \u2014 Dutch national flag: low/mid/high pointers, one pass",
    code: [
      "let low = 0, mid = 0, high = n - 1;",
      "while (mid <= high) {",
      "  if (nums[mid] === 0) { swap(low, mid); low++; mid++; }",
      "  else if (nums[mid] === 1) mid++;",
      "  else { swap(mid, high); high--; }",
      "}",
    ],
    run: (input): VizStep[] => {
      const array = [...input];
      const steps: VizStep[] = [];
      let low = 0;
      let mid = 0;
      let high = array.length - 1;
      while (mid <= high) {
        if (array[mid] === 0) {
          [array[low], array[mid]] = [array[mid], array[low]];
          steps.push({
            description: `nums[mid]=0 \u2014 swap with low (${low}), advance both`,
            array: [...array],
            highlights: [
              { index: low, role: "lo" },
              { index: mid, role: "current" },
              { index: high, role: "hi" },
            ],
            variables: { low, mid, high },
            headline: "0 \u2192 front",
            tag: { label: "Swap Low", tone: "info" },
            codeLine: 3,
          });
          low++;
          mid++;
        } else if (array[mid] === 1) {
          steps.push({
            description: "nums[mid]=1 \u2014 already in place, just advance mid",
            array: [...array],
            highlights: [
              { index: low, role: "lo" },
              { index: mid, role: "current" },
              { index: high, role: "hi" },
            ],
            variables: { low, mid, high },
            headline: "1 stays",
            tag: { label: "Advance", tone: "info" },
            codeLine: 4,
          });
          mid++;
        } else {
          [array[mid], array[high]] = [array[high], array[mid]];
          steps.push({
            description: `nums[mid]=2 \u2014 swap with high (${high}), shrink high`,
            array: [...array],
            highlights: [
              { index: low, role: "lo" },
              { index: mid, role: "current" },
              { index: high, role: "hi" },
            ],
            variables: { low, mid, high },
            headline: "2 \u2192 back",
            tag: { label: "Swap High", tone: "info" },
            codeLine: 5,
          });
          high--;
        }
      }
      steps.push({
        description: `Sorted: [${array.join(", ")}]`,
        array,
        highlights: [],
        variables: { result: `[${array.join(", ")}]` },
        headline: `[${array.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const boatsToSavePeopleApproaches: Partial<Record<"brute" | "optimal", ApproachRunner>> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n\u00b2) \u00b7 Space: O(n) \u2014 repeatedly find the heaviest unassigned person a boat fits",
    code: ["const used = new Array(n).fill(false);", "let boats = 0;", "// for each unused heaviest, try to pair with the heaviest that still fits"],
    run: (input, target = 3): VizStep[] => {
      const steps: VizStep[] = [];
      const sorted = [...input].sort((a, b) => a - b);
      const used = new Array(sorted.length).fill(false);
      let boats = 0;
      for (let i = sorted.length - 1; i >= 0; i--) {
        if (used[i]) continue;
        used[i] = true;
        boats++;
        let partner = -1;
        for (let j = 0; j < i; j++) {
          if (!used[j] && sorted[i] + sorted[j] <= target) {
            partner = j;
            break;
          }
        }
        if (partner !== -1) used[partner] = true;
        steps.push({
          description: partner !== -1
            ? `Pair person ${sorted[i]} with person ${sorted[partner]} (sum \u2264 ${target}) \u2014 boat ${boats}`
            : `Person ${sorted[i]} rides alone \u2014 boat ${boats}`,
          array: sorted,
          highlights: [
            { index: i, role: "match" },
            ...(partner !== -1 ? [{ index: partner, role: "match" as const }] : []),
          ],
          variables: { boats },
          headline: `boat ${boats}`,
          tag: { label: "Assign Boat", tone: "success" },
          codeLine: 2,
        });
      }
      steps.push({
        description: `Minimum boats needed: ${boats}`,
        array: sorted,
        highlights: [],
        variables: { result: boats },
        headline: `${boats} boats`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Two Pointer",
    complexity: "Time: O(n log n) \u00b7 Space: O(1) \u2014 sort, pair lightest with heaviest when they fit",
    code: [
      "people.sort((a, b) => a - b);",
      "let left = 0, right = n - 1, boats = 0;",
      "while (left <= right) {",
      "  if (people[left] + people[right] <= limit) left++;",
      "  right--;",
      "  boats++;",
      "}",
    ],
    run: (input, target = 3): VizStep[] => {
      const steps: VizStep[] = [];
      const sorted = [...input].sort((a, b) => a - b);
      steps.push({
        description: `Sort first: [${sorted.join(", ")}]`,
        array: sorted,
        highlights: sorted.map((_, idx) => ({ index: idx, role: "sorted" as const })),
        variables: {},
        headline: "Sort the array",
        tag: { label: "Sort First", tone: "info" },
        codeLine: 1,
      });
      let left = 0;
      let right = sorted.length - 1;
      let boats = 0;
      while (left <= right) {
        const canPair = left !== right && sorted[left] + sorted[right] <= target;
        steps.push({
          description: canPair
            ? `${sorted[left]} + ${sorted[right]} \u2264 ${target} \u2014 pair them in one boat`
            : `${sorted[left]} + ${sorted[right]} > ${target} (or same person) \u2014 ${sorted[right]} rides alone`,
          array: sorted,
          highlights: canPair
            ? [
                { index: left, role: "match" },
                { index: right, role: "match" },
              ]
            : [{ index: right, role: "hi" }],
          variables: { left, right, boats: boats + 1 },
          headline: canPair ? "Pair up" : "Ride alone",
          tag: { label: "Assign Boat", tone: "success" },
          codeLine: canPair ? 4 : 5,
        });
        if (canPair) left++;
        right--;
        boats++;
      }
      steps.push({
        description: `Minimum boats needed: ${boats}`,
        array: sorted,
        highlights: [],
        variables: { result: boats },
        headline: `${boats} boats`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const mergeSortedArrayApproaches: Partial<Record<"brute" | "optimal", ApproachRunner>> = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O((m+n) log(m+n)) \u00b7 Space: O(1) extra \u2014 append, then sort",
    code: ["for (let i = 0; i < n; i++) nums1[m + i] = nums2[i];", "nums1.sort((a, b) => a - b);"],
    run: (input): VizStep[] => {
      const nums1 = [1, 2, 3, 0, 0, 0];
      const nums2 = [2, 5, 6];
      const m = 3;
      const steps: VizStep[] = [];
      for (let i = 0; i < nums2.length; i++) nums1[m + i] = nums2[i];
      steps.push({
        description: `Append nums2 into the placeholder slots: [${nums1.join(", ")}]`,
        array: [...nums1],
        highlights: Array.from({ length: nums2.length }, (_, idx) => ({ index: m + idx, role: "current" as const })),
        variables: {},
        headline: "Append nums2",
        tag: { label: "Append", tone: "info" },
        codeLine: 1,
      });
      nums1.sort((a, b) => a - b);
      steps.push({
        description: `Sorted: [${nums1.join(", ")}]`,
        array: nums1,
        highlights: nums1.map((_, idx) => ({ index: idx, role: "sorted" as const })),
        variables: { result: `[${nums1.join(", ")}]` },
        headline: `[${nums1.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        codeLine: 2,
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Two Pointer",
    complexity: "Time: O(m+n) \u00b7 Space: O(1) \u2014 merge from the back, largest values first",
    code: [
      "let i = m - 1, j = n - 1, write = m + n - 1;",
      "while (j >= 0) {",
      "  if (i >= 0 && nums1[i] > nums2[j]) nums1[write--] = nums1[i--];",
      "  else nums1[write--] = nums2[j--];",
      "}",
    ],
    run: (): VizStep[] => {
      const nums1 = [1, 2, 3, 0, 0, 0];
      const nums2 = [2, 5, 6];
      const m = 3;
      const steps: VizStep[] = [];
      let i = m - 1;
      let j = nums2.length - 1;
      let write = nums1.length - 1;
      while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) {
          nums1[write] = nums1[i];
          steps.push({
            description: `nums1[${i}] (${nums1[i]}) > nums2[${j}] (${nums2[j]}) \u2014 write ${nums1[i]} at ${write}`,
            array: [...nums1],
            highlights: [
              { index: i, role: "lo" },
              { index: write, role: "match" },
            ],
            variables: { i, j, write },
            headline: `write ${nums1[i]} \u2192 ${write}`,
            tag: { label: "Take from nums1", tone: "info" },
            codeLine: 3,
          });
          i--;
        } else {
          nums1[write] = nums2[j];
          steps.push({
            description: `Write nums2[${j}] (${nums2[j]}) at position ${write}`,
            array: [...nums1],
            highlights: [{ index: write, role: "match" }],
            variables: { i, j, write },
            headline: `write ${nums2[j]} \u2192 ${write}`,
            tag: { label: "Take from nums2", tone: "info" },
            codeLine: 4,
          });
          j--;
        }
        write--;
      }
      steps.push({
        description: `Merged: [${nums1.join(", ")}]`,
        array: nums1,
        highlights: [],
        variables: { result: `[${nums1.join(", ")}]` },
        headline: `[${nums1.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};
