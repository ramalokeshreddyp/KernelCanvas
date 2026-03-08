import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface AngularProcess {
  id: number;
  name: string;
  arrival: number;
  burst: number;
}

interface TimelineBlock {
  label: string;
  start: number;
  end: number;
}

@Component({
  selector: 'app-scheduler-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="scheduler-card">
      <h2>Angular FCFS Preview</h2>
      <p class="subtitle">Small Angular sample for process scheduling timeline rendering.</p>

      <div class="timeline">
        <div class="block" *ngFor="let block of timeline">
          <strong>{{ block.label }}</strong>
          <span>{{ block.start }} -> {{ block.end }}</span>
        </div>
      </div>

      <p class="stats">Average waiting time: {{ avgWaitingTime | number: '1.2-2' }}</p>
    </section>
  `,
  styles: [
    `
      .scheduler-card {
        border: 1px solid #d4dbe5;
        border-radius: 12px;
        padding: 1rem;
        background: #f8fbff;
        font-family: 'Segoe UI', sans-serif;
      }

      .subtitle {
        color: #516173;
        margin-top: 0;
      }

      .timeline {
        display: grid;
        gap: 0.5rem;
        margin: 1rem 0;
      }

      .block {
        background: #ffffff;
        border: 1px solid #d4dbe5;
        border-radius: 8px;
        padding: 0.6rem 0.8rem;
        display: flex;
        justify-content: space-between;
      }

      .stats {
        margin: 0;
        font-weight: 600;
        color: #0b3a66;
      }
    `,
  ],
})
export class SchedulerPreviewComponent {
  private readonly processes: AngularProcess[] = [
    { id: 1, name: 'P1', arrival: 0, burst: 4 },
    { id: 2, name: 'P2', arrival: 2, burst: 3 },
    { id: 3, name: 'P3', arrival: 4, burst: 2 },
  ];

  readonly timeline = this.buildFcfsTimeline(this.processes);
  readonly avgWaitingTime = this.getAverageWaitingTime(this.timeline, this.processes);

  private buildFcfsTimeline(list: AngularProcess[]): TimelineBlock[] {
    const sorted = [...list].sort((a, b) => a.arrival - b.arrival);
    const blocks: TimelineBlock[] = [];
    let time = 0;

    for (const process of sorted) {
      if (time < process.arrival) {
        blocks.push({ label: 'IDLE', start: time, end: process.arrival });
        time = process.arrival;
      }

      blocks.push({
        label: process.name,
        start: time,
        end: time + process.burst,
      });

      time += process.burst;
    }

    return blocks;
  }

  private getAverageWaitingTime(timeline: TimelineBlock[], list: AngularProcess[]): number {
    let totalWaiting = 0;

    for (const process of list) {
      const firstRun = timeline.find((block) => block.label === process.name);
      if (firstRun) {
        totalWaiting += firstRun.start - process.arrival;
      }
    }

    return totalWaiting / list.length;
  }
}
