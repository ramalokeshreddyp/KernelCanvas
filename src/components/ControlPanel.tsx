import { SchedulingAlgorithm, MemoryAlgorithm } from '../engine/types';
import { Play, RotateCcw, Database } from 'lucide-react';

interface ControlPanelProps {
  algorithm: SchedulingAlgorithm;
  setAlgorithm: (a: SchedulingAlgorithm) => void;
  memoryAlgorithm: MemoryAlgorithm;
  setMemoryAlgorithm: (a: MemoryAlgorithm) => void;
  timeQuantum: number;
  setTimeQuantum: (q: number) => void;
  onRun: () => void;
  onReset: () => void;
  onLoadSamples: () => void;
  isRunning: boolean;
  hasProcesses: boolean;
}

const schedAlgos: { value: SchedulingAlgorithm; label: string; desc: string }[] = [
  { value: 'FCFS', label: 'FCFS', desc: 'First Come First Serve' },
  { value: 'SJF', label: 'SJF', desc: 'Shortest Job First' },
  { value: 'RR', label: 'RR', desc: 'Round Robin' },
  { value: 'PRIORITY', label: 'PRI', desc: 'Priority Scheduling' },
];

const memAlgos: { value: MemoryAlgorithm; label: string }[] = [
  { value: 'FIRST_FIT', label: 'First Fit' },
  { value: 'BEST_FIT', label: 'Best Fit' },
  { value: 'WORST_FIT', label: 'Worst Fit' },
];

export function ControlPanel({
  algorithm, setAlgorithm, memoryAlgorithm, setMemoryAlgorithm,
  timeQuantum, setTimeQuantum, onRun, onReset, onLoadSamples, isRunning, hasProcesses,
}: ControlPanelProps) {
  return (
    <div className="space-y-4">
      {/* Scheduling algorithm */}
      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">CPU SCHEDULING</label>
        <div className="flex gap-1.5 flex-wrap">
          {schedAlgos.map(a => (
            <button
              key={a.value}
              onClick={() => setAlgorithm(a.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                algorithm === a.value
                  ? 'bg-primary text-primary-foreground glow-box-cyan'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
              title={a.desc}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time quantum for RR */}
      {algorithm === 'RR' && (
        <div>
          <label className="text-xs font-mono text-muted-foreground mb-2 block">TIME QUANTUM</label>
          <input
            type="number"
            value={timeQuantum}
            onChange={e => setTimeQuantum(Math.max(1, +e.target.value))}
            min={1}
            className="bg-secondary border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground w-20 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      {/* Memory algorithm */}
      <div>
        <label className="text-xs font-mono text-muted-foreground mb-2 block">MEMORY ALLOCATION</label>
        <div className="flex gap-1.5 flex-wrap">
          {memAlgos.map(a => (
            <button
              key={a.value}
              onClick={() => setMemoryAlgorithm(a.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                memoryAlgorithm === a.value
                  ? 'bg-accent text-accent-foreground glow-box-green'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onRun}
          disabled={!hasProcesses || isRunning}
          className="flex-1 bg-primary text-primary-foreground font-mono text-sm px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play size={16} />
          {isRunning ? 'RUNNING...' : 'EXECUTE'}
        </button>
        <button
          onClick={onReset}
          className="bg-secondary text-secondary-foreground font-mono text-sm px-4 py-2.5 rounded-md hover:bg-muted transition-colors flex items-center gap-2"
        >
          <RotateCcw size={16} />
          RESET
        </button>
        <button
          onClick={onLoadSamples}
          className="bg-secondary text-secondary-foreground font-mono text-sm px-4 py-2.5 rounded-md hover:bg-muted transition-colors flex items-center gap-2"
        >
          <Database size={16} />
          SAMPLES
        </button>
      </div>
    </div>
  );
}
