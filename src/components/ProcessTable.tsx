import { useState } from 'react';
import { Process } from '../engine/types';
import { Pencil, Save, Trash2, X } from 'lucide-react';

interface ProcessTableProps {
  processes: Process[];
  onRemove: (pid: number) => void;
  onUpdate?: (pid: number, params: { name: string; arrivalTime: number; burstTime: number; priority: number; memoryRequired: number }) => { ok: boolean; error?: string };
}

const stateLabel: Record<string, string> = {
  NEW: 'NEW',
  READY: 'READY',
  RUNNING: 'RUN',
  WAITING: 'WAIT',
  TERMINATED: 'DONE',
};

export function ProcessTable({ processes, onRemove, onUpdate }: ProcessTableProps) {
  const [editingPid, setEditingPid] = useState<number | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    arrivalTime: 0,
    burstTime: 1,
    priority: 1,
    memoryRequired: 1,
  });

  if (processes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground font-mono text-sm">
        No processes. Add one above or load samples.
      </div>
    );
  }

  const beginEdit = (p: Process) => {
    setEditingPid(p.pid);
    setEditError(null);
    setForm({
      name: p.name,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      priority: p.priority,
      memoryRequired: p.memoryRequired,
    });
  };

  const saveEdit = (pid: number) => {
    if (!onUpdate) return;
    const result = onUpdate(pid, form);
    if (!result.ok) {
      setEditError(result.error ?? 'Unable to update process.');
      return;
    }
    setEditingPid(null);
    setEditError(null);
  };

  return (
    <div className="overflow-x-auto space-y-2">
      <table className="w-full text-sm font-mono">
        <thead>
          <tr className="border-b border-border text-muted-foreground text-xs">
            <th className="text-left py-2 px-3">PID</th>
            <th className="text-left py-2 px-3">NAME</th>
            <th className="text-right py-2 px-3">ARRIVAL</th>
            <th className="text-right py-2 px-3">BURST</th>
            <th className="text-right py-2 px-3">PRIORITY</th>
            <th className="text-right py-2 px-3">MEM</th>
            <th className="text-center py-2 px-3">STATE</th>
            <th className="text-right py-2 px-3">WAIT</th>
            <th className="text-right py-2 px-3">TAT</th>
            <th className="text-right py-2 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {processes.map(p => (
            <tr key={p.pid} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
              <td className="py-2 px-3">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: p.color }} />
                {p.pid}
              </td>
              <td className="py-2 px-3 text-foreground">
                {editingPid === p.pid ? (
                  <input
                    className="w-full rounded border border-border bg-secondary px-2 py-1 text-xs"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                ) : p.name}
              </td>
              <td className="py-2 px-3 text-right">
                {editingPid === p.pid ? (
                  <input
                    type="number"
                    min={0}
                    className="w-16 rounded border border-border bg-secondary px-2 py-1 text-xs text-right"
                    value={form.arrivalTime}
                    onChange={(e) => setForm(prev => ({ ...prev, arrivalTime: Math.max(0, +e.target.value) }))}
                  />
                ) : p.arrivalTime}
              </td>
              <td className="py-2 px-3 text-right">
                {editingPid === p.pid ? (
                  <input
                    type="number"
                    min={1}
                    className="w-16 rounded border border-border bg-secondary px-2 py-1 text-xs text-right"
                    value={form.burstTime}
                    onChange={(e) => setForm(prev => ({ ...prev, burstTime: Math.max(1, +e.target.value) }))}
                  />
                ) : p.burstTime}
              </td>
              <td className="py-2 px-3 text-right">
                {editingPid === p.pid ? (
                  <input
                    type="number"
                    min={1}
                    className="w-16 rounded border border-border bg-secondary px-2 py-1 text-xs text-right"
                    value={form.priority}
                    onChange={(e) => setForm(prev => ({ ...prev, priority: Math.max(1, +e.target.value) }))}
                  />
                ) : p.priority}
              </td>
              <td className="py-2 px-3 text-right">
                {editingPid === p.pid ? (
                  <input
                    type="number"
                    min={1}
                    className="w-20 rounded border border-border bg-secondary px-2 py-1 text-xs text-right"
                    value={form.memoryRequired}
                    onChange={(e) => setForm(prev => ({ ...prev, memoryRequired: Math.max(1, +e.target.value) }))}
                  />
                ) : `${p.memoryRequired}KB`}
              </td>
              <td className="py-2 px-3 text-center">
                <span className={`state-${p.state.toLowerCase()} text-xs font-semibold`}>
                  {stateLabel[p.state]}
                </span>
              </td>
              <td className="py-2 px-3 text-right">{p.state === 'TERMINATED' ? p.waitingTime : '-'}</td>
              <td className="py-2 px-3 text-right">{p.state === 'TERMINATED' ? p.turnaroundTime : '-'}</td>
              <td className="py-2 px-3 text-right">
                <div className="inline-flex items-center gap-2">
                  {editingPid === p.pid ? (
                    <>
                      <button onClick={() => saveEdit(p.pid)} className="text-accent hover:opacity-80 transition-opacity" aria-label="Save process">
                        <Save size={14} />
                      </button>
                      <button onClick={() => setEditingPid(null)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Cancel edit">
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    onUpdate && (
                      <button onClick={() => beginEdit(p)} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Edit process">
                        <Pencil size={14} />
                      </button>
                    )
                  )}
                  <button onClick={() => onRemove(p.pid)} className="text-muted-foreground hover:text-destructive transition-colors" aria-label="Remove process">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-mono text-destructive">
          {editError}
        </div>
      )}
    </div>
  );
}
