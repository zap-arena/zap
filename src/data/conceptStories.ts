export interface ConceptStoryCard {
  step: 1 | 2 | 3 | 4;
  badge: string;
  tone: "danger" | "warning" | "accent" | "success";
  title: string;
  subtitle: string;
  story: string;
  stats?: { label: string; value: string; color?: string }[];
  visualType: "catastrophe" | "trap" | "epiphany" | "blueprint";
  codeSnippet?: {
    language: string;
    code: string;
    highlightLines?: number[];
  };
  keyTakeaway: string;
}

export interface ConceptStory {
  id: string;
  topicTitle: string;
  tagline: string;
  cards: [ConceptStoryCard, ConceptStoryCard, ConceptStoryCard, ConceptStoryCard];
}

export const CONCEPT_STORIES: Record<string, ConceptStory> = {
  "sliding-window": {
    id: "sliding-window",
    topicTitle: "Sliding Window Pattern",
    tagline: "Stop recomputing what already exists. Turn O(N · K) into smooth O(N).",
    cards: [
      {
        step: 1,
        badge: "01 · THE CATASTROPHE",
        tone: "danger",
        title: "The Stock Exchange Ticker Meltdown",
        subtitle: "High-frequency streaming data froze the production analytics dashboard",
        story:
          "During a record market open, NASDAQ servers blasted 500,000 stock tick updates per second. The client dashboard needed to show the maximum trading volume in any 1-minute window (k = 60 seconds). Because the server recalculated every window from scratch, CPU usage spiked to 100%, latency blew past 14 seconds, and traders were blinded during peak volatility.",
        stats: [
          { label: "Incoming Stream", value: "500,000 / sec", color: "#38bdf8" },
          { label: "CPU Load", value: "100% Spiking", color: "#f87171" },
          { label: "Trader Latency", value: "14.2s (Unacceptable)", color: "#fbbf24" },
        ],
        visualType: "catastrophe",
        keyTakeaway:
          "When data streams continuously, recalculating history on every incoming byte causes exponential server collapse.",
      },
      {
        step: 2,
        badge: "02 · THE NAIVE TRAP",
        tone: "warning",
        title: "The Re-Scan Loop Fallacy",
        subtitle: "Why intuition tricks smart developers into O(N · K) traps",
        story:
          "The instinct is simple: for every point in time i, run a nested loop backward or forward over the last k elements to calculate the sum. It works on 10 elements in local tests. But at scale with N = 100,000 and K = 1,000, your code does 100 MILLION repetitive additions, burning battery and choking servers with 99.9% redundant arithmetic.",
        stats: [
          { label: "Time Complexity", value: "O(N · K)", color: "#f87171" },
          { label: "Redundant Work", value: "99.9%", color: "#fbbf24" },
          { label: "Total Operations", value: "100,000,000+", color: "#ef4444" },
        ],
        visualType: "trap",
        codeSnippet: {
          language: "python",
          code: `# THE NAIVE TRAP: Re-adding everything from scratch!
def max_window_sum(nums, k):
    max_sum = float('-inf')
    for i in range(len(nums) - k + 1):
        current_sum = 0
        for j in range(i, i + k):  # ❌ REDUNDANT: adds same elements again and again!
            current_sum += nums[j]
        max_sum = max(max_sum, current_sum)
    return max_sum`,
          highlightLines: [6, 7],
        },
        keyTakeaway:
          "If your window only moves by 1 position, 99% of the elements inside it were already processed. Never throw that work away.",
      },
      {
        step: 3,
        badge: "03 · THE 'AHA!' EPIPHANY",
        tone: "accent",
        title: "The Sliding Window Trick",
        subtitle: "Two pointer arithmetic: subtract the departing, add the arriving",
        story:
          "Imagine a passenger train moving through a tunnel. When the train moves 1 meter forward, you don't count every passenger from scratch. You only watch the front door (+new passenger) and the rear door (-leaving passenger)! In code: WindowSum = WindowSum - nums[left] + nums[right]. That's an O(1) instantaneous update!",
        stats: [
          { label: "Time Per Step", value: "O(1) Instant", color: "#34d399" },
          { label: "Total Time", value: "O(N) Linear", color: "#38bdf8" },
          { label: "Memory Overhead", value: "O(1) Constant", color: "#a78bfa" },
        ],
        visualType: "epiphany",
        keyTakeaway:
          "Window_Sum(next) = Window_Sum(current) - Left_Exiting + Right_Entering. Total time drops from seconds to milliseconds.",
      },
      {
        step: 4,
        badge: "04 · THE BLUEPRINT FORMULA",
        tone: "success",
        title: "The Master Sliding Window Template",
        subtitle: "The 8-line pattern that solves 90% of all window problems",
        story:
          "Whether solving fixed-size windows (maximum sum, average) or dynamic variable-size windows (longest substring without repeating characters, minimum window substring), memorize this exact mental state machine:",
        stats: [
          { label: "Pattern Versatility", value: "Covers 90% Problems", color: "#34d399" },
          { label: "Space Complexity", value: "O(1) or O(Alphabet)", color: "#38bdf8" },
        ],
        visualType: "blueprint",
        codeSnippet: {
          language: "python",
          code: `# THE MASTER BLUEPRINT: Dynamic Sliding Window
def sliding_window_blueprint(s):
    window_state = {}
    left = 0
    best_result = 0

    for right in range(len(s)):
        # 1. Expand window by including s[right]
        add_to_window(window_state, s[right])

        # 2. Shrink from left while constraint is violated
        while window_is_invalid(window_state):
            remove_from_window(window_state, s[left])
            left += 1

        # 3. Update answer with valid window
        best_result = max(best_result, right - left + 1)

    return best_result`,
          highlightLines: [8, 12, 16],
        },
        keyTakeaway:
          "Expand with right pointer to find viable states; shrink with left pointer to restore constraints or minimize size.",
      },
    ],
  },
  "two-pointer": {
    id: "two-pointer",
    topicTitle: "Two Pointers Technique",
    tagline: "Squeeze the search space from both ends. Never do an O(N²) nested scan on sorted data.",
    cards: [
      {
        step: 1,
        badge: "01 · THE CATASTROPHE",
        tone: "danger",
        title: "Autonomous Vehicle LiDAR Blindspot",
        subtitle: "Finding target obstacle distances in high-density point clouds",
        story:
          "An autonomous drone's proximity radar receives 80,000 spatial depth points. To plan flight corridors, it needs to find pairs of objects whose distance exactly equals the safety clearance corridor. An O(N²) brute force pair comparison takes 6.4 billion checks, causing 4-second flight controller lag. At 50 km/h, a 4-second delay means a collision before the math even finishes.",
        stats: [
          { label: "Points to Process", value: "80,000", color: "#38bdf8" },
          { label: "Brute Force Checks", value: "6.4 Billion", color: "#f87171" },
          { label: "Collision Risk", value: "Critical", color: "#ef4444" },
        ],
        visualType: "catastrophe",
        keyTakeaway:
          "Checking all pairs in a list without leveraging order scales quadratically, making real-time systems unviable.",
      },
      {
        step: 2,
        badge: "02 · THE NAIVE TRAP",
        tone: "warning",
        title: "The Double For-Loop Crutch",
        subtitle: "Checking every pair (i, j) ignores the sorting information",
        story:
          "When presented with 'find two numbers that sum to target', almost everyone writes two nested loops: for i in range(n) and for j in range(i+1, n). Even if the array is already sorted, this naive code tests pairs that are mathematically impossible to match, burning CPU cycles on guaranteed dead ends.",
        stats: [
          { label: "Checks Performed", value: "N · (N-1) / 2", color: "#f87171" },
          { label: "Wasted Comparisons", value: "99.8%", color: "#fbbf24" },
        ],
        visualType: "trap",
        codeSnippet: {
          language: "python",
          code: `# THE TRAP: Testing every pair blindly
def two_sum_naive(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):  # ❌ Quadratic search
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
          highlightLines: [3],
        },
        keyTakeaway:
          "If the data is sorted, testing all pairs is mathematically wasteful because magnitude guarantees which direction to move.",
      },
      {
        step: 3,
        badge: "03 · THE 'AHA!' EPIPHANY",
        tone: "accent",
        title: "The Inward Squeeze Elimination",
        subtitle: "One comparison eliminates an entire row or column of possibilities",
        story:
          "Place one pointer at the start (left = 0) and one at the end (right = n-1). Check sum = nums[left] + nums[right]. If the sum is TOO BIG, incrementing left will only make it bigger—so `right` CANNOT possibly pair with anything else! Decrement right (eliminating all pairs with `right`). If TOO SMALL, increment left. In one single comparison, you discard half an entire search space!",
        stats: [
          { label: "Elimination Speed", value: "1 Element / Step", color: "#34d399" },
          { label: "Total Steps", value: "At most N", color: "#38bdf8" },
        ],
        visualType: "epiphany",
        keyTakeaway:
          "Sum too small? Advance left to increase. Sum too big? Decrement right to decrease. You zero in on the target in O(N).",
      },
      {
        step: 4,
        badge: "04 · THE BLUEPRINT FORMULA",
        tone: "success",
        title: "The Inward Squeeze Blueprint",
        subtitle: "The standard template for Two Sum II, 3Sum, Container With Most Water",
        story:
          "Every two-pointer opposite-ends problem follows this exact binary-decision loop:",
        stats: [
          { label: "Time Complexity", value: "O(N) (or O(N log N) if sorting)", color: "#34d399" },
          { label: "Space Complexity", value: "O(1) Auxiliary", color: "#38bdf8" },
        ],
        visualType: "blueprint",
        codeSnippet: {
          language: "python",
          code: `# THE TWO-POINTER BLUEPRINT
def two_pointer_squeeze(sorted_nums, target):
    left = 0
    right = len(sorted_nums) - 1

    while left < right:
        curr_sum = sorted_nums[left] + sorted_nums[right]
        if curr_sum == target:
            return [left, right]       # ✅ Found!
        elif curr_sum < target:
            left += 1                   # ⬆️ Need a larger sum
        else:
            right -= 1                  # ⬇️ Need a smaller sum

    return []`,
          highlightLines: [9, 11, 13],
        },
        keyTakeaway:
          "With sorted arrays, the monotonic property lets two pointers pinch inward in guaranteed linear time.",
      },
    ],
  },
  "hashing": {
    id: "hashing",
    topicTitle: "Hash Maps & Frequency Counting",
    tagline: "Trade memory for time. Turn expensive linear scans into instantaneous O(1) lookups.",
    cards: [
      {
        step: 1,
        badge: "01 · THE CATASTROPHE",
        tone: "danger",
        title: "E-Commerce Black Friday Checkout Freeze",
        subtitle: "Checking duplicate inventory coupons took down the payment gateway",
        story:
          "A major retail platform launched a flash sale with 1,000,000 cart checkout requests per minute. Each cart checked whether a customer was reusing any of 50,000 active discount codes. The legacy backend looped through an array of coupons for every request. With 50,000 comparisons per cart, the database timed out, carts failed, and $4.2M in sales vanished in 18 minutes.",
        stats: [
          { label: "Checkout Requests", value: "1,000,000 / min", color: "#38bdf8" },
          { label: "Array Scans", value: "50,000 per cart", color: "#f87171" },
          { label: "Revenue Lost", value: "$4.2 Million", color: "#ef4444" },
        ],
        visualType: "catastrophe",
        keyTakeaway:
          "Searching inside an unsorted list is an O(N) operation. Repeated millions of times, it is an infrastructure death sentence.",
      },
      {
        step: 2,
        badge: "02 · THE NAIVE TRAP",
        tone: "warning",
        title: "The 'Linear Scan' Habit",
        subtitle: "Calling `item in list` inside a loop creates hidden quadratic complexity",
        story:
          "In high-level languages like Python or JavaScript, syntax is so clean that developers forget cost: `if coupon in coupon_list:` looks like a 1-line check, but behind the scenes the computer checks every single index one by one! If you do that inside another loop, you've secretly written an O(N²) quadratic disaster without noticing.",
        stats: [
          { label: "Lookup Cost", value: "O(N) Hidden", color: "#f87171" },
          { label: "Nested Cost", value: "O(N²)", color: "#fbbf24" },
        ],
        visualType: "trap",
        codeSnippet: {
          language: "python",
          code: `# THE HIDDEN TRAP: 'item in list' is an O(N) scan!
def find_duplicates(items):
    seen = []  # ❌ List, NOT a set!
    for item in items:
        if item in seen:  # ⚠️ This scan takes O(len(seen)) every time!
            return True
        seen.append(item)
    return False`,
          highlightLines: [4],
        },
        keyTakeaway:
          "Syntax hides complexity. A simple 'in list' operation scans linearly. Always ask: what is the cost of my lookup?",
      },
      {
        step: 3,
        badge: "03 · THE 'AHA!' EPIPHANY",
        tone: "accent",
        title: "The Hash Function Shortcut",
        subtitle: "Direct memory addressing: calculate the address, don't search",
        story:
          "Instead of walking down 50,000 aisles in a warehouse, what if you had a magic formula that immediately converts any coupon code into its exact shelf coordinate? That's a Hash Function! It computes hash('DISCOUNT50') % bucket_count = slot 421. You go directly to slot 421 in O(1) time—whether there are 10 items or 10,000,000 items!",
        stats: [
          { label: "Lookup Speed", value: "O(1) Constant", color: "#34d399" },
          { label: "Scale Invariance", value: "Instant at any N", color: "#38bdf8" },
        ],
        visualType: "epiphany",
        keyTakeaway:
          "Hashing calculates memory locations directly using math. You skip searching entirely.",
      },
      {
        step: 4,
        badge: "04 · THE BLUEPRINT FORMULA",
        tone: "success",
        title: "The Complement Lookup Blueprint",
        subtitle: "The Two Sum & Subarray Sum Equals K Foundation",
        story:
          "Whenever a problem asks 'Does a matching partner exist for this element?', invert the question into: 'Did I already store what I need to complete this element?'",
        stats: [
          { label: "Time Complexity", value: "O(N) Single Pass", color: "#34d399" },
          { label: "Space Complexity", value: "O(N) Hash Table", color: "#38bdf8" },
        ],
        visualType: "blueprint",
        codeSnippet: {
          language: "python",
          code: `# THE HASH MAP COMPLEMENT BLUEPRINT
def two_sum_hash(nums, target):
    seen = {}  # value -> index map

    for i, num in enumerate(nums):
        complement = target - num
        # O(1) instantaneous lookup!
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

    return []`,
          highlightLines: [5, 7],
        },
        keyTakeaway:
          "Trade O(N) memory to buy instant O(1) answers. Check for the complement before storing the current element.",
      },
    ],
  },
};
