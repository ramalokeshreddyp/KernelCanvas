import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SchedulerService } from './scheduler.service';
import { ProcessInput, TimelineEntry } from './process.model';

@Component({
  selector: 'app-scheduler-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card">
      <h2>Angular Scheduler Dashboard</h2>
      <p class="subtitle">FCFS and Round Robin computed via Angular service.</p>

      <div class="actions">
        <button type="button" (click)="run('FCFS')">Run FCFS</button>
        <button type="button" (click)="run('RR')">Run Round Robin</button>
      </div>

      <div class="metrics">
        <span>Avg Wait: {{ lastAverageWaiting | number:'1.2-2' }}</span>
        <span>Avg Turnaround: {{ lastAverageTurnaround | number:'1.2-2' }}</span>
        <span>CPU: {{ lastCpuUtilization | number:'1.0-0' }}%</span>
      </div>

      <ul class="timeline">
        <li *ngFor="let row of timeline">
          <strong>{{ row.name }}</strong>
          <span>{{ row.startTime }} - {{ row.endTime }}</span>
        </li>
      </ul>
    </section>
  `,
  styles: [
    `
      .card { border: 1px solid #d7dfea; border-radius: 14px; padding: 1rem; background: #f8fbff; }
      .subtitle { margin-top: 0; color: #49607a; }
      .actions { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
      button { border: 1px solid #9db5d2; border-radius: 999px; background: #fff; padding: 0.35rem 0.85rem; }
      .metrics { display: flex; gap: 0.75rem; flex-wrap: wrap; font-weight: 600; color: #163d67; margin-bottom: 0.75rem; }
      .timeline { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.35rem; }
      .timeline li { background: #fff; border: 1px solid #d7dfea; border-radius: 8px; padding: 0.45rem 0.65rem; display: flex; justify-content: space-between; }
    `,
  ],
})
export class SchedulerDashboardComponent {
  private readonly sampleProcesses: ProcessInput[] = [
    { pid: 1, name: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
    { pid: 2, name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
    { pid: 3, name: 'P3', arrivalTime: 2, burstTime: 2, priority: 3 },
  ];

  timeline: TimelineEntry[] = [];
  lastAverageWaiting = 0;
  lastAverageTurnaround = 0;
  lastCpuUtilization = 0;

  constructor(private readonly scheduler: SchedulerService) {
    this.run('FCFS');
  }

  run(mode: 'FCFS' | 'RR'): void {
    const result = mode === 'FCFS'
      ? this.scheduler.runFcfs(this.sampleProcesses)
      : this.scheduler.runRoundRobin(this.sampleProcesses, 2);

    this.timeline = result.timeline;
    this.lastAverageWaiting = result.averageWaitingTime;
    this.lastAverageTurnaround = result.averageTurnaroundTime;
    this.lastCpuUtilization = result.cpuUtilization;
  }
}
