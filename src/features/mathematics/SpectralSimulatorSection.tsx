import React, { useMemo, useState } from 'react';
import { Orbit, RotateCcw } from 'lucide-react';
import { MathView } from '../../components/common/MathView';
import { MetricBadge } from '../../components/common/MetricBadge';
import { ScientificCard } from '../../components/common/ScientificCard';
import { decomposeSymmetric2x2 } from '../../core/math/spectral2x2';
import type { Matrix2x2 } from '../../core/math/matrix2x2';

const DEFAULT_MATRIX: Matrix2x2 = { a: 3, b: 1, c: 1, d: 2 };
const SIZE = 86;
const CENTER = 110;

export const SpectralSimulatorSection: React.FC = () => {
  const [matrix, setMatrix] = useState<Matrix2x2>(DEFAULT_MATRIX);
  const decomposition = useMemo(() => decomposeSymmetric2x2(matrix), [matrix]);

  const update = (key: keyof Matrix2x2, value: string) => {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      setMatrix((current) => ({ ...current, [key]: parsed, ...(key === 'b' ? { c: parsed } : {}), ...(key === 'c' ? { b: parsed } : {}) }));
    }
  };

  const input = (key: keyof Matrix2x2) => (
    <input
      aria-label={`Elemento ${key} da matriz simétrica`}
      type="number"
      value={matrix[key]}
      step="any"
      onChange={(event) => update(key, event.target.value)}
      className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-right font-mono text-sm text-cyan-300 focus:border-cyan-400 focus:outline-none"
    />
  );

  const point = (vector: { x: number; y: number }, scale: number) =>
    `${CENTER + vector.x * scale},${CENTER - vector.y * scale}`;
  const first = decomposition.eigenvectors[0];
  const second = decomposition.eigenvectors[1];
  const ellipse = Array.from({ length: 65 }, (_, index) => {
    const angle = (index / 64) * Math.PI * 2;
    const x = decomposition.eigenvalues[0] * Math.cos(angle);
    const y = decomposition.eigenvalues[1] * Math.sin(angle);
    return point({ x: x / 3, y: y / 3 }, SIZE / 2);
  }).join(' ');

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-fuchsia-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-300">
            <Orbit className="h-3.5 w-3.5" />
            Simulador • Decomposição Espectral
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Transformação de uma matriz simétrica
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
            Observe os eixos principais e a elipse resultante de uma transformação
            simétrica real. A matriz é mantida simétrica automaticamente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="font-semibold text-white">Matriz simétrica A</h2>
          <div className="space-y-3 font-mono text-slate-200">
            <div className="flex items-center gap-2">{input('a')}{input('b')}</div>
            <div className="flex items-center gap-2">{input('c')}{input('d')}</div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">Os elementos b e c permanecem iguais para garantir A = Aᵀ.</p>
          <button type="button" onClick={() => setMatrix(DEFAULT_MATRIX)} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700">
            <RotateCcw className="h-3.5 w-3.5" /> Restaurar exemplo
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3.5 lg:col-span-2">
          <MetricBadge label="λ₁ principal" value={decomposition.eigenvalues[0].toFixed(4)} variant="purple" />
          <MetricBadge label="λ₂ principal" value={decomposition.eigenvalues[1].toFixed(4)} variant="purple" />
          <MetricBadge label="Resíduo A − QΛQᵀ" value={decomposition.residual.toExponential(2)} variant="emerald" />
          <MetricBadge label="Base espectral" value="Ortonormal" variant="cyan" />
        </div>
      </div>

      <ScientificCard title="Simulação geométrica" subtitle="Os vetores próprios formam os eixos principais da transformação." icon={<Orbit className="h-5 w-5" />} theoryContent={
        <div className="space-y-3">
          <MathView block math="A = Q\\Lambda Q^T,\\qquad Q^TQ=I" />
          <p>Para matrizes reais simétricas, o teorema espectral garante uma base ortonormal de autovetores e autovalores reais. A elipse mostra a ação diagonal nos eixos próprios, em escala visual.</p>
        </div>
      }>
        <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2">
            <svg viewBox="0 0 220 220" className="mx-auto aspect-square w-full max-w-md" role="img" aria-label="Eixos principais e elipse da transformação espectral">
              <line x1="15" y1={CENTER} x2="205" y2={CENTER} stroke="#334155" />
              <line x1={CENTER} y1="15" x2={CENTER} y2="205" stroke="#334155" />
              <polyline points={ellipse} fill="none" stroke="#22d3ee" strokeWidth="2" />
              <line x1={CENTER - first.x * SIZE} y1={CENTER + first.y * SIZE} x2={CENTER + first.x * SIZE} y2={CENTER - first.y * SIZE} stroke="#a78bfa" strokeWidth="2" />
              <line x1={CENTER - second.x * SIZE} y1={CENTER + second.y * SIZE} x2={CENTER + second.x * SIZE} y2={CENTER - second.y * SIZE} stroke="#34d399" strokeWidth="2" />
              <circle cx={CENTER} cy={CENTER} r="3" fill="#f8fafc" />
            </svg>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <p><span className="text-violet-300">Eixo λ₁:</span> ({first.x.toFixed(3)}, {first.y.toFixed(3)})</p>
            <p><span className="text-emerald-300">Eixo λ₂:</span> ({second.x.toFixed(3)}, {second.y.toFixed(3)})</p>
            <p className="text-xs leading-relaxed text-slate-400">A escala do desenho é normalizada para manter a visualização dentro do painel; os valores numéricos permanecem exatos no modelo.</p>
          </div>
        </div>
      </ScientificCard>
    </div>
  );
};
