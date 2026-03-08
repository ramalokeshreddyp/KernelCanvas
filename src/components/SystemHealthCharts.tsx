import { SchedulingResult } from '@/engine/types';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { scaleLinear } from 'd3-scale';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface SystemHealthChartsProps {
  result: SchedulingResult | null;
}

export function SystemHealthCharts({ result }: SystemHealthChartsProps) {
  if (!result) {
    return (
      <div className="py-6 text-center text-sm font-mono text-muted-foreground">
        Run a simulation to generate health charts.
      </div>
    );
  }

  const activeCpu = Number(result.cpuUtilization.toFixed(1));
  const idleCpu = Number((100 - result.cpuUtilization).toFixed(1));

  const metrics = [
    { label: 'Avg Wait', value: result.avgWaitingTime },
    { label: 'Avg TAT', value: result.avgTurnaroundTime },
    { label: 'Throughput', value: result.throughput * 100 },
  ];

  const max = Math.max(...metrics.map(m => m.value), 1);
  const scale = scaleLinear().domain([0, max]).range([0, max]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-lg border border-border bg-secondary/30 p-3">
        <h3 className="mb-2 text-xs font-mono text-muted-foreground">CPU ACTIVE VS IDLE</h3>
        <div className="h-56">
          <Doughnut
            data={{
              labels: ['Active', 'Idle'],
              datasets: [
                {
                  data: [activeCpu, Math.max(0, idleCpu)],
                  backgroundColor: ['#00e5ff', '#2b3343'],
                  borderColor: ['#00e5ff', '#2b3343'],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: 'hsl(215, 15%, 70%)',
                    font: { family: 'IBM Plex Mono', size: 11 },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-secondary/30 p-3">
        <h3 className="mb-2 text-xs font-mono text-muted-foreground">KEY PERFORMANCE METRICS</h3>
        <div className="h-56">
          <Bar
            data={{
              labels: metrics.map(m => m.label),
              datasets: [
                {
                  label: 'Score',
                  data: metrics.map(m => Number(scale(m.value).toFixed(3))),
                  backgroundColor: ['#39ff14', '#00e5ff', '#ffd700'],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: 'hsl(215, 15%, 70%)',
                    font: { family: 'IBM Plex Mono', size: 11 },
                  },
                },
              },
              scales: {
                x: {
                  ticks: { color: 'hsl(215, 15%, 65%)' },
                  grid: { color: 'hsl(220, 20%, 16%)' },
                },
                y: {
                  ticks: { color: 'hsl(215, 15%, 65%)' },
                  grid: { color: 'hsl(220, 20%, 16%)' },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
