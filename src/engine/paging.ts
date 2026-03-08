import { PageAlgorithm } from './types';

export interface PageReplacementResult {
  frames: number[][];       // frame state at each step
  faults: boolean[];        // whether each ref caused a fault
  totalReferences: number;
  totalFaults: number;
  totalHits: number;
  hitRatio: number;
  faultRatio: number;
  referenceString: number[];
}

function fifo(refs: number[], frameCount: number): PageReplacementResult {
  const frames: number[][] = [];
  const faults: boolean[] = [];
  const current: number[] = [];
  let pointer = 0;
  let totalFaults = 0;

  for (const page of refs) {
    if (current.includes(page)) {
      faults.push(false);
    } else {
      totalFaults++;
      faults.push(true);
      if (current.length < frameCount) {
        current.push(page);
      } else {
        current[pointer % frameCount] = page;
        pointer++;
      }
    }
    frames.push([...current]);
  }

  return buildResult(refs, frames, faults, totalFaults);
}

function lru(refs: number[], frameCount: number): PageReplacementResult {
  const frames: number[][] = [];
  const faults: boolean[] = [];
  const current: number[] = [];
  const lastUsed: Map<number, number> = new Map();
  let totalFaults = 0;

  refs.forEach((page, i) => {
    if (current.includes(page)) {
      faults.push(false);
      lastUsed.set(page, i);
    } else {
      totalFaults++;
      faults.push(true);
      if (current.length < frameCount) {
        current.push(page);
      } else {
        // Find LRU page
        let lruPage = current[0];
        let lruTime = lastUsed.get(current[0]) ?? -1;
        for (const p of current) {
          const t = lastUsed.get(p) ?? -1;
          if (t < lruTime) {
            lruTime = t;
            lruPage = p;
          }
        }
        const idx = current.indexOf(lruPage);
        current[idx] = page;
      }
      lastUsed.set(page, i);
    }
    frames.push([...current]);
  });

  return buildResult(refs, frames, faults, totalFaults);
}

function optimal(refs: number[], frameCount: number): PageReplacementResult {
  const frames: number[][] = [];
  const faults: boolean[] = [];
  const current: number[] = [];
  let totalFaults = 0;

  refs.forEach((page, i) => {
    if (current.includes(page)) {
      faults.push(false);
    } else {
      totalFaults++;
      faults.push(true);
      if (current.length < frameCount) {
        current.push(page);
      } else {
        // Find page used farthest in future
        let farthestPage = current[0];
        let farthestDist = -1;
        for (const p of current) {
          const nextUse = refs.indexOf(p, i + 1);
          if (nextUse === -1) {
            farthestPage = p;
            break;
          }
          if (nextUse > farthestDist) {
            farthestDist = nextUse;
            farthestPage = p;
          }
        }
        const idx = current.indexOf(farthestPage);
        current[idx] = page;
      }
    }
    frames.push([...current]);
  });

  return buildResult(refs, frames, faults, totalFaults);
}

function buildResult(
  refs: number[], frames: number[][], faults: boolean[], totalFaults: number
): PageReplacementResult {
  const totalHits = refs.length - totalFaults;
  return {
    frames,
    faults,
    totalReferences: refs.length,
    totalFaults,
    totalHits,
    hitRatio: refs.length > 0 ? (totalHits / refs.length) * 100 : 0,
    faultRatio: refs.length > 0 ? (totalFaults / refs.length) * 100 : 0,
    referenceString: refs,
  };
}

export function runPageReplacement(
  algorithm: PageAlgorithm,
  referenceString: number[],
  frameCount: number
): PageReplacementResult {
  if (referenceString.length === 0 || frameCount <= 0) {
    return {
      frames: [], faults: [], totalReferences: 0,
      totalFaults: 0, totalHits: 0, hitRatio: 0, faultRatio: 0, referenceString: [],
    };
  }

  switch (algorithm) {
    case 'FIFO': return fifo(referenceString, frameCount);
    case 'LRU': return lru(referenceString, frameCount);
    case 'OPTIMAL': return optimal(referenceString, frameCount);
  }
}

export function generateRandomReferenceString(length: number, maxPage: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * maxPage) + 1);
}
