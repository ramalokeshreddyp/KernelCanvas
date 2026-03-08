import { SchedulingResult } from '../engine/types';

interface MetricsPanelProps {
  result: SchedulingResult | null;
}

export function MetricsPanel({ result }: MetricsPanelProps) {
  if (!result) {
    return (
      <div className="text-center py-8 text-muted-foreground font-mono text-sm">
        Run a simulation to see metrics.
      </div>
    );
  }

  const metrics = [
    { label: 'AVG WAITING', value: result.avgWaitingTime.toFixed(2), unit: 'ms', color: 'text-primary' },
    { label: 'AVG TURNAROUND', value: result.avgTurnaroundTime.toFixed(2), unit: 'ms', color: 'text-primary' },
    { label: 'CPU UTILIZATION', value: result.cpuUtilization.toFixed(1), unit: '%', color: 'text-accent' },
    { label: 'THROUGHPUT', value: result.throughput.toFixed(3), unit: 'p/ms', color: 'text-accent' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map(m => (
        <div key={m.label} className="bg-secondary rounded-lg p-4 glow-box-cyan">
          <div className="text-xs font-mono text-muted-foreground mb-1">{m.label}</div>
          <div className={`text-2xl font-mono font-bold ${m.color}`}>
            {m.value}
            <span className="text-xs text-muted-foreground ml-1">{m.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
