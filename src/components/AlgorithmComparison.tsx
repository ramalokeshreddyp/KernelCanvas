import { useState } from 'react';
import { Process, SchedulingAlgorithm } from '../engine/types';
import { runScheduler } from '../engine/scheduler';

interface AlgorithmComparisonProps {
  processes: Process[];
  timeQuantum: number;
}

const algorithms: { value: SchedulingAlgorithm; label: string }[] = [
  { value: 'FCFS', label: 'FCFS' },
  { value: 'SJF', label: 'SJF' },
  { value: 'RR', label: 'Round Robin' },
  { value: 'PRIORITY', label: 'Priority' },
];

export function AlgorithmComparison({ processes, timeQuantum }: AlgorithmComparisonProps) {
  const [results, setResults] = useState<{ algo: string; avgWait: number; avgTat: number; cpuUtil: number; throughput: number }[]>([]);

  const compare = () => {
    if (processes.length === 0) return;
    const res = algorithms.map(a => {
      const r = runScheduler(a.value, processes, timeQuantum);
      return {
        algo: a.label,
        avgWait: r.avgWaitingTime,
        avgTat: r.avgTurnaroundTime,
        cpuUtil: r.cpuUtilization,
        throughput: r.throughput,
      };
    });
    setResults(res);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={compare}
        disabled={processes.length === 0}
        className="bg-primary text-primary-foreground font-mono text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        COMPARE ALL ALGORITHMS
      </button>

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left py-2 px-3">ALGORITHM</th>
                <th className="text-right py-2 px-3">AVG WAIT</th>
                <th className="text-right py-2 px-3">AVG TAT</th>
                <th className="text-right py-2 px-3">CPU %</th>
                <th className="text-right py-2 px-3">THROUGHPUT</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => {
                const bestWait = Math.min(...results.map(x => x.avgWait));
                const bestTat = Math.min(...results.map(x => x.avgTat));
                return (
                  <tr key={r.algo} className="border-b border-border/50">
                    <td className="py-2 px-3 text-foreground font-semibold">{r.algo}</td>
                    <td className={`py-2 px-3 text-right ${r.avgWait === bestWait ? 'text-accent font-bold' : ''}`}>
                      {r.avgWait.toFixed(2)}
                    </td>
                    <td className={`py-2 px-3 text-right ${r.avgTat === bestTat ? 'text-accent font-bold' : ''}`}>
                      {r.avgTat.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right">{r.cpuUtil.toFixed(1)}%</td>
                    <td className="py-2 px-3 text-right">{r.throughput.toFixed(3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Bar chart visualization */}
          <div className="mt-4 space-y-2">
            <div className="text-xs font-mono text-muted-foreground">AVG WAITING TIME COMPARISON</div>
            {results.map(r => {
              const max = Math.max(...results.map(x => x.avgWait));
              const width = max > 0 ? (r.avgWait / max) * 100 : 0;
              return (
                <div key={r.algo} className="flex items-center gap-2">
                  <span className="text-xs font-mono w-20 text-right text-muted-foreground">{r.algo}</span>
                  <div className="flex-1 bg-secondary rounded-sm h-5 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-sm transition-all duration-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono w-12 text-right text-foreground">{r.avgWait.toFixed(1)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
