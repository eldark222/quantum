import React, { useMemo, useState } from 'react';
import { Calculator, Grid2X2, RotateCcw } from 'lucide-react';
import { MathView } from '../../components/common/MathView';
import { MetricBadge } from '../../components/common/MetricBadge';
import { ScientificCard } from '../../components/common/ScientificCard';
import {
  determinant2x2,
  inverse2x2,
  multiplyMatrixVector,
  trace2x2,
} from '../../core/math/matrix2x2';
import type { Matrix2x2, Vector2 } from '../../core/math/matrix2x2';

const DEFAULT_MATRIX: Matrix2x2 = { a: 2, b: 1, c: 1, d: 3 };
const DEFAULT_VECTOR: Vector2 = { x: 1, y: 2 };

export const MatrixSection: React.FC = () => {
  const [matrix, setMatrix] = useState<Matrix2x2>(DEFAULT_MATRIX);
  const [vector, setVector] = useState<Vector2>(DEFAULT_VECTOR);
  const determinant = useMemo(() => determinant2x2(matrix), [matrix]);
  const trace = useMemo(() => trace2x2(matrix), [matrix]);
  const transformedVector = useMemo(() => multiplyMatrixVector(matrix, vector), [matrix, vector]);
  const inverse = useMemo(() => inverse2x2(matrix), [matrix]);

  const updateMatrix = (key: keyof Matrix2x2, value: string) => {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      setMatrix((current) => ({ ...current, [key]: parsed }));
    }
  };

  const updateVector = (key: keyof Vector2, value: string) => {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      setVector((current) => ({ ...current, [key]: parsed }));
    }
  };

  const matrixInput = (key: keyof Matrix2x2) => (
    <input
      aria-label={`Elemento ${key} da matriz`}
      type="number"
      value={matrix[key]}
      step="any"
      onChange={(event) => updateMatrix(key, event.target.value)}
      className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-right font-mono text-sm text-cyan-300 focus:border-cyan-400 focus:outline-none"
    />
  );

  const vectorInput = (key: keyof Vector2) => (
    <input
      aria-label={`Componente ${key} do vetor`}
      type="number"
      value={vector[key]}
      step="any"
      onChange={(event) => updateVector(key, event.target.value)}
      className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-right font-mono text-sm text-cyan-300 focus:border-cyan-400 focus:outline-none"
    />
  );

  const formatMatrix = (value: Matrix2x2) => (
    <div className="grid grid-cols-2 gap-2 font-mono text-cyan-300">
      <span>{value.a.toFixed(3)}</span><span>{value.b.toFixed(3)}</span>
      <span>{value.c.toFixed(3)}</span><span>{value.d.toFixed(3)}</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-blue-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
            <Grid2X2 className="h-3.5 w-3.5" />
            Álgebra Linear • Matrizes e Transformações
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Matriz 2×2 e vetor
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
            Calcule determinante, traço, matriz inversa e a transformação de um vetor.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 lg:col-span-1">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calculator className="h-4 w-4 text-blue-400" />
            <h2 className="font-semibold text-white">Entradas</h2>
          </div>
          <div className="space-y-3 font-mono text-slate-200">
            <div className="flex items-center gap-2">{matrixInput('a')}{matrixInput('b')}</div>
            <div className="flex items-center gap-2">{matrixInput('c')}{matrixInput('d')}</div>
            <div className="pt-2 text-sm text-slate-400">
              Vetor v = ({vectorInput('x')}, {vectorInput('y')})ᵀ
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setMatrix(DEFAULT_MATRIX); setVector(DEFAULT_VECTOR); }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar exemplo
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5 lg:col-span-2">
          <MetricBadge label="Determinante" symbol="det(A)" value={determinant.toFixed(3)} variant="cyan" />
          <MetricBadge label="Traço" symbol="tr(A)" value={trace.toFixed(3)} variant="purple" />
          <MetricBadge label="Vetor transformado" symbol="A·v" value={`(${transformedVector.x.toFixed(3)}, ${transformedVector.y.toFixed(3)})`} variant="emerald" />
          <MetricBadge label="Invertibilidade" value={inverse ? 'Invertível' : 'Singular'} variant={inverse ? 'emerald' : 'amber'} />
        </div>
      </div>

      <ScientificCard
        title="Resultados matriciais"
        subtitle="A inversa existe somente quando o determinante é diferente de zero."
        icon={<Grid2X2 className="h-5 w-5" />}
        theoryContent={
          <div className="space-y-3">
            <p>Para A = [[a, b], [c, d]], as operações fundamentais são:</p>
            <MathView block math="\det(A)=ad-bc,\qquad \operatorname{tr}(A)=a+d" />
            <MathView block math="A^{-1}=\frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}" />
            <p>
              Se det(A) = 0, a transformação comprime o plano em uma dimensão
              menor e não possui inversa usual.
            </p>
          </div>
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-300">Matriz A</h3>
            {formatMatrix(matrix)}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-300">Matriz inversa A⁻¹</h3>
            {inverse ? formatMatrix(inverse.matrix) : <p className="text-sm text-amber-300">Não definida: matriz singular.</p>}
          </div>
        </div>
      </ScientificCard>
    </div>
  );
};
