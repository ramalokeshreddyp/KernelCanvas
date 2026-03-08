# Angular Snippets

This folder contains optional Angular sample code that is intentionally isolated from the React app.

## Included sample

- `scheduler-preview.component.ts`: Standalone Angular component that renders a simple FCFS timeline and average waiting time.
- `process-simulator/process.model.ts`: Process and schedule result models.
- `process-simulator/scheduler.service.ts`: FCFS and Round Robin scheduler logic in Angular service style.
- `process-simulator/scheduler-dashboard.component.ts`: Standalone Angular dashboard component using the scheduler service.

## Use in an Angular app

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { SchedulerDashboardComponent } from './process-simulator/scheduler-dashboard.component';

bootstrapApplication(SchedulerDashboardComponent);
```

## Notes

- These snippets are not part of the React app runtime.
- They are provided as reusable Angular examples and can be copied into a real Angular workspace.

This repository's current build pipeline does not compile this folder.
