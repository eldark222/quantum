import { H_BAR } from './constants';
import { nmToMeters, evToJoules } from './units';

export interface TunnelingParams {
  particleEnergyEv: number; // energia da partícula E em eV
  barrierHeightEv: number; // altura da barreira V_0 em eV
  barrierWidthNm: number; // espessura da barreira a em nm
  massKg: number; // massa da partícula em kg
}

export interface TunnelingResult {
  transmissionCoefficient: number; // T in [0, 1]
  reflectionCoefficient: number; // R in [0, 1], T + R = 1
  wavenumberK: number; // k em m^(-1) na região livre
  barrierKappa: number; // kappa em m^(-1) para E < V_0 ou k' para E > V_0
  regime: 'tunneling' | 'over_barrier' | 'threshold';
  waveProfile: { xNm: number; realPsi: number; density: number; potentialEv: number }[];
}

/**
 * Calcula os coeficientes analíticos de transmissão T e reflexão R
 */
export function calculateTunnelingCoefficients(params: TunnelingParams): {
  T: number;
  R: number;
  regime: 'tunneling' | 'over_barrier' | 'threshold';
  kappa: number;
  k: number;
} {
  const { particleEnergyEv, barrierHeightEv, barrierWidthNm, massKg } = params;
  const E = evToJoules(particleEnergyEv);
  const V0 = evToJoules(barrierHeightEv);
  const a = nmToMeters(barrierWidthNm);

  if (E <= 0 || V0 <= 0 || a <= 0 || massKg <= 0) {
    return { T: 0, R: 1, regime: 'tunneling', kappa: 0, k: 0 };
  }

  const k = Math.sqrt(2 * massKg * E) / H_BAR;

  // Limite E ≈ V0
  if (Math.abs(E - V0) < 1e-22) {
    const denominator = 1 + (massKg * V0 * a * a) / (2 * Math.pow(H_BAR, 2));
    const T = 1 / denominator;
    return { T, R: 1 - T, regime: 'threshold', kappa: 0, k };
  }

  // Regime de tunelamento: E < V0
  if (E < V0) {
    const kappa = Math.sqrt(2 * massKg * (V0 - E)) / H_BAR;
    const sinhVal = Math.sinh(kappa * a);
    const factor = Math.pow(V0, 2) / (4 * E * (V0 - E));
    const denominator = 1 + factor * Math.pow(sinhVal, 2);
    const T = 1 / denominator;
    return {
      T: Math.max(0, Math.min(1, T)),
      R: Math.max(0, Math.min(1, 1 - T)),
      regime: 'tunneling',
      kappa,
      k,
    };
  }

  // Regime acima da barreira: E > V0
  const kPrime = Math.sqrt(2 * massKg * (E - V0)) / H_BAR;
  const sinVal = Math.sin(kPrime * a);
  const factor = Math.pow(V0, 2) / (4 * E * (E - V0));
  const denominator = 1 + factor * Math.pow(sinVal, 2);
  const T = 1 / denominator;
  return {
    T: Math.max(0, Math.min(1, T)),
    R: Math.max(0, Math.min(1, 1 - T)),
    regime: 'over_barrier',
    kappa: kPrime,
    k,
  };
}

/**
 * Simula o perfil da função de onda e potencial através das 3 regiões
 */
export function simulateTunneling(
  params: TunnelingParams,
  numPoints: number = 300,
): TunnelingResult {
  const { T, R, regime, kappa, k } = calculateTunnelingCoefficients(params);
  const a = params.barrierWidthNm;
  const windowNm = Math.max(3 * a, 2.0); // janela total de visualização

  const xMin = -windowNm * 0.5;
  const xMax = a + windowNm * 0.5;
  const step = (xMax - xMin) / numPoints;

  const waveProfile: { xNm: number; realPsi: number; density: number; potentialEv: number }[] = [];

  const tAmp = Math.sqrt(T);
  const rAmp = Math.sqrt(R);

  for (let i = 0; i <= numPoints; i++) {
    const x = xMin + i * step;
    let potential = 0;
    let psiVal = 0;

    if (x < 0) {
      // Região I: incidente + refletida
      potential = 0;
      const kScaled = (k * 1e-9) % (2 * Math.PI);
      psiVal = Math.cos(kScaled * x) + rAmp * Math.cos(-kScaled * x + Math.PI / 2);
    } else if (x <= a) {
      // Região II: barreira
      potential = params.barrierHeightEv;
      if (regime === 'tunneling') {
        const kappaScaled = kappa * 1e-9;
        const decay = Math.exp(-kappaScaled * x);
        psiVal = (1 - rAmp * 0.5) * decay;
      } else {
        const kpScaled = (kappa * 1e-9) % (2 * Math.PI);
        psiVal = (1 - rAmp * 0.3) * Math.cos(kpScaled * x);
      }
    } else {
      // Região III: transmitida
      potential = 0;
      const kScaled = (k * 1e-9) % (2 * Math.PI);
      psiVal = tAmp * Math.cos(kScaled * (x - a));
    }

    const density = Math.min(2.5, Math.pow(psiVal, 2));

    waveProfile.push({
      xNm: Number(x.toFixed(4)),
      realPsi: Number(psiVal.toFixed(4)),
      density: Number(density.toFixed(4)),
      potentialEv: potential,
    });
  }

  return {
    transmissionCoefficient: T,
    reflectionCoefficient: R,
    wavenumberK: k,
    barrierKappa: kappa,
    regime,
    waveProfile,
  };
}
