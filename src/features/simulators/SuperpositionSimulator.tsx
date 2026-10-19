import React, { useState, useMemo } from 'react';
import { CircleDot, RotateCcw, Sparkles } from 'lucide-react';
import {
  calculateQubitState,
  applyHadamardGate,
  applyPauliXGate,
  applyPauliZGate,
  simulateMeasurements,
} from '../../core/physics/superposition';
import type { QubitState } from '../../core/physics/superposition';
import { ParameterControl } from '../../components/common/ParameterControl';
import { MetricBadge } from '../../components/common/MetricBadge';
import { ScientificCard } from '../../components/common/ScientificCard';
import { MathView } from '../../components/common/MathView';

export const SuperpositionSimulator: React.FC = () => {
  const [thetaDeg, setThetaDeg] = useState<number>(60);
  const [phiDeg, setPhiDeg] = useState<number>(45);
  const [measurementResult, setMeasurementResult] = useState<{ count0: number; count1: number; total: number } | null>(null);

  const state: QubitState = useMemo(() => {
    const thetaRad = (thetaDeg * Math.PI) / 180;
    const phiRad = (phiDeg * Math.PI) / 180;
    return calculateQubitState(thetaRad, phiRad);
  }, [thetaDeg, phiDeg]);

  const handleApplyGate = (gate: 'H' | 'X' | 'Z' | 'reset') => {
    if (gate === 'reset') {
      setThetaDeg(0);
      setPhiDeg(0);
      setMeasurementResult(null);
      return;
    }
    let newState = state;
    if (gate === 'H') newState = applyHadamardGate(state);
    if (gate === 'X') newState = applyPauliXGate(state);
    if (gate === 'Z') newState = applyPauliZGate(state);

    setThetaDeg(Math.round((newState.thetaRad * 180) / Math.PI));
    setPhiDeg(Math.round((newState.phiRad * 180) / Math.PI));
    setMeasurementResult(null);
  };

  const handleMeasure = (shots: number) => {
    const res = simulateMeasurements(state, shots);
    setMeasurementResult({ ...res, total: shots });
  };

  // Projeção isométrica 3D na Esfera de Bloch em SVG
  const centerX = 160;
  const centerY = 160;
  const radius = 110;

  // Rotação isométrica simples para a Esfera de Bloch:
  const projX = centerX + radius * (state.bloch.x * 0.866 - state.bloch.y * 0.5);
  const projY = centerY - radius * (state.bloch.z * 0.85 + state.bloch.x * 0.2 + state.bloch.y * 0.2);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <CircleDot className="w-3.5 h-3.5" />
            <span>Informação Quântica • Computação Quântica</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Superposição Quântica & Esfera de Bloch
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Manipule o vetor de estado quântico de um qubit de dois níveis <MathView math="|\psi\rangle = \alpha|0\rangle + \beta|1\rangle" />, aplique portas lógicas quânticas e execute medições projetivas com colapso estatístico.
          </p>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Controles */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3">
            Ângulos de Bloch & Portas
          </h2>

          <ParameterControl
            id="param-theta"
            label="Ângulo Polar"
            symbol="\theta"
            value={thetaDeg}
            min={0}
            max={180}
            step={1}
            unit="graus"
            onChange={setThetaDeg}
            description="Controla a probabilidade entre |0⟩ (θ = 0°) e |1⟩ (θ = 180°)."
          />

          <ParameterControl
            id="param-phi"
            label="Ângulo Azimutal (Fase)"
            symbol="\phi"
            value={phiDeg}
            min={0}
            max={360}
            step={2}
            unit="graus"
            onChange={setPhiDeg}
            description="Define a fase quântica relativa e^(iφ)."
          />

          {/* Portas Lógicas Quânticas */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 block">
              Portas Lógicas Quânticas (Transformações Unitárias)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleApplyGate('H')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Hadamard (H)</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyGate('X')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Pauli-X (NOT)</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyGate('Z')}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-amber-300 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Pauli-Z (Fase)</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyGate('reset')}
                className="px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset (|0⟩)</span>
              </button>
            </div>
          </div>

          {/* Medição Simulada */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                Colapso de Medição (Regra de Born)
              </span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleMeasure(100)}
                className="py-1.5 px-3 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                Medir 100x
              </button>
              <button
                type="button"
                onClick={() => handleMeasure(1000)}
                className="py-1.5 px-3 rounded-lg text-xs font-medium bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30"
              >
                Medir 1000x
              </button>
            </div>
            {measurementResult && (
              <div className="space-y-1.5 pt-1 border-t border-slate-800/80 text-xs font-mono">
                <div className="flex justify-between text-cyan-400">
                  <span>|0⟩ colapsos:</span>
                  <span>{measurementResult.count0} ({(measurementResult.count0 / measurementResult.total * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between text-purple-400">
                  <span>|1⟩ colapsos:</span>
                  <span>{measurementResult.count1} ({(measurementResult.count1 / measurementResult.total * 100).toFixed(1)}%)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visualização da Esfera de Bloch (SVG) */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-300">Esfera de Bloch Geométrica</span>
            <span className="text-xs font-mono text-cyan-400">|ψ⟩ = (x, y, z)</span>
          </div>

          <div className="my-3">
            <svg width={320} height={320} viewBox="0 0 320 320" className="overflow-visible select-none">
              {/* Esfera externa transparente */}
              <circle cx={centerX} cy={centerY} r={radius} fill="#090d16" stroke="#1e293b" strokeWidth={1.5} />
              
              {/* Equador elíptico */}
              <ellipse cx={centerX} cy={centerY} rx={radius} ry={radius * 0.32} fill="none" stroke="#334155" strokeWidth={1} strokeDasharray="3 3" />
              
              {/* Meridiano elíptico */}
              <ellipse cx={centerX} cy={centerY} rx={radius * 0.32} ry={radius} fill="none" stroke="#334155" strokeWidth={1} strokeDasharray="3 3" />

              {/* Eixos cartesianos */}
              {/* Eixo Z (vertical) */}
              <line x1={centerX} y1={centerY + radius + 15} x2={centerX} y2={centerY - radius - 15} stroke="#475569" strokeWidth={1.5} />
              <text x={centerX + 6} y={centerY - radius - 8} fill="#38bdf8" fontSize={11} fontWeight="bold">|0⟩ (+Z)</text>
              <text x={centerX + 6} y={centerY + radius + 14} fill="#a855f7" fontSize={11} fontWeight="bold">|1⟩ (-Z)</text>

              {/* Eixo X */}
              <line x1={centerX - radius * 0.8} y1={centerY + radius * 0.3} x2={centerX + radius * 0.8} y2={centerY - radius * 0.3} stroke="#334155" strokeWidth={1} />
              <text x={centerX + radius * 0.8 + 4} y={centerY - radius * 0.3} fill="#94a3b8" fontSize={10}>+X</text>

              {/* Eixo Y */}
              <line x1={centerX - radius * 0.85} y1={centerY - radius * 0.15} x2={centerX + radius * 0.85} y2={centerY + radius * 0.15} stroke="#334155" strokeWidth={1} />
              <text x={centerX + radius * 0.85 + 4} y={centerY + radius * 0.15} fill="#94a3b8" fontSize={10}>+Y</text>

              {/* Vetor de Estado Quântico |ψ⟩ */}
              <line
                x1={centerX}
                y1={centerY}
                x2={projX}
                y2={projY}
                stroke="#06b6d4"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle cx={projX} cy={projY} r={6} fill="#06b6d4" stroke="#ffffff" strokeWidth={2} />
              <text x={projX + 8} y={projY - 4} fill="#ffffff" fontSize={12} fontWeight="bold">|ψ⟩</text>
            </svg>
          </div>

          <div className="w-full text-center text-xs font-mono text-slate-400">
            x = {state.bloch.x.toFixed(2)}, y = {state.bloch.y.toFixed(2)}, z = {state.bloch.z.toFixed(2)}
          </div>
        </div>

        {/* Métricas e Amplitudes */}
        <div className="lg:col-span-1 space-y-4">
          <MetricBadge
            label="Probabilidade |0⟩"
            symbol="P(|0\rangle) = \cos^2(\theta/2)"
            value={`${(state.prob0 * 100).toFixed(2)}%`}
            subtext="Amplitude α = cos(θ/2)"
            variant="cyan"
          />
          <MetricBadge
            label="Probabilidade |1⟩"
            symbol="P(|1\rangle) = \sin^2(\theta/2)"
            value={`${(state.prob1 * 100).toFixed(2)}%`}
            subtext="Amplitude β = e^(iφ) sin(θ/2)"
            variant="purple"
          />
          <MetricBadge
            label="Normalização Quântica"
            symbol="|\alpha|^2 + |\beta|^2"
            value="1.000"
            subtext="Conservação de probabilidade"
            variant="emerald"
          />

          {/* Barra Comparativa de Probabilidade */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">Distribuição de Probabilidades Teóricas</span>
            <div className="h-4 w-full rounded-full bg-slate-950 overflow-hidden flex border border-slate-800">
              <div
                style={{ width: `${state.prob0 * 100}%` }}
                className="bg-cyan-500 h-full transition-all"
                title={`P(0) = ${(state.prob0 * 100).toFixed(1)}%`}
              />
              <div
                style={{ width: `${state.prob1 * 100}%` }}
                className="bg-purple-500 h-full transition-all"
                title={`P(1) = ${(state.prob1 * 100).toFixed(1)}%`}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-cyan-400">|0⟩: {(state.prob0 * 100).toFixed(1)}%</span>
              <span className="text-purple-400">|1⟩: {(state.prob1 * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fundamentação Científica */}
      <ScientificCard
        title="Fundamentos de Qubits e Computação Quântica"
        subtitle="Diferenças entre bit clássico e qubit quântico em superposição contínua"
        badge="Teoria da Informação Quântica"
        theoryTitle="Estrutura Algébrica do Qubit e Regra de Born"
        theoryContent={
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-white text-sm mb-1">1. O Espaço de Hilbert de 2 Dimensões</h4>
              <p>
                Enquanto um bit clássico assume exclusivamente os valores discretos <MathView math="0" /> ou <MathView math="1" />, o estado quântico de um qubit reside em um espaço de Hilbert bidimensional <MathView math="\mathbb{C}^2" />:
              </p>
              <MathView block math="|\psi\rangle = \alpha |0\rangle + \beta |1\rangle, \quad \alpha, \beta \in \mathbb{C}, \quad |\alpha|^2 + |\beta|^2 = 1" />
              <p>
                Eliminando uma fase global arbitrária inobservável (<MathView math="e^{i\gamma}" />), qualquer estado puro pode ser parametrizado unicamente por dois ângulos reais <MathView math="\theta \in [0, \pi]" /> e <MathView math="\phi \in [0, 2\pi]" />:
              </p>
              <MathView block math="|\psi\rangle = \cos\left(\frac{\theta}{2}\right)|0\rangle + e^{i\phi}\sin\left(\frac{\theta}{2}\right)|1\rangle" />
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-1">2. As Portas Lógicas Fundamentais</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong className="text-cyan-300">Porta de Hadamard (H):</strong> cria uma superposição balanceada a partir da base computacional. Transforma <MathView math="|0\rangle \to \frac{|0\rangle + |1\rangle}{\sqrt{2}} = |+\rangle" />.</li>
                <li><strong className="text-purple-300">Porta Pauli-X:</strong> análogo quântico da porta NOT clássica. Inverte <MathView math="|0\rangle \leftrightarrow |1\rangle" /> (rotação de 180° em torno do eixo X).</li>
                <li><strong className="text-amber-300">Porta Pauli-Z:</strong> inverte a fase relativa do estado <MathView math="|1\rangle \to -|1\rangle" /> mantendo inalteradas as probabilidades na base computacional.</li>
              </ul>
            </div>
          </div>
        }
      >
        <div className="text-sm text-slate-300 leading-relaxed space-y-2">
          <p>
            A <strong>Esfera de Bloch</strong> é a representação geométrica dos estados puros de um sistema quântico de dois níveis. O polo norte representa o estado fundamental <MathView math="|0\rangle" />, o polo sul representa o estado excitado <MathView math="|1\rangle" />, e os pontos sobre o equador representam superposições com probabilidades iguais (<MathView math="50\% / 50\%" />), diferenciadas apenas por suas fases quânticas relativas.
          </p>
        </div>
      </ScientificCard>
    </div>
  );
};
