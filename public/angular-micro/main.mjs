import 'https://esm.sh/zone.js@0.14.10';
import 'https://esm.sh/@angular/compiler@17.3.12';
import { Component, NgModule } from 'https://esm.sh/@angular/core@17.3.12';
import { BrowserModule } from 'https://esm.sh/@angular/platform-browser@17.3.12';
import { platformBrowserDynamic } from 'https://esm.sh/@angular/platform-browser-dynamic@17.3.12';
import { CommonModule } from 'https://esm.sh/@angular/common@17.3.12';

class MiniSchedulerComponent {
  constructor() {
    this.title = 'Angular Micro Scheduler';
    this.quantum = 2;
    this.processes = [
      { name: 'P1', burst: 5 },
      { name: 'P2', burst: 3 },
      { name: 'P3', burst: 2 },
    ];
    this.slices = [];
    this.avgBurst = 0;
    this.run();
  }

  run() {
    this.slices = [];
    let time = 0;

    for (const process of this.processes) {
      let remaining = process.burst;
      while (remaining > 0) {
        const exec = Math.min(this.quantum, remaining);
        this.slices.push({ name: process.name, start: time, end: time + exec });
        remaining -= exec;
        time += exec;
      }
    }

    this.avgBurst = this.processes.reduce((sum, p) => sum + p.burst, 0) / this.processes.length;
  }
}

Component({
  selector: 'app-mini-scheduler',
  standalone: false,
  imports: [CommonModule],
  template: `
    <section style="padding: 10px;">
      <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px;">
        <h3 style="margin:0; font-size:13px; color:#143e6b; letter-spacing:.02em;">{{ title }}</h3>
        <button
          type="button"
          (click)="run()"
          style="border:1px solid #9fb6d3; border-radius:999px; background:#fff; padding:3px 9px; font-size:11px; cursor:pointer;"
        >
          Recompute
        </button>
      </div>

      <div style="display:grid; gap:6px; max-height:110px; overflow:auto;">
        <div
          *ngFor="let block of slices"
          style="display:flex; justify-content:space-between; font-size:11px; border:1px solid #d7e1ef; border-radius:8px; background:#fff; padding:4px 8px;"
        >
          <strong>{{ block.name }}</strong>
          <span>{{ block.start }} - {{ block.end }}</span>
        </div>
      </div>

      <p style="margin:8px 0 0; font-size:11px; color:#254f79;">Avg Burst: {{ avgBurst.toFixed(2) }}</p>
    </section>
  `,
})(MiniSchedulerComponent);

class AppModule {}

NgModule({
  declarations: [MiniSchedulerComponent],
  imports: [BrowserModule, CommonModule],
  bootstrap: [MiniSchedulerComponent],
})(AppModule);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    const status = document.getElementById('boot-status');
    if (status) {
      status.style.display = 'none';
    }
  })
  .catch((error) => {
    const status = document.getElementById('boot-status');
    if (status) {
      status.textContent = 'Angular widget failed to load.';
    }
    console.error(error);
  });
