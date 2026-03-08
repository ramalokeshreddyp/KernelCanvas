import { MemoryBlock, MemoryAlgorithm, Process } from './types';

export function initializeMemory(totalSize: number): MemoryBlock[] {
  return [{ id: 0, size: totalSize, process: null, startAddress: 0 }];
}

export function allocateMemory(
  blocks: MemoryBlock[],
  process: Process,
  algorithm: MemoryAlgorithm
): MemoryBlock[] {
  const newBlocks = blocks.map(b => ({ ...b }));
  let targetIndex = -1;

  const freeBlocks = newBlocks
    .map((b, i) => ({ block: b, index: i }))
    .filter(({ block }) => block.process === null && block.size >= process.memoryRequired);

  if (freeBlocks.length === 0) return newBlocks;

  switch (algorithm) {
    case 'FIRST_FIT':
      targetIndex = freeBlocks[0].index;
      break;
    case 'BEST_FIT':
      targetIndex = freeBlocks.sort((a, b) => a.block.size - b.block.size)[0].index;
      break;
    case 'WORST_FIT':
      targetIndex = freeBlocks.sort((a, b) => b.block.size - a.block.size)[0].index;
      break;
  }

  if (targetIndex === -1) return newBlocks;

  const target = newBlocks[targetIndex];
  const remaining = target.size - process.memoryRequired;

  const allocated: MemoryBlock = {
    id: Date.now(),
    size: process.memoryRequired,
    process,
    startAddress: target.startAddress,
  };

  if (remaining > 0) {
    const freeBlock: MemoryBlock = {
      id: Date.now() + 1,
      size: remaining,
      process: null,
      startAddress: target.startAddress + process.memoryRequired,
    };
    newBlocks.splice(targetIndex, 1, allocated, freeBlock);
  } else {
    newBlocks.splice(targetIndex, 1, allocated);
  }

  return newBlocks;
}

export function deallocateMemory(blocks: MemoryBlock[], pid: number): MemoryBlock[] {
  const newBlocks = blocks.map(b =>
    b.process?.pid === pid ? { ...b, process: null } : { ...b }
  );

  // Merge adjacent free blocks
  const merged: MemoryBlock[] = [];
  for (const block of newBlocks) {
    const last = merged[merged.length - 1];
    if (last && last.process === null && block.process === null) {
      last.size += block.size;
    } else {
      merged.push({ ...block });
    }
  }

  return merged;
}

export function getMemoryUsage(blocks: MemoryBlock[]): {
  used: number;
  free: number;
  total: number;
  fragmentation: number;
} {
  const total = blocks.reduce((s, b) => s + b.size, 0);
  const used = blocks.filter(b => b.process !== null).reduce((s, b) => s + b.size, 0);
  const free = total - used;
  const freeBlocks = blocks.filter(b => b.process === null);
  const largestFree = freeBlocks.length > 0 ? Math.max(...freeBlocks.map(b => b.size)) : 0;
  const fragmentation = free > 0 ? ((free - largestFree) / free) * 100 : 0;

  return { used, free, total, fragmentation };
}
