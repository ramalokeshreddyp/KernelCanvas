import { useState, useCallback } from 'react';
import { Process, SchedulingAlgorithm, MemoryAlgorithm, GanttBlock, MemoryBlock, SchedulingResult, getProcessColor } from '../engine/types';
import { runScheduler } from '../engine/scheduler';
import { initializeMemory, allocateMemory, deallocateMemory } from '../engine/memory';

const TOTAL_MEMORY = 1024;

interface AddProcessParams {
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  memoryRequired: number;
}

interface AddProcessResult {
  ok: boolean;
  error?: string;
}

interface UpdateProcessParams {
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  memoryRequired: number;
}

export function useSimulation() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
  const [memoryAlgorithm, setMemoryAlgorithm] = useState<MemoryAlgorithm>('FIRST_FIT');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>(initializeMemory(TOTAL_MEMORY));
  const [nextPid, setNextPid] = useState(1);
  const [isRunning, setIsRunning] = useState(false);

  const allocateForProcesses = useCallback((list: Process[]) => {
    let blocks = initializeMemory(TOTAL_MEMORY);
    for (const process of list) {
      const nextBlocks = allocateMemory(blocks, process, memoryAlgorithm);
      const allocated = nextBlocks.some(b => b.process?.pid === process.pid);
      if (!allocated) {
        return { ok: false as const, blocks, error: `Allocation failed for ${process.name}.` };
      }
      blocks = nextBlocks;
    }
    return { ok: true as const, blocks };
  }, [memoryAlgorithm]);

  const addProcess = useCallback((params: AddProcessParams): AddProcessResult => {
    const arrivalTime = Number.isFinite(params.arrivalTime) ? Math.max(0, Math.floor(params.arrivalTime)) : 0;
    const burstTime = Number.isFinite(params.burstTime) ? Math.max(1, Math.floor(params.burstTime)) : 1;
    const priority = Number.isFinite(params.priority) ? Math.max(1, Math.floor(params.priority)) : 1;
    const memoryRequired = Number.isFinite(params.memoryRequired) ? Math.max(1, Math.floor(params.memoryRequired)) : 1;

    if (memoryRequired > TOTAL_MEMORY) {
      return { ok: false, error: `Memory must be <= ${TOTAL_MEMORY}KB.` };
    }

    const pid = nextPid;
    const newProcess: Process = {
      pid,
      name: params.name || `P${pid}`,
      arrivalTime,
      burstTime,
      remainingTime: burstTime,
      priority,
      memoryRequired,
      state: 'NEW',
      color: getProcessColor(pid - 1),
      waitingTime: 0,
      turnaroundTime: 0,
      completionTime: 0,
      startTime: 0,
    };

    const allocatedBlocks = allocateMemory(memoryBlocks, newProcess, memoryAlgorithm);
    const allocated = allocatedBlocks.some(b => b.process?.pid === newProcess.pid);
    if (!allocated) {
      return { ok: false, error: 'Allocation failed: insufficient contiguous free memory for this process.' };
    }

    setProcesses(prev => [...prev, newProcess]);
    setNextPid(pid + 1);
    setMemoryBlocks(allocatedBlocks);

    return { ok: true };
  }, [nextPid, memoryAlgorithm, memoryBlocks]);

  const updateProcess = useCallback((pid: number, params: UpdateProcessParams): AddProcessResult => {
    const current = processes.find(p => p.pid === pid);
    if (!current) {
      return { ok: false, error: 'Process not found.' };
    }

    const arrivalTime = Number.isFinite(params.arrivalTime) ? Math.max(0, Math.floor(params.arrivalTime)) : 0;
    const burstTime = Number.isFinite(params.burstTime) ? Math.max(1, Math.floor(params.burstTime)) : 1;
    const priority = Number.isFinite(params.priority) ? Math.max(1, Math.floor(params.priority)) : 1;
    const memoryRequired = Number.isFinite(params.memoryRequired) ? Math.max(1, Math.floor(params.memoryRequired)) : 1;

    if (memoryRequired > TOTAL_MEMORY) {
      return { ok: false, error: `Memory must be <= ${TOTAL_MEMORY}KB.` };
    }

    const updated: Process = {
      ...current,
      name: params.name.trim() || current.name,
      arrivalTime,
      burstTime,
      remainingTime: current.state === 'TERMINATED' ? 0 : burstTime,
      priority,
      memoryRequired,
      waitingTime: current.state === 'TERMINATED' ? current.waitingTime : 0,
      turnaroundTime: current.state === 'TERMINATED' ? current.turnaroundTime : 0,
      completionTime: current.state === 'TERMINATED' ? current.completionTime : 0,
      startTime: current.state === 'TERMINATED' ? current.startTime : 0,
    };

    const nextProcesses = processes.map(p => (p.pid === pid ? updated : p));
    const sortedForMemory = [...nextProcesses].sort((a, b) => a.pid - b.pid);
    const allocation = allocateForProcesses(sortedForMemory);

    if (!allocation.ok) {
      return { ok: false, error: allocation.error };
    }

    setProcesses(nextProcesses);
    setMemoryBlocks(allocation.blocks);
    setResult(null);

    return { ok: true };
  }, [allocateForProcesses, processes]);

  const removeProcess = useCallback((pid: number) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
    setMemoryBlocks(prev => deallocateMemory(prev, pid));
  }, []);

  const runSimulation = useCallback(() => {
    if (processes.length === 0) return;
    setIsRunning(true);
    const res = runScheduler(algorithm, processes, timeQuantum);
    setResult(res);
    setProcesses(res.completedProcesses);
    setTimeout(() => setIsRunning(false), 500);
  }, [processes, algorithm, timeQuantum]);

  const resetSimulation = useCallback(() => {
    setProcesses([]);
    setResult(null);
    setMemoryBlocks(initializeMemory(TOTAL_MEMORY));
    setNextPid(1);
    setIsRunning(false);
  }, []);

  const buildSampleScenario = useCallback(() => {
    const samples = [
      { name: 'Init', arrivalTime: 0, burstTime: 5, priority: 1, memoryRequired: 64 },
      { name: 'Shell', arrivalTime: 1, burstTime: 3, priority: 2, memoryRequired: 128 },
      { name: 'Compiler', arrivalTime: 2, burstTime: 8, priority: 3, memoryRequired: 256 },
      { name: 'Browser', arrivalTime: 3, burstTime: 4, priority: 2, memoryRequired: 192 },
      { name: 'Editor', arrivalTime: 5, burstTime: 2, priority: 1, memoryRequired: 96 },
    ];

    let pid = 1;
    let mem = initializeMemory(TOTAL_MEMORY);
    const procs: Process[] = [];

    for (const s of samples) {
      const p: Process = {
        pid,
        name: s.name,
        arrivalTime: s.arrivalTime,
        burstTime: s.burstTime,
        remainingTime: s.burstTime,
        priority: s.priority,
        memoryRequired: s.memoryRequired,
        state: 'NEW',
        color: getProcessColor(pid - 1),
        waitingTime: 0,
        turnaroundTime: 0,
        completionTime: 0,
        startTime: 0,
      };
      procs.push(p);
      mem = allocateMemory(mem, p, memoryAlgorithm);
      pid++;
    }

    return { procs, mem, nextPid: pid };
  }, [memoryAlgorithm]);

  const addSampleProcesses = useCallback(() => {
    const { procs, mem, nextPid: sampleNextPid } = buildSampleScenario();
    setProcesses(procs);
    setMemoryBlocks(mem);
    setNextPid(sampleNextPid);
    setResult(null);
  }, [buildSampleScenario]);

  const runSampleSimulation = useCallback(() => {
    const { procs, mem, nextPid: sampleNextPid } = buildSampleScenario();
    setIsRunning(true);
    const res = runScheduler(algorithm, procs, timeQuantum);
    setResult(res);
    setProcesses(res.completedProcesses);
    setMemoryBlocks(mem);
    setNextPid(sampleNextPid);
    setTimeout(() => setIsRunning(false), 500);
  }, [algorithm, timeQuantum, buildSampleScenario]);

  return {
    processes, algorithm, setAlgorithm, memoryAlgorithm, setMemoryAlgorithm,
    timeQuantum, setTimeQuantum, result, memoryBlocks, isRunning,
    addProcess, updateProcess, removeProcess, runSimulation, resetSimulation, addSampleProcesses, runSampleSimulation,
    totalMemory: TOTAL_MEMORY,
  };
}
