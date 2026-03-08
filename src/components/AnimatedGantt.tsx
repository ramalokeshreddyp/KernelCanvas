import { useState, useEffect, useRef } from 'react';
import { GanttBlock } from '../engine/types';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

interface AnimatedGanttProps {
  blocks: GanttBlock[];
}

export function AnimatedGantt({ blocks }: AnimatedGanttProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalTime = blocks.length > 0 ? blocks[blocks.length - 1].endTime : 0;

  // Build time steps - one per time unit
  const timeSteps: { time: number; activeBlock: GanttBlock | null }[] = [];
  for (let t = 0; t <= totalTime; t++) {
    const active = blocks.find(b => t >= b.startTime && t < b.endTime) || null;
    timeSteps.push({ time: t, activeBlock: active });
  }

  useEffect(() => {
    if (isPlaying && currentStep < timeSteps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= timeSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStep, speed, timeSteps.length]);

  useEffect(() => {
    if (currentStep >= timeSteps.length - 1) {
      setIsPlaying(false);
    }
  }, [currentStep, timeSteps.length]);

  // Reset when blocks change
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [blocks]);

  if (blocks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground font-mono text-sm">
        Run a simulation to see the animated timeline.
      </div>
    );
  }

  const currentTime = timeSteps[currentStep]?.time ?? 0;
  const activeProcess = timeSteps[currentStep]?.activeBlock;

  return (
    <div className="space-y-4">
      {/* Playback controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-primary text-primary-foreground rounded-md p-2 hover:opacity-90 transition-opacity"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={() => setCurrentStep(prev => Math.min(prev + 1, timeSteps.length - 1))}
          className="bg-secondary text-secondary-foreground rounded-md p-2 hover:bg-muted"
        >
          <SkipForward size={16} />
        </button>
        <button
          onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
          className="bg-secondary text-secondary-foreground rounded-md p-2 hover:bg-muted"
        >
          <RotateCcw size={16} />
        </button>

        {/* Speed */}
        <div className="flex items-center gap-2 ml-4">
          <span className="text-xs font-mono text-muted-foreground">SPEED</span>
          {[1000, 500, 200].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded text-xs font-mono ${
                speed === s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}
            >
              {s === 1000 ? '1x' : s === 500 ? '2x' : '5x'}
            </button>
          ))}
        </div>

        {/* Time display */}
        <div className="ml-auto text-sm font-mono">
          <span className="text-muted-foreground">T=</span>
          <span className="text-primary font-bold">{currentTime}</span>
          <span className="text-muted-foreground">/{totalTime}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-200"
          style={{ width: `${totalTime > 0 ? (currentTime / totalTime) * 100 : 0}%` }}
        />
      </div>

      {/* Animated Gantt bars */}
      <div className="flex gap-0.5 h-14 rounded-md overflow-hidden border border-border">
        {blocks.map((block, i) => {
          const width = ((block.endTime - block.startTime) / totalTime) * 100;
          const isIdle = block.pid === -1;
          const isActive = activeProcess?.pid === block.pid && currentTime >= block.startTime && currentTime < block.endTime;
          const isPast = block.endTime <= currentTime;
          const isFuture = block.startTime > currentTime;

          return (
            <div
              key={i}
              className={`flex items-center justify-center text-xs font-mono font-semibold relative transition-all duration-200 ${
                isActive ? 'animate-pulse-glow ring-2 ring-primary/50 z-10 scale-y-110' : ''
              }`}
              style={{
                width: `${width}%`,
                backgroundColor: isFuture
                  ? 'hsl(var(--muted))'
                  : isIdle
                    ? 'hsl(var(--secondary))'
                    : block.color,
                color: isFuture
                  ? 'hsl(var(--muted-foreground))'
                  : isIdle
                    ? 'hsl(var(--muted-foreground))'
                    : '#000',
                opacity: isFuture ? 0.3 : isPast ? 0.7 : 1,
                minWidth: '20px',
              }}
            >
              <span className="truncate px-1">
                {isIdle ? '⏸' : block.processName}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current process info */}
      {activeProcess && (
        <div className="flex items-center gap-3 px-3 py-2 bg-secondary rounded-md">
          <div
            className="w-4 h-4 rounded-full animate-pulse-glow"
            style={{ backgroundColor: activeProcess.color }}
          />
          <span className="text-sm font-mono text-foreground font-semibold">
            {activeProcess.pid === -1 ? 'CPU IDLE' : `${activeProcess.processName} (PID ${activeProcess.pid})`}
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            Running: T={activeProcess.startTime}–{activeProcess.endTime}
          </span>
        </div>
      )}

      {/* Scrubber */}
      <input
        type="range"
        min={0}
        max={timeSteps.length - 1}
        value={currentStep}
        onChange={e => { setCurrentStep(+e.target.value); setIsPlaying(false); }}
        className="w-full accent-primary"
      />
    </div>
  );
}
