export interface Resource {
  id: number;
  name: string;
  total: number;
  available: number;
}

export interface DeadlockProcess {
  pid: number;
  name: string;
  allocation: number[];  // resources currently held
  maxNeed: number[];     // max resources needed
  need: number[];        // remaining need (max - allocation)
}

export interface DeadlockResult {
  safe: boolean;
  safeSequence: number[];   // PIDs in safe order
  deadlockedProcesses: number[]; // PIDs in deadlock
  steps: DeadlockStep[];
}

export interface DeadlockStep {
  pid: number;
  processName: string;
  canProceed: boolean;
  available: number[];
  reason: string;
}

export function runBankersAlgorithm(
  processes: DeadlockProcess[],
  available: number[]
): DeadlockResult {
  const n = processes.length;
  const m = available.length;
  const work = [...available];
  const finish = new Array(n).fill(false);
  const safeSequence: number[] = [];
  const steps: DeadlockStep[] = [];

  let found = true;
  while (found) {
    found = false;
    for (let i = 0; i < n; i++) {
      if (finish[i]) continue;
      const p = processes[i];
      const canProceed = p.need.every((need, j) => need <= work[j]);

      if (canProceed) {
        steps.push({
          pid: p.pid,
          processName: p.name,
          canProceed: true,
          available: [...work],
          reason: `P${p.pid} can proceed. Need ≤ Available. Releasing resources.`,
        });

        for (let j = 0; j < m; j++) {
          work[j] += p.allocation[j];
        }
        finish[i] = true;
        safeSequence.push(p.pid);
        found = true;
      }
    }
  }

  const deadlocked: number[] = [];
  for (let i = 0; i < n; i++) {
    if (!finish[i]) {
      deadlocked.push(processes[i].pid);
      steps.push({
        pid: processes[i].pid,
        processName: processes[i].name,
        canProceed: false,
        available: [...work],
        reason: `P${processes[i].pid} CANNOT proceed. Need > Available. DEADLOCKED.`,
      });
    }
  }

  return {
    safe: deadlocked.length === 0,
    safeSequence,
    deadlockedProcesses: deadlocked,
    steps,
  };
}

// Resource Allocation Graph edge types
export interface RAGEdge {
  from: string; // "P1" or "R1"
  to: string;
  type: 'request' | 'assignment';
}

export function detectCycleInRAG(edges: RAGEdge[]): { hasCycle: boolean; cycle: string[] } {
  // Build adjacency list
  const adj: Map<string, string[]> = new Map();
  for (const edge of edges) {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    adj.get(edge.from)!.push(edge.to);
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();
  const path: string[] = [];

  function dfs(node: string): string[] | null {
    visited.add(node);
    recStack.add(node);
    path.push(node);

    for (const neighbor of adj.get(node) || []) {
      if (!visited.has(neighbor)) {
        const result = dfs(neighbor);
        if (result) return result;
      } else if (recStack.has(neighbor)) {
        const cycleStart = path.indexOf(neighbor);
        return path.slice(cycleStart);
      }
    }

    path.pop();
    recStack.delete(node);
    return null;
  }

  for (const node of adj.keys()) {
    if (!visited.has(node)) {
      const cycle = dfs(node);
      if (cycle) return { hasCycle: true, cycle };
    }
  }

  return { hasCycle: false, cycle: [] };
}

export function generateSampleDeadlockScenario(): {
  processes: DeadlockProcess[];
  resources: Resource[];
  available: number[];
} {
  return {
    resources: [
      { id: 0, name: 'CPU', total: 10, available: 3 },
      { id: 1, name: 'Memory', total: 5, available: 3 },
      { id: 2, name: 'Disk', total: 7, available: 2 },
    ],
    available: [3, 3, 2],
    processes: [
      { pid: 1, name: 'P1', allocation: [0, 1, 0], maxNeed: [7, 5, 3], need: [7, 4, 3] },
      { pid: 2, name: 'P2', allocation: [2, 0, 0], maxNeed: [3, 2, 2], need: [1, 2, 2] },
      { pid: 3, name: 'P3', allocation: [3, 0, 2], maxNeed: [9, 0, 2], need: [6, 0, 0] },
      { pid: 4, name: 'P4', allocation: [2, 1, 1], maxNeed: [2, 2, 2], need: [0, 1, 1] },
      { pid: 5, name: 'P5', allocation: [0, 0, 2], maxNeed: [4, 3, 3], need: [4, 3, 1] },
    ],
  };
}

export function generateDeadlockedScenario(): {
  processes: DeadlockProcess[];
  resources: Resource[];
  available: number[];
} {
  return {
    resources: [
      { id: 0, name: 'CPU', total: 6, available: 0 },
      { id: 1, name: 'Memory', total: 4, available: 0 },
    ],
    available: [0, 0],
    processes: [
      { pid: 1, name: 'P1', allocation: [3, 2], maxNeed: [5, 4], need: [2, 2] },
      { pid: 2, name: 'P2', allocation: [3, 2], maxNeed: [4, 3], need: [1, 1] },
    ],
  };
}
