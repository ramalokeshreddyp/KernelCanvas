import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';

interface ProcessFormProps {
  onAdd: (params: { name: string; arrivalTime: number; burstTime: number; priority: number; memoryRequired: number }) => {
    ok: boolean;
    error?: string;
  };
}

export function ProcessForm({ onAdd }: ProcessFormProps) {
  const [name, setName] = useState('');
  const [arrivalTime, setArrivalTime] = useState(0);
  const [burstTime, setBurstTime] = useState(1);
  const [priority, setPriority] = useState(1);
  const [memoryRequired, setMemoryRequired] = useState(64);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      arrivalTime: Number.isFinite(arrivalTime) ? arrivalTime : 0,
      burstTime: Number.isFinite(burstTime) ? burstTime : 1,
      priority: Number.isFinite(priority) ? priority : 1,
      memoryRequired: Number.isFinite(memoryRequired) ? memoryRequired : 1,
    };

    if (payload.arrivalTime < 0) {
      setError('Arrival time cannot be negative.');
      return;
    }
    if (payload.burstTime < 1) {
      setError('Burst time must be at least 1.');
      return;
    }
    if (payload.priority < 1) {
      setError('Priority must be at least 1.');
      return;
    }
    if (payload.memoryRequired < 1) {
      setError('Memory must be at least 1KB.');
      return;
    }

    const result = onAdd(payload);
    if (!result.ok) {
      setError(result.error ?? 'Unable to add process.');
      return;
    }

    setError(null);
    setName('');
    setArrivalTime(0);
    setBurstTime(1);
    setPriority(1);
    setMemoryRequired(64);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="process-name" className="text-xs font-mono text-muted-foreground">NAME</label>
        <input
          id="process-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Process"
          className="bg-secondary border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="process-arrival" className="text-xs font-mono text-muted-foreground">ARRIVAL</label>
        <input
          id="process-arrival"
          type="number"
          value={arrivalTime}
          onChange={e => setArrivalTime(Math.max(0, +e.target.value))}
          min={0}
          className="bg-secondary border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="process-burst" className="text-xs font-mono text-muted-foreground">BURST</label>
        <input
          id="process-burst"
          type="number"
          value={burstTime}
          onChange={e => setBurstTime(Math.max(1, +e.target.value))}
          min={1}
          className="bg-secondary border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="process-priority" className="text-xs font-mono text-muted-foreground">PRIORITY</label>
        <input
          id="process-priority"
          type="number"
          value={priority}
          onChange={e => setPriority(Math.max(1, +e.target.value))}
          min={1}
          className="bg-secondary border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="process-memory" className="text-xs font-mono text-muted-foreground">MEMORY (KB)</label>
        <input
          id="process-memory"
          type="number"
          value={memoryRequired}
          onChange={e => setMemoryRequired(Math.max(1, +e.target.value))}
          min={1}
          className="bg-secondary border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-mono text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          ADD
        </button>
      </div>

      {error && (
        <div className="col-span-full rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-mono text-destructive flex items-center gap-2">
          <AlertTriangle size={14} />
          {error}
        </div>
      )}
    </form>
  );
}
