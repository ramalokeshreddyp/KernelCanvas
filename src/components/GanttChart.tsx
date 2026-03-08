import { useEffect, useMemo, useRef } from 'react';
import { GanttBlock } from '../engine/types';

interface GanttChartProps {
  blocks: GanttBlock[];
}

export function GanttChart({ blocks }: GanttChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const totalTime = blocks.length > 0 ? blocks[blocks.length - 1].endTime : 0;

  const timeMarkers = useMemo(() => {
    const markers = [0];
    if (totalTime > 4) markers.push(Math.floor(totalTime / 4));
    if (totalTime > 2) markers.push(Math.floor(totalTime / 2));
    if (totalTime > 4) markers.push(Math.floor((totalTime * 3) / 4));
    markers.push(totalTime);
    return Array.from(new Set(markers));
  }, [totalTime]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || totalTime <= 0) return;

    const containerWidth = canvas.parentElement?.clientWidth ?? 800;
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = Math.max(640, containerWidth - 8);
    const logicalHeight = 88;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    const xPad = 8;
    const yPad = 14;
    const barHeight = 48;
    const usableWidth = logicalWidth - xPad * 2;

    ctx.fillStyle = 'rgba(18, 24, 36, 0.65)';
    ctx.fillRect(xPad, yPad, usableWidth, barHeight);

    blocks.forEach((block) => {
      const startX = xPad + (block.startTime / totalTime) * usableWidth;
      const width = Math.max(6, ((block.endTime - block.startTime) / totalTime) * usableWidth);
      const isIdle = block.pid === -1;

      ctx.fillStyle = isIdle ? '#2b3343' : block.color;
      ctx.fillRect(startX, yPad, width, barHeight);

      ctx.strokeStyle = 'rgba(8, 11, 18, 0.55)';
      ctx.strokeRect(startX, yPad, width, barHeight);

      ctx.fillStyle = isIdle ? '#9ba6bb' : '#041018';
      ctx.font = '600 11px IBM Plex Mono';
      const label = isIdle ? 'IDLE' : block.processName;
      ctx.fillText(label, startX + 4, yPad + barHeight / 2 + 4);
    });
  }, [blocks, totalTime]);

  if (blocks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground font-mono text-sm">
        Run a simulation to see the Gantt chart.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-md border border-border bg-secondary/30 p-1">
        <canvas ref={canvasRef} aria-label="CPU gantt canvas" />
      </div>
      {/* Time markers */}
      <div className="flex justify-between text-xs font-mono text-muted-foreground px-1">
        {timeMarkers.map((marker) => (
          <span key={marker}>{marker}</span>
        ))}
      </div>
    </div>
  );
}
