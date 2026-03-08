import { Cpu, HardDrive, Monitor, Zap } from 'lucide-react';
import { ProcessForm } from '@/components/ProcessForm';
import { ProcessTable } from '@/components/ProcessTable';
import { ControlPanel } from '@/components/ControlPanel';
import { MemoryVisualizer } from '@/components/MemoryVisualizer';
import { useSimulationContext } from '@/context/SimulationContext';
import { PageIntro, PanelCard, SectionHeader } from '@/components/layout/PagePrimitives';

export default function MemoryPage() {
  const sim = useSimulationContext();

  return (
    <div className="space-y-6 page-enter">
      <PageIntro
        title="Memory Allocation Studio"
        subtitle="Inspect first fit, best fit, and worst fit allocations with fragmentation awareness."
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
          <SectionHeader icon={Cpu} title="CREATE PROCESS" subtitle="Allocation is validated before insertion" />
          <ProcessForm onAdd={sim.addProcess} />
        </PanelCard>
      </div>

      <PanelCard>
        <SectionHeader icon={HardDrive} title="MEMORY MAP" subtitle={`${sim.totalMemory}KB total`} />
        <MemoryVisualizer blocks={sim.memoryBlocks} totalMemory={sim.totalMemory} />
      </PanelCard>

      <PanelCard>
        <SectionHeader icon={Monitor} title="PROCESS TABLE" subtitle={`${sim.processes.length} processes`} />
        <ProcessTable processes={sim.processes} onRemove={sim.removeProcess} onUpdate={sim.updateProcess} />
      </PanelCard>
    </div>
  );
}
