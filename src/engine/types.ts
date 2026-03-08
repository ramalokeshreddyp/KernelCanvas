// Process types and interfaces

export type ProcessState = 'NEW' | 'READY' | 'RUNNING' | 'WAITING' | 'TERMINATED';

export interface Process {
  pid: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  remainingTime: number;
  priority: number;
  memoryRequired: number;
  state: ProcessState;
  color: string;
  waitingTime: number;
  turnaroundTime: number;
  completionTime: number;
  startTime: number;
}

export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'RR' | 'PRIORITY';

export type MemoryAlgorithm = 'FIRST_FIT' | 'BEST_FIT' | 'WORST_FIT';

export type PageAlgorithm = 'FIFO' | 'LRU' | 'OPTIMAL';

export interface GanttBlock {
  pid: number;
  processName: string;
  startTime: number;
  endTime: number;
  color: string;
}

export interface MemoryBlock {
  id: number;
  size: number;
  process: Process | null;
  startAddress: number;
}

export interface SchedulingResult {
  ganttChart: GanttBlock[];
  completedProcesses: Process[];
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  cpuUtilization: number;
  throughput: number;
}

export interface SimulationState {
  processes: Process[];
  currentTime: number;
  isRunning: boolean;
  speed: number;
  algorithm: SchedulingAlgorithm;
  timeQuantum: number;
  ganttChart: GanttBlock[];
  memoryBlocks: MemoryBlock[];
  memoryAlgorithm: MemoryAlgorithm;
  totalMemory: number;
}

export const PROCESS_COLORS = [
  '#00e5ff', '#39ff14', '#ff6b35', '#ffd700',
  '#ff1493', '#7b68ee', '#00fa9a', '#ff4444',
  '#1e90ff', '#ff8c00', '#da70d6', '#32cd32',
];

export const getProcessColor = (index: number): string => {
  return PROCESS_COLORS[index % PROCESS_COLORS.length];
};
