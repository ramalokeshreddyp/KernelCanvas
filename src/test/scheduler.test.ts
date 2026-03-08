import { describe, expect, it } from 'vitest';
import { runScheduler } from '@/engine/scheduler';
import { Process } from '@/engine/types';

function makeProcess(partial: Partial<Process> & { pid: number }): Process {
  return {
    pid: partial.pid,
    name: partial.name ?? `P${partial.pid}`,
    arrivalTime: partial.arrivalTime ?? 0,
    burstTime: partial.burstTime ?? 1,
    remainingTime: partial.burstTime ?? 1,
    priority: partial.priority ?? 1,
    memoryRequired: partial.memoryRequired ?? 64,
    state: 'NEW',
    color: partial.color ?? '#00e5ff',
    waitingTime: 0,
    turnaroundTime: 0,
    completionTime: 0,
    startTime: 0,
  };
}

describe('scheduler engine', () => {
  it('computes FCFS metrics on ordered arrivals', () => {
    const processes = [
      makeProcess({ pid: 1, arrivalTime: 0, burstTime: 3 }),
      makeProcess({ pid: 2, arrivalTime: 1, burstTime: 2 }),
      makeProcess({ pid: 3, arrivalTime: 2, burstTime: 1 }),
    ];

    const result = runScheduler('FCFS', processes);

    expect(result.ganttChart.length).toBeGreaterThan(0);
    expect(result.avgWaitingTime).toBeCloseTo(1.666, 2);
    expect(result.avgTurnaroundTime).toBeCloseTo(3.666, 2);
    expect(result.cpuUtilization).toBe(100);
  });

  it('handles empty process list safely', () => {
    const result = runScheduler('RR', [], 2);
    expect(result.ganttChart).toEqual([]);
    expect(result.avgWaitingTime).toBe(0);
    expect(result.cpuUtilization).toBe(0);
  });

  it('creates idle block for delayed first arrival', () => {
    const processes = [makeProcess({ pid: 1, arrivalTime: 4, burstTime: 2 })];
    const result = runScheduler('SJF', processes);

    expect(result.ganttChart[0].pid).toBe(-1);
    expect(result.ganttChart[0].startTime).toBe(0);
    expect(result.ganttChart[0].endTime).toBe(4);
  });
});
