import React, { useMemo, useState } from 'react';
import { BrainCircuit, RotateCcw } from 'lucide-react';
import { MathView } from '../../components/common/MathView';
import { MetricBadge } from '../../components/common/MetricBadge';
import { ScientificCard } from '../../components/common/ScientificCard';
import { analyzeEigenvalues2x2 } from '../../core/math/eigen2x2';
import type { Matrix2x2 } from '../../core/math/matrix2x2';

const DEFAULT_MATRIX: Matrix2x2 = { a: 2, b: 1, c: 1, d: 3 };

export const EigenvalueSection: React.FC = () => {
  const [matrix, setMatrix] = useState<Matrix2x2>(DEFAULT_MATRIX);
  const analysis = useMemo(() => analyzeEigenvalues2x2(matrix), [matrix]);

  const updateMatrix = (key: keyof Matrix2x2, value: string) => {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      setMatrix((current) => ({ ...current, [key]: parsed }));
    }
  };

  const input = (key: keyof Matrix2x2) => (
    <input
      aria-label={`Elemento ${key} da matriz`}
      type="number"
      value={matrix[key]}
      step="any"
      onChange={(event) => updateMatrix(key, event.target.value)}
      className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-right font-mono text-sm text-cyan-300 focus:border-cyan-400 focus:outline-none"
    />
  );

  const statusLabel = {
    'real-distinct': 'Reais distintos',
    'real-repeated': 'Real repetido',
    'complex-conjugate': 'Complexos conjugados',
  }[analysis.status];

  const formatEigenvalue = (value: typeof analysis.eigenvalues[number]) => {
    if (value.imaginary === 0) return value.real.toFixed(4);
    return `${value.real.toFixed(4)} ${value.imaginary >= 0 ? '+' : '-'} ${Math.abs(value.imaginary).toFixed(4)}i`;
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-violet-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
            <BrainCircuit className="h-3.5 w-3.5" />
            Álgebra Linear • Problema Espectral
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Autovalores e autovetores 2×2
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
            Explore a equação característica de uma matriz real e identifique quando
            seus autovalores são reais ou complexos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-1">
          <h2 className="font-semibold text-white">Matriz A</h2>
          <div className="space-y-3 font-mono text-slate-200">
            <div className="flex items-center gap-2">{input('a')}{input('b')}</div>
            <div className="flex items-center gap-2">{input('c')}{input('d')}</div>
          </div>
          <button
            type="button"
            onClick={() => setMatrix(DEFAULT_MATRIX)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar exemplo
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3.5 lg:col-span-2">
          <MetricBadge label="Discriminante" symbol="Δ" value={analysis.discriminant.toFixed(4)} variant="cyan" />
          <MetricBadge label="Classificação" value={statusLabel} variant={analysis.status === 'complex-conjugate' ? 'amber' : 'emerald'} />
          <MetricBadge label="Autovalor λ₁" value={formatEigenvalue(analysis.eigenvalues[0])} variant="purple" />
          <MetricBadge label="Autovalor λ₂" value={formatEigenvalue(analysis.eigenvalues[1])} variant="purple" />
        </div>
      </div>

      <ScientificCard
        title="Interpretação espectral"
        subtitle="Os autovalores são as raízes do polinômio característico det(A − λI)."
        icon={<BrainCircuit className="h-5 w-5" />}
        theoryContent={
          <div className="space-y-3">
            <MathView block math="\lambda^2-\operatorname{tr}(A)\lambda+\det(A)=0" />
            <MathView block math="\lambda=\frac{\operatorname{tr}(A)\pm\sqrt{\operatorname{tr}(A)^2-4\det(A)}}{2}" />
            <p>
              Quando o discriminante é negativo, a matriz real possui um par
              complexo conjugado e não há autovetores reais correspondentes.
              Em um autovalor repetido de uma matriz 2×2, a dimensão do
              autoespaço distingue a matriz escalar (dimensão 2) de uma matriz
              defectiva, não diagonalizável (dimensão 1).
            </p>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Dimensão do autoespaço real: <strong className="text-violet-300">{analysis.eigenspaceDimension}</strong>.
          </p>
          {analysis.eigenvalues.map((value, index) => (
            <div key={`${value.real}-${value.imaginary}`} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <p className="text-sm font-semibold text-white">λ{index + 1} = {formatEigenvalue(value)}</p>
              {value.eigenvector ? (
                <p className="mt-1 text-sm text-slate-400">
                  Autovetor unitário real: ({value.eigenvector.x.toFixed(4)}, {value.eigenvector.y.toFixed(4)})
                </p>
              ) : (
                <p className="mt-1 text-sm text-amber-300">Autovetor real não exibido para este autovalor complexo.</p>
              )}
            </div>
          ))}
        </div>
      </ScientificCard>
    </div>
  );
};
