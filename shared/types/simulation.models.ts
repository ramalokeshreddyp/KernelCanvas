export interface ProcessSnapshot {
  pid: number;
  state: 'NEW' | 'READY' | 'RUNNING' | 'WAITING' | 'TERMINATED';
  cpuPercent: number;
  memoryKb: number;
}

export interface DashboardMetrics {
  cpuUtilization: number;
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  throughput: number;
  pageFaults: number;
}
