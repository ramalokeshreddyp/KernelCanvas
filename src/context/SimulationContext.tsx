import { createContext, useContext } from 'react';
import { useSimulation } from '@/hooks/useSimulation';

type SimulationContextValue = ReturnType<typeof useSimulation>;

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const simulation = useSimulation();
  return <SimulationContext.Provider value={simulation}>{children}</SimulationContext.Provider>;
}

export function useSimulationContext() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulationContext must be used within SimulationProvider');
  }
  return context;
}
