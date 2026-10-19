import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Activity, ShieldCheck, HelpCircle } from 'lucide-react';
import { simulateUncertainty } from '../../core/physics/uncertainty';
import { formatScientific } from '../../core/physics/units';
import { ParameterControl } from '../../components/common/ParameterControl';
import { MetricBadge } from '../../components/common/MetricBadge';
import { ScientificCard } from '../../components/common/ScientificCard';
import { MathView } from '../../components/common/MathView';

export const UncertaintySimulator: React.FC = () => {
  const [sigmaXNm, setSigmaXNm] = useState<number>(0.5);

  const simulation = useMemo(() => {
    return simulateUncertainty(sigmaXNm, 200);
  }, [sigmaXNm]);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Fundamentos Quânticos • Relações de Comutação</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Princípio da Incerteza de Heisenberg & Pares Conjugados
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Examine a relação fundamental entre a localização espacial <MathView math="\Delta x" /> e a dispersão do momento linear <MathView math="\Delta p" /> em um pacote de onda Gaussiano ótimo.
          </p>
        </div>
      </div>

      {/* Grid de Controles e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3">
              Controle de Dispersão Espacial
            </h2>

            <ParameterControl
              id="param-sigma-x"
              label="Incerteza Espacial"
              symbol="\sigma_x = \Delta x"
              value={sigmaXNm}
              min={0.08}
              max={1.8}
              step={0.02}
              unit="nm"
              onChange={setSigmaXNm}
              description="Ajuste a largura do pacote de ondas no espaço das posições."
            />

            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Condição de Incerteza Mínima</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                O pacote de ondas Gaussiano atinge exatamente o limite inferior absoluto de Heisenberg:
              </p>
              <MathView block math="\Delta x \cdot \Delta p = \frac{\hbar}{2}" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <MetricBadge
            label="Incerteza Espacial"
            symbol="\Delta x"
            value={`${simulation.sigmaXNm.toFixed(3)}`}
            unit="nm"
            subtext="Desvio padrão no espaço x"
            variant="cyan"
          />
          <MetricBadge
            label="Incerteza Momento"
            symbol="\Delta p"
            value={formatScientific(simulation.sigmaPJoulesSecPerM, 2)}
            unit="kg·m/s"
            subtext="ℏ / (2 Δx)"
            variant="purple"
          />
          <MetricBadge
            label="Produto de Incertezas"
            symbol="\Delta x \Delta p"
            value="0.500"
            unit="ℏ"
            subtext="Mínimo teórico absoluto"
            variant="emerald"
          />
          <MetricBadge
            label="Constante de Dirac"
            symbol="\hbar"
            value="1.055 × 10⁻³⁴"
            unit="J·s"
            subtext="Constante de Planck reduzida"
            variant="default"
          />
          <MetricBadge
            label="Comutador [x̂, p̂]"
            symbol="[\hat{x}, \hat{p}]"
            value="iℏ"
            subtext="Operadores não-comutativos"
            variant="amber"
          />
          <MetricBadge
            label="Razão ao Limite Mínimo"
            symbol="\Delta x \Delta p / (\hbar/2)"
            value="1.000×"
            subtext="Satura a desigualdade"
            variant="default"
          />
        </div>
      </div>

      {/* Gráficos Conjugados Lado a Lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Espaço das Posições */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-semibold text-cyan-400">
              Espaço das Posições — Densidade |ψ(x)|²
            </span>
            <span className="font-mono text-slate-400">Δx = {sigmaXNm.toFixed(3)} nm</span>
          </div>
          <div className="h-64 w-full rounded-xl bg-slate-950/70 border border-slate-800 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulation.pointsX} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="x"
                  type="number"
                  stroke="#64748b"
                  label={{ value: 'Posição x (nm)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  stroke="#64748b"
                  label={{ value: '|ψ(x)|² [nm⁻¹]', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                  formatter={(val) => [`${val} nm⁻¹`, '|ψ(x)|²']}
                  labelFormatter={(lbl) => `x = ${lbl} nm`}
                />
                <Area
                  type="monotone"
                  dataKey="density"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.25}
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400">
            Quanto mais estreita esta curva (menor <MathView math="\Delta x" />), maior é a certeza sobre a coordenada espacial da partícula.
          </p>
        </div>

        {/* Espaço dos Momentos */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-semibold text-purple-400">
              Espaço dos Momentos — Densidade |φ(p)|²
            </span>
            <span className="font-mono text-slate-400">Δp = {formatScientific(simulation.sigmaPJoulesSecPerM, 2)} kg·m/s</span>
          </div>
          <div className="h-64 w-full rounded-xl bg-slate-950/70 border border-slate-800 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulation.pointsP} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="p"
                  type="number"
                  stroke="#64748b"
                  label={{ value: 'Momento p (múltiplos de Δp)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  stroke="#64748b"
                  label={{ value: '|φ(p)|²', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                  formatter={(val) => [`${val}`, '|φ(p)|²']}
                  labelFormatter={(lbl) => `p = ${lbl} Δp`}
                />
                <Area
                  type="monotone"
                  dataKey="density"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.25}
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400">
            Pela relação de Fourier, a largura no momento é inversamente proporcional a <MathView math="\Delta x" /> (<MathView math="\Delta p \propto 1/\Delta x" />).
          </p>
        </div>
      </div>

      {/* Fundamentação Científica */}
      <ScientificCard
        title="Rigor Científico: Incerteza Estatística vs. Efeito do Observador"
        subtitle="Esclarecimento de equívocos conceituais comuns sobre o princípio de Heisenberg"
        badge="Fundamento Teórico"
        theoryTitle="Derivação Formal a partir da Desigualdade de Robertson-Schrödinger"
        theoryContent={
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-white text-sm mb-1">1. Teorema Geral da Incerteza (Robertson, 1929)</h4>
              <p>
                Para quaisquer dois observáveis hermitianos <MathView math="\hat{A}" /> e <MathView math="\hat{B}" />, a dispersão estatística (desvio padrão) é definida por <MathView math="\sigma_A = \sqrt{\langle \hat{A}^2 \rangle - \langle \hat{A} \rangle^2}" />. Demonstra-se rigorosamente a partir da desigualdade de Cauchy-Schwarz que:
              </p>
              <MathView block math="\sigma_A \sigma_B \ge \frac{1}{2} \left| \langle [\hat{A}, \hat{B}] \rangle \right|" />
              <p>
                Para posição e momento linear, a relação fundamental de comutação canônica de Dirac-Heisenberg é:
              </p>
              <MathView block math="[\hat{x}, \hat{p}] = i\hbar \hat{I} \implies \left| \langle [\hat{x}, \hat{p}] \rangle \right| = \hbar \implies \Delta x \Delta p \ge \frac{\hbar}{2}" />
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-1">2. O que a Incerteza NÃO é</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong className="text-white">Não é erro do instrumento de medição:</strong> mesmo com um equipamento hipoteticamente perfeito com resolução infinita, a incerteza intrínseca do estado quântico permanece idêntica.</li>
                <li><strong className="text-white">Não é mera perturbação do fóton na medição:</strong> embora a medição perturbe o sistema (efeito do observador), a incerteza de Heisenberg é uma propriedade geométrica do espaço de Hilbert e da natureza ondulatória dos estados.</li>
                <li><strong className="text-white">Propriedade de ensemble estatístico:</strong> se prepararmos 10.000 partículas exatamente no mesmo estado quântico, a distribuição das medições de posição terá desvio <MathView math="\Delta x" /> e a das medições de momento terá desvio <MathView math="\Delta p" /> satisfazendo a desigualdade.</li>
              </ul>
            </div>
          </div>
        }
      >
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-slate-300">
          <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white block mb-1">Experiência Interativa:</span>
            <span>
              Ao arrastar o controle para valores muito pequenos (<MathView math="\Delta x \to 0" />), a partícula fica altamente confinada, mas a incerteza em seu momento explode (<MathView math="\Delta p \to \infty" />), impedindo a definição simultânea de trajetória clássica.
            </span>
          </div>
        </div>
      </ScientificCard>
    </div>
  );
};
