import { Injectable } from '@angular/core';
import { ProcessInput, ScheduleSummary, TimelineEntry } from './process.model';

@Injectable({ providedIn: 'root' })
export class SchedulerService {
  runFcfs(processes: ProcessInput[]): ScheduleSummary {
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const timeline: TimelineEntry[] = [];
    const completionTime = new Map<number, number>();
    let time = 0;

    for (const p of sorted) {
      if (time < p.arrivalTime) {
        time = p.arrivalTime;
      }

      const start = time;
      const end = start + p.burstTime;
      timeline.push({ pid: p.pid, name: p.name, startTime: start, endTime: end });
      completionTime.set(p.pid, end);
      time = end;
    }

    return this.buildSummary(sorted, timeline, completionTime);
  }

  runRoundRobin(processes: ProcessInput[], quantum = 2): ScheduleSummary {
    const queue = [...processes]
      .sort((a, b) => a.arrivalTime - b.arrivalTime)
      .map(p => ({ ...p, remaining: p.burstTime }));

    const ready: typeof queue = [];
    const timeline: TimelineEntry[] = [];
    const completionTime = new Map<number, number>();

    let time = 0;
    let index = 0;

    while (index < queue.length && queue[index].arrivalTime <= time) {
      ready.push(queue[index]);
      index++;
    }

    while (ready.length > 0 || index < queue.length) {
      if (ready.length === 0) {
        time = queue[index].arrivalTime;
        ready.push(queue[index]);
        index++;
      }

      const current = ready.shift()!;
      const exec = Math.min(quantum, current.remaining);
      const start = time;
      const end = start + exec;

      timeline.push({ pid: current.pid, name: current.name, startTime: start, endTime: end });
      time = end;
      current.remaining -= exec;

      while (index < queue.length && queue[index].arrivalTime <= time) {
        ready.push(queue[index]);
        index++;
      }

      if (current.remaining > 0) {
        ready.push(current);
      } else {
        completionTime.set(current.pid, time);
      }
    }

    return this.buildSummary(processes, timeline, completionTime);
  }

  private buildSummary(
    processes: ProcessInput[],
    timeline: TimelineEntry[],
    completionTime: Map<number, number>
  ): ScheduleSummary {
    const waitingValues: number[] = [];
    const turnaroundValues: number[] = [];

    for (const p of processes) {
      const complete = completionTime.get(p.pid) ?? p.arrivalTime;
      const turnaround = complete - p.arrivalTime;
      const waiting = turnaround - p.burstTime;

      waitingValues.push(waiting);
      turnaroundValues.push(turnaround);
    }

    const totalDuration = timeline.length ? timeline[timeline.length - 1].endTime : 0;
    const busyTime = timeline.reduce((sum, t) => sum + (t.endTime - t.startTime), 0);

    return {
      timeline,
      averageWaitingTime: waitingValues.reduce((a, b) => a + b, 0) / (waitingValues.length || 1),
      averageTurnaroundTime: turnaroundValues.reduce((a, b) => a + b, 0) / (turnaroundValues.length || 1),
      cpuUtilization: totalDuration > 0 ? (busyTime / totalDuration) * 100 : 0,
    };
  }
}
