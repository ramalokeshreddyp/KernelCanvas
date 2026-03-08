import { useState } from 'react';
import { PageAlgorithm } from '../engine/types';
import { runPageReplacement, generateRandomReferenceString, PageReplacementResult } from '../engine/paging';
import { Shuffle, Play } from 'lucide-react';

const algorithms: { value: PageAlgorithm; label: string; desc: string }[] = [
  { value: 'FIFO', label: 'FIFO', desc: 'First In First Out' },
  { value: 'LRU', label: 'LRU', desc: 'Least Recently Used' },
  { value: 'OPTIMAL', label: 'OPT', desc: 'Optimal (Bélády)' },
];

export function PageReplacementVisualizer() {
  const [algorithm, setAlgorithm] = useState<PageAlgorithm>('FIFO');
  const [frameCount, setFrameCount] = useState(3);
  const [refString, setRefString] = useState('7,0,1,2,0,3,0,4,2,3,0,3,2');
  const [result, setResult] = useState<PageReplacementResult | null>(null);
  const [compareResults, setCompareResults] = useState<{ algo: string; result: PageReplacementResult }[]>([]);

  const parseRefs = () => refString.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

  const run = () => {
    const refs = parseRefs();
    if (refs.length === 0) return;
    setResult(runPageReplacement(algorithm, refs, frameCount));
    setCompareResults([]);
  };

  const compareAll = () => {
    const refs = parseRefs();
    if (refs.length === 0) return;
    const results = algorithms.map(a => ({
      algo: a.label,
      result: runPageReplacement(a.value, refs, frameCount),
    }));
    setCompareResults(results);
    setResult(null);
  };

  const randomize = () => {
    const refs = generateRandomReferenceString(15, 7);
    setRefString(refs.join(','));
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono text-muted-foreground mb-1 block">REFERENCE STRING</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={refString}
                onChange={e => setRefString(e.target.value)}
                placeholder="7,0,1,2,0,3..."
                className="flex-1 bg-secondary border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button onClick={randomize} className="bg-secondary border border-border rounded-md px-3 py-2 text-muted-foreground hover:text-primary transition-colors" title="Random">
                <Shuffle size={16} />
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground mb-1 block">FRAMES</label>
            <input
              type="number"
              value={frameCount}
              onChange={e => setFrameCount(Math.max(1, Math.min(8, +e.target.value)))}
              min={1} max={8}
              className="w-20 bg-secondary border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono text-muted-foreground mb-2 block">ALGORITHM</label>
            <div className="flex gap-1.5">
              {algorithms.map(a => (
                <button
                  key={a.value}
                  onClick={() => setAlgorithm(a.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                    algorithm === a.value
                      ? 'bg-primary text-primary-foreground glow-box-cyan'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                  title={a.desc}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={run} className="bg-primary text-primary-foreground font-mono text-sm px-4 py-2 rounded-md hover:opacity-90 flex items-center gap-2">
              <Play size={14} /> RUN
            </button>
            <button onClick={compareAll} className="bg-secondary text-secondary-foreground font-mono text-sm px-4 py-2 rounded-md hover:bg-muted border border-border">
              COMPARE ALL
            </button>
          </div>
        </div>
      </div>

      {/* Single result */}
      {result && <PageResultView result={result} algorithm={algorithm} />}

      {/* Comparison */}
      {compareResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold text-foreground">ALGORITHM COMPARISON</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {compareResults.map(cr => (
              <div key={cr.algo} className="bg-secondary/50 rounded-lg p-3 border border-border">
                <div className="text-xs font-mono font-bold text-primary mb-2">{cr.algo}</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>Faults: <span className="text-destructive font-bold">{cr.result.totalFaults}</span></div>
                  <div>Hits: <span className="text-accent font-bold">{cr.result.totalHits}</span></div>
                  <div>Hit %: <span className="text-primary font-bold">{cr.result.hitRatio.toFixed(1)}%</span></div>
                  <div>Fault %: <span className="text-warning font-bold">{cr.result.faultRatio.toFixed(1)}%</span></div>
                </div>
              </div>
            ))}
          </div>
          {/* Bar comparison */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-muted-foreground">PAGE FAULTS</div>
            {compareResults.map(cr => {
              const max = Math.max(...compareResults.map(x => x.result.totalFaults));
              const w = max > 0 ? (cr.result.totalFaults / max) * 100 : 0;
              const best = Math.min(...compareResults.map(x => x.result.totalFaults));
              return (
                <div key={cr.algo} className="flex items-center gap-2">
                  <span className="text-xs font-mono w-12 text-right text-muted-foreground">{cr.algo}</span>
                  <div className="flex-1 bg-secondary rounded-sm h-5 overflow-hidden">
                    <div
                      className={`h-full rounded-sm transition-all duration-500 ${cr.result.totalFaults === best ? 'bg-accent' : 'bg-primary'}`}
                      style={{ width: `${w}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono w-8 text-right text-foreground">{cr.result.totalFaults}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function PageResultView({ result, algorithm }: { result: PageReplacementResult; algorithm: string }) {
  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricBox label="REFERENCES" value={result.totalReferences.toString()} />
        <MetricBox label="PAGE FAULTS" value={result.totalFaults.toString()} color="text-destructive" />
        <MetricBox label="HIT RATIO" value={`${result.hitRatio.toFixed(1)}%`} color="text-accent" />
        <MetricBox label="FAULT RATIO" value={`${result.faultRatio.toFixed(1)}%`} color="text-warning" />
      </div>

      {/* Frame table */}
      <div className="overflow-x-auto">
        <table className="text-xs font-mono border-collapse">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left text-muted-foreground border-b border-border">REF</th>
              {result.referenceString.map((ref, i) => (
                <th key={i} className={`px-2 py-1 text-center border-b border-border ${result.faults[i] ? 'text-destructive' : 'text-accent'}`}>
                  {ref}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: result.frames[result.frames.length - 1]?.length || 0 }, (_, frameIdx) => (
              <tr key={frameIdx}>
                <td className="px-2 py-1 text-muted-foreground border-b border-border/50">F{frameIdx}</td>
                {result.frames.map((frame, stepIdx) => (
                  <td key={stepIdx} className={`px-2 py-1 text-center border-b border-border/50 ${
                    frame[frameIdx] !== undefined ? 'text-foreground' : 'text-muted-foreground/30'
                  }`}>
                    {frame[frameIdx] !== undefined ? frame[frameIdx] : '—'}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="px-2 py-1 text-muted-foreground">STATUS</td>
              {result.faults.map((fault, i) => (
                <td key={i} className={`px-2 py-1 text-center font-bold ${fault ? 'text-destructive' : 'text-accent'}`}>
                  {fault ? 'F' : 'H'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricBox({ label, value, color = 'text-primary' }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-secondary rounded-md px-3 py-2 text-center">
      <div className="text-xs font-mono text-muted-foreground">{label}</div>
      <div className={`text-lg font-mono font-bold ${color}`}>{value}</div>
    </div>
  );
}
