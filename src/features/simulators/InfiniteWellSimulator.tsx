import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Layers, Sliders } from 'lucide-react';
import { PARTICLE_PRESETS } from '../../core/physics/constants';
import type { ParticleOption } from '../../core/physics/constants';
import {
  simulateInfiniteWell,
  calculateIntervalProbability,
  calculateEnergy,
} from '../../core/physics/infiniteWell';
import { formatEnergy, formatScientific, joulesToEv } from '../../core/physics/units';
import { ParameterControl } from '../../components/common/ParameterControl';
import { MetricBadge } from '../../components/common/MetricBadge';
import { ScientificCard } from '../../components/common/ScientificCard';
import { MathView } from '../../components/common/MathView';

export const InfiniteWellSimulator: React.FC = () => {
  const [n, setN] = useState<number>(1);
  const [widthNm, setWidthNm] = useState<number>(1.0);
  const [selectedParticleId, setSelectedParticleId] = useState<string>('electron');
  const [intervalX1, setIntervalX1] = useState<number>(0.2);
  const [intervalX2, setIntervalX2] = useState<number>(0.8);
  const [activeView, setActiveView] = useState<'separated' | 'wave' | 'prob'>('separated');

  const selectedParticle = useMemo<ParticleOption>(() => {
    return PARTICLE_PRESETS.find((p) => p.id === selectedParticleId) || PARTICLE_PRESETS[0];
  }, [selectedParticleId]);

  // Simulação física analítica
  const simulation = useMemo(() => {
    return simulateInfiniteWell(n, widthNm, selectedParticle.massKg, 250);
  }, [n, widthNm, selectedParticle]);

  // Probabilidade no sub-intervalo [x1, x2]
  const intervalProb = useMemo(() => {
    return calculateIntervalProbability(intervalX1, intervalX2, n, widthNm);
  }, [intervalX1, intervalX2, n, widthNm]);

  // Escada de níveis de energia para visualização quantizada
  const energyLevels = useMemo(() => {
    const levels = [];
    const maxN = Math.max(5, n);
    for (let i = 1; i <= maxN; i++) {
      const eJ = calculateEnergy(i, widthNm, selectedParticle.massKg);
      levels.push({
        level: i,
        energyEv: joulesToEv(eJ),
        isCurrent: i === n,
      });
    }
    return levels;
  }, [n, widthNm, selectedParticle]);

  const energyFormatted = formatEnergy(simulation.energyJoules);

  return (
    <div className="space-y-8">
      {/* Cabeçalho do Experimento */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Mecânica Quântica 1D • Confinamento Espacial</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Poço de Potencial Infinito 1D (Partícula na Caixa)
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Investigue analiticamente os autoestados de energia, as funções de onda <MathView math="\psi_n(x)" />, a densidade de probabilidade <MathView math="|\psi_n(x)|^2" /> e a quantização estrita imposta pelo confinamento geométrico.
          </p>
        </div>
      </div>

      {/* Grid de Controles e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Parâmetros */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-white">Parâmetros Experimentais</h2>
          </div>

          {/* Seleção de Partícula */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300">Partícula Confinada</label>
            <div className="grid grid-cols-2 gap-2">
              {PARTICLE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedParticleId(p.id)}
                  className={`px-3 py-2 text-left rounded-xl text-xs font-medium border transition-all ${
                    selectedParticleId === p.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{p.name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">{p.symbol}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {formatScientific(p.massKg, 2)} kg
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Controle do Número Quântico n */}
          <ParameterControl
            id="param-n"
            label="Número Quântico Principal"
            symbol="n"
            value={n}
            min={1}
            max={8}
            step={1}
            unit="adimensional"
            onChange={setN}
            description="Determina o estado energético. O estado fundamental corresponde a n = 1."
          />

          {/* Controle da Largura L */}
          <ParameterControl
            id="param-width"
            label="Largura do Poço"
            symbol="L"
            value={widthNm}
            min={0.2}
            max={4.0}
            step={0.1}
            unit="nm"
            onChange={setWidthNm}
            description="Dimensão de confinamento. A energia é inversamente proporcional a L²."
          />

          {/* Integração de Probabilidade em Intervalo */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                Probabilidade no Intervalo [x₁, x₂]
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {(intervalProb * 100).toFixed(2)}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">x₁ (nm)</label>
                <input
                  type="number"
                  min={0}
                  max={widthNm}
                  step={0.05}
                  value={intervalX1}
                  onChange={(e) => setIntervalX1(Math.max(0, Math.min(widthNm, parseFloat(e.target.value) || 0)))}
                  className="w-full px-2 py-1 text-xs font-mono bg-slate-900 border border-slate-700 rounded text-slate-200"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">x₂ (nm)</label>
                <input
                  type="number"
                  min={0}
                  max={widthNm}
                  step={0.05}
                  value={intervalX2}
                  onChange={(e) => setIntervalX2(Math.max(0, Math.min(widthNm, parseFloat(e.target.value) || 0)))}
                  className="w-full px-2 py-1 text-xs font-mono bg-slate-900 border border-slate-700 rounded text-slate-200"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Integral exata analítica <MathView math="P = \int_{x_1}^{x_2} |\psi_n(x)|^2 \, dx" />
            </p>
          </div>
        </div>

        {/* Métricas Científicas */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <MetricBadge
              label="Energia Quantizada"
              symbol="E_n"
              value={energyFormatted.compact}
              subtext={`${energyFormatted.joules}`}
              variant="cyan"
            />
            <MetricBadge
              label="Razão de Energia"
              symbol="E_n / E_1"
              value={`${Math.pow(n, 2)}×`}
              subtext="Dependência quadrática n²"
              variant="purple"
            />
            <MetricBadge
              label="Nós Internos"
              symbol="x_k"
              value={simulation.nodes.length}
              subtext={`Total de nós = n - 1`}
              variant="emerald"
            />
            <MetricBadge
              label="Posição Média"
              symbol="\langle x \rangle"
              value={`${(widthNm / 2).toFixed(2)}`}
              unit="nm"
              subtext="Simetria central L/2"
              variant="default"
            />
            <MetricBadge
              label="Incerteza Posição"
              symbol="\Delta x"
              value={`${simulation.uncertaintyXNm.toFixed(3)}`}
              unit="nm"
              subtext="Desvio padrão estatístico"
              variant="default"
            />
            <MetricBadge
              label="Produto de Incerteza"
              symbol="\Delta x \Delta p"
              value={`${simulation.uncertaintyProductHbar.toFixed(3)}`}
              unit="ℏ"
              subtext="Respeita ≥ 0.5 ℏ"
              variant="amber"
            />
          </div>

          {/* Gráfico de Níveis de Energia (Ladder Diagram) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Escada de Níveis de Energia Quantizados</span>
              <span>E_n ∝ n² / (m L²)</span>
            </div>
            <div className="flex items-end gap-2 h-24 pt-2 px-2 border-b border-slate-800">
              {energyLevels.map((lvl) => {
                const maxEnergy = energyLevels[energyLevels.length - 1].energyEv;
                const heightPct = Math.max(12, (lvl.energyEv / maxEnergy) * 100);
                return (
                  <div
                    key={lvl.level}
                    className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group"
                    onClick={() => setN(lvl.level)}
                  >
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">
                      {lvl.energyEv < 1000 ? `${lvl.energyEv.toFixed(1)}` : `${(lvl.energyEv / 1000).toFixed(1)}k`}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-md transition-all ${
                        lvl.isCurrent
                          ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-lg shadow-cyan-500/30'
                          : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                    />
                    <span
                      className={`text-[11px] font-bold ${
                        lvl.isCurrent ? 'text-cyan-300' : 'text-slate-400'
                      }`}
                    >
                      n={lvl.level}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Visualização Científica dos Gráficos com Escalas Separadas */}
      <ScientificCard
        title="Visualizações da Mecânica Quântica 1D"
        subtitle="Separação rigorosa entre a amplitude de onda ψ(x) [nm⁻¹ᐟ²] e a densidade de probabilidade |ψ(x)|² [nm⁻¹]"
        badge="Rigor Científico"
        theoryTitle="Derivação Analítica da Equação de Schrödinger Independente do Tempo"
        theoryContent={
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-white text-sm mb-1">1. Equação Diferencial e Condições de Contorno</h4>
              <p>
                No interior do poço (<MathView math="0 < x < L" />), o potencial é nulo (<MathView math="V(x) = 0" />), e a Equação de Schrödinger independente do tempo reduz-se a:
              </p>
              <MathView block math="-\frac{\hbar^2}{2m}\frac{d^2\psi(x)}{dx^2} = E\psi(x) \implies \frac{d^2\psi(x)}{dx^2} + k^2\psi(x) = 0, \quad k \equiv \frac{\sqrt{2mE}}{\hbar}" />
              <p>
                Como as paredes em <MathView math="x \le 0" /> e <MathView math="x \ge L" /> têm potencial infinito (<MathView math="V = \infty" />), a probabilidade de encontrar a partícula fora do poço é identicamente nula. Pela continuidade da função de onda, temos as condições de contorno de Dirichlet:
              </p>
              <MathView block math="\psi(0) = 0 \quad \text{e} \quad \psi(L) = 0" />
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-1">2. Autoestados e Níveis de Energia</h4>
              <p>
                A solução geral é <MathView math="\psi(x) = A\sin(kx) + B\cos(kx)" />. A condição <MathView math="\psi(0) = 0" /> impõe <MathView math="B = 0" />. A condição <MathView math="\psi(L) = 0" /> exige <MathView math="\sin(kL) = 0" />, o que restringe o número de onda a valores discretos:
              </p>
              <MathView block math="k_n = \frac{n\pi}{L}, \quad n \in \{1, 2, 3, \dots\}" />
              <p>
                Substituindo <MathView math="k_n" /> na definição de energia:
              </p>
              <MathView block math="E_n = \frac{\hbar^2 k_n^2}{2m} = \frac{n^2\pi^2\hbar^2}{2mL^2} = \frac{n^2 h^2}{8mL^2}" />
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-1">3. Normalização e Princípio da Correspondência</h4>
              <p>
                A constante de normalização <MathView math="A" /> é calculada por <MathView math="\int_0^L |\psi_n(x)|^2 dx = 1" />, resultando em <MathView math="A = \sqrt{2/L}" />. No limite clássico (<MathView math="n \to \infty" />), a média temporal da densidade de probabilidade rápida oscilante converge para a densidade clássica uniforme <MathView math="P_{\text{clássica}}(x) = 1/L" />, confirmando o Princípio da Correspondência de Bohr.
              </p>
            </div>
          </div>
        }
      >
        {/* Seletor de Abas de Visualização */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveView('separated')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'separated' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gráficos lado a lado (recomendado)
            </button>
            <button
              type="button"
              onClick={() => setActiveView('wave')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'wave' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Apenas Amplitude ψ(x)
            </button>
            <button
              type="button"
              onClick={() => setActiveView('prob')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeView === 'prob' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Apenas Densidade |ψ(x)|²
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span>ψₙ(x) [nm⁻¹ᐟ²]</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>|ψₙ(x)|² [nm⁻¹]</span>
            </span>
          </div>
        </div>

        {/* Gráficos Recharts com Coordenadas Numéricas Contínuas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Painel da Função de Onda ψ_n(x) */}
          {(activeView === 'separated' || activeView === 'wave') && (
            <div className={`space-y-2 ${activeView === 'wave' ? 'lg:col-span-2' : ''}`}>
              <div className="flex items-center justify-between text-xs text-slate-300 px-1">
                <span className="font-semibold text-cyan-400">
                  Função de onda ψₙ(x) — amplitude quântica
                </span>
                <span className="font-mono text-slate-400">Unidade: nm⁻¹ᐟ²</span>
              </div>
              <div className="h-72 w-full rounded-xl bg-slate-950/70 border border-slate-800 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulation.points} margin={{ top: 15, right: 20, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={[0, widthNm]}
                      stroke="#64748b"
                      label={{ value: 'Posição x (nm)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#64748b"
                      domain={['auto', 'auto']}
                      label={{ value: 'ψ(x) [nm⁻¹ᐟ²]', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                      formatter={(val) => [`${val} nm⁻¹ᐟ²`, 'ψ(x)']}
                      labelFormatter={(label) => `x = ${label} nm`}
                    />
                    <ReferenceLine y={0} stroke="#475569" strokeDasharray="2 2" />
                    {simulation.nodes.map((nodeX, idx) => (
                      <ReferenceLine
                        key={idx}
                        x={nodeX}
                        stroke="#f59e0b"
                        strokeDasharray="3 3"
                        label={{ value: `Nó ${idx + 1}`, fill: '#f59e0b', fontSize: 10, position: 'top' }}
                      />
                    ))}
                    <Line
                      type="monotone"
                      dataKey="psi"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-slate-400 px-1">
                A amplitude varia continuamente entre <MathView math="-\sqrt{2/L}" /> e <MathView math="+\sqrt{2/L}" />. Cruza zero exatamente nos <span className="text-amber-400 font-semibold">{simulation.nodes.length} nós</span> internos.
              </p>
            </div>
          )}

          {/* Painel da Densidade de Probabilidade |ψ_n(x)|² */}
          {(activeView === 'separated' || activeView === 'prob') && (
            <div className={`space-y-2 ${activeView === 'prob' ? 'lg:col-span-2' : ''}`}>
              <div className="flex items-center justify-between text-xs text-slate-300 px-1">
                <span className="font-semibold text-rose-400">
                  Densidade de probabilidade |ψₙ(x)|²
                </span>
                <span className="font-mono text-slate-400">Unidade: nm⁻¹</span>
              </div>
              <div className="h-72 w-full rounded-xl bg-slate-950/70 border border-slate-800 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulation.points} margin={{ top: 15, right: 20, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={[0, widthNm]}
                      stroke="#64748b"
                      label={{ value: 'Posição x (nm)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#64748b"
                      domain={[0, 'auto']}
                      label={{ value: '|ψ(x)|² [nm⁻¹]', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                      formatter={(val, name) => [
                        `${val} nm⁻¹`,
                        name === 'probDensity' ? '|ψ(x)|² Quântico' : 'Densidade Clássica (1/L)',
                      ]}
                      labelFormatter={(label) => `x = ${label} nm`}
                    />
                    <ReferenceLine
                      y={1 / widthNm}
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      label={{ value: 'Limite Clássico (1/L)', fill: '#94a3b8', fontSize: 10, position: 'top' }}
                    />
                    <ReferenceLine x={intervalX1} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'x₁', fill: '#10b981', fontSize: 10 }} />
                    <ReferenceLine x={intervalX2} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'x₂', fill: '#10b981', fontSize: 10 }} />
                    <Area
                      type="monotone"
                      dataKey="probDensity"
                      stroke="#f43f5e"
                      fill="#f43f5e"
                      fillOpacity={0.25}
                      strokeWidth={2.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-slate-400 px-1">
                Sempre não negativa. A integral sobre toda a caixa vale <MathView math="\int_0^L |\psi|^2 \, dx = 1" />. A linha tracejada cinza exibe a previsão clássica uniforme <MathView math="1/L" />.
              </p>
            </div>
          )}
        </div>

        {/* Nós do Poço */}
        {simulation.nodes.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              Posições Analíticas dos Nós Internos (onde ψ(x) = 0 e a probabilidade de encontrar a partícula é nula):
            </span>
            <div className="flex flex-wrap gap-2">
              {simulation.nodes.map((nodeX, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-amber-950/30 text-amber-300 border border-amber-500/20"
                >
                  x₍{idx + 1}₎ = {nodeX.toFixed(3)} nm ({((idx + 1) / n).toFixed(2)} L)
                </span>
              ))}
            </div>
          </div>
        )}
      </ScientificCard>
    </div>
  );
};
