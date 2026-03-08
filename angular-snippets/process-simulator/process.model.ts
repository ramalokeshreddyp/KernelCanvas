export interface ProcessInput {
  pid: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

export interface TimelineEntry {
  pid: number;
  name: string;
  startTime: number;
  endTime: number;
}

export interface ScheduleSummary {
  timeline: TimelineEntry[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  cpuUtilization: number;
}
