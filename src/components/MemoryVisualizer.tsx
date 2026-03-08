import { MemoryBlock } from '../engine/types';
import { getMemoryUsage } from '../engine/memory';

interface MemoryVisualizerProps {
  blocks: MemoryBlock[];
  totalMemory: number;
}

export function MemoryVisualizer({ blocks, totalMemory }: MemoryVisualizerProps) {
  const usage = getMemoryUsage(blocks);

  return (
    <div className="space-y-3">
      {/* Memory bar */}
      <div className="flex gap-0.5 h-10 rounded-md overflow-hidden border border-border">
        {blocks.map((block, i) => {
          const width = (block.size / totalMemory) * 100;
          return (
            <div
              key={i}
              className="memory-block flex items-center justify-center text-xs font-mono font-semibold relative group"
              style={{
                width: `${width}%`,
                backgroundColor: block.process ? block.process.color : 'hsl(var(--secondary))',
                color: block.process ? '#000' : 'hsl(var(--muted-foreground))',
                minWidth: '16px',
              }}
            >
              <span className="truncate px-0.5">
                {block.process ? block.process.name : 'Free'}
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-md px-2 py-1 text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {block.process ? `${block.process.name} (${block.size}KB)` : `Free (${block.size}KB)`}
                <br />
                Addr: {block.startAddress}–{block.startAddress + block.size}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatBox label="USED" value={`${usage.used}KB`} accent />
        <StatBox label="FREE" value={`${usage.free}KB`} />
        <StatBox label="USAGE" value={`${((usage.used / usage.total) * 100).toFixed(0)}%`} accent />
        <StatBox label="FRAG" value={`${usage.fragmentation.toFixed(0)}%`} warn={usage.fragmentation > 30} />
      </div>
    </div>
  );
}

function StatBox({ label, value, accent, warn }: { label: string; value: string; accent?: boolean; warn?: boolean }) {
  return (
    <div className="bg-secondary rounded-md px-3 py-2 text-center">
      <div className="text-xs font-mono text-muted-foreground">{label}</div>
      <div className={`text-sm font-mono font-bold ${warn ? 'text-warning' : accent ? 'text-primary' : 'text-foreground'}`}>
        {value}
      </div>
    </div>
  );
}
