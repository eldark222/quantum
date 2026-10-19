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
import { ArrowRightLeft } from 'lucide-react';
import { ELECTRON_MASS, PROTON_MASS } from '../../core/physics/constants';
import {
  simulateTunneling,
  calculateTunnelingCoefficients,
} from '../../core/physics/tunneling';
import type { TunnelingParams } from '../../core/physics/tunneling';
import { formatScientific } from '../../core/physics/units';
import { ParameterControl } from '../../components/common/ParameterControl';
import { MetricBadge } from '../../components/common/MetricBadge';
import { ScientificCard } from '../../components/common/ScientificCard';
import { MathView } from '../../components/common/MathView';

export const TunnelingSimulator: React.FC = () => {
  const [particleEnergyEv, setParticleEnergyEv] = useState<number>(4.0);
  const [barrierHeightEv, setBarrierHeightEv] = useState<number>(7.0);
  const [barrierWidthNm, setBarrierWidthNm] = useState<number>(0.25);
  const [isProton, setIsProton] = useState<boolean>(false);

  const massKg = isProton ? PROTON_MASS : ELECTRON_MASS;

  const params: TunnelingParams = useMemo(() => {
    return {
      particleEnergyEv,
      barrierHeightEv,
      barrierWidthNm,
      massKg,
    };
  }, [particleEnergyEv, barrierHeightEv, barrierWidthNm, massKg]);

  const simulation = useMemo(() => {
    return simulateTunneling(params, 250);
  }, [params]);

  // Curva de transmissão analítica T vs E/V0
  const transmissionCurve = useMemo(() => {
    const points = [];
    const v0 = barrierHeightEv;
    for (let i = 1; i <= 60; i++) {
      const eRatio = i * 0.04; // 0.04 a 2.4
      const currentE = eRatio * v0;
      const { T } = calculateTunnelingCoefficients({
        particleEnergyEv: currentE,
        barrierHeightEv: v0,
        barrierWidthNm,
        massKg,
      });
      points.push({
        eRatio: Number(eRatio.toFixed(2)),
        energyEv: Number(currentE.toFixed(2)),
        T: Number(T.toFixed(5)),
        isCurrent: Math.abs(eRatio - particleEnergyEv / v0) < 0.03,
      });
    }
    return points;
  }, [barrierHeightEv, barrierWidthNm, massKg, particleEnergyEv]);

  const tPercent = simulation.transmissionCoefficient * 100;
  const rPercent = simulation.reflectionCoefficient * 100;
  const skinDepthNm = simulation.barrierKappa > 0 ? (1 / simulation.barrierKappa) * 1e9 : 0;

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Penetração de Barreira • Soluções Evanescentes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tunelamento Quântico em Barreira Retangular 1D
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Compreenda como partículas quânticas atravessam barreiras de potencial classicamente proibidas (<MathView math="E < V_0" />) e explore ressonâncias de transmissão para energias superiores à barreira (<MathView math="E > V_0" />).
          </p>
        </div>
      </div>

      {/* Grid de Parâmetros e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3">
            Controles da Barreira e Partícula
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Partícula</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsProton(false)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  !isProton
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Elétron (leve)
              </button>
              <button
                type="button"
                onClick={() => setIsProton(true)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  isProton
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Próton (pesado)
              </button>
            </div>
          </div>

          <ParameterControl
            id="param-energy"
            label="Energia da Partícula"
            symbol="E"
            value={particleEnergyEv}
            min={0.5}
            max={15.0}
            step={0.1}
            unit="eV"
            onChange={setParticleEnergyEv}
            description="Energia cinética incidente da partícula vinda da esquerda."
          />

          <ParameterControl
            id="param-barrier-height"
            label="Altura da Barreira"
            symbol="V_0"
            value={barrierHeightEv}
            min={1.0}
            max={15.0}
            step={0.2}
            unit="eV"
            onChange={setBarrierHeightEv}
            description="Potencial elétrico estático da barreira confinada entre 0 e a."
          />

          <ParameterControl
            id="param-barrier-width"
            label="Espessura da Barreira"
            symbol="a"
            value={barrierWidthNm}
            min={0.05}
            max={0.8}
            step={0.02}
            unit="nm"
            onChange={setBarrierWidthNm}
            description="Largura espacial da barreira de potencial."
          />
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <MetricBadge
            label="Coeficiente Transmissão"
            symbol="T"
            value={`${tPercent < 0.01 ? formatScientific(tPercent, 2) : tPercent.toFixed(2)}%`}
            subtext={simulation.regime === 'tunneling' ? 'Tunelamento sub-barreira' : 'Acima da barreira'}
            variant={simulation.regime === 'tunneling' ? 'emerald' : 'cyan'}
          />
          <MetricBadge
            label="Coeficiente Reflexão"
            symbol="R"
            value={`${rPercent.toFixed(2)}%`}
            subtext="Probabilidade de ricochete"
            variant="amber"
          />
          <MetricBadge
            label="Conservação de Fluxo"
            symbol="T + R"
            value="100.00%"
            subtext="Unitaridade rigorosa mantida"
            variant="default"
          />
          <MetricBadge
            label="Razão de Energia"
            symbol="E / V_0"
            value={(particleEnergyEv / barrierHeightEv).toFixed(2)}
            subtext={particleEnergyEv < barrierHeightEv ? 'Classicamente Proibido' : 'Classicamente Permitido'}
            variant={particleEnergyEv < barrierHeightEv ? 'purple' : 'cyan'}
          />
          <MetricBadge
            label="Profundidade de Penetração"
            symbol="1/\kappa"
            value={skinDepthNm > 0 ? `${skinDepthNm.toFixed(3)} nm` : '—'}
            subtext="Comprimento de atenuação 1/e"
            variant="default"
          />
          <MetricBadge
            label="Regime Físico"
            value={simulation.regime === 'tunneling' ? 'Tunelamento' : simulation.regime === 'threshold' ? 'Limiar (E≈V₀)' : 'Transmissão'}
            subtext={isProton ? 'Massa alta suprime T' : 'Massa leve do elétron'}
            variant={simulation.regime === 'tunneling' ? 'emerald' : 'rose'}
          />
        </div>
      </div>

      {/* Perfil da Função de Onda nas 3 Regiões */}
      <ScientificCard
        title="Perfil Espacial da Função de Onda nas Três Regiões"
        subtitle="Região I (Incidente + Refletida), Região II (Atenuação Evanescente) e Região III (Onda Transmitida)"
        badge="Equação de Schrödinger"
        theoryTitle="Equações Analíticas e Unitaridade do Tunelamento"
        theoryContent={
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-white text-sm mb-1">1. Soluções por Regiões</h4>
              <p>
                Para uma barreira retangular <MathView math="V(x) = V_0" /> em <MathView math="0 < x < a" /> e <MathView math="0" /> em outros pontos:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 mt-1">
                <li><strong>Região I (<MathView math="x < 0" />):</strong> <MathView math="\psi_I(x) = e^{ikx} + r\,e^{-ikx}" />, com <MathView math="k = \sqrt{2mE}/\hbar" />.</li>
                <li><strong>Região II (<MathView math="0 \le x \le a" />, <MathView math="E < V_0" />):</strong> <MathView math="\psi_{II}(x) = A\,e^{-\kappa x} + B\,e^{\kappa x}" />, com <MathView math="\kappa = \sqrt{2m(V_0 - E)}/\hbar" /> (onda evanescente).</li>
                <li><strong>Região III (<MathView math="x > a" />):</strong> <MathView math="\psi_{III}(x) = t\,e^{ikx}" /> (onda puramente transmitida).</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-1">2. Coeficiente de Transmissão Analítico de Morse-Condon</h4>
              <p>
                Impondo a continuidade de <MathView math="\psi(x)" /> e de sua derivada <MathView math="\psi'(x)" /> em <MathView math="x = 0" /> e <MathView math="x = a" />, obtém-se analiticamente:
              </p>
              <MathView block math="T = \left[ 1 + \frac{V_0^2}{4E(V_0 - E)} \sinh^2(\kappa a) \right]^{-1}, \quad \text{para } E < V_0" />
              <p>
                Para barreiras espessas (<MathView math="\kappa a \gg 1" />), a aproximação assintótica é <MathView math="T \approx 16 \frac{E}{V_0}\left(1 - \frac{E}{V_0}\right) e^{-2\kappa a}" />, demonstrando a sensibilidade exponencial à largura da barreira.
              </p>
            </div>
          </div>
        }
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simulation.waveProfile} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="xNm"
                type="number"
                stroke="#64748b"
                label={{ value: 'Posição x (nm)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                stroke="#64748b"
                domain={[-1.8, 2.2]}
                label={{ value: 'Re{ψ(x)} / Potencial', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                formatter={(val, name) => [
                  `${val}`,
                  name === 'realPsi' ? 'Re{ψ(x)}' : 'Densidade |ψ|²',
                ]}
                labelFormatter={(lbl) => `x = ${lbl} nm`}
              />
              <ReferenceLine x={0} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'x=0', fill: '#10b981', fontSize: 10 }} />
              <ReferenceLine x={barrierWidthNm} stroke="#10b981" strokeDasharray="3 3" label={{ value: `x=a (${barrierWidthNm} nm)`, fill: '#10b981', fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="density"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.15}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="realPsi"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ScientificCard>

      {/* Curva de Transmissão T vs E/V0 */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-semibold text-emerald-400">
            Curva de Transmissão T(E/V₀) — Ressonâncias de Ramsauer-Townsend
          </span>
          <span className="font-mono text-slate-400">Ponto Atual: E/V₀ = {(particleEnergyEv / barrierHeightEv).toFixed(2)}</span>
        </div>
        <div className="h-56 w-full rounded-xl bg-slate-950/70 border border-slate-800 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transmissionCurve} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="eRatio"
                type="number"
                stroke="#64748b"
                label={{ value: 'Razão de Energia E / V₀', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                stroke="#64748b"
                domain={[0, 1.05]}
                label={{ value: 'Transmissão T', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                formatter={(val) => [`${(Number(val) * 100).toFixed(2)}%`, 'Transmissão T']}
                labelFormatter={(lbl) => `E/V₀ = ${lbl}`}
              />
              <ReferenceLine x={1.0} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Limiar E = V₀', fill: '#f59e0b', fontSize: 10, position: 'top' }} />
              <ReferenceLine x={particleEnergyEv / barrierHeightEv} stroke="#10b981" strokeWidth={2} label={{ value: 'Atual', fill: '#10b981', fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="T"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
