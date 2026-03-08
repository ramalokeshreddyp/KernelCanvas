import { describe, expect, it } from 'vitest';
import { allocateMemory, deallocateMemory, getMemoryUsage, initializeMemory } from '@/engine/memory';
import { Process } from '@/engine/types';

function process(pid: number, memoryRequired: number): Process {
  return {
    pid,
    name: `P${pid}`,
    arrivalTime: 0,
    burstTime: 2,
    remainingTime: 2,
    priority: 1,
    memoryRequired,
    state: 'NEW',
    color: '#00e5ff',
    waitingTime: 0,
    turnaroundTime: 0,
    completionTime: 0,
    startTime: 0,
  };
}

describe('memory allocation engine', () => {
  it('allocates and deallocates with merging', () => {
    let blocks = initializeMemory(100);
    blocks = allocateMemory(blocks, process(1, 20), 'FIRST_FIT');
    blocks = allocateMemory(blocks, process(2, 30), 'FIRST_FIT');

    expect(blocks.some((b) => b.process?.pid === 1)).toBe(true);
    expect(blocks.some((b) => b.process?.pid === 2)).toBe(true);

    blocks = deallocateMemory(blocks, 1);
    blocks = deallocateMemory(blocks, 2);

    expect(blocks.length).toBe(1);
    expect(blocks[0].process).toBeNull();
    expect(blocks[0].size).toBe(100);
  });

  it('returns unchanged blocks when memory is insufficient', () => {
    const blocks = initializeMemory(10);
    const updated = allocateMemory(blocks, process(1, 20), 'BEST_FIT');
    expect(updated).toEqual(blocks);
  });

  it('reports usage and fragmentation safely', () => {
    let blocks = initializeMemory(64);
    blocks = allocateMemory(blocks, process(1, 16), 'WORST_FIT');
    const usage = getMemoryUsage(blocks);

    expect(usage.total).toBe(64);
    expect(usage.used).toBe(16);
    expect(usage.free).toBe(48);
    expect(usage.fragmentation).toBeGreaterThanOrEqual(0);
  });
});
