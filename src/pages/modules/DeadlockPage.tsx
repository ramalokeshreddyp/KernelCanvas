import { ShieldAlert } from 'lucide-react';
import { DeadlockDetector } from '@/components/DeadlockDetector';
import { PageIntro, PanelCard, SectionHeader } from '@/components/layout/PagePrimitives';

export default function DeadlockPage() {
  return (
    <div className="space-y-6 page-enter">
      <PageIntro
        title="Deadlock Analyzer"
        subtitle="Run Banker's algorithm on safe and deadlocked scenarios with explicit step-by-step reasoning."
      />

      <PanelCard>
        <SectionHeader icon={ShieldAlert} title="DETECTION MODULE" subtitle="Banker's safety check" />
        <DeadlockDetector />
      </PanelCard>
    </div>
  );
}
