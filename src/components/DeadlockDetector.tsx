import React, { useState } from 'react';
import {
  runBankersAlgorithm,
  detectCycleInRAG,
  generateSampleDeadlockScenario,
  generateDeadlockedScenario,
  DeadlockProcess,
  Resource,
  DeadlockResult,
  RAGEdge,
} from '../engine/deadlock';
import { ShieldCheck, ShieldAlert, Play, Database } from 'lucide-react';

export function DeadlockDetector() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [processes, setProcesses] = useState<DeadlockProcess[]>([]);
  const [available, setAvailable] = useState<number[]>([]);
  const [result, setResult] = useState<DeadlockResult | null>(null);
  const [cycleResult, setCycleResult] = useState<{ hasCycle: boolean; cycle: string[] } | null>(null);

  const loadSafe = () => {
    const s = generateSampleDeadlockScenario();
    setResources(s.resources);
    setProcesses(s.processes);
    setAvailable(s.available);
    setResult(null);
    setCycleResult(null);
  };

  const loadDeadlocked = () => {
    const s = generateDeadlockedScenario();
    setResources(s.resources);
    setProcesses(s.processes);
    setAvailable(s.available);
    setResult(null);
    setCycleResult(null);
  };

  const detect = () => {
    if (processes.length === 0) return;
    setResult(runBankersAlgorithm(processes, available));
  };

  const detectCycle = () => {
    if (processes.length === 0) return;
    const edges: RAGEdge[] = [];

    for (const p of processes) {
      p.allocation.forEach((count, idx) => {
        if (count > 0) {
          edges.push({ from: `R${idx + 1}`, to: `P${p.pid}`, type: 'assignment' });
        }
      });

      p.need.forEach((count, idx) => {
        if (count > 0) {
          edges.push({ from: `P${p.pid}`, to: `R${idx + 1}`, type: 'request' });
        }
      });
    }

    setCycleResult(detectCycleInRAG(edges));
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button onClick={loadSafe} className="bg-secondary text-secondary-foreground font-mono text-sm px-4 py-2 rounded-md hover:bg-muted border border-border flex items-center gap-2">
          <Database size={14} /> SAFE SCENARIO
        </button>
        <button onClick={loadDeadlocked} className="bg-secondary text-secondary-foreground font-mono text-sm px-4 py-2 rounded-md hover:bg-muted border border-border flex items-center gap-2">
          <ShieldAlert size={14} /> DEADLOCK SCENARIO
        </button>
        <button onClick={detect} disabled={processes.length === 0} className="bg-primary text-primary-foreground font-mono text-sm px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2 disabled:opacity-40">
          <Play size={14} /> DETECT
        </button>
        <button onClick={detectCycle} disabled={processes.length === 0} className="bg-secondary text-secondary-foreground font-mono text-sm px-4 py-2 rounded-md hover:bg-muted border border-border flex items-center gap-2 disabled:opacity-40">
          <ShieldAlert size={14} /> GRAPH CYCLE CHECK
        </button>
      </div>

      {processes.length > 0 && (
        <>
          {/* Resources */}
          <div>
            <h3 className="text-xs font-mono text-muted-foreground mb-2">RESOURCES</h3>
            <div className="flex gap-3">
              {resources.map((r, i) => (
                <div key={i} className="bg-secondary rounded-md px-3 py-2 text-center">
                  <div className="text-xs font-mono text-muted-foreground">{r.name}</div>
                  <div className="text-sm font-mono text-foreground">Total: {r.total}</div>
                  <div className="text-sm font-mono text-primary">Avail: {available[i]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Process-Resource Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs">
                  <th className="text-left py-2 px-3">PROCESS</th>
                  {resources.map(r => (
                    <th key={r.id} className="text-center py-2 px-2" colSpan={3}>
                      {r.name}
                    </th>
                  ))}
                </tr>
                <tr className="border-b border-border text-muted-foreground text-xs">
                  <th className="py-1 px-3"></th>
                  {resources.map(r => (
                    <React.Fragment key={r.id}>
                      <th className="py-1 px-1 text-center text-primary/70">Alloc</th>
                      <th className="py-1 px-1 text-center text-warning/70">Max</th>
                      <th className="py-1 px-1 text-center text-accent/70">Need</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processes.map(p => (
                  <tr key={p.pid} className="border-b border-border/50">
                    <td className="py-2 px-3 font-semibold text-foreground">{p.name}</td>
                    {resources.map((_, ri) => (
                      <React.Fragment key={ri}>
                        <td className="py-2 px-1 text-center text-primary">{p.allocation[ri]}</td>
                        <td className="py-2 px-1 text-center text-warning">{p.maxNeed[ri]}</td>
                        <td className="py-2 px-1 text-center text-accent">{p.need[ri]}</td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-3">
          {/* Status banner */}
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${
            result.safe
              ? 'bg-accent/10 border-accent/30'
              : 'bg-destructive/10 border-destructive/30'
          }`}>
            {result.safe ? (
              <ShieldCheck size={24} className="text-accent" />
            ) : (
              <ShieldAlert size={24} className="text-destructive" />
            )}
            <div>
              <div className={`text-sm font-mono font-bold ${result.safe ? 'text-accent' : 'text-destructive'}`}>
                {result.safe ? 'SYSTEM IS IN SAFE STATE' : '⚠ DEADLOCK DETECTED'}
              </div>
              {result.safe ? (
                <div className="text-xs font-mono text-muted-foreground mt-1">
                  Safe Sequence: {result.safeSequence.map(pid => `P${pid}`).join(' → ')}
                </div>
              ) : (
                <div className="text-xs font-mono text-muted-foreground mt-1">
                  Deadlocked: {result.deadlockedProcesses.map(pid => `P${pid}`).join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-xs font-mono text-muted-foreground mb-2">BANKER'S ALGORITHM STEPS</h3>
            <div className="space-y-1">
              {result.steps.map((step, i) => (
                <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-md text-xs font-mono ${
                  step.canProceed ? 'bg-accent/5' : 'bg-destructive/5'
                }`}>
                  <span className={`font-bold ${step.canProceed ? 'text-accent' : 'text-destructive'}`}>
                    {step.canProceed ? '✓' : '✗'}
                  </span>
                  <span className="text-muted-foreground">{step.reason}</span>
                  <span className="ml-auto text-muted-foreground/60">
                    Available: [{step.available.join(', ')}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {cycleResult && (
        <div className={`rounded-lg border p-3 text-xs font-mono ${cycleResult.hasCycle ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'border-accent/30 bg-accent/10 text-accent'}`}>
          {cycleResult.hasCycle
            ? `Cycle detected in resource-allocation graph: ${cycleResult.cycle.join(' -> ')}`
            : 'No cycle detected in resource-allocation graph.'}
        </div>
      )}

      {processes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground font-mono text-sm">
          Load a scenario to begin deadlock detection.
        </div>
      )}
    </div>
  );
}
