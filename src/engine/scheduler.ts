import { Process, GanttBlock, SchedulingResult, SchedulingAlgorithm } from './types';

function calculateMetrics(gantt: GanttBlock[], processes: Process[]): SchedulingResult {
  const completed = processes.map(p => ({ ...p }));
  const totalTime = gantt.length > 0 ? gantt[gantt.length - 1].endTime : 0;

  for (const p of completed) {
    const blocks = gantt.filter(g => g.pid === p.pid);
    if (blocks.length > 0) {
      p.completionTime = blocks[blocks.length - 1].endTime;
      p.startTime = blocks[0].startTime;
      p.turnaroundTime = p.completionTime - p.arrivalTime;
      p.waitingTime = p.turnaroundTime - p.burstTime;
      p.state = 'TERMINATED';
    }
  }

  const avgWaiting = completed.reduce((s, p) => s + p.waitingTime, 0) / completed.length;
  const avgTurnaround = completed.reduce((s, p) => s + p.turnaroundTime, 0) / completed.length;
  const busyTime = gantt.filter(g => g.pid !== -1).reduce((s, g) => s + (g.endTime - g.startTime), 0);
  const cpuUtil = totalTime > 0 ? (busyTime / totalTime) * 100 : 0;

  return {
    ganttChart: gantt,
    completedProcesses: completed,
    avgWaitingTime: avgWaiting,
    avgTurnaroundTime: avgTurnaround,
    cpuUtilization: cpuUtil,
    throughput: totalTime > 0 ? completed.length / totalTime : 0,
  };
}

function scheduleFCFS(processes: Process[]): SchedulingResult {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const gantt: GanttBlock[] = [];
  let time = 0;

  for (const p of sorted) {
    if (time < p.arrivalTime) {
      gantt.push({ pid: -1, processName: 'IDLE', startTime: time, endTime: p.arrivalTime, color: '#333' });
      time = p.arrivalTime;
    }
    gantt.push({ pid: p.pid, processName: p.name, startTime: time, endTime: time + p.burstTime, color: p.color });
    time += p.burstTime;
  }

  return calculateMetrics(gantt, sorted);
}

function scheduleSJF(processes: Process[]): SchedulingResult {
  const remaining = processes.map(p => ({ ...p, remaining: p.burstTime }));
  const gantt: GanttBlock[] = [];
  let time = 0;
  let completed = 0;
  const n = remaining.length;

  while (completed < n) {
    const available = remaining.filter(p => p.arrivalTime <= time && p.remaining > 0);
    if (available.length === 0) {
      const next = remaining.filter(p => p.remaining > 0).sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      gantt.push({ pid: -1, processName: 'IDLE', startTime: time, endTime: next.arrivalTime, color: '#333' });
      time = next.arrivalTime;
      continue;
    }

    const shortest = available.sort((a, b) => a.remaining - b.remaining)[0];
    const last = gantt[gantt.length - 1];
    if (last && last.pid === shortest.pid) {
      last.endTime = time + 1;
    } else {
      gantt.push({ pid: shortest.pid, processName: shortest.name, startTime: time, endTime: time + 1, color: shortest.color });
    }
    shortest.remaining--;
    time++;
    if (shortest.remaining === 0) completed++;
  }

  return calculateMetrics(gantt, processes);
}

function scheduleRoundRobin(processes: Process[], quantum: number): SchedulingResult {
  const queue = processes.map(p => ({ ...p, remaining: p.burstTime }));
  const gantt: GanttBlock[] = [];
  let time = 0;
  const readyQueue: typeof queue = [];
  const arrived = new Set<number>();
  let completed = 0;
  const n = queue.length;

  // Add initially arrived processes
  for (const p of queue.sort((a, b) => a.arrivalTime - b.arrivalTime)) {
    if (p.arrivalTime <= time) {
      readyQueue.push(p);
      arrived.add(p.pid);
    }
  }

  while (completed < n) {
    if (readyQueue.length === 0) {
      const next = queue.filter(p => p.remaining > 0 && !arrived.has(p.pid)).sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      if (!next) break;
      gantt.push({ pid: -1, processName: 'IDLE', startTime: time, endTime: next.arrivalTime, color: '#333' });
      time = next.arrivalTime;
      readyQueue.push(next);
      arrived.add(next.pid);
      continue;
    }

    const current = readyQueue.shift()!;
    const execTime = Math.min(quantum, current.remaining);
    gantt.push({ pid: current.pid, processName: current.name, startTime: time, endTime: time + execTime, color: current.color });
    time += execTime;
    current.remaining -= execTime;

    // Add newly arrived processes
    for (const p of queue) {
      if (!arrived.has(p.pid) && p.arrivalTime <= time && p.remaining > 0) {
        readyQueue.push(p);
        arrived.add(p.pid);
      }
    }

    if (current.remaining > 0) {
      readyQueue.push(current);
    } else {
      completed++;
    }
  }

  return calculateMetrics(gantt, processes);
}

function schedulePriority(processes: Process[]): SchedulingResult {
  const remaining = processes.map(p => ({ ...p, remaining: p.burstTime }));
  const gantt: GanttBlock[] = [];
  let time = 0;
  let completed = 0;
  const n = remaining.length;

  while (completed < n) {
    const available = remaining.filter(p => p.arrivalTime <= time && p.remaining > 0);
    if (available.length === 0) {
      const next = remaining.filter(p => p.remaining > 0).sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      gantt.push({ pid: -1, processName: 'IDLE', startTime: time, endTime: next.arrivalTime, color: '#333' });
      time = next.arrivalTime;
      continue;
    }

    const highest = available.sort((a, b) => a.priority - b.priority)[0];
    const last = gantt[gantt.length - 1];
    if (last && last.pid === highest.pid) {
      last.endTime = time + 1;
    } else {
      gantt.push({ pid: highest.pid, processName: highest.name, startTime: time, endTime: time + 1, color: highest.color });
    }
    highest.remaining--;
    time++;
    if (highest.remaining === 0) completed++;
  }

  return calculateMetrics(gantt, processes);
}

export function runScheduler(
  algorithm: SchedulingAlgorithm,
  processes: Process[],
  timeQuantum: number = 2
): SchedulingResult {
  if (processes.length === 0) {
    return { ganttChart: [], completedProcesses: [], avgWaitingTime: 0, avgTurnaroundTime: 0, cpuUtilization: 0, throughput: 0 };
  }

  switch (algorithm) {
    case 'FCFS': return scheduleFCFS(processes);
    case 'SJF': return scheduleSJF(processes);
    case 'RR': return scheduleRoundRobin(processes, timeQuantum);
    case 'PRIORITY': return schedulePriority(processes);
  }
}
