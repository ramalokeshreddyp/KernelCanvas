import { Activity, BarChart3, Cpu, Monitor, Zap } from 'lucide-react';
import { ProcessForm } from '@/components/ProcessForm';
import { ProcessTable } from '@/components/ProcessTable';
import { GanttChart } from '@/components/GanttChart';
import { AnimatedGantt } from '@/components/AnimatedGantt';
import { MetricsPanel } from '@/components/MetricsPanel';
import { ControlPanel } from '@/components/ControlPanel';
import { useSimulationContext } from '@/context/SimulationContext';
import { PageIntro, PanelCard, SectionHeader } from '@/components/layout/PagePrimitives';

export default function SchedulingPage() {
  const sim = useSimulationContext();

  return (
    <div className="space-y-6 page-enter">
      <PageIntro
        title="CPU Scheduling Lab"
        subtitle="Create processes, run algorithms, and inspect execution timelines with detailed metrics."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PanelCard>
          <SectionHeader icon={Zap} title="CONTROL PANEL" />
          <ControlPanel
            algorithm={sim.algorithm}
            setAlgorithm={sim.setAlgorithm}
            memoryAlgorithm={sim.memoryAlgorithm}
            setMemoryAlgorithm={sim.setMemoryAlgorithm}
            timeQuantum={sim.timeQuantum}
            setTimeQuantum={sim.setTimeQuantum}
            onRun={sim.runSimulation}
            onReset={sim.resetSimulation}
            onLoadSamples={sim.addSampleProcesses}
            isRunning={sim.isRunning}
            hasProcesses={sim.processes.length > 0}
          />
        </PanelCard>

        <PanelCard className="lg:col-span-2">
          <SectionHeader icon={Cpu} title="CREATE PROCESS" subtitle="Validated inputs with memory checks" />
          <ProcessForm onAdd={sim.addProcess} />
        </PanelCard>
      </div>

      <PanelCard>
        <SectionHeader icon={Monitor} title="PROCESS TABLE" subtitle={`${sim.processes.length} processes`} />
        <ProcessTable processes={sim.processes} onRemove={sim.removeProcess} onUpdate={sim.updateProcess} />
      </PanelCard>

      <MetricsPanel result={sim.result} />

      <PanelCard>
        <SectionHeader icon={BarChart3} title="CPU TIMELINE" subtitle="Static Gantt chart" />
        <GanttChart blocks={sim.result?.ganttChart || []} />
      </PanelCard>

      <PanelCard>
        <SectionHeader icon={Activity} title="ANIMATED PLAYBACK" subtitle="Step-by-step execution" />
        <AnimatedGantt blocks={sim.result?.ganttChart || []} />
      </PanelCard>
    </div>
  );
}
