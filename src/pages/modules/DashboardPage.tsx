import { Activity, BarChart3, GitCompare, Monitor } from 'lucide-react';
import { MetricsPanel } from '@/components/MetricsPanel';
import { CPUUtilizationChart } from '@/components/CPUUtilizationChart';
import { AlgorithmComparison } from '@/components/AlgorithmComparison';
import { ProcessTable } from '@/components/ProcessTable';
import { SystemMonitorPanel } from '@/components/SystemMonitorPanel';
import { SystemHealthCharts } from '@/components/SystemHealthCharts';
import { useSimulationContext } from '@/context/SimulationContext';
import { PageIntro, PanelCard, SectionHeader } from '@/components/layout/PagePrimitives';

export default function DashboardPage() {
  const sim = useSimulationContext();

  return (
    <div className="space-y-6 page-enter">
      <PageIntro
        title="Performance Dashboard"
        subtitle="Track utilization, compare algorithms, and audit process outcomes in one polished view."
      />

      <MetricsPanel result={sim.result} />

      {!sim.result && (
        <PanelCard>
          <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-border bg-secondary/20 p-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-mono font-semibold text-foreground">No simulation result yet.</p>
              <p className="text-xs font-mono text-muted-foreground">Run a demo scenario to populate CPU and health charts instantly.</p>
            </div>
            <button
              onClick={sim.runSampleSimulation}
              disabled={sim.isRunning}
              className="rounded-md bg-primary px-4 py-2 text-xs font-mono font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sim.isRunning ? 'RUNNING DEMO...' : 'RUN DEMO CHARTS'}
            </button>
          </div>
        </PanelCard>
      )}

      <PanelCard>
        <SectionHeader icon={Activity} title="CPU UTILIZATION" subtitle="Instant vs running average" />
        <CPUUtilizationChart result={sim.result} />
      </PanelCard>

      <PanelCard>
        <SectionHeader icon={BarChart3} title="HEALTH CHARTS" subtitle="Doughnut + bar analytics" />
        <SystemHealthCharts result={sim.result} />
      </PanelCard>

      <PanelCard>
        <SectionHeader icon={GitCompare} title="ALGORITHM COMPARISON" subtitle="Cross-check efficiency quickly" />
        <AlgorithmComparison processes={sim.processes} timeQuantum={sim.timeQuantum} />
      </PanelCard>

      <PanelCard>
        <SectionHeader icon={Monitor} title="SYSTEM MONITOR" subtitle="Task-manager style live process stats" />
        <SystemMonitorPanel processes={sim.processes} result={sim.result} memoryBlocks={sim.memoryBlocks} />
      </PanelCard>

      <PanelCard>
        <SectionHeader icon={Monitor} title="PROCESS SNAPSHOT" subtitle={`${sim.processes.length} processes`} />
        <ProcessTable processes={sim.processes} onRemove={sim.removeProcess} onUpdate={sim.updateProcess} />
      </PanelCard>
    </div>
  );
}
