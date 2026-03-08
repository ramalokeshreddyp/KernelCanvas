import { Activity, ArrowRight, Cpu, HardDrive, Layers, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSimulationContext } from '@/context/SimulationContext';
import { PageIntro, PanelCard } from '@/components/layout/PagePrimitives';

const modules = [
  {
    title: 'CPU Scheduling',
    subtitle: 'Build and execute process workloads with FCFS, SJF, RR, and Priority.',
    to: '/scheduling',
    icon: Cpu,
  },
  {
    title: 'Memory Allocation',
    subtitle: 'Visualize block allocation and fragmentation using fit strategies.',
    to: '/memory',
    icon: HardDrive,
  },
  {
    title: 'Page Replacement',
    subtitle: 'Compare FIFO, LRU, and Optimal with frame-by-frame outcomes.',
    to: '/paging',
    icon: Layers,
  },
  {
    title: 'Deadlock Detection',
    subtitle: "Analyze safe and unsafe states using Banker's algorithm.",
    to: '/deadlock',
    icon: ShieldAlert,
  },
  {
    title: 'Performance Dashboard',
    subtitle: 'Track CPU utilization, metrics, and algorithm-level outcomes.',
    to: '/dashboard',
    icon: Activity,
  },
];

export default function HomePage() {
  const sim = useSimulationContext();

  return (
    <div className="space-y-6 page-enter">
      <PageIntro
        title="ProcessOS Control Center"
        subtitle="Professional multi-page simulator for scheduling, memory, paging, deadlock analysis, and live performance insights."
      />

      <PanelCard>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            <p className="text-[11px] font-mono text-muted-foreground">ACTIVE PROCESSES</p>
            <p className="text-xl font-mono font-bold text-foreground">{sim.processes.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            <p className="text-[11px] font-mono text-muted-foreground">CPU ALGORITHM</p>
            <p className="text-xl font-mono font-bold text-foreground">{sim.algorithm}</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            <p className="text-[11px] font-mono text-muted-foreground">MEMORY STRATEGY</p>
            <p className="text-xl font-mono font-bold text-foreground">{sim.memoryAlgorithm.replace('_', ' ')}</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/30 p-3">
            <p className="text-[11px] font-mono text-muted-foreground">CPU UTILIZATION</p>
            <p className="text-xl font-mono font-bold text-foreground">
              {sim.result ? `${sim.result.cpuUtilization.toFixed(1)}%` : '--'}
            </p>
          </div>
        </div>
      </PanelCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map(({ title, subtitle, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-xl border border-border bg-card/90 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md hover:shadow-primary/20"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon size={18} />
              </span>
              <ArrowRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <h2 className="mb-1 text-base font-mono font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
