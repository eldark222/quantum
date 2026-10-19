import React from 'react';

interface MetricBadgeProps {
  label: string;
  value: string | number;
  unit?: string;
  symbol?: string;
  subtext?: string;
  variant?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'default';
}

const variantStyles = {
  cyan: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300',
  purple: 'border-purple-500/30 bg-purple-950/20 text-purple-300',
  emerald: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
  amber: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
  rose: 'border-rose-500/30 bg-rose-950/20 text-rose-300',
  default: 'border-slate-800 bg-slate-900/60 text-slate-200',
};

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  unit,
  symbol,
  subtext,
  variant = 'default',
}) => {
  return (
    <div
      className={`flex flex-col gap-1 rounded-xl border p-3.5 transition-all ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium">{label}</span>
        {symbol && <span className="font-serif italic font-semibold">{symbol}</span>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold font-mono tracking-tight text-white">{value}</span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>
      {subtext && <span className="text-xs text-slate-400/90 leading-tight">{subtext}</span>}
    </div>
  );
};
