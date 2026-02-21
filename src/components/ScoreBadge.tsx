import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ScoreBadge({ score, size = 'sm', showLabel = false }: ScoreBadgeProps) {
  const level = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-semibold',
        level === 'high' && 'score-high',
        level === 'medium' && 'score-medium',
        level === 'low' && 'score-low',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-4 py-1.5 text-base',
      )}
    >
      {score}
      {showLabel && <span className="font-normal">/100</span>}
    </div>
  );
}

interface ScoreBreakdownProps {
  breakdown: {
    sectorMatch: number;
    stageMatch: number;
    hiringActivity: number;
    technicalSignals: number;
    blogFreshness: number;
  };
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const items = [
    { label: 'Sector match', value: breakdown.sectorMatch, max: 30 },
    { label: 'Stage match', value: breakdown.stageMatch, max: 25 },
    { label: 'Hiring activity', value: breakdown.hiringActivity, max: 22 },
    { label: 'Technical signals', value: breakdown.technicalSignals, max: 15 },
    { label: 'Blog freshness', value: breakdown.blogFreshness, max: 10 },
  ];

  return (
    <div className="space-y-2 p-3 text-xs">
      <p className="font-semibold text-foreground mb-2">Why this matches your thesis</p>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="text-primary font-mono font-semibold w-6 text-right">+{item.value}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-muted-foreground">{item.label}</span>
            </div>
            <div className="h-1 rounded-full bg-secondary">
              <div
                className="h-1 rounded-full bg-primary transition-all"
                style={{ width: `${(item.value / item.max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
