import React from 'react';

interface ParameterControlProps {
  id: string;
  label: string;
  symbol?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  description?: string;
  disabled?: boolean;
}

export const ParameterControl: React.FC<ParameterControlProps> = ({
  id,
  label,
  symbol,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  description,
  disabled = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    if (!isNaN(num)) {
      const clamped = Math.max(min, Math.min(max, num));
      onChange(clamped);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-slate-900/80 border border-slate-800 p-4 transition-colors hover:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
          {symbol && (
            <span className="font-serif italic text-cyan-400 font-semibold">{symbol}</span>
          )}
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            id={`${id}-number`}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            className="w-20 px-2 py-1 text-right text-sm font-mono rounded-md bg-slate-950 border border-slate-700 text-cyan-300 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-50"
            aria-label={`Valor numérico de ${label}`}
          />
          <span className="text-xs font-mono text-slate-400 min-w-[28px]">{unit}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-slate-500">{min}</span>
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
        />
        <span className="text-xs font-mono text-slate-500">{max}</span>
      </div>

      {description && (
        <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{description}</p>
      )}
    </div>
  );
};
