import React, { useEffect, useMemo, useState } from 'react';
import { Activity, RotateCcw } from 'lucide-react';
import { MathView } from '../../components/common/MathView';
import { MetricBadge } from '../../components/common/MetricBadge';
import { ScientificCard } from '../../components/common/ScientificCard';
import { getFunctionDefinition, numericalDerivative, sampleDerivative } from '../../core/math/numericalDifferentiation';
import type { DifferentiableFunction, DifferenceMethod } from '../../core/math/numericalDifferentiation';

const DEFAULT_KIND: DifferentiableFunction = 'quadratic';
const DEFAULT_METHOD: DifferenceMethod = 'central';
const WIDTH = 640;
const HEIGHT = 260;

const METHOD_LABELS: Record<DifferenceMethod, string> = { forward: 'Progressiva', backward: 'Regressiva', central: 'Central' };

export function getRangeForFunction(kind: DifferentiableFunction): { minimum: number; maximum: number } {
  return kind === 'logarithm' ? { minimum: 0.1, maximum: 3 } : { minimum: -3, maximum: 3 };
}

export function clampCalculusPoint(point: number, kind: DifferentiableFunction): number {
  const range = getRangeForFunction(kind);
  return Math.min(range.maximum, Math.max(range.minimum, point));
}

export const CalculusSection: React.FC = () => {
  const [kind, setKind] = useState<DifferentiableFunction>(DEFAULT_KIND);
  const [method, setMethod] = useState<DifferenceMethod>(DEFAULT_METHOD);
  const [point, setPoint] = useState(1);
  const [step, setStep] = useState(0.0001);
  const definition = getFunctionDefinition(kind);
  const range = getRangeForFunction(kind);
  const effectivePoint = clampCalculusPoint(point, kind);
  useEffect(() => {
    if (point !== effectivePoint) setPoint(effectivePoint);
  }, [effectivePoint, point]);
  const result = useMemo(() => {
    try { return { value: numericalDerivative(definition, method, effectivePoint, step) }; }
    catch (error) { return { error: error instanceof Error ? error.message : 'Parâmetros inválidos.' }; }
  }, [definition, method, effectivePoint, step]);
  const comparisons = useMemo(() => (
    (['forward', 'backward', 'central'] as DifferenceMethod[]).map((comparisonMethod) => {
      try {
        return { method: comparisonMethod, result: numericalDerivative(definition, comparisonMethod, effectivePoint, step) };
      } catch {
        return { method: comparisonMethod, result: undefined };
      }
    })
  ), [definition, effectivePoint, step]);
  const samples = useMemo(() => {
    try { return sampleDerivative(kind, range.minimum, range.maximum, 81, step); }
    catch { return []; }
  }, [kind, range.minimum, range.maximum, step]);
  const maxY = Math.max(...samples.flatMap((sample) => [sample.value, sample.analytic]), 1);
  const minY = Math.min(...samples.flatMap((sample) => [sample.value, sample.analytic]), -1);
  const xScale = (x: number) => (x - range.minimum) / (range.maximum - range.minimum) * WIDTH;
  const yScale = (y: number) => HEIGHT - (y - minY) / Math.max(1, maxY - minY) * HEIGHT;
  const functionPath = samples.map((sample, index) => `${index === 0 ? 'M' : 'L'} ${xScale(sample.x).toFixed(2)} ${yScale(sample.value).toFixed(2)}`).join(' ');
  const derivativePath = samples.map((sample, index) => `${index === 0 ? 'M' : 'L'} ${xScale(sample.x).toFixed(2)} ${yScale(sample.analytic).toFixed(2)}`).join(' ');
  const maxError = samples.length ? Math.max(...samples.map((sample) => sample.absoluteError)) : Number.NaN;
  const pointValue = result.value?.value ?? definition.evaluate(effectivePoint);
  const localLine = result.value ? `M 0 ${yScale(pointValue - result.value.derivative * effectivePoint).toFixed(2)} L ${WIDTH} ${yScale(pointValue + result.value.derivative * (range.maximum - effectivePoint)).toFixed(2)}` : '';
  const secant = result.value && result.value.stencil.length >= 2
    ? `M ${xScale(result.value.stencil[0])} ${yScale(definition.evaluate(result.value.stencil[0]))} L ${xScale(result.value.stencil[result.value.stencil.length - 1])} ${yScale(definition.evaluate(result.value.stencil[result.value.stencil.length - 1]))}`
    : '';
  const errorSamples = useMemo(() => [1e-1, 3e-2, 1e-2, 3e-3, 1e-3, 3e-4, 1e-4, 3e-5, 1e-5].map((sampleStep) => (
    (['forward', 'backward', 'central'] as DifferenceMethod[]).map((comparisonMethod) => {
      try {
        return numericalDerivative(definition, comparisonMethod, effectivePoint, sampleStep).absoluteError;
      } catch {
        return Number.NaN;
      }
    })
  )), [definition, effectivePoint]);
  const reset = () => { setKind(DEFAULT_KIND); setMethod(DEFAULT_METHOD); setPoint(1); setStep(0.0001); };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"><Activity className="h-3.5 w-3.5" /> Cálculo Diferencial • Laboratório de Derivadas</div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Derivada: analítica e numérica</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">Compare três diferenças finitas com a derivada analítica. Funções trigonométricas usam radianos.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <label className="block text-sm font-semibold text-white" htmlFor="calculus-function">Função</label>
          <select id="calculus-function" value={kind} onChange={(event) => setKind(event.target.value as DifferentiableFunction)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-amber-400 focus:outline-none">
            <option value="quadratic">Quadrática: x²</option><option value="cubic-minus-linear">Cúbica: x³ − x</option><option value="sine">Seno: sin(x)</option><option value="cosine">Cosseno: cos(x)</option><option value="exponential">Exponencial: eˣ</option><option value="logarithm">Logaritmo: ln(x)</option>
          </select>
          <label className="block text-sm font-semibold text-white" htmlFor="calculus-method">Método</label>
          <select id="calculus-method" value={method} onChange={(event) => setMethod(event.target.value as DifferenceMethod)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-amber-400 focus:outline-none">
            <option value="forward">Diferença progressiva</option><option value="backward">Diferença regressiva</option><option value="central">Diferença central</option>
          </select>
          <label className="block text-sm font-semibold text-white" htmlFor="calculus-point">Ponto x = {effectivePoint.toFixed(3)}</label>
          <input id="calculus-point" type="range" min={range.minimum} max={range.maximum} step="0.001" value={effectivePoint} onChange={(event) => setPoint(Number(event.target.value))} className="w-full accent-amber-400" />
          <label className="block text-sm font-semibold text-white" htmlFor="calculus-step">Passo h</label>
          <input id="calculus-step" type="number" min="0.000001" max="0.5" step="0.000001" value={step} onChange={(event) => setStep(Number(event.target.value))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-cyan-300" />
          <input aria-label="Controle deslizante do passo h" type="range" min="0.000001" max="0.1" step="0.000001" value={step > 0.1 ? 0.1 : step} onChange={(event) => setStep(Number(event.target.value))} className="w-full accent-amber-400" />
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700"><RotateCcw className="h-3.5 w-3.5" /> Restaurar exemplo</button>
        </div>
        <div className="grid grid-cols-2 gap-3.5 lg:col-span-2">
          <MetricBadge label="Método" value={METHOD_LABELS[method]} variant="cyan" /><MetricBadge label="Derivada numérica" symbol="f′(x)" value={result.value?.derivative.toFixed(6) ?? 'Inválida'} variant="purple" />
          <MetricBadge label="Referência analítica" value={result.value?.analytic.toFixed(6) ?? '—'} variant="emerald" /><MetricBadge label="Erro absoluto" value={result.value?.absoluteError.toExponential(2) ?? '—'} variant="amber" />
          {result.value?.relativeError === undefined && <p className="col-span-2 text-xs text-slate-400">Erro relativo omitido: a derivada analítica é zero ou não é uma métrica informativa.</p>}
          {result.error && <p role="alert" className="col-span-2 rounded-lg border border-rose-500/30 bg-rose-950/30 p-3 text-sm text-rose-300">{result.error}</p>}
        </div>
      </div>
      <ScientificCard title="Visualização local" subtitle={`${definition.equation}; a reta violeta é a linearização numérica em x = ${effectivePoint.toFixed(3)}.`} icon={<Activity className="h-5 w-5" />} theoryContent={<div className="space-y-3"><MathView block math="f'(x)\\approx\\frac{f(x+h)-f(x-h)}{2h}" /><p>Progressiva e regressiva têm erro de truncamento de primeira ordem; a central tem segunda ordem para funções suaves. Passos excessivamente pequenos podem aumentar o erro de arredondamento.</p></div>}>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 p-2"><svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="min-w-[520px] w-full" role="img" aria-label={`Gráfico de ${definition.label}, derivada analítica, secante e aproximação local`}><line x1="0" y1={yScale(0)} x2={WIDTH} y2={yScale(0)} stroke="#334155" /><path d={functionPath} fill="none" stroke="#22d3ee" strokeWidth="2.5" /><path d={derivativePath} fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeDasharray="6 4" /><path d={secant} fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3 3" /><path d={localLine} fill="none" stroke="#f59e0b" strokeWidth="2" /><circle cx={xScale(effectivePoint)} cy={yScale(pointValue)} r="4" fill="#f8fafc" />{result.value?.stencil.map((stencilPoint) => <circle key={stencilPoint} cx={xScale(stencilPoint)} cy={yScale(definition.evaluate(stencilPoint))} r="3.5" fill="#f97316" />)}</svg></div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400"><span className="text-cyan-300">● f(x)</span><span className="text-violet-300">● f′(x) analítica</span><span className="text-orange-300">● secante do método</span><span className="text-amber-300">● linearização numérica</span><span>h = {step}</span><span>erro máximo = {Number.isFinite(maxError) ? maxError.toExponential(2) : '—'}</span></div>
      </ScientificCard>
      <ScientificCard title="Comparação e efeito do passo" subtitle="Todos os valores abaixo são recalculados pelo mesmo motor matemático." icon={<Activity className="h-5 w-5" />}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400"><tr><th className="p-2">Método</th><th className="p-2">Aproximação</th><th className="p-2">Referência</th><th className="p-2">Erro absoluto</th><th className="p-2">Ordem</th></tr></thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">{comparisons.map(({ method: comparisonMethod, result: comparison }) => <tr key={comparisonMethod}><td className="p-2">{METHOD_LABELS[comparisonMethod]}</td><td className="p-2 font-mono">{comparison?.derivative.toFixed(6) ?? 'Inválida'}</td><td className="p-2 font-mono">{comparison?.analytic.toFixed(6) ?? '—'}</td><td className="p-2 font-mono">{comparison?.absoluteError.toExponential(2) ?? '—'}</td><td className="p-2">{comparisonMethod === 'central' ? 'O(h²)' : 'O(h)'}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 p-2">
          <svg viewBox={`0 0 ${WIDTH} 180`} className="min-w-[520px] w-full" role="img" aria-label="Erro absoluto para diferentes passos numéricos">
            <text x="8" y="18" fill="#94a3b8" fontSize="11">Erro absoluto por passo h (escala visual logarítmica)</text>
            {([0, 1, 2] as number[]).map((methodIndex) => {
              const valid = errorSamples.map((values, index) => ({ x: 40 + index * 70, error: values[methodIndex] })).filter((item) => Number.isFinite(item.error) && item.error > 0);
              const maximum = Math.max(...valid.map((item) => item.error), 1e-16);
              const minimum = Math.min(...valid.map((item) => item.error), maximum);
              const y = (error: number) => 155 - (Math.log(error) - Math.log(minimum)) / Math.max(1, Math.log(maximum) - Math.log(minimum)) * 120;
              return <polyline key={methodIndex} points={valid.map((item) => `${item.x},${y(item.error)}`).join(' ')} fill="none" stroke={['#22d3ee', '#f97316', '#a78bfa'][methodIndex]} strokeWidth="2" />;
            })}
          </svg>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">A tendência combina erro de truncamento e arredondamento de ponto flutuante; diminuir h não garante melhoria monótona.</p>
      </ScientificCard>
    </div>
  );
};
