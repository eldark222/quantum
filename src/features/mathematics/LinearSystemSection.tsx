import React, { useMemo, useState } from 'react';
import { Calculator, CheckCircle2, Sigma } from 'lucide-react';
import { MathView } from '../../components/common/MathView';
import { MetricBadge } from '../../components/common/MetricBadge';
import { ScientificCard } from '../../components/common/ScientificCard';
import { solveLinearSystem2x2 } from '../../core/math/linearSystem';
import type { LinearSystem2x2 } from '../../core/math/linearSystem';

const DEFAULT_SYSTEM: LinearSystem2x2 = { a: 2, b: 1, c: 1, d: -1, e: 5, f: 1 };

export const LinearSystemSection: React.FC = () => {
  const [system, setSystem] = useState<LinearSystem2x2>(DEFAULT_SYSTEM);
  const result = useMemo(() => solveLinearSystem2x2(system), [system]);

  const updateCoefficient = (key: keyof LinearSystem2x2, value: string) => {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      setSystem((current) => ({ ...current, [key]: parsed }));
    }
  };

  const input = (key: keyof LinearSystem2x2) => (
    <input
      aria-label={`Coeficiente ${key}`}
      type="number"
      value={system[key]}
      step="any"
      onChange={(event) => updateCoefficient(key, event.target.value)}
      className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-right font-mono text-sm text-cyan-300 focus:border-cyan-400 focus:outline-none"
    />
  );

  const statusLabel = {
    unique: 'Uma solução',
    inconsistent: 'Sem solução',
    underdetermined: 'Infinitas soluções',
  }[result.status];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Sigma className="h-3.5 w-3.5" />
            Álgebra Linear • Fundamentos para Física e Computação
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Sistema Linear 2×2
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
            Altere os coeficientes e observe como o determinante classifica a
            existência e a unicidade da solução.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-1">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calculator className="h-4 w-4 text-emerald-400" />
            <h2 className="font-semibold text-white">Coeficientes</h2>
          </div>
          <div className="space-y-4 font-mono text-slate-200">
            <div className="flex items-center gap-2">
              {input('a')}<span>x +</span>{input('b')}<span>y =</span>{input('e')}
            </div>
            <div className="flex items-center gap-2">
              {input('c')}<span>x +</span>{input('d')}<span>y =</span>{input('f')}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSystem(DEFAULT_SYSTEM)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700"
          >
            Restaurar exemplo
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5 lg:col-span-2">
          <MetricBadge label="Determinante" symbol="Δ = ad − bc" value={result.determinant.toFixed(3)} variant="cyan" />
          <MetricBadge label="Classificação" value={statusLabel} variant={result.status === 'unique' ? 'emerald' : 'amber'} />
          {result.status === 'unique' && (
            <>
              <MetricBadge label="Solução x" symbol="x = Δx/Δ" value={result.x?.toFixed(5) ?? '—'} variant="purple" />
              <MetricBadge label="Solução y" symbol="y = Δy/Δ" value={result.y?.toFixed(5) ?? '—'} variant="purple" />
            </>
          )}
        </div>
      </div>

      <ScientificCard
        title="Como interpretar"
        subtitle="A regra de Cramer usa determinantes para resolver o sistema quando Δ ≠ 0."
        icon={<Sigma className="h-5 w-5" />}
        theoryContent={
          <div className="space-y-3">
            <p>Para o sistema escolhido:</p>
            <MathView block math="\begin{cases} ax + by = e \\ cx + dy = f \end{cases}" />
            <MathView block math="\Delta = ad-bc,\qquad x=\frac{ed-bf}{\Delta},\qquad y=\frac{af-ec}{\Delta}" />
            <p>
              Se Δ é não nulo, as retas se cruzam em um único ponto. Se Δ é
              nulo, os determinantes substitutos distinguem retas coincidentes
              de retas paralelas.
            </p>
          </div>
        }
      >
        {result.status === 'unique' ? (
          <div className="flex items-start gap-3 text-sm text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              Exemplo resolvido: <strong>x = {result.x?.toFixed(3)}</strong> e{' '}
              <strong>y = {result.y?.toFixed(3)}</strong>. Os resíduos calculados
              são {result.residualX?.toExponential(2)} e {result.residualY?.toExponential(2)}.
            </p>
          </div>
        ) : (
          <p className="text-sm text-amber-300">
            O determinante é compatível com um sistema singular: verifique se as
            duas equações representam retas paralelas ou coincidentes.
          </p>
        )}
      </ScientificCard>
    </div>
  );
};
