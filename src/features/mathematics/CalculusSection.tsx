import React, { useMemo, useState } from 'react';
import { Activity, RotateCcw } from 'lucide-react';
import { MathView } from '../../components/common/MathView';
import { MetricBadge } from '../../components/common/MetricBadge';
import { ScientificCard } from '../../components/common/ScientificCard';
import { getFunctionDefinition, sampleDerivative } from '../../core/math/numericalDifferentiation';
import type { DifferentiableFunction } from '../../core/math/numericalDifferentiation';

const DEFAULT_KIND: DifferentiableFunction = 'quadratic';
const WIDTH = 640;
const HEIGHT = 260;

export const CalculusSection: React.FC = () => {
  const [kind, setKind] = useState<DifferentiableFunction>(DEFAULT_KIND);
  const [point, setPoint] = useState(1);
  const samples = useMemo(() => sampleDerivative(kind, -3, 3), [kind]);
  const definition = getFunctionDefinition(kind);
  const nearest = samples.reduce((best, sample) => Math.abs(sample.x - point) < Math.abs(best.x - point) ? sample : best, samples[0]);
  const maxError = Math.max(...samples.map((sample) => sample.absoluteError));
  const minY = Math.min(...samples.flatMap((sample) => [sample.value, sample.analytic]));
  const maxY = Math.max(...samples.flatMap((sample) => [sample.value, sample.analytic]));
  const xScale = (x: number) => (x + 3) / 6 * WIDTH;
  const yScale = (y: number) => HEIGHT - (y - minY) / Math.max(1, maxY - minY) * HEIGHT;
  const path = (key: 'value' | 'analytic') => samples.map((sample, index) => `${index === 0 ? 'M' : 'L'} ${xScale(sample.x).toFixed(2)} ${yScale(sample[key]).toFixed(2)}`).join(' ');

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            <Activity className="h-3.5 w-3.5" /> Cálculo Diferencial • Derivação Numérica
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Derivada: analítica e numérica</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">Compare a derivada central com a derivada analítica de funções elementares.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm font-semibold text-white" htmlFor="calculus-function">Função</label>
          <select id="calculus-function" value={kind} onChange={(event) => setKind(event.target.value as DifferentiableFunction)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-amber-400 focus:outline-none">
            <option value="quadratic">Quadrática: x²</option>
            <option value="sine">Seno: sin(x)</option>
            <option value="exponential">Exponencial: eˣ</option>
          </select>
          <label className="block text-sm font-semibold text-white" htmlFor="calculus-point">Ponto x = {point.toFixed(2)}</label>
          <input id="calculus-point" type="range" min="-3" max="3" step="0.01" value={point} onChange={(event) => setPoint(Number(event.target.value))} className="w-full accent-amber-400" />
          <button type="button" onClick={() => { setKind(DEFAULT_KIND); setPoint(1); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700"><RotateCcw className="h-3.5 w-3.5" /> Restaurar exemplo</button>
        </div>
        <div className="grid grid-cols-2 gap-3.5 lg:col-span-2">
          <MetricBadge label="Função" value={definition.label} variant="cyan" />
          <MetricBadge label="Derivada em x" symbol="f'(x)" value={nearest.analytic.toFixed(5)} variant="purple" />
          <MetricBadge label="Aproximação central" value={nearest.numerical.toFixed(5)} variant="emerald" />
          <MetricBadge label="Erro máximo no intervalo" value={maxError.toExponential(2)} variant="amber" />
        </div>
      </div>

      <ScientificCard title="Visualização" subtitle={`${definition.equation}; linha ciano é f(x), linha violeta é f'(x).`} icon={<Activity className="h-5 w-5" />} theoryContent={
        <div className="space-y-3">
          <MathView block math="f'(x)=\\lim_{h\\to 0}\\frac{f(x+h)-f(x-h)}{2h}" />
          <p>O modelo usa diferença central com h = 10⁻⁴. A curva numérica é comparada à expressão analítica conhecida; o erro reportado é absoluto e depende da escala da função e do passo escolhido.</p>
        </div>
      }>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 p-2">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="min-w-[520px] w-full" role="img" aria-label={`Gráfico de ${definition.label} e sua derivada`}>
            <line x1="0" y1={yScale(0)} x2={WIDTH} y2={yScale(0)} stroke="#334155" />
            <path d={path('value')} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
            <path d={path('analytic')} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeDasharray="6 4" />
          </svg>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400"><span className="text-cyan-300">● f(x)</span><span className="text-violet-300">● f'(x) analítica</span><span>x ∈ [−3, 3]</span></div>
      </ScientificCard>
    </div>
  );
};
