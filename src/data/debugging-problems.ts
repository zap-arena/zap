export interface DebuggingTestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  hidden?: boolean;
  explanation?: string;
}

export interface DebuggingProblem {
  id: string;
  slug: string;
  title: string;
  topic: string;
  difficulty: "Medium" | "Hard" | "Expert";
  points: number;
  tags: string[];
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  incidentReport: {
    severity: "Critical" | "High" | "Medium";
    reportedBy: string;
    environment: string;
    symptoms: string;
    errorType: string;
  };
  hints: string[];
  languages: ("python" | "cpp" | "java")[];
  buggyCode: Record<string, string>;
  solutionCode: Record<string, string>;
  testCases: DebuggingTestCase[];
}

export const DEBUGGING_TOPICS = [
  "All Topics",
  "Graphs & Networks",
  "Dynamic Programming",
  "Advanced Data Structures",
  "Binary Search & Pointers",
  "Segment Trees & Ranges",
  "String Algorithms",
  "Greedy & Scheduling",
  "Trees & Recursion",
] as const;

export const DEBUGGING_PROBLEMS: DebuggingProblem[] = [
  {
    id: "dbg-tarjan-bridge",
    slug: "critical-network-links",
    title: "Critical Network Links (Tarjan's Bridge)",
    topic: "Graphs & Networks",
    difficulty: "Hard",
    points: 150,
    tags: ["Graphs", "DFS", "Tarjan", "Bridge Finding", "Connected Components"],
    description: `### Background
In a mission-critical distributed sensor grid, servers communicate through bidirectional point-to-point fiber optic channels. A **critical link** (bridge) is a communication cable whose failure would partition the network into two or more disconnected components.

The platform engineering team implemented an optimized single-pass Depth-First Search algorithm using Tarjan's Bridge Finding logic. However, during failover resilience tests, certain resilient networks were falsely flagged as containing critical single points of failure, causing unnecessary traffic re-routing and alarm storms.

### Task
You are given an undirected graph with \`n\` nodes numbered from \`0\` to \`n - 1\` and a list of bidirectional connections \`connections\` where \`connections[i] = [u, v]\`.
Return all critical links sorted in lexicographical order (i.e., for each edge \`[u, v]\`, ensure \`u < v\`, and sort the list of edges).

Diagnose the bug in the provided DFS implementation, fix the classification logic, and pass all system tests.`,
    inputFormat: "First line: integer n (number of nodes). Second line: integer m (number of edges). Next m lines: two space-separated integers u and v denoting a bidirectional edge.",
    outputFormat: "Each critical connection [u, v] (with u < v) printed on a new line, sorted lexicographically by u, then v. If no bridges exist, print 'NONE'.",
    constraints: `2 <= n <= 10^5
1 <= connections.length <= 10^5
0 <= u, v < n and u != v
There are no duplicate edges or self loops.`,
    incidentReport: {
      severity: "Critical",
      reportedBy: "Network Reliability Engineering",
      environment: "Cluster Mesh Router v3.2",
      symptoms: "Graph with 3-node cycles is incorrectly reporting back-edges as critical bridges. Redundant paths are mistakenly thought to be broken single points of failure.",
      errorType: "Logical Condition Flaw / Inverted Relation",
    },
    hints: [
      "Check the discovery time comparison between node v and child to.",
      "A connection (v, to) is a bridge if and only if the lowest reachable discovery time from the subtree rooted at 'to' is strictly greater than the entry discovery time of 'v' (low[to] > tin[v]).",
      "Look closely at the condition: is it using '>=' instead of '>'?",
    ],
    languages: ["python", "cpp", "java"],
    buggyCode: {
      python: `import sys

def find_critical_links(n: int, connections: list[list[int]]) -> list[list[int]]:
    adj = [[] for _ in range(n)]
    for u, v in connections:
        adj[u].append(v)
        adj[v].append(u)

    tin = [-1] * n
    low = [-1] * n
    timer = 0
    bridges = []

    def dfs(v: int, p: int = -1):
        nonlocal timer
        tin[v] = low[v] = timer
        timer += 1

        for to in adj[v]:
            if to == p:
                continue
            if tin[to] != -1:
                # Visited node, update low[v] with back-edge
                low[v] = min(low[v], tin[to])
            else:
                dfs(to, v)
                low[v] = min(low[v], low[to])
                # BUG IN THE LINE BELOW:
                # Should be strictly greater (low[to] > tin[v]), but uses '>=':
                if low[to] >= tin[v]:
                    bridges.append([min(v, to), max(v, to)])

    for i in range(n):
        if tin[i] == -1:
            dfs(i)

    bridges.sort()
    return bridges

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    m = int(input_data[1])
    edges = []
    idx = 2
    for _ in range(m):
        u = int(input_data[idx])
        v = int(input_data[idx + 1])
        edges.append([u, v])
        idx += 2

    res = find_critical_links(n, edges)
    if not res:
        print("NONE")
    else:
        for u, v in res:
            print(f"{u} {v}")

if __name__ == '__main__':
    main()`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int timer_count = 0;
vector<vector<int>> adj;
vector<int> tin, low;
vector<pair<int, int>> bridges;

void dfs(int v, int p = -1) {
    tin[v] = low[v] = timer_count++;
    for (int to : adj[v]) {
        if (to == p) continue;
        if (tin[to] != -1) {
            low[v] = min(low[v], tin[to]);
        } else {
            dfs(to, v);
            low[v] = min(low[v], low[to]);
            // BUG: should be low[to] > tin[v], not >=
            if (low[to] >= tin[v]) {
                bridges.push_back({min(v, to), max(v, to)});
            }
        }
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, m;
    if (!(cin >> n >> m)) return 0;
    adj.assign(n, vector<int>());
    tin.assign(n, -1);
    low.assign(n, -1);
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    for (int i = 0; i < n; ++i) {
        if (tin[i] == -1) dfs(i);
    }
    sort(bridges.begin(), bridges.end());
    if (bridges.empty()) {
        cout << "NONE\\n";
    } else {
        for (auto& edge : bridges) {
            cout << edge.first << " " << edge.second << "\\n";
        }
    }
    return 0;
}`,
      java: `import java.io.*;
import java.util.*;

public class Main {
    static int timer = 0;
    static List<List<Integer>> adj;
    static int[] tin, low;
    static List<int[]> bridges = new ArrayList<>();

    static void dfs(int v, int p) {
        tin[v] = low[v] = timer++;
        for (int to : adj.get(v)) {
            if (to == p) continue;
            if (tin[to] != -1) {
                low[v] = Math.min(low[v], tin[to]);
            } else {
                dfs(to, v);
                low[v] = Math.min(low[v], low[to]);
                // BUG: Uses >= instead of > (low[to] >= tin[v])
                if (low[to] >= tin[v]) {
                    bridges.add(new int[]{Math.min(v, to), Math.max(v, to)});
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int m = sc.nextInt();
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt();
            int v = sc.nextInt();
            adj.get(u).add(v);
            adj.get(v).add(u);
        }
        tin = new int[n];
        low = new int[n];
        Arrays.fill(tin, -1);
        Arrays.fill(low, -1);

        for (int i = 0; i < n; i++) {
            if (tin[i] == -1) dfs(i, -1);
        }

        bridges.sort((a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));
        if (bridges.isEmpty()) {
            System.out.println("NONE");
        } else {
            for (int[] b : bridges) {
                System.out.println(b[0] + " " + b[1]);
            }
        }
    }
}`,
    },
    solutionCode: {
      python: `import sys

def find_critical_links(n: int, connections: list[list[int]]) -> list[list[int]]:
    adj = [[] for _ in range(n)]
    for u, v in connections:
        adj[u].append(v)
        adj[v].append(u)

    tin = [-1] * n
    low = [-1] * n
    timer = 0
    bridges = []

    def dfs(v: int, p: int = -1):
        nonlocal timer
        tin[v] = low[v] = timer
        timer += 1

        for to in adj[v]:
            if to == p:
                continue
            if tin[to] != -1:
                low[v] = min(low[v], tin[to])
            else:
                dfs(to, v)
                low[v] = min(low[v], low[to])
                if low[to] > tin[v]:
                    bridges.append([min(v, to), max(v, to)])

    for i in range(n):
        if tin[i] == -1:
            dfs(i)

    bridges.sort()
    return bridges

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    m = int(input_data[1])
    edges = []
    idx = 2
    for _ in range(m):
        u = int(input_data[idx])
        v = int(input_data[idx + 1])
        edges.append([u, v])
        idx += 2

    res = find_critical_links(n, edges)
    if not res:
        print("NONE")
    else:
        for u, v in res:
            print(f"{u} {v}")

if __name__ == '__main__':
    main()`,
      java: `import java.io.*;
import java.util.*;

public class Main {
    static int timer = 0;
    static List<List<Integer>> adj;
    static int[] tin, low;
    static List<int[]> bridges = new ArrayList<>();

    static void dfs(int v, int p) {
        tin[v] = low[v] = timer++;
        for (int to : adj.get(v)) {
            if (to == p) continue;
            if (tin[to] != -1) {
                low[v] = Math.min(low[v], tin[to]);
            } else {
                dfs(to, v);
                low[v] = Math.min(low[v], low[to]);
                // FIXED: Strictly greater condition low[to] > tin[v]
                if (low[to] > tin[v]) {
                    bridges.add(new int[]{Math.min(v, to), Math.max(v, to)});
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int m = sc.nextInt();
        adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int i = 0; i < m; i++) {
            int u = sc.nextInt();
            int v = sc.nextInt();
            adj.get(u).add(v);
            adj.get(v).add(u);
        }
        tin = new int[n];
        low = new int[n];
        Arrays.fill(tin, -1);
        Arrays.fill(low, -1);

        for (int i = 0; i < n; i++) {
            if (tin[i] == -1) dfs(i, -1);
        }

        bridges.sort((a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));
        if (bridges.isEmpty()) {
            System.out.println("NONE");
        } else {
            for (int[] b : bridges) {
                System.out.println(b[0] + " " + b[1]);
            }
        }
    }
}`,
    },
    testCases: [
      {
        id: "tc-1",
        name: "Cycle Graph with One Bridge",
        input: "4 4\n0 1\n1 2\n2 0\n1 3",
        expectedOutput: "1 3",
        explanation: "Nodes 0, 1, 2 form a triangle cycle (no bridges). Node 3 is connected only to node 1 via edge (1, 3). Edge (1, 3) is the only bridge.",
      },
      {
        id: "tc-2",
        name: "Simple Pure Cycle (No Bridges)",
        input: "4 4\n0 1\n1 2\n2 3\n3 0",
        expectedOutput: "NONE",
        explanation: "All nodes form a simple 4-cycle. No single edge removal disconnects the graph.",
      },
      {
        id: "tc-3",
        name: "Linear Chain (All Bridges)",
        input: "4 3\n0 1\n1 2\n2 3",
        expectedOutput: "0 1\n1 2\n2 3",
        explanation: "In a straight line tree, every edge is a critical bridge.",
      },
      {
        id: "tc-4",
        name: "Two Triangles Sharing a Bridge",
        input: "6 7\n0 1\n1 2\n2 0\n2 3\n3 4\n4 5\n5 3",
        expectedOutput: "2 3",
        hidden: true,
      },
    ],
  },
  {
    id: "dbg-lru-cache",
    slug: "lru-cache-ttl-eviction",
    title: "High-Throughput LRU Cache with Eviction",
    topic: "Advanced Data Structures",
    difficulty: "Hard",
    points: 175,
    tags: ["Data Structures", "Linked List", "Hash Map", "Memory Management", "LRU"],
    description: `### Background
An in-memory caching engine utilizes an LRU (Least Recently Used) policy to store key-value pairs with a strict capacity constraint. When capacity is exceeded, the least recently accessed element must be evicted in O(1) time.

A doubly-linked list maintains node recency: the head represents the most recently accessed item, and the tail represents the least recently used item.

### The Bug in Production
During load testing, developers noticed that when an existing key is updated or evicted, the doubly linked list occasionally forms a cycle or retains stale pointers, causing infinite loops during traversal and retaining evicted nodes.

### Task
Analyze the \`LRUCache\` implementation.
Fix the node detachment and splicing operations so that all \`get\` and \`put\` operations execute in true O(1) time with correct recency order.`,
    inputFormat: "First line: integer capacity and integer Q (number of queries). Next Q lines: operations formatted as 'put key val' or 'get key'.",
    outputFormat: "For each 'get key' operation, print the retrieved value (or -1 if missing) on a new line.",
    constraints: `1 <= capacity <= 3000
1 <= key <= 10^4
0 <= value <= 10^5
Up to 5 * 10^4 queries.`,
    incidentReport: {
      severity: "High",
      reportedBy: "Core Infrastructure Team",
      environment: "Redis-compatible microservice node",
      symptoms: "Stale pointer dereference and wrong eviction victim. When updating an existing key's value, it was inserted twice into the hash map or detached improperly.",
      errorType: "Pointer / Node Mutation Desynchronization",
    },
    hints: [
      "When a node is updated or removed from the middle of the doubly linked list, make sure BOTH node.prev.next and node.next.prev are properly linked together.",
      "Check the remove_node function: does it safely bypass the node without unhooking other neighbors?",
      "In put(), when key already exists, ensure the node's value is updated and moved to the head without incrementing current size.",
    ],
    languages: ["python", "cpp", "java"],
    buggyCode: {
      python: `import sys

class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head = Node() # Dummy head
        self.tail = Node() # Dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head

    def _add_to_head(self, node: Node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def _remove_node(self, node: Node):
        # BUG: The linkage here is broken
        # Notice node.next.prev is assigned, but node.prev.next is pointing to node itself!
        prev_node = node.prev
        next_node = node.next
        next_node.prev = prev_node
        # BUG: prev_node.next is NOT updated to next_node!
        # It remains pointing to node!
        prev_node.next = node 

    def _move_to_head(self, node: Node):
        self._remove_node(node)
        self._add_to_head(node)

    def _pop_tail(self) -> Node:
        res = self.tail.prev
        self._remove_node(res)
        return res

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._move_to_head(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._move_to_head(node)
        else:
            new_node = Node(key, value)
            self.cache[key] = new_node
            self._add_to_head(new_node)
            if len(self.cache) > self.capacity:
                tail = self._pop_tail()
                del self.cache[tail.key]

def main():
    lines = sys.stdin.read().split()
    if not lines:
        return
    cap = int(lines[0])
    q = int(lines[1])
    lru = LRUCache(cap)
    idx = 2
    for _ in range(q):
        op = lines[idx]
        if op == "put":
            k = int(lines[idx+1])
            v = int(lines[idx+2])
            lru.put(k, v)
            idx += 3
        elif op == "get":
            k = int(lines[idx+1])
            print(lru.get(k))
            idx += 2

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    static class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }

    static class LRUCache {
        int capacity;
        Map<Integer, Node> map = new HashMap<>();
        Node head = new Node(0, 0);
        Node tail = new Node(0, 0);

        LRUCache(int cap) {
            this.capacity = cap;
            head.next = tail;
            tail.prev = head;
        }

        void addToHead(Node node) {
            node.prev = head;
            node.next = head.next;
            head.next.prev = node;
            head.next = node;
        }

        void removeNode(Node node) {
            Node prevNode = node.prev;
            Node nextNode = node.next;
            nextNode.prev = prevNode;
            // BUG: prevNode.next is assigned back to node instead of nextNode!
            prevNode.next = node;
        }

        void moveToHead(Node node) {
            removeNode(node);
            addToHead(node);
        }

        int get(int key) {
            if (!map.containsKey(key)) return -1;
            Node node = map.get(key);
            moveToHead(node);
            return node.val;
        }

        void put(int key, int value) {
            if (map.containsKey(key)) {
                Node node = map.get(key);
                node.val = value;
                moveToHead(node);
            } else {
                Node newNode = new Node(key, value);
                map.put(key, newNode);
                addToHead(newNode);
                if (map.size() > capacity) {
                    Node lru = tail.prev;
                    removeNode(lru);
                    map.remove(lru.key);
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int cap = sc.nextInt();
        int q = sc.nextInt();
        LRUCache cache = new LRUCache(cap);
        while (q-- > 0 && sc.hasNext()) {
            String op = sc.next();
            if (op.equals("put")) {
                int k = sc.nextInt();
                int v = sc.nextInt();
                cache.put(k, v);
            } else if (op.equals("get")) {
                int k = sc.nextInt();
                System.out.println(cache.get(k));
            }
        }
    }
}`,
      cpp: `#include <iostream>
#include <unordered_map>
#include <string>

using namespace std;

struct Node {
    int key, val;
    Node* prev;
    Node* next;
    Node(int k = 0, int v = 0) : key(k), val(v), prev(nullptr), next(nullptr) {}
};

class LRUCache {
    int capacity;
    unordered_map<int, Node*> cache;
    Node* head;
    Node* tail;

    void add_to_head(Node* node) {
        node->prev = head;
        node->next = head->next;
        head->next->prev = node;
        head->next = node;
    }

    void remove_node(Node* node) {
        Node* prev_node = node->prev;
        Node* next_node = node->next;
        next_node->prev = prev_node;
        // BUG: prev_node->next is assigned back to node instead of next_node!
        prev_node->next = node;
    }

    void move_to_head(Node* node) {
        remove_node(node);
        add_to_head(node);
    }

    Node* pop_tail() {
        Node* res = tail->prev;
        remove_node(res);
        return res;
    }

public:
    LRUCache(int cap) : capacity(cap) {
        head = new Node();
        tail = new Node();
        head->next = tail;
        tail->prev = head;
    }

    int get(int key) {
        if (cache.find(key) == cache.end()) return -1;
        Node* node = cache[key];
        move_to_head(node);
        return node->val;
    }

    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            Node* node = cache[key];
            node->val = value;
            move_to_head(node);
        } else {
            Node* new_node = new Node(key, value);
            cache[key] = new_node;
            add_to_head(new_node);
            if ((int)cache.size() > capacity) {
                Node* lru = pop_tail();
                cache.erase(lru->key);
                delete lru;
            }
        }
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int cap, q;
    if (!(cin >> cap >> q)) return 0;
    LRUCache lru(cap);
    for (int i = 0; i < q; ++i) {
        string op;
        cin >> op;
        if (op == "put") {
            int k, v;
            cin >> k >> v;
            lru.put(k, v);
        } else if (op == "get") {
            int k;
            cin >> k;
            cout << lru.get(k) << "\n";
        }
    }
    return 0;
}`,
    },
    solutionCode: {
      python: `import sys

class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _add_to_head(self, node: Node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def _remove_node(self, node: Node):
        prev_node = node.prev
        next_node = node.next
        prev_node.next = next_node
        next_node.prev = prev_node

    def _move_to_head(self, node: Node):
        self._remove_node(node)
        self._add_to_head(node)

    def _pop_tail(self) -> Node:
        res = self.tail.prev
        self._remove_node(res)
        return res

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._move_to_head(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._move_to_head(node)
        else:
            new_node = Node(key, value)
            self.cache[key] = new_node
            self._add_to_head(new_node)
            if len(self.cache) > self.capacity:
                tail = self._pop_tail()
                del self.cache[tail.key]

def main():
    lines = sys.stdin.read().split()
    if not lines:
        return
    cap = int(lines[0])
    q = int(lines[1])
    lru = LRUCache(cap)
    idx = 2
    for _ in range(q):
        op = lines[idx]
        if op == "put":
            k = int(lines[idx+1])
            v = int(lines[idx+2])
            lru.put(k, v)
            idx += 3
        elif op == "get":
            k = int(lines[idx+1])
            print(lru.get(k))
            idx += 2

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    static class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }

    static class LRUCache {
        int capacity;
        Map<Integer, Node> map = new HashMap<>();
        Node head = new Node(0, 0);
        Node tail = new Node(0, 0);

        LRUCache(int cap) {
            this.capacity = cap;
            head.next = tail;
            tail.prev = head;
        }

        void addToHead(Node node) {
            node.prev = head;
            node.next = head.next;
            head.next.prev = node;
            head.next = node;
        }

        void removeNode(Node node) {
            Node prevNode = node.prev;
            Node nextNode = node.next;
            // FIXED: Proper bidirectional link
            prevNode.next = nextNode;
            nextNode.prev = prevNode;
        }

        void moveToHead(Node node) {
            removeNode(node);
            addToHead(node);
        }

        int get(int key) {
            if (!map.containsKey(key)) return -1;
            Node node = map.get(key);
            moveToHead(node);
            return node.val;
        }

        void put(int key, int value) {
            if (map.containsKey(key)) {
                Node node = map.get(key);
                node.val = value;
                moveToHead(node);
            } else {
                Node newNode = new Node(key, value);
                map.put(key, newNode);
                addToHead(newNode);
                if (map.size() > capacity) {
                    Node lru = tail.prev;
                    removeNode(lru);
                    map.remove(lru.key);
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int cap = sc.nextInt();
        int q = sc.nextInt();
        LRUCache cache = new LRUCache(cap);
        while (q-- > 0 && sc.hasNext()) {
            String op = sc.next();
            if (op.equals("put")) {
                int k = sc.nextInt();
                int v = sc.nextInt();
                cache.put(k, v);
            } else if (op.equals("get")) {
                int k = sc.nextInt();
                System.out.println(cache.get(k));
            }
        }
    }
}`,
      cpp: `#include <iostream>
#include <unordered_map>
#include <string>

using namespace std;

struct Node {
    int key, val;
    Node* prev;
    Node* next;
    Node(int k = 0, int v = 0) : key(k), val(v), prev(nullptr), next(nullptr) {}
};

class LRUCache {
    int capacity;
    unordered_map<int, Node*> cache;
    Node* head;
    Node* tail;

    void add_to_head(Node* node) {
        node->prev = head;
        node->next = head->next;
        head->next->prev = node;
        head->next = node;
    }

    void remove_node(Node* node) {
        Node* prev_node = node->prev;
        Node* next_node = node->next;
        // FIXED: Proper double linked list disconnection
        prev_node->next = next_node;
        next_node->prev = prev_node;
    }

    void move_to_head(Node* node) {
        remove_node(node);
        add_to_head(node);
    }

    Node* pop_tail() {
        Node* res = tail->prev;
        remove_node(res);
        return res;
    }

public:
    LRUCache(int cap) : capacity(cap) {
        head = new Node();
        tail = new Node();
        head->next = tail;
        tail->prev = head;
    }

    int get(int key) {
        if (cache.find(key) == cache.end()) return -1;
        Node* node = cache[key];
        move_to_head(node);
        return node->val;
    }

    void put(int key, int value) {
        if (cache.find(key) != cache.end()) {
            Node* node = cache[key];
            node->val = value;
            move_to_head(node);
        } else {
            Node* new_node = new Node(key, value);
            cache[key] = new_node;
            add_to_head(new_node);
            if ((int)cache.size() > capacity) {
                Node* lru = pop_tail();
                cache.erase(lru->key);
                delete lru;
            }
        }
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int cap, q;
    if (!(cin >> cap >> q)) return 0;
    LRUCache lru(cap);
    for (int i = 0; i < q; ++i) {
        string op;
        cin >> op;
        if (op == "put") {
            int k, v;
            cin >> k >> v;
            lru.put(k, v);
        } else if (op == "get") {
            int k;
            cin >> k;
            cout << lru.get(k) << "\n";
        }
    }
    return 0;
}`,
    },
    testCases: [
      {
        id: "tc-lru-1",
        name: "Standard Eviction Order",
        input: "2 6\nput 1 10\nput 2 20\nget 1\nput 3 30\nget 2\nget 3",
        expectedOutput: "10\n-1\n30",
        explanation: "Capacity is 2. After accessing 1, key 2 is the LRU item and gets evicted when key 3 is added. Hence get(2) returns -1.",
      },
      {
        id: "tc-lru-2",
        name: "Overwriting Existing Key",
        input: "2 5\nput 1 10\nput 1 50\nget 1\nput 2 20\nget 2",
        expectedOutput: "50\n20",
        explanation: "Overwriting key 1 does not increase size or cause unintended evictions.",
      },
      {
        id: "tc-lru-3",
        name: "Capacity 1 Edge Case",
        input: "1 4\nput 1 1\nget 1\nput 2 2\nget 1",
        expectedOutput: "1\n-1",
        hidden: true,
      },
    ],
  },
  {
    id: "dbg-lazy-seg-tree",
    slug: "segment-tree-lazy-propagation",
    title: "Range Sum Query with Lazy Propagation",
    topic: "Segment Trees & Ranges",
    difficulty: "Hard",
    points: 180,
    tags: ["Segment Tree", "Range Queries", "Lazy Propagation", "Data Structures"],
    description: `### Background
A telemetry analytics pipeline computes running range sums over millions of sensor intervals. To support both \`update(l, r, val)\` (add \`val\` to every element from index \`l\` to \`r\`) and \`query(l, r)\` (calculate \`sum(A[l..r])\`) in \`O(log N)\` time, an engineer implemented a Segment Tree with Lazy Propagation.

### The Problem
During QA validation, single-point queries worked fine, but wide range updates followed by range sum queries produced grossly underestimated totals.

### Task
Inspect the \`push\` and \`update\` functions of the Segment Tree.
Find the mistake in how pending lazy updates are multiplied by interval lengths and applied to children. Fix the calculation so all range sum queries are exact.`,
    inputFormat: "First line: n and q. Second line: n space-separated integers representing initial array elements. Next q lines: '1 l r val' (range update) or '2 l r' (range sum query) using 0-based indices.",
    outputFormat: "For each query type 2, output the sum on a new line.",
    constraints: `1 <= n, q <= 10^5
0 <= l <= r < n
-10^4 <= val, A[i] <= 10^4`,
    incidentReport: {
      severity: "High",
      reportedBy: "Analytics QA Lead",
      environment: "Data Lake Query Service",
      symptoms: "Range sum results are off by orders of magnitude after lazy propagation. The lazy value is assigned directly to child sum without multiplying by segment width.",
      errorType: "Mathematical Scaling / Lazy Tag Push Error",
    },
    hints: [
      "When pushing a lazy value down to a child node covering range [start, end], how much does the child's sum increase?",
      "The sum increases by lazy[node] * (child_length), where child_length = (end - start + 1).",
      "Check the push() function: does it just do tree[2*node] += lazy[node], or tree[2*node] += lazy[node] * len?",
    ],
    languages: ["python", "cpp", "java"],
    buggyCode: {
      python: `import sys

class LazySegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self.build(0, 0, self.n - 1, arr)

    def build(self, node, l, r, arr):
        if l == r:
            self.tree[node] = arr[l]
            return
        mid = (l + r) // 2
        self.build(2 * node + 1, l, mid, arr)
        self.build(2 * node + 2, mid + 1, r, arr)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def push(self, node, l, r):
        if self.lazy[node] != 0:
            mid = (l + r) // 2
            val = self.lazy[node]
            left_child = 2 * node + 1
            right_child = 2 * node + 2

            # BUG: The child tree sums should be incremented by val * segment_length!
            # Here it only adds val without multiplying by the segment size:
            self.tree[left_child] += val
            self.lazy[left_child] += val

            self.tree[right_child] += val
            self.lazy[right_child] += val

            self.lazy[node] = 0

    def update(self, node, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            self.tree[node] += val * (r - l + 1)
            self.lazy[node] += val
            return
        self.push(node, l, r)
        mid = (l + r) // 2
        if ql <= mid:
            self.update(2 * node + 1, l, mid, ql, qr, val)
        if qr > mid:
            self.update(2 * node + 2, mid + 1, r, ql, qr, val)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def query(self, node, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.tree[node]
        self.push(node, l, r)
        mid = (l + r) // 2
        total = 0
        if ql <= mid:
            total += self.query(2 * node + 1, l, mid, ql, qr)
        if qr > mid:
            total += self.query(2 * node + 2, mid + 1, r, ql, qr)
        return total

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    q = int(input_data[1])
    arr = [int(x) for x in input_data[2:2+n]]
    st = LazySegmentTree(arr)
    idx = 2 + n
    for _ in range(q):
        t = int(input_data[idx])
        if t == 1:
            l = int(input_data[idx+1])
            r = int(input_data[idx+2])
            val = int(input_data[idx+3])
            st.update(0, 0, n - 1, l, r, val)
            idx += 4
        else:
            l = int(input_data[idx+1])
            r = int(input_data[idx+2])
            print(st.query(0, 0, n - 1, l, r))
            idx += 3

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    static class LazySegmentTree {
        int n;
        long[] tree, lazy;

        LazySegmentTree(int[] arr) {
            this.n = arr.length;
            tree = new long[4 * n];
            lazy = new long[4 * n];
            build(0, 0, n - 1, arr);
        }

        void build(int node, int l, int r, int[] arr) {
            if (l == r) {
                tree[node] = arr[l];
                return;
            }
            int mid = (l + r) / 2;
            build(2 * node + 1, l, mid, arr);
            build(2 * node + 2, mid + 1, r, arr);
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }

        void push(int node, int l, int r) {
            if (lazy[node] != 0) {
                int mid = (l + r) / 2;
                long val = lazy[node];
                int left = 2 * node + 1;
                int right = 2 * node + 2;

                // BUG: Directly adds val without scaling by child range lengths!
                tree[left] += val;
                lazy[left] += val;

                tree[right] += val;
                lazy[right] += val;

                lazy[node] = 0;
            }
        }

        void update(int node, int l, int r, int ql, int qr, long val) {
            if (ql <= l && r <= qr) {
                tree[node] += val * (r - l + 1);
                lazy[node] += val;
                return;
            }
            push(node, l, r);
            int mid = (l + r) / 2;
            if (ql <= mid) update(2 * node + 1, l, mid, ql, qr, val);
            if (qr > mid) update(2 * node + 2, mid + 1, r, ql, qr, val);
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }

        long query(int node, int l, int r, int ql, int qr) {
            if (ql <= l && r <= qr) return tree[node];
            push(node, l, r);
            int mid = (l + r) / 2;
            long total = 0;
            if (ql <= mid) total += query(2 * node + 1, l, mid, ql, qr);
            if (qr > mid) total += query(2 * node + 2, mid + 1, r, ql, qr);
            return total;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int q = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        LazySegmentTree st = new LazySegmentTree(arr);
        while (q-- > 0) {
            int type = sc.nextInt();
            if (type == 1) {
                int l = sc.nextInt();
                int r = sc.nextInt();
                long val = sc.nextLong();
                st.update(0, 0, n - 1, l, r, val);
            } else {
                int l = sc.nextInt();
                int r = sc.nextInt();
                System.out.println(st.query(0, 0, n - 1, l, r));
            }
        }
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class LazySegmentTree {
    int n;
    vector<long long> tree, lazy;

    void build(int node, int l, int r, const vector<long long>& arr) {
        if (l == r) {
            tree[node] = arr[l];
            return;
        }
        int mid = (l + r) / 2;
        build(2 * node + 1, l, mid, arr);
        build(2 * node + 2, mid + 1, r, arr);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    void push(int node, int l, int r) {
        if (lazy[node] != 0) {
            int mid = (l + r) / 2;
            long long val = lazy[node];
            int left_child = 2 * node + 1;
            int right_child = 2 * node + 2;

            // BUG: Child tree sums must be incremented by val * segment_length!
            // Here it only adds val without multiplying by the segment size:
            tree[left_child] += val;
            lazy[left_child] += val;

            tree[right_child] += val;
            lazy[right_child] += val;

            lazy[node] = 0;
        }
    }

public:
    LazySegmentTree(const vector<long long>& arr) {
        n = arr.size();
        tree.assign(4 * n, 0);
        lazy.assign(4 * n, 0);
        build(0, 0, n - 1, arr);
    }

    void update(int node, int l, int r, int ql, int qr, long long val) {
        if (ql <= l && r <= qr) {
            tree[node] += val * (r - l + 1);
            lazy[node] += val;
            return;
        }
        push(node, l, r);
        int mid = (l + r) / 2;
        if (ql <= mid) update(2 * node + 1, l, mid, ql, qr, val);
        if (qr > mid) update(2 * node + 2, mid + 1, r, ql, qr, val);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    long long query(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        push(node, l, r);
        int mid = (l + r) / 2;
        long long total = 0;
        if (ql <= mid) total += query(2 * node + 1, l, mid, ql, qr);
        if (qr > mid) total += query(2 * node + 2, mid + 1, r, ql, qr);
        return total;
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> arr(n);
    for (int i = 0; i < n; ++i) cin >> arr[i];
    LazySegmentTree seg(arr);
    for (int i = 0; i < q; ++i) {
        int type;
        cin >> type;
        if (type == 1) {
            int l, r;
            long long val;
            cin >> l >> r >> val;
            seg.update(0, 0, n - 1, l, r, val);
        } else {
            int l, r;
            cin >> l >> r;
            cout << seg.query(0, 0, n - 1, l, r) << "\n";
        }
    }
    return 0;
}`,
    },
    solutionCode: {
      python: `import sys

class LazySegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self.build(0, 0, self.n - 1, arr)

    def build(self, node, l, r, arr):
        if l == r:
            self.tree[node] = arr[l]
            return
        mid = (l + r) // 2
        self.build(2 * node + 1, l, mid, arr)
        self.build(2 * node + 2, mid + 1, r, arr)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def push(self, node, l, r):
        if self.lazy[node] != 0:
            mid = (l + r) // 2
            val = self.lazy[node]
            left_child = 2 * node + 1
            right_child = 2 * node + 2

            left_len = mid - l + 1
            right_len = r - mid

            self.tree[left_child] += val * left_len
            self.lazy[left_child] += val

            self.tree[right_child] += val * right_len
            self.lazy[right_child] += val

            self.lazy[node] = 0

    def update(self, node, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            self.tree[node] += val * (r - l + 1)
            self.lazy[node] += val
            return
        self.push(node, l, r)
        mid = (l + r) // 2
        if ql <= mid:
            self.update(2 * node + 1, l, mid, ql, qr, val)
        if qr > mid:
            self.update(2 * node + 2, mid + 1, r, ql, qr, val)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def query(self, node, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.tree[node]
        self.push(node, l, r)
        mid = (l + r) // 2
        total = 0
        if ql <= mid:
            total += self.query(2 * node + 1, l, mid, ql, qr)
        if qr > mid:
            total += self.query(2 * node + 2, mid + 1, r, ql, qr)
        return total

def main():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    q = int(input_data[1])
    arr = [int(x) for x in input_data[2:2+n]]
    st = LazySegmentTree(arr)
    idx = 2 + n
    for _ in range(q):
        t = int(input_data[idx])
        if t == 1:
            l = int(input_data[idx+1])
            r = int(input_data[idx+2])
            val = int(input_data[idx+3])
            st.update(0, 0, n - 1, l, r, val)
            idx += 4
        else:
            l = int(input_data[idx+1])
            r = int(input_data[idx+2])
            print(st.query(0, 0, n - 1, l, r))
            idx += 3

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    static class LazySegmentTree {
        int n;
        long[] tree, lazy;

        LazySegmentTree(int[] arr) {
            this.n = arr.length;
            tree = new long[4 * n];
            lazy = new long[4 * n];
            build(0, 0, n - 1, arr);
        }

        void build(int node, int l, int r, int[] arr) {
            if (l == r) {
                tree[node] = arr[l];
                return;
            }
            int mid = (l + r) / 2;
            build(2 * node + 1, l, mid, arr);
            build(2 * node + 2, mid + 1, r, arr);
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }

        void push(int node, int l, int r) {
            if (lazy[node] != 0) {
                int mid = (l + r) / 2;
                long val = lazy[node];
                int left = 2 * node + 1;
                int right = 2 * node + 2;

                int leftLen = mid - l + 1;
                int rightLen = r - mid;

                // FIXED: multiply by child range lengths
                tree[left] += val * leftLen;
                lazy[left] += val;

                tree[right] += val * rightLen;
                lazy[right] += val;

                lazy[node] = 0;
            }
        }

        void update(int node, int l, int r, int ql, int qr, long val) {
            if (ql <= l && r <= qr) {
                tree[node] += val * (r - l + 1);
                lazy[node] += val;
                return;
            }
            push(node, l, r);
            int mid = (l + r) / 2;
            if (ql <= mid) update(2 * node + 1, l, mid, ql, qr, val);
            if (qr > mid) update(2 * node + 2, mid + 1, r, ql, qr, val);
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
        }

        long query(int node, int l, int r, int ql, int qr) {
            if (ql <= l && r <= qr) return tree[node];
            push(node, l, r);
            int mid = (l + r) / 2;
            long total = 0;
            if (ql <= mid) total += query(2 * node + 1, l, mid, ql, qr);
            if (qr > mid) total += query(2 * node + 2, mid + 1, r, ql, qr);
            return total;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int q = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        LazySegmentTree st = new LazySegmentTree(arr);
        while (q-- > 0) {
            int type = sc.nextInt();
            if (type == 1) {
                int l = sc.nextInt();
                int r = sc.nextInt();
                long val = sc.nextLong();
                st.update(0, 0, n - 1, l, r, val);
            } else {
                int l = sc.nextInt();
                int r = sc.nextInt();
                System.out.println(st.query(0, 0, n - 1, l, r));
            }
        }
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class LazySegmentTree {
    int n;
    vector<long long> tree, lazy;

    void build(int node, int l, int r, const vector<long long>& arr) {
        if (l == r) {
            tree[node] = arr[l];
            return;
        }
        int mid = (l + r) / 2;
        build(2 * node + 1, l, mid, arr);
        build(2 * node + 2, mid + 1, r, arr);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    void push(int node, int l, int r) {
        if (lazy[node] != 0) {
            int mid = (l + r) / 2;
            long long val = lazy[node];
            int left_child = 2 * node + 1;
            int right_child = 2 * node + 2;

            // FIXED: Multiply lazy addition by the segment length
            tree[left_child] += val * (mid - l + 1);
            lazy[left_child] += val;

            tree[right_child] += val * (r - mid);
            lazy[right_child] += val;

            lazy[node] = 0;
        }
    }

public:
    LazySegmentTree(const vector<long long>& arr) {
        n = arr.size();
        tree.assign(4 * n, 0);
        lazy.assign(4 * n, 0);
        build(0, 0, n - 1, arr);
    }

    void update(int node, int l, int r, int ql, int qr, long long val) {
        if (ql <= l && r <= qr) {
            tree[node] += val * (r - l + 1);
            lazy[node] += val;
            return;
        }
        push(node, l, r);
        int mid = (l + r) / 2;
        if (ql <= mid) update(2 * node + 1, l, mid, ql, qr, val);
        if (qr > mid) update(2 * node + 2, mid + 1, r, ql, qr, val);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }

    long long query(int node, int l, int r, int ql, int qr) {
        if (ql <= l && r <= qr) return tree[node];
        push(node, l, r);
        int mid = (l + r) / 2;
        long long total = 0;
        if (ql <= mid) total += query(2 * node + 1, l, mid, ql, qr);
        if (qr > mid) total += query(2 * node + 2, mid + 1, r, ql, qr);
        return total;
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n, q;
    if (!(cin >> n >> q)) return 0;
    vector<long long> arr(n);
    for (int i = 0; i < n; ++i) cin >> arr[i];
    LazySegmentTree seg(arr);
    for (int i = 0; i < q; ++i) {
        int type;
        cin >> type;
        if (type == 1) {
            int l, r;
            long long val;
            cin >> l >> r >> val;
            seg.update(0, 0, n - 1, l, r, val);
        } else {
            int l, r;
            cin >> l >> r;
            cout << seg.query(0, 0, n - 1, l, r) << "\n";
        }
    }
    return 0;
}`,
    },
    testCases: [
      {
        id: "tc-seg-1",
        name: "Range Update & Range Query",
        input: "5 3\n1 2 3 4 5\n1 0 2 2\n2 0 4\n2 1 3",
        expectedOutput: "21\n13",
        explanation: "Initial arr: [1,2,3,4,5]. Update range [0, 2] by +2 -> [3,4,5,4,5]. Sum(0..4) = 21. Sum(1..3) = 4+5+4 = 13.",
      },
      {
        id: "tc-seg-2",
        name: "Overlapping Partial Ranges",
        input: "4 3\n0 0 0 0\n1 0 3 5\n1 1 2 3\n2 0 3",
        expectedOutput: "26",
        explanation: "All 4 elements become 5, then middle 2 get +3. Total is 5 + 8 + 8 + 5 = 26.",
      },
      {
        id: "tc-seg-3",
        name: "Single Element Query",
        input: "3 2\n10 20 30\n1 0 2 5\n2 1 1",
        expectedOutput: "25",
        hidden: true,
      },
    ],
  },
  {
    id: "dbg-rabin-karp",
    slug: "rolling-hash-rabin-karp",
    title: "Rolling Hash Pattern Matcher (Rabin-Karp)",
    topic: "String Algorithms",
    difficulty: "Medium",
    points: 125,
    tags: ["Strings", "Hashing", "Rabin-Karp", "Modulo Arithmetic"],
    description: `### Background
A fast log-indexing service utilizes the Rabin-Karp polynomial rolling hash algorithm to locate all starting indices of a search pattern \`P\` within a document text \`T\`.

### The Problem
When running tests on strings with distinct character alphabets, negative hash values occasionally occur. Because Python and C++ handle negative modulo operations differently (or cause negative hashes before modulo), false positive matches and negative index computations occur, failing match assertions.

### Task
Analyze the hash rolling window logic in \`rabin_karp\`.
Ensure the prefix rolling subtraction properly preserves positive modular invariants \`((hash - old_val) % MOD + MOD) % MOD\`.
Print all 0-based start indices in ascending order, or 'NOT FOUND'.`,
    inputFormat: "First line: text string T. Second line: pattern string P.",
    outputFormat: "Space-separated 0-based indices where pattern P occurs in T. If not found, output 'NOT FOUND'.",
    constraints: `1 <= len(P) <= len(T) <= 2 * 10^5
Text and pattern contain lowercase English letters.`,
    incidentReport: {
      severity: "Medium",
      reportedBy: "Search Engine Team",
      environment: "Log Parser Worker",
      symptoms: "Underflow during rolling subtraction creates negative hash values, leading to missed pattern occurrences or bogus collisions.",
      errorType: "Modulo Arithmetic Underflow",
    },
    hints: [
      "In modular arithmetic: (A - B) % M can be negative if A < B.",
      "Always add MOD before taking the modulo: ((A - B) % MOD + MOD) % MOD.",
      "Check the window roll step: does it add MOD before computing hash % MOD?",
    ],
    languages: ["python", "cpp", "java"],
    buggyCode: {
      python: `import sys

def rabin_karp(text: str, pattern: str) -> list[int]:
    n = len(text)
    m = len(pattern)
    if m > n:
        return []

    BASE = 257
    MOD = 10**9 + 7

    pat_hash = 0
    cur_hash = 0
    power = 1

    for i in range(m - 1):
        power = (power * BASE) % MOD

    for i in range(m):
        pat_hash = (pat_hash * BASE + ord(pattern[i])) % MOD
        cur_hash = (cur_hash * BASE + ord(text[i])) % MOD

    matches = []
    for i in range(n - m + 1):
        if cur_hash == pat_hash:
            # Double check to prevent hash collision
            if text[i:i+m] == pattern:
                matches.append(i)

        if i < n - m:
            # BUG: rolling subtraction can produce a negative result!
            # It misses adding MOD, so cur_hash becomes negative!
            remove_val = (ord(text[i]) * power) % MOD
            cur_hash = ((cur_hash - remove_val) * BASE + ord(text[i + m])) % MOD
            # cur_hash can be negative in standard Python/C++ logic without (+ MOD) % MOD!

    return matches

def main():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    text = lines[0].strip()
    pattern = lines[1].strip() if len(lines) > 1 else ""

    res = rabin_karp(text, pattern)
    if not res:
        print("NOT FOUND")
    else:
        print(*(res))

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    static List<Integer> rabinKarp(String text, String pattern) {
        int n = text.length();
        int m = pattern.length();
        List<Integer> matches = new ArrayList<>();
        if (m > n) return matches;

        long BASE = 257;
        long MOD = 1_000_000_007L;

        long patHash = 0;
        long curHash = 0;
        long power = 1;

        for (int i = 0; i < m - 1; i++) {
            power = (power * BASE) % MOD;
        }

        for (int i = 0; i < m; i++) {
            patHash = (patHash * BASE + pattern.charAt(i)) % MOD;
            curHash = (curHash * BASE + text.charAt(i)) % MOD;
        }

        for (int i = 0; i <= n - m; i++) {
            if (curHash == patHash) {
                if (text.substring(i, i + m).equals(pattern)) {
                    matches.add(i);
                }
            }

            if (i < n - m) {
                long removeVal = (text.charAt(i) * power) % MOD;
                // BUG: Negative modulo underflow in Java without adding MOD!
                curHash = ((curHash - removeVal) * BASE + text.charAt(i + m)) % MOD;
            }
        }
        return matches;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String text = sc.nextLine().trim();
        if (!sc.hasNextLine()) return;
        String pattern = sc.nextLine().trim();
        List<Integer> matches = rabinKarp(text, pattern);
        if (matches.isEmpty()) {
            System.out.println("NOT FOUND");
        } else {
            for (int i = 0; i < matches.size(); i++) {
                System.out.print(matches.get(i) + (i == matches.size() - 1 ? "" : " "));
            }
            System.out.println();
        }
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

vector<int> rabin_karp(const string& text, const string& pattern) {
    int n = text.size();
    int m = pattern.size();
    if (m > n) return {};

    const long long BASE = 257;
    const long long MOD = 1000000007;

    long long pat_hash = 0;
    long long cur_hash = 0;
    long long power = 1;

    for (int i = 0; i < m - 1; ++i) {
        power = (power * BASE) % MOD;
    }

    for (int i = 0; i < m; ++i) {
        pat_hash = (pat_hash * BASE + (unsigned char)pattern[i]) % MOD;
        cur_hash = (cur_hash * BASE + (unsigned char)text[i]) % MOD;
    }

    vector<int> matches;
    for (int i = 0; i <= n - m; ++i) {
        if (cur_hash == pat_hash) {
            if (text.substr(i, m) == pattern) {
                matches.push_back(i);
            }
        }
        if (i < n - m) {
            // BUG: rolling subtraction without (+ MOD) can yield negative modulo!
            long long remove_val = ((unsigned char)text[i] * power) % MOD;
            cur_hash = ((cur_hash - remove_val) * BASE + (unsigned char)text[i + m]) % MOD;
        }
    }
    return matches;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string text, pattern;
    if (!getline(cin, text)) return 0;
    if (!getline(cin, pattern)) return 0;
    vector<int> res = rabin_karp(text, pattern);
    if (res.empty()) {
        cout << "NOT FOUND\n";
    } else {
        for (int i = 0; i < (int)res.size(); ++i) {
            cout << res[i] << (i + 1 == (int)res.size() ? "" : " ");
        }
        cout << "\n";
    }
    return 0;
}`,
    },
    solutionCode: {
      python: `import sys

def rabin_karp(text: str, pattern: str) -> list[int]:
    n = len(text)
    m = len(pattern)
    if m > n:
        return []

    BASE = 257
    MOD = 10**9 + 7

    pat_hash = 0
    cur_hash = 0
    power = 1

    for i in range(m - 1):
        power = (power * BASE) % MOD

    for i in range(m):
        pat_hash = (pat_hash * BASE + ord(pattern[i])) % MOD
        cur_hash = (cur_hash * BASE + ord(text[i])) % MOD

    matches = []
    for i in range(n - m + 1):
        if cur_hash == pat_hash:
            if text[i:i+m] == pattern:
                matches.append(i)

        if i < n - m:
            remove_val = (ord(text[i]) * power) % MOD
            cur_hash = (((cur_hash - remove_val) % MOD + MOD) * BASE + ord(text[i + m])) % MOD

    return matches

def main():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    text = lines[0].strip()
    pattern = lines[1].strip() if len(lines) > 1 else ""

    res = rabin_karp(text, pattern)
    if not res:
        print("NOT FOUND")
    else:
        print(*(res))

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    static List<Integer> rabinKarp(String text, String pattern) {
        int n = text.length();
        int m = pattern.length();
        List<Integer> matches = new ArrayList<>();
        if (m > n) return matches;

        long BASE = 257;
        long MOD = 1_000_000_007L;

        long patHash = 0;
        long curHash = 0;
        long power = 1;

        for (int i = 0; i < m - 1; i++) {
            power = (power * BASE) % MOD;
        }

        for (int i = 0; i < m; i++) {
            patHash = (patHash * BASE + pattern.charAt(i)) % MOD;
            curHash = (curHash * BASE + text.charAt(i)) % MOD;
        }

        for (int i = 0; i <= n - m; i++) {
            if (curHash == patHash) {
                if (text.substring(i, i + m).equals(pattern)) {
                    matches.add(i);
                }
            }

            if (i < n - m) {
                long removeVal = (text.charAt(i) * power) % MOD;
                // FIXED: Guarantee positive modular result with (+ MOD) % MOD
                curHash = (((curHash - removeVal) % MOD + MOD) * BASE + text.charAt(i + m)) % MOD;
            }
        }
        return matches;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String text = sc.nextLine().trim();
        if (!sc.hasNextLine()) return;
        String pattern = sc.nextLine().trim();
        List<Integer> matches = rabinKarp(text, pattern);
        if (matches.isEmpty()) {
            System.out.println("NOT FOUND");
        } else {
            for (int i = 0; i < matches.size(); i++) {
                System.out.print(matches.get(i) + (i == matches.size() - 1 ? "" : " "));
            }
            System.out.println();
        }
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <vector>

using namespace std;

vector<int> rabin_karp(const string& text, const string& pattern) {
    int n = text.size();
    int m = pattern.size();
    if (m > n) return {};

    const long long BASE = 257;
    const long long MOD = 1000000007;

    long long pat_hash = 0;
    long long cur_hash = 0;
    long long power = 1;

    for (int i = 0; i < m - 1; ++i) {
        power = (power * BASE) % MOD;
    }

    for (int i = 0; i < m; ++i) {
        pat_hash = (pat_hash * BASE + (unsigned char)pattern[i]) % MOD;
        cur_hash = (cur_hash * BASE + (unsigned char)text[i]) % MOD;
    }

    vector<int> matches;
    for (int i = 0; i <= n - m; ++i) {
        if (cur_hash == pat_hash) {
            if (text.substr(i, m) == pattern) {
                matches.push_back(i);
            }
        }
        if (i < n - m) {
            // FIXED: Ensure positive modulo with ((diff % MOD) + MOD) % MOD
            long long remove_val = ((unsigned char)text[i] * power) % MOD;
            cur_hash = (((cur_hash - remove_val) % MOD + MOD) % MOD * BASE + (unsigned char)text[i + m]) % MOD;
        }
    }
    return matches;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string text, pattern;
    if (!getline(cin, text)) return 0;
    if (!getline(cin, pattern)) return 0;
    vector<int> res = rabin_karp(text, pattern);
    if (res.empty()) {
        cout << "NOT FOUND\n";
    } else {
        for (int i = 0; i < (int)res.size(); ++i) {
            cout << res[i] << (i + 1 == (int)res.size() ? "" : " ");
        }
        cout << "\n";
    }
    return 0;
}`,
    },
    testCases: [
      {
        id: "tc-rk-1",
        name: "Repeated Substrings",
        input: "abracadabra\nabra",
        expectedOutput: "0 7",
        explanation: "'abra' occurs at index 0 ('abracadabra') and index 7 ('abracadabra').",
      },
      {
        id: "tc-rk-2",
        name: "Pattern not present",
        input: "mississippi\nsun",
        expectedOutput: "NOT FOUND",
      },
      {
        id: "tc-rk-3",
        name: "Single Character Overlap",
        input: "aaaaa\naa",
        expectedOutput: "0 1 2 3",
        hidden: true,
      },
    ],
  },
  {
    id: "dbg-task-scheduler",
    slug: "task-scheduler-cooldown",
    title: "Task Scheduler with Priority Cooldown",
    topic: "Greedy & Scheduling",
    difficulty: "Medium",
    points: 130,
    tags: ["Greedy", "Heap", "Intervals", "Queue", "Math"],
    description: `### Background
A distributed batch compute cluster executes CPU-bound tasks represented by uppercase characters (e.g., 'A', 'B', 'C'). Due to hardware thermal constraints, the same task type cannot be executed within \`k\` cooling intervals of each other. During cooling intervals, the CPU can either run another task or remain idle.

### The Bug
The current function uses a formula-based greedy calculation to find the minimum number of CPU intervals required. However, when multiple distinct tasks tie for the maximum frequency, the idle slot calculation fails to properly subtract the secondary tasks with equal max frequency, causing the scheduler to allocate unnecessary idle slots.

### Task
Fix the idle slot and maximum frequency count calculation in \`least_intervals\`.`,
    inputFormat: "First line: space-separated characters representing task names. Second line: integer k (the cooldown parameter).",
    outputFormat: "Single integer: the minimum total CPU intervals needed.",
    constraints: `1 <= tasks.length <= 10^5
tasks[i] is an uppercase English letter.
0 <= k <= 100`,
    incidentReport: {
      severity: "Medium",
      reportedBy: "Compute Operations",
      environment: "Batch Worker Scheduler",
      symptoms: "Under high load with multiple tasks sharing top frequency, the CPU execution plan generates superfluous IDLE periods, degrading throughput.",
      errorType: "Greedy Math Formula Boundary Oversight",
    },
    hints: [
      "Count how many tasks share the maximum frequency (max_freq_count).",
      "The number of chunk groups is (max_freq - 1). Each chunk has room for k idle slots.",
      "Empty slots = (max_freq - 1) * (k - (max_freq_count - 1)). If empty slots < 0, idle slots is 0.",
      "Check if max_freq_count was considered in the formula.",
    ],
    languages: ["python", "cpp", "java"],
    buggyCode: {
      python: `import sys
from collections import Counter

def least_intervals(tasks: list[str], k: int) -> int:
    if k == 0:
        return len(tasks)

    counts = Counter(tasks)
    max_freq = max(counts.values())

    # BUG: Fails to count how many tasks share the max_freq!
    # It assumes only 1 task has max_freq:
    max_freq_count = 1  # <-- BUG HERE! Should count all tasks with count == max_freq

    part_count = max_freq - 1
    part_length = k - (max_freq_count - 1)
    empty_slots = part_count * part_length
    available_tasks = len(tasks) - (max_freq * max_freq_count)
    idles = max(0, empty_slots - available_tasks)

    return len(tasks) + idles

def main():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    tasks = lines[0].split()
    k = int(lines[1]) if len(lines) > 1 else 0
    print(least_intervals(tasks, k))

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    public static int leastInterval(char[] tasks, int k) {
        if (k == 0) return tasks.length;
        int[] counts = new int[26];
        int maxFreq = 0;
        for (char c : tasks) {
            counts[c - 'A']++;
            maxFreq = Math.max(maxFreq, counts[c - 'A']);
        }

        // BUG: Hardcoded to 1 instead of counting ties with frequency == maxFreq!
        int maxFreqCount = 1;

        int partCount = maxFreq - 1;
        int partLength = k - (maxFreqCount - 1);
        int emptySlots = partCount * partLength;
        int availableTasks = tasks.length - (maxFreq * maxFreqCount);
        int idles = Math.max(0, emptySlots - availableTasks);

        return tasks.length + idles;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String line = sc.nextLine().trim();
        if (line.isEmpty()) return;
        String[] parts = line.split("\\\\s+");
        char[] tasks = new char[parts.length];
        for (int i = 0; i < parts.length; i++) tasks[i] = parts[i].charAt(0);
        int k = sc.hasNextInt() ? sc.nextInt() : 0;
        System.out.println(leastInterval(tasks, k));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

using namespace std;

int least_intervals(const vector<string>& tasks, int k) {
    if (k == 0) return tasks.size();

    unordered_map<string, int> counts;
    int max_freq = 0;
    for (const auto& t : tasks) {
        counts[t]++;
        max_freq = max(max_freq, counts[t]);
    }

    // BUG: Fails to count tasks sharing max_freq, assuming only 1 task has max_freq
    int max_freq_count = 1;

    int part_count = max_freq - 1;
    int part_length = k - (max_freq_count - 1);
    int empty_slots = part_count * part_length;
    int available_tasks = (int)tasks.size() - (max_freq * max_freq_count);
    int idles = max(0, empty_slots - available_tasks);

    return (int)tasks.size() + idles;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    vector<string> tasks;
    string task;
    while (cin >> task) {
        bool is_num = true;
        for (char c : task) {
            if (!isdigit(c)) { is_num = false; break; }
        }
        if (is_num) {
            int k = stoi(task);
            cout << least_intervals(tasks, k) << "\n";
            return 0;
        }
        tasks.push_back(task);
    }
    return 0;
}`,
    },
    solutionCode: {
      python: `import sys
from collections import Counter

def least_intervals(tasks: list[str], k: int) -> int:
    if k == 0:
        return len(tasks)

    counts = Counter(tasks)
    max_freq = max(counts.values())
    max_freq_count = sum(1 for v in counts.values() if v == max_freq)

    part_count = max_freq - 1
    part_length = k - (max_freq_count - 1)
    empty_slots = part_count * part_length
    available_tasks = len(tasks) - (max_freq * max_freq_count)
    idles = max(0, empty_slots - available_tasks)

    return len(tasks) + idles

def main():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    tasks = lines[0].split()
    k = int(lines[1]) if len(lines) > 1 else 0
    print(least_intervals(tasks, k))

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    public static int leastInterval(char[] tasks, int k) {
        if (k == 0) return tasks.length;
        int[] counts = new int[26];
        int maxFreq = 0;
        for (char c : tasks) {
            counts[c - 'A']++;
            maxFreq = Math.max(maxFreq, counts[c - 'A']);
        }

        // FIXED: Count how many tasks tie for maxFreq
        int maxFreqCount = 0;
        for (int f : counts) {
            if (f == maxFreq) maxFreqCount++;
        }

        int partCount = maxFreq - 1;
        int partLength = k - (maxFreqCount - 1);
        int emptySlots = partCount * partLength;
        int availableTasks = tasks.length - (maxFreq * maxFreqCount);
        int idles = Math.max(0, emptySlots - availableTasks);

        return tasks.length + idles;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String line = sc.nextLine().trim();
        if (line.isEmpty()) return;
        String[] parts = line.split("\\\\s+");
        char[] tasks = new char[parts.length];
        for (int i = 0; i < parts.length; i++) tasks[i] = parts[i].charAt(0);
        int k = sc.hasNextInt() ? sc.nextInt() : 0;
        System.out.println(leastInterval(tasks, k));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>

using namespace std;

int least_intervals(const vector<string>& tasks, int k) {
    if (k == 0) return tasks.size();

    unordered_map<string, int> counts;
    int max_freq = 0;
    for (const auto& t : tasks) {
        counts[t]++;
        max_freq = max(max_freq, counts[t]);
    }

    // FIXED: Count ALL tasks sharing the maximum frequency
    int max_freq_count = 0;
    for (const auto& pair : counts) {
        if (pair.second == max_freq) max_freq_count++;
    }

    int part_count = max_freq - 1;
    int part_length = k - (max_freq_count - 1);
    int empty_slots = part_count * part_length;
    int available_tasks = (int)tasks.size() - (max_freq * max_freq_count);
    int idles = max(0, empty_slots - available_tasks);

    return (int)tasks.size() + idles;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    vector<string> tasks;
    string task;
    while (cin >> task) {
        bool is_num = true;
        for (char c : task) {
            if (!isdigit(c)) { is_num = false; break; }
        }
        if (is_num) {
            int k = stoi(task);
            cout << least_intervals(tasks, k) << "\n";
            return 0;
        }
        tasks.push_back(task);
    }
    return 0;
}`,
    },
    testCases: [
      {
        id: "tc-sched-1",
        name: "Two Tasks with Equal Max Frequency",
        input: "A A A B B B\n2",
        expectedOutput: "8",
        explanation: "Possible sequence: A -> B -> IDLE -> A -> B -> IDLE -> A -> B. Total 8 intervals.",
      },
      {
        id: "tc-sched-2",
        name: "Zero Cooldown",
        input: "A A A B B B\n0",
        expectedOutput: "6",
        explanation: "With cooldown 0, no idles are required. Total intervals = total tasks = 6.",
      },
      {
        id: "tc-sched-3",
        name: "Three Max Frequency Tasks",
        input: "A A A B B B C C C D D E\n2",
        expectedOutput: "12",
        hidden: true,
      },
    ],
  },
  {
    id: "dbg-median-two-arrays",
    slug: "median-two-sorted-arrays",
    title: "Median of Two Sorted Partitions",
    topic: "Binary Search & Pointers",
    difficulty: "Expert",
    points: 200,
    tags: ["Binary Search", "Divide and Conquer", "Arrays", "Median"],
    description: `### Background
In a real-time time-series merger, two independently sorted numerical feeds of sizes \`m\` and \`n\` must be queried for their combined median value with a strict time complexity guarantee of \`O(log(min(m, n)))\`.

### The Bug
The binary search partition algorithm determines cut points \`i\` and \`j\` such that the left half contains half of the total elements. However, when array \`nums1\` is entirely greater than or less than \`nums2\`, edge bounds \`i == 0\` or \`i == m\` result in incorrect boundary assignments for \`min_right1\` and \`max_left1\`, throwing index errors or selecting infinity inappropriately.

### Task
Debug the binary search partitioning algorithm in \`find_median_sorted_arrays\`. Fix the cut boundary checks so it reliably returns the combined median formatted to 5 decimal places.`,
    inputFormat: "First line: m space-separated numbers for nums1. Second line: n space-separated numbers for nums2. (Either line may be empty).",
    outputFormat: "Float value formatted to 5 decimal places (e.g. 2.00000 or 2.50000).",
    constraints: `0 <= m, n <= 10^5
1 <= m + n <= 2 * 10^5
-10^6 <= nums1[i], nums2[i] <= 10^6`,
    incidentReport: {
      severity: "Critical",
      reportedBy: "Quant Trading Platform",
      environment: "Order Book Median Indexer",
      symptoms: "Assertion failure when one feed is empty or has all elements strictly greater than the other feed. Division by zero and negative index lookups.",
      errorType: "Partition Boundary Clamp Error",
    },
    hints: [
      "Always binary search on the smaller array so that j = (m + n + 1) // 2 - i is guaranteed to be non-negative.",
      "If i == 0, max_left1 should be -infinity; if i == m, min_right1 should be +infinity.",
      "Ensure float formatting is exact: '{:.5f}'.format(median).",
    ],
    languages: ["python", "cpp", "java"],
    buggyCode: {
      python: `import sys

def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    # Ensure nums1 is smaller
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1

    m, n = len(nums1), len(nums2)
    imin, imax = 0, m
    half_len = (m + n + 1) // 2

    while imin <= imax:
        i = (imin + imax) // 2
        j = half_len - i

        # BUG: Swapped conditions causing wrong direction in binary search!
        if i < m and nums2[j - 1] > nums1[i]:
            imin = i + 1
        elif i > 0 and nums1[i - 1] > nums2[j]:
            imax = i - 1
        else:
            # We found the right partition!
            # BUG: Boundary checks use wrong conditions:
            if i == 0:
                max_left = nums2[j - 1]
            elif j == 0:
                max_left = nums1[i - 1]
            else:
                max_left = max(nums1[i - 1], nums2[j - 1])

            if (m + n) % 2 == 1:
                return float(max_left)

            # BUG: If i == m or j == n, handled inconsistently:
            if i == m:
                min_right = nums2[j]
            elif j == n:
                min_right = nums1[i]
            else:
                min_right = min(nums1[i], nums2[j])

            return (max_left + min_right) / 2.0

    return 0.0

def main():
    lines = sys.stdin.read().splitlines()
    nums1 = [int(x) for x in lines[0].split()] if len(lines) > 0 and lines[0].strip() else []
    nums2 = [int(x) for x in lines[1].split()] if len(lines) > 1 and lines[1].strip() else []

    med = find_median_sorted_arrays(nums1, nums2)
    print(f"{med:.5f}")

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }

        int m = nums1.length;
        int n = nums2.length;
        int imin = 0, imax = m;
        int halfLen = (m + n + 1) / 2;

        while (imin <= imax) {
            int i = (imin + imax) / 2;
            int j = halfLen - i;

            if (i < m && nums2[j - 1] > nums1[i]) {
                imin = i + 1;
            } else if (i > 0 && nums1[i - 1] > nums2[j]) {
                imax = i - 1;
            } else {
                int maxLeft;
                if (i == 0) maxLeft = nums2[j - 1];
                else if (j == 0) maxLeft = nums1[i - 1];
                else maxLeft = Math.max(nums1[i - 1], nums2[j - 1]);

                if ((m + n) % 2 == 1) {
                    return maxLeft;
                }

                int minRight;
                if (i == m) minRight = nums2[j];
                else if (j == n) minRight = nums1[i];
                else minRight = Math.min(nums1[i], nums2[j]);

                return (maxLeft + minRight) / 2.0;
            }
        }
        return 0.0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line1 = sc.hasNextLine() ? sc.nextLine().trim() : "";
        String line2 = sc.hasNextLine() ? sc.nextLine().trim() : "";

        int[] nums1 = parse(line1);
        int[] nums2 = parse(line2);

        double med = findMedianSortedArrays(nums1, nums2);
        System.out.printf(Locale.US, "%.5f%n", med);
    }

    static int[] parse(String s) {
        if (s.isEmpty()) return new int[0];
        String[] tokens = s.split("\\\\s+");
        int[] arr = new int[tokens.length];
        for (int i = 0; i < tokens.length; i++) arr[i] = Integer.parseInt(tokens[i]);
        return arr;
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <iomanip>
#include <climits>

using namespace std;

vector<int> parse_line(const string& s) {
    vector<int> res;
    stringstream ss(s);
    int x;
    while (ss >> x) res.push_back(x);
    return res;
}

double find_median_sorted_arrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size()) {
        return find_median_sorted_arrays(nums2, nums1);
    }

    int m = nums1.size();
    int n = nums2.size();
    int imin = 0, imax = m;
    int half_len = (m + n + 1) / 2;

    while (imin <= imax) {
        int i = (imin + imax) / 2;
        int j = half_len - i;

        // BUG: Inverted binary search bounds
        if (i < m && nums2[j - 1] > nums1[i]) {
            imin = i + 1;
        } else if (i > 0 && nums1[i - 1] > nums2[j]) {
            imax = i - 1;
        } else {
            int max_left = 0;
            if (i == 0) max_left = nums2[j - 1];
            else if (j == 0) max_left = nums1[i - 1];
            else max_left = max(nums1[i - 1], nums2[j - 1]);

            if ((m + n) % 2 == 1) return max_left;

            int min_right = 0;
            if (i == m) min_right = nums2[j];
            else if (j == n) min_right = nums1[i];
            else min_right = min(nums1[i], nums2[j]);

            return (max_left + min_right) / 2.0;
        }
    }
    return 0.0;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line1, line2;
    getline(cin, line1);
    getline(cin, line2);
    vector<int> a = parse_line(line1);
    vector<int> b = parse_line(line2);
    cout << fixed << setprecision(5) << find_median_sorted_arrays(a, b) << "\n";
    return 0;
}`,
    },
    solutionCode: {
      python: `import sys

def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1

    m, n = len(nums1), len(nums2)
    imin, imax = 0, m
    half_len = (m + n + 1) // 2

    while imin <= imax:
        i = (imin + imax) // 2
        j = half_len - i

        if i < m and nums2[j - 1] > nums1[i]:
            imin = i + 1
        elif i > 0 and nums1[i - 1] > nums2[j]:
            imax = i - 1
        else:
            if i == 0:
                max_left = nums2[j - 1]
            elif j == 0:
                max_left = nums1[i - 1]
            else:
                max_left = max(nums1[i - 1], nums2[j - 1])

            if (m + n) % 2 == 1:
                return float(max_left)

            if i == m:
                min_right = nums2[j]
            elif j == n:
                min_right = nums1[i]
            else:
                min_right = min(nums1[i], nums2[j])

            return (max_left + min_right) / 2.0

    return 0.0

def main():
    lines = sys.stdin.read().splitlines()
    nums1 = [int(x) for x in lines[0].split()] if len(lines) > 0 and lines[0].strip() else []
    nums2 = [int(x) for x in lines[1].split()] if len(lines) > 1 and lines[1].strip() else []

    med = find_median_sorted_arrays(nums1, nums2)
    print(f"{med:.5f}")

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }

        int m = nums1.length;
        int n = nums2.length;
        int imin = 0, imax = m;
        int halfLen = (m + n + 1) / 2;

        while (imin <= imax) {
            int i = (imin + imax) / 2;
            int j = halfLen - i;

            if (i < m && nums2[j - 1] > nums1[i]) {
                imin = i + 1;
            } else if (i > 0 && nums1[i - 1] > nums2[j]) {
                imax = i - 1;
            } else {
                int maxLeft;
                if (i == 0) maxLeft = nums2[j - 1];
                else if (j == 0) maxLeft = nums1[i - 1];
                else maxLeft = Math.max(nums1[i - 1], nums2[j - 1]);

                if ((m + n) % 2 == 1) {
                    return maxLeft;
                }

                int minRight;
                if (i == m) minRight = nums2[j];
                else if (j == n) minRight = nums1[i];
                else minRight = Math.min(nums1[i], nums2[j]);

                return (maxLeft + minRight) / 2.0;
            }
        }
        return 0.0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line1 = sc.hasNextLine() ? sc.nextLine().trim() : "";
        String line2 = sc.hasNextLine() ? sc.nextLine().trim() : "";

        int[] nums1 = parse(line1);
        int[] nums2 = parse(line2);

        double med = findMedianSortedArrays(nums1, nums2);
        System.out.printf(Locale.US, "%.5f%n", med);
    }

    static int[] parse(String s) {
        if (s.isEmpty()) return new int[0];
        String[] tokens = s.split("\\\\s+");
        int[] arr = new int[tokens.length];
        for (int i = 0; i < tokens.length; i++) arr[i] = Integer.parseInt(tokens[i]);
        return arr;
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <iomanip>
#include <climits>

using namespace std;

vector<int> parse_line(const string& s) {
    vector<int> res;
    stringstream ss(s);
    int x;
    while (ss >> x) res.push_back(x);
    return res;
}

double find_median_sorted_arrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size()) {
        return find_median_sorted_arrays(nums2, nums1);
    }

    int m = nums1.size();
    int n = nums2.size();
    int imin = 0, imax = m;
    int half_len = (m + n + 1) / 2;

    while (imin <= imax) {
        int i = (imin + imax) / 2;
        int j = half_len - i;

        int max_left1 = (i == 0) ? INT_MIN : nums1[i - 1];
        int min_right1 = (i == m) ? INT_MAX : nums1[i];
        int max_left2 = (j == 0) ? INT_MIN : nums2[j - 1];
        int min_right2 = (j == n) ? INT_MAX : nums2[j];

        // FIXED: Balanced partition comparison and safe binary search range adjustment
        if (max_left1 <= min_right2 && max_left2 <= min_right1) {
            if ((m + n) % 2 == 1) {
                return max(max_left1, max_left2);
            }
            return (max(max_left1, max_left2) + min(min_right1, min_right2)) / 2.0;
        } else if (max_left1 > min_right2) {
            imax = i - 1;
        } else {
            imin = i + 1;
        }
    }
    return 0.0;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line1, line2;
    getline(cin, line1);
    getline(cin, line2);
    vector<int> a = parse_line(line1);
    vector<int> b = parse_line(line2);
    cout << fixed << setprecision(5) << find_median_sorted_arrays(a, b) << "\n";
    return 0;
}`,
    },
    testCases: [
      {
        id: "tc-med-1",
        name: "Odd Total Length",
        input: "1 3\n2",
        expectedOutput: "2.00000",
        explanation: "Merged array is [1, 2, 3]. Median is 2.00000.",
      },
      {
        id: "tc-med-2",
        name: "Even Total Length",
        input: "1 2\n3 4",
        expectedOutput: "2.50000",
        explanation: "Merged array is [1, 2, 3, 4]. Median is (2 + 3) / 2 = 2.50000.",
      },
      {
        id: "tc-med-3",
        name: "One Empty Array",
        input: "\n1 2 3 4 5",
        expectedOutput: "3.00000",
        hidden: true,
      },
    ],
  },
  {
    id: "dbg-palindromic-part",
    slug: "palindromic-partitioning-dp",
    title: "Palindromic Partitioning Minimum Cuts",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    points: 160,
    tags: ["Dynamic Programming", "Strings", "Intervals"],
    description: `### Background
In genomic sequence tokenization, DNA fragments must be partitioned into the minimum possible number of palindromic subsequences to facilitate compression.

### The Bug
The 2D dynamic programming solution caches \`is_pal[i][j]\` and computes \`dp[i]\` (the minimum cuts needed for prefix \`s[0..i]\`). However, the loop bounds for substring length checking use an inclusive/exclusive index mismatch (\`s[i] == s[j]\` combined with \`j - i <= 2\`), and the initialization of \`dp\` sets all values to 0 instead of infinity, causing the algorithm to declare that zero cuts are needed for non-palindromic strings.

### Task
Find and fix the base case initialization and the substring state transition in \`min_cut\`. Return the minimum cuts needed so that every substring of the partition is a palindrome.`,
    inputFormat: "A single line containing the string s.",
    outputFormat: "A single integer: minimum cuts needed.",
    constraints: `1 <= len(s) <= 2000
s consists of lowercase English letters.`,
    incidentReport: {
      severity: "High",
      reportedBy: "Bioinformatics Pipeline",
      environment: "Genomic Sequence Compressor",
      symptoms: "Produces 0 cuts for arbitrary non-palindromic strings because the DP array initializes to 0 instead of indexing infinity.",
      errorType: "Dynamic Programming Initialization Defect",
    },
    hints: [
      "If the entire prefix s[0..i] is a palindrome, how many cuts are needed? Exactly 0 cuts.",
      "If s[0..i] is not a palindrome, dp[i] should be min(dp[j-1] + 1) for all j <= i such that s[j..i] is a palindrome.",
      "Ensure dp is initialized with max values (e.g. dp[i] = i) and not all zeros.",
    ],
    languages: ["python", "cpp", "java"],
    buggyCode: {
      python: `import sys

def min_cut(s: str) -> int:
    n = len(s)
    if n <= 1:
        return 0

    is_pal = [[False] * n for _ in range(n)]
    for i in range(n):
        is_pal[i][i] = True

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                if length == 2 or is_pal[i + 1][j - 1]:
                    is_pal[i][j] = True

    # BUG: dp is initialized to [0] * n!
    # It should be initialized to max cuts possible (dp[i] = i)
    dp = [0] * n

    for i in range(n):
        if is_pal[0][i]:
            dp[i] = 0
        else:
            # BUG: dp[i] is already 0, so min(...) will never exceed 0!
            for j in range(1, i + 1):
                if is_pal[j][i]:
                    dp[i] = min(dp[i], dp[j - 1] + 1)

    return dp[n - 1]

def main():
    line = sys.stdin.read().strip()
    if not line:
        return
    print(min_cut(line))

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    public static int minCut(String s) {
        int n = s.length();
        if (n <= 1) return 0;

        boolean[][] isPal = new boolean[n][n];
        for (int i = 0; i < n; i++) isPal[i][i] = true;

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s.charAt(i) == s.charAt(j)) {
                    if (len == 2 || isPal[i + 1][j - 1]) {
                        isPal[i][j] = true;
                    }
                }
            }
        }

        // BUG: In Java, int[] is initialized with 0 by default!
        // dp[i] remains 0, so Math.min(dp[i], ...) will never pick valid cut transitions!
        int[] dp = new int[n];

        for (int i = 0; i < n; i++) {
            if (isPal[0][i]) {
                dp[i] = 0;
            } else {
                for (int j = 1; j <= i; j++) {
                    if (isPal[j][i]) {
                        dp[i] = Math.min(dp[i], dp[j - 1] + 1);
                    }
                }
            }
        }

        return dp[n - 1];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String s = sc.nextLine().trim();
        System.out.println(minCut(s));
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int min_cut(const string& s) {
    int n = s.size();
    if (n <= 1) return 0;

    vector<vector<bool>> is_pal(n, vector<bool>(n, false));
    for (int i = 0; i < n; ++i) is_pal[i][i] = true;

    for (int len = 2; len <= n; ++len) {
        for (int i = 0; i <= n - len; ++i) {
            int j = i + len - 1;
            if (s[i] == s[j]) {
                if (len == 2 || is_pal[i + 1][j - 1]) {
                    is_pal[i][j] = true;
                }
            }
        }
    }

    // BUG: dp is initialized to 0! min(...) with 0 will never give proper cut count
    vector<int> dp(n, 0);

    for (int i = 0; i < n; ++i) {
        if (is_pal[0][i]) {
            dp[i] = 0;
        } else {
            for (int j = 1; j <= i; ++j) {
                if (is_pal[j][i]) {
                    dp[i] = min(dp[i], dp[j - 1] + 1);
                }
            }
        }
    }
    return dp[n - 1];
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s;
    if (cin >> s) {
        cout << min_cut(s) << "\n";
    }
    return 0;
}`,
    },
    solutionCode: {
      python: `import sys

def min_cut(s: str) -> int:
    n = len(s)
    if n <= 1:
        return 0

    is_pal = [[False] * n for _ in range(n)]
    for i in range(n):
        is_pal[i][i] = True

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                if length == 2 or is_pal[i + 1][j - 1]:
                    is_pal[i][j] = True

    dp = [i for i in range(n)]

    for i in range(n):
        if is_pal[0][i]:
            dp[i] = 0
        else:
            for j in range(1, i + 1):
                if is_pal[j][i]:
                    dp[i] = min(dp[i], dp[j - 1] + 1)

    return dp[n - 1]

def main():
    line = sys.stdin.read().strip()
    if not line:
        return
    print(min_cut(line))

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    public static int minCut(String s) {
        int n = s.length();
        if (n <= 1) return 0;

        boolean[][] isPal = new boolean[n][n];
        for (int i = 0; i < n; i++) isPal[i][i] = true;

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s.charAt(i) == s.charAt(j)) {
                    if (len == 2 || isPal[i + 1][j - 1]) {
                        isPal[i][j] = true;
                    }
                }
            }
        }

        // FIXED: Initialize dp array with maximum cuts possible (dp[i] = i)
        int[] dp = new int[n];
        for (int i = 0; i < n; i++) dp[i] = i;

        for (int i = 0; i < n; i++) {
            if (isPal[0][i]) {
                dp[i] = 0;
            } else {
                for (int j = 1; j <= i; j++) {
                    if (isPal[j][i]) {
                        dp[i] = Math.min(dp[i], dp[j - 1] + 1);
                    }
                }
            }
        }

        return dp[n - 1];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String s = sc.nextLine().trim();
        System.out.println(minCut(s));
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int min_cut(const string& s) {
    int n = s.size();
    if (n <= 1) return 0;

    vector<vector<bool>> is_pal(n, vector<bool>(n, false));
    for (int i = 0; i < n; ++i) is_pal[i][i] = true;

    for (int len = 2; len <= n; ++len) {
        for (int i = 0; i <= n - len; ++i) {
            int j = i + len - 1;
            if (s[i] == s[j]) {
                if (len == 2 || is_pal[i + 1][j - 1]) {
                    is_pal[i][j] = true;
                }
            }
        }
    }

    // FIXED: Initialize dp array with maximum cuts possible (dp[i] = i)
    vector<int> dp(n);
    for (int i = 0; i < n; ++i) dp[i] = i;

    for (int i = 0; i < n; ++i) {
        if (is_pal[0][i]) {
            dp[i] = 0;
        } else {
            for (int j = 1; j <= i; ++j) {
                if (is_pal[j][i]) {
                    dp[i] = min(dp[i], dp[j - 1] + 1);
                }
            }
        }
    }
    return dp[n - 1];
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string s;
    if (cin >> s) {
        cout << min_cut(s) << "\n";
    }
    return 0;
}`,
    },
    testCases: [
      {
        id: "tc-pal-1",
        name: "Standard String",
        input: "aab",
        expectedOutput: "1",
        explanation: "Cut 'aa' and 'b'. Total cuts = 1.",
      },
      {
        id: "tc-pal-2",
        name: "Already Palindrome",
        input: "racecar",
        expectedOutput: "0",
        explanation: "'racecar' is a palindrome, 0 cuts needed.",
      },
      {
        id: "tc-pal-3",
        name: "All Distinct Characters",
        input: "abcdef",
        expectedOutput: "5",
        hidden: true,
      },
    ],
  },
  {
    id: "dbg-lca-tree",
    slug: "lowest-common-ancestor-tree",
    title: "Lowest Common Ancestor in Binary Tree",
    topic: "Trees & Recursion",
    difficulty: "Medium",
    points: 120,
    tags: ["Trees", "Recursion", "Binary Tree", "DFS"],
    description: `### Background
In an organizational hierarchy graph structured as a binary tree, an access control system needs to compute the Lowest Common Ancestor (LCA) between two employee IDs \`p\` and \`q\` to assign the minimum necessary delegation authority.

### The Bug
The recursive helper function checks if the current node matches \`p\` or \`q\`. However, when finding a match on the left subtree, it immediately returns the left match without searching the right subtree, causing the algorithm to fail whenever \`q\` resides in the right sibling subtree!

### Task
Fix the recursion in \`lowest_common_ancestor\` so that it continues to evaluate both left and right child subtrees to find the true shared ancestor.`,
    inputFormat: "First line: level-order serialization of binary tree (null nodes denoted by 'null'). Second line: integer p. Third line: integer q.",
    outputFormat: "Integer value of the Lowest Common Ancestor node.",
    constraints: `The number of nodes in the tree is in the range [2, 10^5].
-10^9 <= Node.val <= 10^9
All Node.val are unique.
p != q and both p and q exist in the tree.`,
    incidentReport: {
      severity: "High",
      reportedBy: "Security & IAM Team",
      environment: "Authorization Gatekeeper",
      symptoms: "LCA is returning 'p' itself even when 'p' is a leaf node and 'q' is in a completely separate branch, rather than their common parent.",
      errorType: "Premature Recursion Termination",
    },
    hints: [
      "If root is None or root.val == p or root.val == q, return root.",
      "Recurse on left subtree AND right subtree.",
      "If both left and right return non-null, root is the LCA. If only one is non-null, return that non-null child.",
    ],
    languages: ["python", "cpp", "java"],
    buggyCode: {
      python: `import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def lowest_common_ancestor(root: TreeNode, p: int, q: int) -> TreeNode:
    if not root:
        return None
    if root.val == p or root.val == q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    # BUG: If left is found, it prematurely returns without checking right!
    if left:
        return left

    right = lowest_common_ancestor(root.right, p, q)
    return right

def build_tree(tokens: list[str]) -> TreeNode:
    if not tokens or tokens[0] == "null":
        return None
    root = TreeNode(int(tokens[0]))
    queue = deque([root])
    idx = 1
    while queue and idx < len(tokens):
        curr = queue.popleft()
        if idx < len(tokens) and tokens[idx] != "null":
            curr.left = TreeNode(int(tokens[idx]))
            queue.append(curr.left)
        idx += 1
        if idx < len(tokens) and tokens[idx] != "null":
            curr.right = TreeNode(int(tokens[idx]))
            queue.append(curr.right)
        idx += 1
    return root

def main():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    tokens = lines[0].split()
    p = int(lines[1])
    q = int(lines[2])
    root = build_tree(tokens)
    lca = lowest_common_ancestor(root, p, q)
    if lca:
        print(lca.val)

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int v) { val = v; }
    }

    public static TreeNode lowestCommonAncestor(TreeNode root, int p, int q) {
        if (root == null) return null;
        if (root.val == p || root.val == q) return root;

        TreeNode left = lowestCommonAncestor(root.left, p, q);
        // BUG: If left is found, it prematurely returns without searching right subtree!
        if (left != null) return left;

        TreeNode right = lowestCommonAncestor(root.right, p, q);
        return right;
    }

    static TreeNode buildTree(String[] tokens) {
        if (tokens.length == 0 || tokens[0].equals("null")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int idx = 1;
        while (!queue.isEmpty() && idx < tokens.length) {
            TreeNode curr = queue.poll();
            if (idx < tokens.length && !tokens[idx].equals("null")) {
                curr.left = new TreeNode(Integer.parseInt(tokens[idx]));
                queue.add(curr.left);
            }
            idx++;
            if (idx < tokens.length && !tokens[idx].equals("null")) {
                curr.right = new TreeNode(Integer.parseInt(tokens[idx]));
                queue.add(curr.right);
            }
            idx++;
        }
        return root;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String[] tokens = sc.nextLine().trim().split("\\\\s+");
        int p = sc.nextInt();
        int q = sc.nextInt();
        TreeNode root = buildTree(tokens);
        TreeNode lca = lowestCommonAncestor(root, p, q);
        if (lca != null) System.out.println(lca.val);
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <queue>

using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

TreeNode* lowest_common_ancestor(TreeNode* root, int p, int q) {
    if (!root) return nullptr;
    if (root->val == p || root->val == q) return root;

    TreeNode* left = lowest_common_ancestor(root->left, p, q);
    // BUG: If left is found, it prematurely returns without checking right subtree!
    if (left) return left;

    TreeNode* right = lowest_common_ancestor(root->right, p, q);
    return right;
}

TreeNode* build_tree(const vector<string>& tokens) {
    if (tokens.empty() || tokens[0] == "null") return nullptr;
    TreeNode* root = new TreeNode(stoi(tokens[0]));
    queue<TreeNode*> q;
    q.push(root);
    int idx = 1;
    while (!q.empty() && idx < (int)tokens.size()) {
        TreeNode* curr = q.front();
        q.pop();
        if (idx < (int)tokens.size() && tokens[idx] != "null") {
            curr->left = new TreeNode(stoi(tokens[idx]));
            q.push(curr->left);
        }
        idx++;
        if (idx < (int)tokens.size() && tokens[idx] != "null") {
            curr->right = new TreeNode(stoi(tokens[idx]));
            q.push(curr->right);
        }
        idx++;
    }
    return root;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    stringstream ss(line);
    vector<string> tokens;
    string tok;
    while (ss >> tok) tokens.push_back(tok);
    int p, q;
    if (cin >> p >> q) {
        TreeNode* root = build_tree(tokens);
        TreeNode* lca = lowest_common_ancestor(root, p, q);
        if (lca) cout << lca->val << "\n";
    }
    return 0;
}`,
    },
    solutionCode: {
      python: `import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def lowest_common_ancestor(root: TreeNode, p: int, q: int) -> TreeNode:
    if not root:
        return None
    if root.val == p or root.val == q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    if left and right:
        return root
    return left if left else right

def build_tree(tokens: list[str]) -> TreeNode:
    if not tokens or tokens[0] == "null":
        return None
    root = TreeNode(int(tokens[0]))
    queue = deque([root])
    idx = 1
    while queue and idx < len(tokens):
        curr = queue.popleft()
        if idx < len(tokens) and tokens[idx] != "null":
            curr.left = TreeNode(int(tokens[idx]))
            queue.append(curr.left)
        idx += 1
        if idx < len(tokens) and tokens[idx] != "null":
            curr.right = TreeNode(int(tokens[idx]))
            queue.append(curr.right)
        idx += 1
    return root

def main():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    tokens = lines[0].split()
    p = int(lines[1])
    q = int(lines[2])
    root = build_tree(tokens)
    lca = lowest_common_ancestor(root, p, q)
    if lca:
        print(lca.val)

if __name__ == '__main__':
    main()`,
      java: `import java.util.*;

public class Main {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int v) { val = v; }
    }

    public static TreeNode lowestCommonAncestor(TreeNode root, int p, int q) {
        if (root == null) return null;
        if (root.val == p || root.val == q) return root;

        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        // FIXED: If both are found, root is the LCA. Otherwise return the non-null branch.
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }

    static TreeNode buildTree(String[] tokens) {
        if (tokens.length == 0 || tokens[0].equals("null")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int idx = 1;
        while (!queue.isEmpty() && idx < tokens.length) {
            TreeNode curr = queue.poll();
            if (idx < tokens.length && !tokens[idx].equals("null")) {
                curr.left = new TreeNode(Integer.parseInt(tokens[idx]));
                queue.add(curr.left);
            }
            idx++;
            if (idx < tokens.length && !tokens[idx].equals("null")) {
                curr.right = new TreeNode(Integer.parseInt(tokens[idx]));
                queue.add(curr.right);
            }
            idx++;
        }
        return root;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextLine()) return;
        String[] tokens = sc.nextLine().trim().split("\\\\s+");
        int p = sc.nextInt();
        int q = sc.nextInt();
        TreeNode root = buildTree(tokens);
        TreeNode lca = lowestCommonAncestor(root, p, q);
        if (lca != null) System.out.println(lca.val);
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <queue>

using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

TreeNode* lowest_common_ancestor(TreeNode* root, int p, int q) {
    if (!root) return nullptr;
    if (root->val == p || root->val == q) return root;

    TreeNode* left = lowest_common_ancestor(root->left, p, q);
    TreeNode* right = lowest_common_ancestor(root->right, p, q);

    // FIXED: If both left and right return non-null, root is LCA; else return non-null branch
    if (left && right) return root;
    return left ? left : right;
}

TreeNode* build_tree(const vector<string>& tokens) {
    if (tokens.empty() || tokens[0] == "null") return nullptr;
    TreeNode* root = new TreeNode(stoi(tokens[0]));
    queue<TreeNode*> q;
    q.push(root);
    int idx = 1;
    while (!q.empty() && idx < (int)tokens.size()) {
        TreeNode* curr = q.front();
        q.pop();
        if (idx < (int)tokens.size() && tokens[idx] != "null") {
            curr->left = new TreeNode(stoi(tokens[idx]));
            q.push(curr->left);
        }
        idx++;
        if (idx < (int)tokens.size() && tokens[idx] != "null") {
            curr->right = new TreeNode(stoi(tokens[idx]));
            q.push(curr->right);
        }
        idx++;
    }
    return root;
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    string line;
    if (!getline(cin, line)) return 0;
    stringstream ss(line);
    vector<string> tokens;
    string tok;
    while (ss >> tok) tokens.push_back(tok);
    int p, q;
    if (cin >> p >> q) {
        TreeNode* root = build_tree(tokens);
        TreeNode* lca = lowest_common_ancestor(root, p, q);
        if (lca) cout << lca->val << "\n";
    }
    return 0;
}`,
    },
    testCases: [
      {
        id: "tc-lca-1",
        name: "LCA on Opposite Subtrees",
        input: "3 5 1 6 2 0 8 null null 7 4\n5\n1",
        expectedOutput: "3",
        explanation: "p=5 and q=1 are children of root node 3. LCA is 3.",
      },
      {
        id: "tc-lca-2",
        name: "LCA is One of the Target Nodes",
        input: "3 5 1 6 2 0 8 null null 7 4\n5\n4",
        expectedOutput: "5",
        explanation: "Node 4 is a descendant of node 5. LCA is 5.",
      },
      {
        id: "tc-lca-3",
        name: "Two-node Tree",
        input: "1 2\n1\n2",
        expectedOutput: "1",
        hidden: true,
      },
    ],
  },
];
