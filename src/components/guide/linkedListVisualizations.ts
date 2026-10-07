import type { ApproachRunner, VizStep } from "./AlgoVisualizer";

type NumApproaches = Partial<Record<"brute" | "optimal", ApproachRunner>>;

export const reverseLinkedListApproaches: NumApproaches = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 copy every value into an array, then build a brand-new list in reverse order",
    code: [
      "const vals = [];",
      "for (let n = head; n; n = n.next) vals.push(n.val);",
      "vals.reverse();",
      "return buildList(vals); // a new list, not the original nodes",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const vals = [...input];
      steps.push({
        description: `Walk the list and copy every node's value: [${vals.join(" \u2192 ")}]`,
        array: input,
        highlights: input.map((_, idx) => ({ index: idx, role: "i" as const })),
        structure: { label: "copied values", entries: [...vals] },
        variables: {},
        headline: "Copy to array",
        tag: { label: "Copy", tone: "info" },
        codeLine: 2,
      });
      vals.reverse();
      steps.push({
        description: `Reverse the array: [${vals.join(" \u2192 ")}]`,
        array: input,
        highlights: [],
        structure: { label: "reversed array", entries: [...vals] },
        variables: {},
        headline: "Reverse array",
        tag: { label: "Reverse", tone: "info" },
        codeLine: 3,
      });
      steps.push({
        description: `Build a brand-new linked list from the reversed array \u2014 original nodes are discarded`,
        array: vals,
        highlights: vals.map((_, idx) => ({ index: idx, role: "match" as const })),
        structure: { label: "new list", entries: [...vals] },
        variables: {},
        headline: vals.join(" \u2192 "),
        tag: { label: "Done", tone: "success" },
        codeLine: 4,
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (In-Place Pointer Reversal)",
    complexity:
      "Time: O(n) \u00b7 Space: O(1) \u2014 re-point each node's next pointer backward as you walk, no new nodes",
    code: [
      "let prev = null, cur = head;",
      "while (cur) {",
      "  const next = cur.next;",
      "  cur.next = prev;",
      "  prev = cur; cur = next;",
      "}",
      "return prev; // new head",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const reversed: (string | number)[] = [];
      for (let i = 0; i < input.length; i++) {
        reversed.unshift(input[i]);
        steps.push({
          description: `Re-point node ${input[i]}'s next pointer to the previous node (or null). prev now ends at ${input[i]}`,
          array: input,
          highlights: [
            { index: i, role: "current" as const },
            ...(i > 0 ? [{ index: i - 1, role: "sorted" as const }] : []),
          ],
          structure: { label: "list so far (reversed)", entries: [...reversed] },
          variables: { cur: input[i] },
          headline: `prev = ${input[i]}`,
          tag: { label: "Re-point", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: `prev is the new head \u2014 the list is reversed in place: [${reversed.join(" \u2192 ")}]`,
        array: input,
        highlights: [],
        structure: { label: "reversed list", entries: [...reversed] },
        variables: {},
        headline: reversed.join(" \u2192 "),
        tag: { label: "Done", tone: "success" },
        codeLine: 7,
        done: true,
      });
      return steps;
    },
  },
};

export const linkedListCycleApproaches: NumApproaches = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 remember every node visited in a set; a repeat means a cycle",
    code: [
      "const seen = new Set();",
      "for (let n = head; n; n = n.next) {",
      "  if (seen.has(n)) return true;",
      "  seen.add(n);",
      "}",
      "return false;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const cycleStart = 2;
      const seen: number[] = [];
      const visitLimit = input.length + 3;
      for (let step = 0; step < visitLimit; step++) {
        const idx = step < input.length ? step : cycleStart + ((step - input.length) % (input.length - cycleStart));
        if (seen.includes(idx)) {
          steps.push({
            description: `Node at index ${idx} (value ${input[idx]}) was already visited \u2014 cycle detected!`,
            array: input,
            highlights: [{ index: idx, role: "match" }],
            structure: { label: "visited set", entries: [...seen] },
            variables: { result: true },
            headline: "Cycle found",
            tag: { label: "Cycle", tone: "danger" },
            done: true,
          });
          return steps;
        }
        seen.push(idx);
        steps.push({
          description: `Visit node at index ${idx} (value ${input[idx]}) \u2014 add it to the visited set`,
          array: input,
          highlights: [{ index: idx, role: "current" }],
          structure: { label: "visited set", entries: [...seen] },
          variables: {},
          headline: `visit(${input[idx]})`,
          tag: { label: "Visit", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: "Reached the end without revisiting any node \u2014 no cycle",
        array: input,
        highlights: [],
        structure: { label: "visited set", entries: [...seen] },
        variables: { result: false },
        headline: "No cycle",
        tag: { label: "No Cycle", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Floyd's Slow / Fast Pointers)",
    complexity:
      "Time: O(n) \u00b7 Space: O(1) \u2014 two pointers, one stepping 1 node and one stepping 2; they meet only if there's a cycle",
    code: [
      "let slow = head, fast = head;",
      "while (fast && fast.next) {",
      "  slow = slow.next;",
      "  fast = fast.next.next;",
      "  if (slow === fast) return true;",
      "}",
      "return false;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const cycleStart = 2;
      const n = input.length;
      const nextOf = (i: number) => (i + 1 < n ? i + 1 : cycleStart);
      let slow = 0;
      let fast = 0;
      for (let iter = 0; iter < n + 3; iter++) {
        slow = nextOf(slow);
        fast = nextOf(nextOf(fast));
        const met = slow === fast;
        steps.push({
          description: met
            ? `slow (value ${input[slow]}) meets fast (value ${input[fast]}) at the same node \u2014 there's a cycle!`
            : `slow moves to value ${input[slow]}, fast jumps to value ${input[fast]} \u2014 not the same node yet`,
          array: input,
          highlights: [
            { index: slow, role: met ? "match" : "i" },
            { index: fast, role: met ? "match" : "j" },
          ],
          variables: { slow: input[slow], fast: input[fast] },
          headline: met ? "slow == fast" : `${input[slow]} vs ${input[fast]}`,
          tag: met ? { label: "Cycle", tone: "danger" } : { label: "Chase", tone: "info" },
          codeLine: 5,
          done: met,
        });
        if (met) return steps;
      }
      steps.push({
        description: "fast reached the end without meeting slow \u2014 no cycle",
        array: input,
        highlights: [],
        variables: { result: false },
        headline: "No cycle",
        tag: { label: "No Cycle", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const mergeTwoSortedListsApproaches: NumApproaches = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O((m+n) log(m+n)) \u00b7 Space: O(m+n) \u2014 dump every value into one array and sort it",
    code: [
      "const all = [...valuesOf(l1), ...valuesOf(l2)];",
      "all.sort((a, b) => a - b);",
      "return buildList(all);",
    ],
    run: (): VizStep[] => {
      const steps: VizStep[] = [];
      const l1 = [1, 3, 5, 7];
      const l2 = [2, 4, 6];
      const combined = [...l1, ...l2];
      steps.push({
        description: `List A: [${l1.join(" \u2192 ")}], List B: [${l2.join(" \u2192 ")}]. Dump both into one array: [${combined.join(", ")}]`,
        array: combined,
        highlights: l1.map((_, idx) => ({ index: idx, role: "i" as const })),
        structure: { label: "list B", entries: [...l2] },
        variables: {},
        headline: "Combine",
        tag: { label: "Combine", tone: "info" },
        codeLine: 1,
      });
      const sorted = [...combined].sort((a, b) => a - b);
      steps.push({
        description: `Sort the combined array: [${sorted.join(", ")}]`,
        array: sorted,
        highlights: sorted.map((_, idx) => ({ index: idx, role: "sorted" as const })),
        variables: {},
        headline: "Sort",
        tag: { label: "Sort", tone: "info" },
        codeLine: 2,
      });
      steps.push({
        description: "Build a new linked list from the sorted array \u2014 original two lists are discarded",
        array: sorted,
        highlights: [],
        variables: {},
        headline: sorted.join(" \u2192 "),
        tag: { label: "Done", tone: "success" },
        codeLine: 3,
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Direct Pointer Merge)",
    complexity:
      "Time: O(m+n) \u00b7 Space: O(1) extra \u2014 walk both lists once, re-linking nodes directly, no sorting needed",
    code: [
      "let a = l1, b = l2, tail = dummy;",
      "while (a && b) {",
      "  if (a.val <= b.val) { tail.next = a; a = a.next; }",
      "  else { tail.next = b; b = b.next; }",
      "  tail = tail.next;",
      "}",
      "tail.next = a ?? b;",
    ],
    run: (): VizStep[] => {
      const steps: VizStep[] = [];
      const l1 = [1, 3, 5, 7];
      const l2 = [2, 4, 6];
      let i = 0;
      let j = 0;
      const merged: number[] = [];
      while (i < l1.length && j < l2.length) {
        if (l1[i] <= l2[j]) {
          merged.push(l1[i]);
          steps.push({
            description: `l1[${i}] (${l1[i]}) \u2264 l2[${j}] (${l2[j]}) \u2014 link l1's node next, advance i`,
            array: l1,
            highlights: [{ index: i, role: "match" }],
            structure: { label: "list B", entries: l2.slice(j) },
            variables: { merged: merged.join(",") },
            headline: `take ${l1[i]} from A`,
            tag: { label: "Link A", tone: "info" },
            codeLine: 3,
          });
          i++;
        } else {
          merged.push(l2[j]);
          steps.push({
            description: `l2[${j}] (${l2[j]}) < l1[${i}] (${l1[i]}) \u2014 link l2's node next, advance j`,
            array: l1.slice(i),
            highlights: [],
            structure: { label: "list B", entries: l2.slice(j) },
            variables: { merged: merged.join(",") },
            headline: `take ${l2[j]} from B`,
            tag: { label: "Link B", tone: "info" },
            codeLine: 4,
          });
          j++;
        }
      }
      const rest = i < l1.length ? l1.slice(i) : l2.slice(j);
      if (rest.length) {
        merged.push(...rest);
        steps.push({
          description: `One list is exhausted \u2014 link the remainder [${rest.join(", ")}] directly, no comparisons needed`,
          array: rest,
          highlights: rest.map((_, idx) => ({ index: idx, role: "sorted" as const })),
          variables: { merged: merged.join(",") },
          headline: "Attach remainder",
          tag: { label: "Attach", tone: "success" },
          codeLine: 7,
        });
      }
      steps.push({
        description: `Merged list (no sorting, single pass): [${merged.join(" \u2192 ")}]`,
        array: merged,
        highlights: merged.map((_, idx) => ({ index: idx, role: "match" as const })),
        variables: {},
        headline: merged.join(" \u2192 "),
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const removeNthFromEndApproaches: NumApproaches = {
  brute: {
    label: "Brute Force (Two-Pass)",
    complexity: "Time: O(n) \u00b7 Space: O(1) \u2014 count the length first, then walk again to the target node",
    code: [
      "let len = 0;",
      "for (let n = head; n; n = n.next) len++;",
      "const target = len - k;",
      "// second pass: walk to index target - 1, unlink target",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const k = 2;
      const len = input.length;
      steps.push({
        description: `First pass: count the list length \u2014 len = ${len}`,
        array: input,
        highlights: input.map((_, idx) => ({ index: idx, role: "i" as const })),
        variables: { len },
        headline: `len = ${len}`,
        tag: { label: "Pass 1", tone: "info" },
        codeLine: 2,
      });
      const targetIdx = len - k;
      steps.push({
        description: `Node to remove is at index len - k = ${len} - ${k} = ${targetIdx} (value ${input[targetIdx]})`,
        array: input,
        highlights: [{ index: targetIdx, role: "current" }],
        variables: { targetIdx },
        headline: `target index = ${targetIdx}`,
        tag: { label: "Locate", tone: "info" },
        codeLine: 3,
      });
      const result = input.filter((_, idx) => idx !== targetIdx);
      steps.push({
        description: `Second pass: walk to index ${targetIdx - 1} and unlink the target node. Result: [${result.join(" \u2192 ")}]`,
        array: result,
        highlights: result.map((_, idx) => ({ index: idx, role: "sorted" as const })),
        variables: {},
        headline: result.join(" \u2192 "),
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (One-Pass Two Pointers)",
    complexity:
      "Time: O(n) \u00b7 Space: O(1) \u2014 advance a lead pointer k steps first, then move both together until lead hits the end",
    code: [
      "let lead = head;",
      "for (let i = 0; i < k; i++) lead = lead.next;",
      "let trail = dummy, cur = head;",
      "while (lead) { lead = lead.next; trail = cur; cur = cur.next; }",
      "trail.next = cur.next; // unlink cur",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const k = 2;
      let lead = 0;
      for (let i = 0; i < k; i++) {
        lead++;
        steps.push({
          description: `Advance the lead pointer ${i + 1}/${k} step(s) ahead \u2014 lead is now ${k - i - 1 > 0 ? `${k - i - 1} step(s) from target` : "at the gap"}`,
          array: input,
          highlights: [{ index: Math.min(lead, input.length - 1), role: "j" }],
          variables: { lead },
          headline: `lead = ${lead}`,
          tag: { label: "Lead Ahead", tone: "info" },
          codeLine: 2,
        });
      }
      let trail = -1;
      let cur = 0;
      while (lead < input.length) {
        lead++;
        trail = cur;
        cur++;
        steps.push({
          description: `Move both pointers one step \u2014 trail now trails cur by ${k}, keeping a constant gap`,
          array: input,
          highlights: [
            { index: cur, role: "i" },
            { index: Math.min(lead, input.length - 1), role: "j" },
          ],
          variables: { trail, cur },
          headline: `cur = ${cur}, lead = ${lead}`,
          tag: { label: "Walk Together", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: `Lead fell off the end \u2014 cur (index ${cur}, value ${input[cur]}) is the node to remove. Unlink it in one pass, no length counting needed.`,
        array: input,
        highlights: [{ index: cur, role: "match" }],
        variables: { removeIndex: cur },
        headline: `remove(${input[cur]})`,
        tag: { label: "Remove", tone: "success" },
        codeLine: 5,
      });
      const result = input.filter((_, idx) => idx !== cur);
      steps.push({
        description: `Result: [${result.join(" \u2192 ")}]`,
        array: result,
        highlights: result.map((_, idx) => ({ index: idx, role: "sorted" as const })),
        variables: {},
        headline: result.join(" \u2192 "),
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const middleOfLinkedListApproaches: NumApproaches = {
  brute: {
    label: "Brute Force (Two-Pass)",
    complexity: "Time: O(n) \u00b7 Space: O(1) \u2014 count the length, then walk again to length / 2",
    code: [
      "let len = 0;",
      "for (let n = head; n; n = n.next) len++;",
      "let cur = head;",
      "for (let i = 0; i < Math.floor(len / 2); i++) cur = cur.next;",
      "return cur;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const len = input.length;
      steps.push({
        description: `First pass: count the list length \u2014 len = ${len}`,
        array: input,
        highlights: input.map((_, idx) => ({ index: idx, role: "i" as const })),
        variables: { len },
        headline: `len = ${len}`,
        tag: { label: "Pass 1", tone: "info" },
        codeLine: 2,
      });
      const mid = Math.floor(len / 2);
      for (let i = 0; i <= mid; i++) {
        steps.push({
          description: `Second pass: step ${i}/${mid} toward the middle`,
          array: input,
          highlights: [{ index: i, role: i === mid ? "match" : "current" }],
          variables: { i },
          headline: i === mid ? "Reached middle" : `step ${i}`,
          tag: i === mid ? { label: "Middle", tone: "success" } : { label: "Walk", tone: "info" },
          done: i === mid,
        });
      }
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Slow / Fast Pointers)",
    complexity:
      "Time: O(n) \u00b7 Space: O(1) \u2014 one pass: slow moves 1 step, fast moves 2; when fast hits the end, slow is at the middle",
    code: [
      "let slow = head, fast = head;",
      "while (fast && fast.next) {",
      "  slow = slow.next;",
      "  fast = fast.next.next;",
      "}",
      "return slow;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      let slow = 0;
      let fast = 0;
      while (fast < input.length - 1 && fast + 1 < input.length) {
        slow++;
        fast += 2;
        const fastClamped = Math.min(fast, input.length - 1);
        steps.push({
          description: `slow advances 1 \u2192 index ${slow}; fast advances 2 \u2192 index ${fastClamped}`,
          array: input,
          highlights: [
            { index: slow, role: "i" },
            { index: fastClamped, role: "j" },
          ],
          variables: { slow, fast: fastClamped },
          headline: `slow=${input[slow]}, fast=${input[fastClamped]}`,
          tag: { label: "Walk", tone: "info" },
        });
        if (fast >= input.length - 1) break;
      }
      steps.push({
        description: `fast reached the end in a single pass \u2014 slow is sitting at the middle node (value ${input[slow]})`,
        array: input,
        highlights: [{ index: slow, role: "match" }],
        variables: { middle: input[slow] },
        headline: `middle = ${input[slow]}`,
        tag: { label: "Middle", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const palindromeLinkedListApproaches: NumApproaches = {
  brute: {
    label: "Brute Force (Copy to Array)",
    complexity: "Time: O(n) \u00b7 Space: O(n) \u2014 copy every value out, then compare with two pointers",
    code: [
      "const vals = [];",
      "for (let n = head; n; n = n.next) vals.push(n.val);",
      "let i = 0, j = vals.length - 1;",
      "while (i < j) { if (vals[i] !== vals[j]) return false; i++; j--; }",
      "return true;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const vals = [...input];
      steps.push({
        description: `Copy every node's value into an array: [${vals.join(", ")}] \u2014 costs O(n) extra space`,
        array: vals,
        highlights: vals.map((_, idx) => ({ index: idx, role: "i" as const })),
        variables: {},
        headline: "Copy to array",
        tag: { label: "Copy", tone: "info" },
        codeLine: 2,
      });
      let i = 0;
      let j = vals.length - 1;
      while (i < j) {
        const match = vals[i] === vals[j];
        steps.push({
          description: `Compare vals[${i}] (${vals[i]}) with vals[${j}] (${vals[j]}) \u2014 ${match ? "equal" : "mismatch"}`,
          array: vals,
          highlights: [
            { index: i, role: match ? "match" : "current" },
            { index: j, role: match ? "match" : "current" },
          ],
          variables: { i, j },
          headline: `${vals[i]} vs ${vals[j]}`,
          tag: match ? { label: "Match", tone: "success" } : { label: "Mismatch", tone: "danger" },
          codeLine: 4,
          done: !match,
        });
        if (!match) return steps;
        i++;
        j--;
      }
      steps.push({
        description: "All pairs matched \u2014 the list is a palindrome",
        array: vals,
        highlights: [],
        variables: { result: true },
        headline: "Palindrome",
        tag: { label: "Palindrome", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Reverse Second Half In-Place)",
    complexity:
      "Time: O(n) \u00b7 Space: O(1) \u2014 find the middle, reverse the second half in place, compare halves, no copy needed",
    code: [
      "const mid = findMiddle(head); // slow/fast pointers",
      "let second = reverse(mid);",
      "let first = head;",
      "while (second) {",
      "  if (first.val !== second.val) return false;",
      "  first = first.next; second = second.next;",
      "}",
      "return true;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const n = input.length;
      const mid = Math.floor(n / 2);
      steps.push({
        description: `Find the middle using slow/fast pointers \u2014 middle is at index ${mid}`,
        array: input,
        highlights: [{ index: mid, role: "match" }],
        variables: { mid },
        headline: "Find middle",
        tag: { label: "Locate", tone: "info" },
        codeLine: 1,
      });
      const secondHalf = input.slice(mid).reverse();
      steps.push({
        description: `Reverse the second half in place: [${secondHalf.join(", ")}] \u2014 no extra array needed, just re-pointed links`,
        array: input,
        highlights: Array.from({ length: n - mid }, (_, idx) => ({ index: mid + idx, role: "sorted" as const })),
        structure: { label: "reversed second half", entries: [...secondHalf] },
        variables: {},
        headline: "Reverse 2nd half",
        tag: { label: "Reverse", tone: "info" },
        codeLine: 2,
      });
      const firstHalf = input.slice(0, secondHalf.length);
      let allMatch = true;
      for (let i = 0; i < Math.min(firstHalf.length, secondHalf.length); i++) {
        const match = firstHalf[i] === secondHalf[i];
        allMatch = allMatch && match;
        steps.push({
          description: `Compare first half [${i}] (${firstHalf[i]}) with reversed second half [${i}] (${secondHalf[i]}) \u2014 ${match ? "equal" : "mismatch"}`,
          array: input,
          highlights: [
            { index: i, role: match ? "match" : "current" },
            { index: mid + i, role: match ? "match" : "current" },
          ],
          structure: { label: "reversed second half", entries: [...secondHalf] },
          variables: { i },
          headline: `${firstHalf[i]} vs ${secondHalf[i]}`,
          tag: match ? { label: "Match", tone: "success" } : { label: "Mismatch", tone: "danger" },
          codeLine: 5,
          done: !match,
        });
        if (!match) return steps;
      }
      steps.push({
        description: allMatch
          ? "Every pair matched \u2014 the list is a palindrome, achieved with O(1) extra space"
          : "Mismatch found \u2014 not a palindrome",
        array: input,
        highlights: [],
        variables: { result: allMatch },
        headline: allMatch ? "Palindrome" : "Not a palindrome",
        tag: { label: allMatch ? "Palindrome" : "Not Palindrome", tone: allMatch ? "success" : "danger" },
        done: true,
      });
      return steps;
    },
  },
};
