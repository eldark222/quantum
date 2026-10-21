import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Network, AlertTriangle } from 'lucide-react';
import {
  calculateQuantumCorrelation,
  evaluateChshInequality,
} from '../../core/physics/entanglement';
import { ParameterControl } from '../../components/common/ParameterControl';
import { MetricBadge } from '../../components/common/MetricBadge';
import { ScientificCard } from '../../components/common/ScientificCard';
import { MathView } from '../../components/common/MathView';

export const EntanglementSimulator: React.FC = () => {
  const [angleA, setAngleA] = useState<number>(0);
  const [angleB, setAngleB] = useState<number>(45);

  const [chshA] = useState<number>(0);
  const [chshAPrime] = useState<number>(90);
  const [chshB] = useState<number>(45);
  const [chshBPrime] = useState<number>(135);

  const currentCorrelation = useMemo(() => {
    return calculateQuantumCorrelation(angleA, angleB);
  }, [angleA, angleB]);

  const chshResult = useMemo(() => {
    return evaluateChshInequality(chshA, chshAPrime, chshB, chshBPrime);
  }, [chshA, chshAPrime, chshB, chshBPrime]);

  // Curva de correlação quântica vs ângulo relativo Delta theta
  const correlationCurve = useMemo(() => {
    const points = [];
    for (let delta = 0; delta <= 360; delta += 5) {
      const qCorr = -Math.cos((delta * Math.PI) / 180);
      // Modelo clássico linear de variáveis ocultas locais:
      const normDelta = ((delta + 180) % 360) - 180;
      const classCorr = (2 * Math.abs(normDelta)) / 180 - 1;

      points.push({
        deltaDeg: delta,
        quantum: Number(qCorr.toFixed(4)),
        classical: Number(classCorr.toFixed(4)),
      });
    }
    return points;
  }, []);

  const deltaTheta = Math.abs(angleA - angleB) % 360;

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-blue-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <Network className="w-3.5 h-3.5" />
            <span>Não localidade quântica • Teorema de Bell</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Emaranhamento Quântico & Teste de Bell CHSH
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Examine as correlações não locais de pares EPR de spin-1/2 no estado singleto, a violação das desigualdades de Bell e o teorema da não comunicação.
          </p>
        </div>
      </div>

      {/* Grid de Parâmetros e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3">
            Orientação dos Detectores (Alice & Bob)
          </h2>

          <ParameterControl
            id="param-angle-a"
            label="Ângulo do Detector de Alice"
            symbol="\theta_A"
            value={angleA}
            min={0}
            max={360}
            step={5}
            unit="graus"
            onChange={setAngleA}
            description="Direção (no plano) em que Alice mede o spin."
          />

          <ParameterControl
            id="param-angle-b"
            label="Ângulo do Detector de Bob"
            symbol="\theta_B"
            value={angleB}
            min={0}
            max={360}
            step={5}
            unit="graus"
            onChange={setAngleB}
            description="Direção (no plano) em que Bob mede o spin."
          />

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">Diferença Angular Relativa</span>
            <div className="text-lg font-mono font-bold text-cyan-400">
              Δθ = |θ_A - θ_B| = {deltaTheta}°
            </div>
            <p className="text-[11px] text-slate-400">
              Se Δθ = 0°, os resultados são perfeitamente anticorrelacionados (E = −1). Se Δθ = 180°, são perfeitamente correlacionados (E = +1).
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <MetricBadge
            label="Correlação Quântica"
            symbol="E(a, b)"
            value={currentCorrelation.toFixed(3)}
            subtext="E = -cos(θ_A - θ_B)"
            variant="cyan"
          />
          <MetricBadge
            label="Parâmetro CHSH |S|"
            symbol="|S|"
            value={chshResult.sParameter.toFixed(3)}
            subtext={chshResult.violatesClassicalBound ? 'Viola limite clássico (> 2.0)' : 'Dentro do limite clássico'}
            variant={chshResult.violatesClassicalBound ? 'emerald' : 'amber'}
          />
          <MetricBadge
            label="Limite Clássico Local"
            symbol="|S| \le 2"
            value="2.000"
            subtext="Realismo local (Einstein)"
            variant="default"
          />
          <MetricBadge
            label="Limite de Tsirelson"
            symbol="2\sqrt{2}"
            value="2.828"
            subtext="Máximo quântico absoluto"
            variant="purple"
          />
          <MetricBadge
            label="Estado Bipartido"
            symbol="|\Psi^-\rangle"
            value="Singleto"
            subtext="( |01⟩ - |10⟩ ) / √2"
            variant="default"
          />
          <MetricBadge
            label="Comunicação superluminal?"
            value="IMPOSSÍVEL"
            subtext="Teorema da não comunicação"
            variant="rose"
          />
        </div>
      </div>

      {/* Gráfico de Correlação Quântica vs Modelo Clássico */}
      <ScientificCard
        title="Correlação Quântica vs. Modelo Local de Variáveis Ocultas"
        subtitle="A mecânica quântica prevê uma curva cossenoidal; o modelo local linear de Bell reproduz os extremos, mas não os ângulos intermediários"
        badge="Teorema de Bell (1964)"
        theoryTitle="Fundamentação do Paradoxo EPR, Teorema de Bell e Não-Comunicação"
        theoryContent={
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-white text-sm mb-1">1. O Estado Singleto EPR</h4>
              <p>
                Consideremos um par de partículas de spin-1/2 preparadas no estado singleto (momento angular total zero):
              </p>
              <MathView block math="|\Psi^-\rangle = \frac{1}{\sqrt{2}} \left( |{\uparrow}\rangle_A |{\downarrow}\rangle_B - |{\downarrow}\rangle_A |{\uparrow}\rangle_B \right)" />
              <p>
                A mecânica quântica prevê que o valor esperado do produto das medições ao longo dos eixos unitários <MathView math="\vec{a}" /> e <MathView math="\vec{b}" /> é:
              </p>
              <MathView block math="E(\vec{a}, \vec{b}) = \langle \Psi^- | (\vec{\sigma}\cdot\vec{a}) \otimes (\vec{\sigma}\cdot\vec{b}) | \Psi^- \rangle = -\vec{a}\cdot\vec{b} = -\cos(\theta_A - \theta_B)" />
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-1">2. Desigualdade CHSH (Clauser-Horne-Shimony-Holt, 1969)</h4>
              <p>
                Se existirem variáveis ocultas locais <MathView math="\lambda" /> (determinismo local proposto por Einstein, Podolsky e Rosen em 1935), a combinação de 4 medições satisfaz estritamente:
              </p>
              <MathView block math="|S| \equiv |E(a, b) - E(a, b') + E(a', b) + E(a', b')| \le 2" />
              <p>
                Com os ângulos de Tsirelson (<MathView math="a = 0^\circ, a' = 90^\circ, b = 45^\circ, b' = 135^\circ" />), a mecânica quântica produz:
              </p>
              <MathView block math="|S_{\text{quântico}}| = |-\cos(45^\circ) - (-\cos(135^\circ)) - \cos(45^\circ) - \cos(45^\circ)| = 2\sqrt{2} \approx 2.8284 > 2" />
              <p>
                Este resultado foi verificado experimentalmente com precisão extrema (Prêmio Nobel de Física de 2022 para Alain Aspect, John Clauser e Anton Zeilinger), excluindo teorias de variáveis ocultas locais (os testes "sem brechas" de 2015 fecharam as principais lacunas experimentais).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
              <h4 className="font-bold text-rose-300 text-sm mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                3. Por que o Emaranhamento NÃO Permite Transmitir Mensagens Mais Rápido que a Luz?
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Pelo <strong>teorema da não comunicação (no-communication theorem)</strong>, a matriz densidade reduzida de Alice é proporcional à identidade, independentemente do que Bob mede <MathView math="\rho_A = \frac{1}{2}I" />. Isso significa que, localmente, cada medição de Alice é puro ruído estatístico (<MathView math="50\%" /> para cima, <MathView math="50\%" /> para baixo), totalmente indistinguível de um lançamento de moeda aleatório. Alice só consegue constatar a correlação quando se encontra com Bob ou recebe os dados dele por um canal clássico convencional, cuja velocidade é limitada pela velocidade da luz <MathView math="c" />.
              </p>
            </div>
          </div>
        }
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={correlationCurve} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="deltaDeg"
                type="number"
                domain={[0, 360]}
                stroke="#64748b"
                label={{ value: 'Diferença Angular Δθ (graus)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                stroke="#64748b"
                domain={[-1.05, 1.05]}
                label={{ value: 'Correlação E(a, b)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                formatter={(val, name) => [
                  `${val}`,
                  name === 'quantum' || name === 'Correlação Quântica' ? 'Correlação Quântica (Cosseno)' : 'Modelo Local Linear (Bell)',
                ]}
                labelFormatter={(lbl) => `Δθ = ${lbl}°`}
              />
              <ReferenceLine y={0} stroke="#334155" />
              <ReferenceLine x={deltaTheta} stroke="#06b6d4" strokeWidth={2} label={{ value: 'Configuração Atual', fill: '#06b6d4', fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="classical"
                stroke="#64748b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
                name="Modelo Local Linear"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="quantum"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={false}
                name="Correlação Quântica"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ScientificCard>
    </div>
  );
};
