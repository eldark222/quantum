import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Split, Play, Pause, RotateCcw, Eye, EyeOff, Sparkles } from 'lucide-react';
import {
  simulateDoubleSlit,
  calculateDoubleSlitIntensity,
} from '../../core/physics/doubleSlit';
import type { DoubleSlitParams } from '../../core/physics/doubleSlit';
import { ParameterControl } from '../../components/common/ParameterControl';
import { MetricBadge } from '../../components/common/MetricBadge';
import { ScientificCard } from '../../components/common/ScientificCard';
import { MathView } from '../../components/common/MathView';

export const DoubleSlitSimulator: React.FC = () => {
  const [wavelengthNm, setWavelengthNm] = useState<number>(532); // Laser verde 532 nm
  const [slitSeparationUm, setSlitSeparationUm] = useState<number>(50); // 50 um
  const [slitWidthUm, setSlitWidthUm] = useState<number>(10); // 10 um
  const [screenDistanceM, setScreenDistanceM] = useState<number>(1.0); // 1 m
  const [hasWhichWayDetector, setHasWhichWayDetector] = useState<boolean>(false);

  // Estado da simulação de impacto de partículas (Canvas 2D)
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [particleCount, setParticleCount] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const params: DoubleSlitParams = useMemo(() => {
    return {
      wavelengthNm,
      slitSeparationUm,
      slitWidthUm,
      screenDistanceM,
      hasWhichWayDetector,
    };
  }, [wavelengthNm, slitSeparationUm, slitWidthUm, screenDistanceM, hasWhichWayDetector]);

  // Curva teórica de intensidade
  const curveData = useMemo(() => {
    return simulateDoubleSlit(params, 25, 250);
  }, [params]);

  // Espaçamento entre franjas de interferência: Delta y = lambda * D / d
  const fringeSpacingMm = useMemo(() => {
    const lambda = wavelengthNm * 1e-9;
    const D = screenDistanceM;
    const d = slitSeparationUm * 1e-6;
    return (lambda * D / d) * 1e3;
  }, [wavelengthNm, screenDistanceM, slitSeparationUm]);

  // Largura do máximo central de difração: 2 * lambda * D / a
  const centralMaxMm = useMemo(() => {
    const lambda = wavelengthNm * 1e-9;
    const D = screenDistanceM;
    const a = slitWidthUm * 1e-6;
    return (2 * lambda * D / a) * 1e3;
  }, [wavelengthNm, screenDistanceM, slitWidthUm]);

  // Limpa o canvas de partículas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setParticleCount(0);
  }, []);

  // Amostragem por rejeição para impacto de partículas individuais
  const samplePosition = useCallback((): number => {
    const screenRangeMm = 25;
    for (let attempts = 0; attempts < 1000; attempts++) {
      const yMm = (Math.random() * 2 - 1) * screenRangeMm;
      const { intensity } = calculateDoubleSlitIntensity(yMm, params);
      if (Math.random() < intensity) {
        return yMm;
      }
    }
    return 0;
  }, [params]);

  // Loop de animação de partículas
  useEffect(() => {
    if (!isRunning) return;
    let animationFrameId: number;

    const fireBatch = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const batchSize = 15;
          const screenRangeMm = 25;

          for (let i = 0; i < batchSize; i++) {
            const yMm = samplePosition();
            // Mapeia yMm (-25 a +25) para a largura do canvas (X no canvas)
            const canvasX = ((yMm + screenRangeMm) / (2 * screenRangeMm)) * canvas.width;
            // Altura aleatória para preencher a tela verticalmente
            const canvasY = Math.random() * canvas.height;

            ctx.fillStyle = hasWhichWayDetector
              ? 'rgba(244, 63, 94, 0.65)' // Vermelho (com detector)
              : 'rgba(6, 182, 212, 0.75)'; // Ciano (interferência quântica)
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 1.2, 0, 2 * Math.PI);
            ctx.fill();
          }

          setParticleCount((prev) => prev + batchSize);
        }
      }
      animationFrameId = requestAnimationFrame(fireBatch);
    };

    animationFrameId = requestAnimationFrame(fireBatch);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, samplePosition, hasWhichWayDetector]);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-blue-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Split className="w-3.5 h-3.5" />
            <span>Dualidade Onda-Partícula • Decoerência Quântica</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Experimento da Dupla Fenda & Colapso por Medição
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Observe o surgimento estatístico das franjas de interferência impacto a impacto e compreenda como a observação (detector de qual fenda) destrói a superposição quântica.
          </p>
        </div>
      </div>

      {/* Grid de Controles e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Controles */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h2 className="text-base font-semibold text-white border-b border-slate-800 pb-3">
            Geometria do Experimento
          </h2>

          <ParameterControl
            id="param-wavelength"
            label="Comprimento de Onda"
            symbol="\lambda"
            value={wavelengthNm}
            min={400}
            max={750}
            step={5}
            unit="nm"
            onChange={setWavelengthNm}
            description="Espectro visível (400 nm violeta a 750 nm vermelho)."
          />

          <ParameterControl
            id="param-slit-dist"
            label="Separação entre Fendas"
            symbol="d"
            value={slitSeparationUm}
            min={20}
            max={120}
            step={5}
            unit="µm"
            onChange={setSlitSeparationUm}
            description="Distância centro a centro entre as duas fendas."
          />

          <ParameterControl
            id="param-slit-width"
            label="Largura de Cada Fenda"
            symbol="a"
            value={slitWidthUm}
            min={4}
            max={25}
            step={1}
            unit="µm"
            onChange={setSlitWidthUm}
            description="Modula o envelope de difração de Fraunhofer."
          />

          <ParameterControl
            id="param-screen-dist"
            label="Distância ao Anteparo"
            symbol="D"
            value={screenDistanceM}
            min={0.5}
            max={2.5}
            step={0.1}
            unit="m"
            onChange={setScreenDistanceM}
            description="Distância entre o plano das fendas e a tela de detecção."
          />

          {/* Detector de Qual Fenda (Which-Way) */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                {hasWhichWayDetector ? <Eye className="w-4 h-4 text-rose-400" /> : <EyeOff className="w-4 h-4 text-cyan-400" />}
                Detector de Fenda (Medição)
              </span>
              <button
                type="button"
                onClick={() => {
                  setHasWhichWayDetector(!hasWhichWayDetector);
                  clearCanvas();
                }}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  hasWhichWayDetector
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {hasWhichWayDetector ? 'ATIVADO' : 'DESATIVADO'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {hasWhichWayDetector
                ? 'Detector ativo: o estado colapsa para uma fenda definida. A coerência de fase é destruída e as franjas de interferência desaparecem.'
                : 'Detector desligado: a partícula passa em superposição por ambas as fendas, gerando interferência quântica.'}
            </p>
          </div>
        </div>

        {/* Métricas e Canvas de Partículas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricBadge
              label="Espaçamento Franjas"
              symbol="\Delta y"
              value={fringeSpacingMm.toFixed(2)}
              unit="mm"
              subtext="\lambda D / d"
              variant="cyan"
            />
            <MetricBadge
              label="Máximo Central"
              symbol="W_0"
              value={centralMaxMm.toFixed(2)}
              unit="mm"
              subtext="2 \lambda D / a"
              variant="purple"
            />
            <MetricBadge
              label="Impactos Registrados"
              symbol="N"
              value={particleCount.toLocaleString()}
              unit="partículas"
              subtext="Acúmulo estatístico"
              variant="emerald"
            />
            <MetricBadge
              label="Regime Quântico"
              value={hasWhichWayDetector ? 'Clássico' : 'Interferência'}
              subtext={hasWhichWayDetector ? 'Sem coerência' : 'Superposição pura'}
              variant={hasWhichWayDetector ? 'rose' : 'cyan'}
            />
          </div>

          {/* Tela Detector / Canvas 2D de Acúmulo */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold">Anteparo de Detecção em Tempo Real (Canvas 2D)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isRunning
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30'
                  }`}
                >
                  {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunning ? 'Pausar' : 'Disparar'}</span>
                </button>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Limpar anteparo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#020617] h-36 w-full flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={700}
                height={144}
                className="w-full h-full block"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Cada ponto luminoso representa uma partícula individual colidindo contra o anteparo. Note como o padrão ondulatório surge gradualmente da amostragem quântica de Born.
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico Analítico de Intensidade */}
      <ScientificCard
        title="Distribuição Analítica de Intensidade no Anteparo"
        subtitle="Interferência de Young modulada pelo envelope de difração de Fraunhofer"
        badge="Óptica Quântica"
        theoryTitle="Fundamentação Teórica da Dupla Fenda e Difração"
        theoryContent={
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-white text-sm mb-1">1. Princípio de Superposição das Ondas de Matéria</h4>
              <p>
                Quando uma partícula (fóton ou elétron com comprimento de onda de de Broglie <MathView math="\lambda = h/p" />) incide sobre duas fendas separadas por <MathView math="d" />, a amplitude total no ponto <MathView math="y" /> do anteparo é a soma coerente das amplitudes:
              </p>
              <MathView block math="\psi_{\text{total}}(y) = \psi_1(y) + \psi_2(y)" />
              <p>
                A intensidade observada é proporcional ao quadrado do módulo da amplitude total:
              </p>
              <MathView block math="I(y) \propto |\psi_{\text{total}}|^2 = |\psi_1|^2 + |\psi_2|^2 + 2\,\text{Re}\{\psi_1^* \psi_2\}" />
              <p>
                O termo cruzado <MathView math="2\,\text{Re}\{\psi_1^* \psi_2\}" /> é o termo de interferência responsável pelas franjas claras e escuras.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-1">2. Expressão Matemática Exata</h4>
              <p>
                Levando em conta a largura finita <MathView math="a" /> de cada fenda (difração de fenda simples):
              </p>
              <MathView block math="I(\theta) = I_0 \left(\frac{\sin\beta}{\beta}\right)^2 \cos^2\alpha, \quad \beta = \frac{\pi a}{\lambda}\sin\theta, \quad \alpha = \frac{\pi d}{\lambda}\sin\theta" />
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-1">3. Medição e Teorema da Decoerência</h4>
              <p>
                Ao introduzir um detector para descobrir por qual fenda a partícula passou, o sistema entrelaça-se com os graus de liberdade do medidor. A matriz de densidade perde as coerências quânticas fora da diagonal (<MathView math="\rho_{12} \to 0" />), resultando na simples soma clássica de intensidades <MathView math="I_{\text{clássico}} = I_1 + I_2" /> sem termo de interferência.
              </p>
            </div>
          </div>
        }
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curveData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="positionMm"
                type="number"
                domain={[-25, 25]}
                stroke="#64748b"
                label={{ value: 'Posição y no anteparo (mm)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                stroke="#64748b"
                domain={[0, 1.05]}
                label={{ value: 'Intensidade Normalizada I/I₀', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                formatter={(val, name) => [
                  `${val}`,
                  name === 'intensity' ? 'Intensidade Quântica I(y)' : 'Envelope de Difração',
                ]}
                labelFormatter={(label) => `y = ${label} mm`}
              />
              <Line
                type="monotone"
                dataKey="envelope"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
                name="Envelope de Difração"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="intensity"
                stroke={hasWhichWayDetector ? '#f43f5e' : '#06b6d4'}
                strokeWidth={2.5}
                dot={false}
                name="Intensidade Quântica"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ScientificCard>
    </div>
  );
};
