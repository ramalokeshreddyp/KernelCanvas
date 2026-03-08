import { MemoryBlock, Process, SchedulingResult } from '@/engine/types';
import { getMemoryUsage } from '@/engine/memory';

interface SystemMonitorPanelProps {
  processes: Process[];
  result: SchedulingResult | null;
  memoryBlocks: MemoryBlock[];
}

function buildCpuShare(result: SchedulingResult | null): Record<number, number> {
  if (!result || result.ganttChart.length === 0) return {};
  const total = result.ganttChart[result.ganttChart.length - 1].endTime || 0;
  const used: Record<number, number> = {};

  for (const block of result.ganttChart) {
    if (block.pid === -1) continue;
    used[block.pid] = (used[block.pid] ?? 0) + (block.endTime - block.startTime);
  }

  const percentages: Record<number, number> = {};
  for (const [pid, time] of Object.entries(used)) {
    percentages[Number(pid)] = total > 0 ? (time / total) * 100 : 0;
  }

  return percentages;
}

export function SystemMonitorPanel({ processes, result, memoryBlocks }: SystemMonitorPanelProps) {
  const cpuShare = buildCpuShare(result);
  const usage = getMemoryUsage(memoryBlocks);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="CPU UTIL" value={result ? `${result.cpuUtilization.toFixed(1)}%` : '--'} accent />
        <Stat label="THROUGHPUT" value={result ? result.throughput.toFixed(3) : '--'} />
        <Stat label="MEM USED" value={`${usage.used}KB`} accent />
        <Stat label="MEM FREE" value={`${usage.free}KB`} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="border-b border-border bg-secondary/60 text-xs text-muted-foreground">
              <th className="px-3 py-2 text-left">PID</th>
              <th className="px-3 py-2 text-left">STATE</th>
              <th className="px-3 py-2 text-right">CPU%</th>
              <th className="px-3 py-2 text-right">MEMORY</th>
            </tr>
          </thead>
          <tbody>
            {processes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-xs text-muted-foreground">
                  No active process data. Add or load sample processes to monitor live state.
                </td>
              </tr>
            )}
            {processes.map((p) => (
              <tr key={p.pid} className="border-b border-border/40 text-xs">
                <td className="px-3 py-2 text-foreground">{p.pid}</td>
                <td className="px-3 py-2">
                  <span className={`state-${p.state.toLowerCase()} font-semibold`}>{p.state}</span>
                </td>
                <td className="px-3 py-2 text-right text-primary">{(cpuShare[p.pid] ?? 0).toFixed(1)}%</td>
                <td className="px-3 py-2 text-right text-foreground">{p.memoryRequired}KB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-center">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className={`text-sm font-bold ${accent ? 'text-accent' : 'text-foreground'}`}>{value}</div>
    </div>
  );
}
