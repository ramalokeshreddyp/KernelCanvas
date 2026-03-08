import { Layers } from 'lucide-react';
import { PageReplacementVisualizer } from '@/components/PageReplacementVisualizer';
import { PageIntro, PanelCard, SectionHeader } from '@/components/layout/PagePrimitives';

export default function PagingPage() {
  return (
    <div className="space-y-6 page-enter">
      <PageIntro
        title="Page Replacement Engine"
        subtitle="Compare FIFO, LRU, and Optimal page replacement strategies with visual frame-by-frame output."
      />

      <PanelCard>
        <SectionHeader icon={Layers} title="VIRTUAL MEMORY" subtitle="Page faults and hit ratios" />
        <PageReplacementVisualizer />
      </PanelCard>
    </div>
  );
}
