import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Activity, Cpu, HardDrive, Home, Layers, Moon, ShieldAlert, Sun, Terminal } from 'lucide-react';
import { useSimulationContext } from '@/context/SimulationContext';
import { useTheme } from 'next-themes';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/scheduling', label: 'Scheduling', icon: Cpu },
  { to: '/memory', label: 'Memory', icon: HardDrive },
  { to: '/paging', label: 'Page Replacement', icon: Layers },
  { to: '/deadlock', label: 'Deadlock', icon: ShieldAlert },
  { to: '/dashboard', label: 'Dashboard', icon: Activity },
];

function StatChip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <span className="rounded-full border border-border bg-secondary px-3 py-1 text-[11px] font-mono text-muted-foreground">
      {label}: <span className={accent ? 'font-bold text-accent' : 'font-semibold text-primary'}>{value}</span>
    </span>
  );
}

export function AppShell() {
  const sim = useSimulationContext();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme !== 'light';

  return (
    <div className="min-h-screen bg-background atmospheric-bg">
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <NavLink to="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <Terminal size={20} />
              </span>
              <div>
                <p className="text-lg font-mono font-bold tracking-widest text-foreground glow-cyan">ProcessOS</p>
                <p className="text-[11px] font-mono tracking-wider text-muted-foreground">Interactive Simulator v2</p>
              </div>
            </NavLink>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <StatChip label="PROCS" value={String(sim.processes.length)} />
              <StatChip label="ALGO" value={sim.algorithm} accent />
              <StatChip label="MEM" value={sim.memoryAlgorithm.replace('_', ' ')} />
              <StatChip label="CPU" value={sim.result ? `${sim.result.cpuUtilization.toFixed(0)}%` : '--'} accent />
              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-[11px] font-mono font-semibold text-foreground transition-colors hover:bg-muted"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun size={13} className="text-warning" /> : <Moon size={13} className="text-primary" />}
                  {isDark ? 'LIGHT MODE' : 'DARK MODE'}
                </button>
              )}
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-mono font-semibold transition-all md:text-sm ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30'
                      : 'border-border bg-secondary text-secondary-foreground hover:bg-muted'
                  }`
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card/60 py-4">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs font-mono text-muted-foreground md:px-6">
          ProcessOS v2.0 - Polished for demo and hackathon readiness
        </div>
      </footer>
    </div>
  );
}
