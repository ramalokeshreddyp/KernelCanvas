import { SchedulingResult } from '../engine/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { scaleLinear } from 'd3-scale';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface CPUUtilizationChartProps {
  result: SchedulingResult | null;
}

export function CPUUtilizationChart({ result }: CPUUtilizationChartProps) {
  if (!result || result.ganttChart.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground font-mono text-sm">
        Run a simulation to see CPU utilization.
      </div>
    );
  }

  const totalTime = result.ganttChart[result.ganttChart.length - 1].endTime;

  // Build CPU usage over time
  const data: { time: number; utilization: number; process: string }[] = [];
  for (let t = 0; t < totalTime; t++) {
    const block = result.ganttChart.find(b => t >= b.startTime && t < b.endTime);
    data.push({
      time: t,
      utilization: block && block.pid !== -1 ? 100 : 0,
      process: block ? block.processName : 'IDLE',
    });
  }

  // Running average utilization
  let running = 0;
  const avgData = data.map((d, i) => {
    running += d.utilization;
    return { ...d, avgUtil: running / (i + 1) };
  });

  return (
    <div className="space-y-4">
      <div className="h-48">
        <Line
          data={{
            labels: avgData.map(d => d.time),
            datasets: [
              {
                label: 'Instant',
                data: avgData.map(d => d.utilization),
                borderColor: '#00e5ff',
                borderWidth: 2,
                pointRadius: 0,
                stepped: true,
              },
              {
                label: 'Running Avg',
                data: avgData.map(d => Number(d.avgUtil.toFixed(2))),
                borderColor: '#39ff14',
                borderWidth: 2,
                pointRadius: 0,
                borderDash: [4, 2],
                tension: 0.35,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: {
                labels: {
                  color: 'hsl(215, 15%, 70%)',
                  font: { family: 'IBM Plex Mono', size: 11 },
                },
              },
              tooltip: {
                callbacks: {
                  title: (items) => `T=${items[0]?.label ?? ''}`,
                },
              },
            },
            scales: {
              x: {
                ticks: { color: 'hsl(215, 15%, 50%)', maxTicksLimit: 10 },
                grid: { color: 'hsl(220, 20%, 16%)' },
              },
              y: {
                min: 0,
                max: 100,
                ticks: { color: 'hsl(215, 15%, 50%)' },
                grid: { color: 'hsl(220, 20%, 16%)' },
              },
            },
          }}
        />
      </div>

      {/* Per-process CPU time */}
      <ProcessCPUBreakdown result={result} />
    </div>
  );
}

function ProcessCPUBreakdown({ result }: { result: SchedulingResult }) {
  const totalTime = result.ganttChart[result.ganttChart.length - 1]?.endTime || 0;
  const processTime: Record<string, number> = {};

  for (const block of result.ganttChart) {
    if (block.pid === -1) continue;
    const key = block.processName;
    processTime[key] = (processTime[key] || 0) + (block.endTime - block.startTime);
  }

  const data = Object.entries(processTime).map(([name, time]) => ({
    name,
    cpuTime: time,
    percentage: totalTime > 0 ? (time / totalTime) * 100 : 0,
  }));

  const maxPercentage = data.length > 0 ? Math.max(...data.map(d => d.percentage)) : 0;
  const widthScale = scaleLinear().domain([0, Math.max(1, maxPercentage)]).range([0, 100]);

  return (
    <div className="space-y-1">
      <div className="text-xs font-mono text-muted-foreground mb-2">CPU TIME PER PROCESS</div>
      {data.map(d => (
        <div key={d.name} className="flex items-center gap-2">
          <span className="text-xs font-mono w-16 text-right text-muted-foreground">{d.name}</span>
          <div className="flex-1 bg-secondary rounded-sm h-4 overflow-hidden">
            <div
              className="h-full bg-primary/80 rounded-sm transition-all"
              style={{ width: `${widthScale(d.percentage)}%` }}
            />
          </div>
          <span className="text-xs font-mono w-20 text-right text-foreground">{d.cpuTime}ms ({d.percentage.toFixed(1)}%)</span>
        </div>
      ))}
    </div>
  );
}
