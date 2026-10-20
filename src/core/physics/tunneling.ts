import { H_BAR } from './constants';
import { nmToMeters, evToJoules } from './units';

export interface TunnelingParams {
  particleEnergyEv: number;
  barrierHeightEv: number;
  barrierWidthNm: number;
  massKg: number;
}

export interface TunnelingResult {
  transmissionCoefficient: number;
  reflectionCoefficient: number;
  wavenumberK: number;
  barrierKappa: number;
  regime: 'tunneling' | 'over_barrier' | 'threshold';
  waveProfile: { xNm: number; realPsi: number; density: number; potentialEv: number }[];
}

type Regime = TunnelingResult['regime'];
interface Coefficients {
  T: number;
  R: number;
  regime: Regime;
  kappa: number;
  k: number;
}

interface Complex {
  re: number;
  im: number;
}

const complex = (re: number, im = 0): Complex => ({ re, im });
const add = (a: Complex, b: Complex): Complex => complex(a.re + b.re, a.im + b.im);
const subtract = (a: Complex, b: Complex): Complex => complex(a.re - b.re, a.im - b.im);
const multiply = (a: Complex, b: Complex): Complex =>
  complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const divide = (a: Complex, b: Complex): Complex => {
  const denominator = b.re * b.re + b.im * b.im;
  return complex((a.re * b.re + a.im * b.im) / denominator, (a.im * b.re - a.re * b.im) / denominator);
};
const scale = (a: Complex, factor: number): Complex => complex(a.re * factor, a.im * factor);
const magnitudeSquared = (a: Complex): number => a.re * a.re + a.im * a.im;
const expComplex = (real: number, imaginary = 0): Complex => {
  const amplitude = Math.exp(real);
  return complex(amplitude * Math.cos(imaginary), amplitude * Math.sin(imaginary));
};

function validateParameters(params: TunnelingParams): void {
  const { particleEnergyEv, barrierHeightEv, barrierWidthNm, massKg } = params;
  if (![particleEnergyEv, barrierHeightEv, barrierWidthNm, massKg].every(Number.isFinite)) {
    throw new Error('Os parâmetros de tunelamento devem ser números finitos.');
  }
  if (particleEnergyEv <= 0 || barrierHeightEv <= 0 || barrierWidthNm <= 0 || massKg <= 0) {
    throw new Error('Energia, barreira, largura e massa devem ser estritamente positivas.');
  }
}

function logSinhSquared(value: number): number {
  if (value < 20) return 2 * Math.log(Math.sinh(value));
  return 2 * (value - Math.log(2) + Math.log1p(-Math.exp(-2 * value)));
}

function boundedTransmission(logFactor: number, argument: number): number {
  if (argument === 0) return 1;
  const logTerm = logFactor + logSinhSquared(argument);
  if (logTerm > 745) return 0;
  return 1 / (1 + Math.exp(logTerm));
}

/**
 * Coeficientes exatos de espalhamento para uma barreira retangular 1D.
 * A incidência tem amplitude 1 e, como os números de onda externos são iguais,
 * o fluxo implica R = 1 - T.
 */
export function calculateTunnelingCoefficients(params: TunnelingParams): Coefficients {
  validateParameters(params);
  const E = evToJoules(params.particleEnergyEv);
  const V0 = evToJoules(params.barrierHeightEv);
  const a = nmToMeters(params.barrierWidthNm);
  const k = Math.sqrt(2 * params.massKg * E) / H_BAR;
  const relativeThreshold = 1e-12 * Math.max(E, V0);

  if (Math.abs(E - V0) <= relativeThreshold) {
    const denominator = 1 + (params.massKg * V0 * a * a) / (2 * H_BAR * H_BAR);
    const T = 1 / denominator;
    return { T, R: 1 - T, regime: 'threshold', kappa: 0, k };
  }

  if (E < V0) {
    const kappa = Math.sqrt(2 * params.massKg * (V0 - E)) / H_BAR;
    const logFactor = Math.log(V0 * V0) - Math.log(4 * E * (V0 - E));
    const T = boundedTransmission(logFactor, kappa * a);
    return { T, R: 1 - T, regime: 'tunneling', kappa, k };
  }

  const waveNumber = Math.sqrt(2 * params.massKg * (E - V0)) / H_BAR;
  const factor = (V0 * V0) / (4 * E * (E - V0));
  const denominator = 1 + factor * Math.sin(waveNumber * a) ** 2;
  const T = 1 / denominator;
  return { T, R: 1 - T, regime: 'over_barrier', kappa: waveNumber, k };
}

function solveLinearSystem(matrix: Complex[][], rhs: Complex[]): Complex[] {
  const augmented = matrix.map((row, index) => [...row, rhs[index]]);
  for (let column = 0; column < 4; column++) {
    let pivot = column;
    for (let row = column + 1; row < 4; row++) {
      if (magnitudeSquared(augmented[row][column]) > magnitudeSquared(augmented[pivot][column])) {
        pivot = row;
      }
    }
    [augmented[column], augmented[pivot]] = [augmented[pivot], augmented[column]];
    const pivotValue = augmented[column][column];
    for (let item = column; item <= 4; item++) {
      augmented[column][item] = divide(augmented[column][item], pivotValue);
    }
    for (let row = 0; row < 4; row++) {
      if (row === column) continue;
      const factor = augmented[row][column];
      for (let item = column; item <= 4; item++) {
        augmented[row][item] = subtract(augmented[row][item], multiply(factor, augmented[column][item]));
      }
    }
  }
  return augmented.map((row) => row[4]);
}

function calculateScatteringAmplitudes(params: TunnelingParams, coefficients: Coefficients): Complex[] {
  const a = nmToMeters(params.barrierWidthNm);
  const k = coefficients.k;
  const phase = expComplex(0, k * a);
  const ik = complex(0, k);
  if (coefficients.regime === 'threshold') {
    const matrix = [
      [complex(1), complex(-1), complex(-1), complex(0)],
      [scale(ik, -1), complex(0), complex(-1), complex(0)],
      [complex(0), complex(1), complex(a), scale(phase, -1)],
      [complex(0), complex(0), complex(1), multiply(scale(phase, -1), ik)],
    ];
    return solveLinearSystem(matrix, [complex(-1), scale(ik, -1), complex(0), complex(0)]);
  }

  const q = coefficients.kappa;
  const left = coefficients.regime === 'tunneling' ? complex(q) : complex(0, q);
  const right = coefficients.regime === 'tunneling' ? complex(-q) : complex(0, -q);
  const leftAtA = expComplex(left.re * a, left.im * a);
  const rightAtA = expComplex(right.re * a, right.im * a);
  const matrix = [
    [complex(1), scale(left, -1), scale(right, -1), complex(0)],
    [scale(ik, -1), scale(left, -1), scale(right, -1), complex(0)],
    [complex(0), leftAtA, rightAtA, scale(phase, -1)],
    [complex(0), multiply(left, leftAtA), multiply(right, rightAtA), scale(multiply(ik, phase), -1)],
  ];
  return solveLinearSystem(matrix, [complex(-1), scale(ik, -1), complex(0), complex(0)]);
}

/**
 * Gera o perfil estacionário exato (parte real e densidade |psi|^2) nas três
 * regiões da barreira. A amplitude incidente é 1; o perfil não é uma
 * distribuição temporal de pacotes de onda.
 */
export function simulateTunneling(params: TunnelingParams, numPoints: number = 300): TunnelingResult {
  validateParameters(params);
  if (!Number.isInteger(numPoints) || numPoints < 1) {
    throw new Error('O número de pontos deve ser um inteiro positivo.');
  }
  const coefficients = calculateTunnelingCoefficients(params);
  const amplitudes = calculateScatteringAmplitudes(params, coefficients);
  const aNm = params.barrierWidthNm;
  const a = nmToMeters(aNm);
  const windowNm = Math.max(3 * aNm, 2);
  const xMin = -windowNm * 0.5;
  const xMax = aNm + windowNm * 0.5;
  const step = (xMax - xMin) / numPoints;
  const waveProfile = [];

  for (let i = 0; i <= numPoints; i++) {
    const xNm = xMin + i * step;
    const x = nmToMeters(xNm);
    let psi: Complex;
    let potentialEv: number;
    if (x < 0) {
      psi = add(expComplex(0, coefficients.k * x), multiply(amplitudes[0], expComplex(0, -coefficients.k * x)));
      potentialEv = 0;
    } else if (x <= a) {
      const coordinate = x;
      if (coefficients.regime === 'threshold') {
        psi = add(amplitudes[1], scale(amplitudes[2], coordinate));
      } else {
        const left = coefficients.regime === 'tunneling' ? coefficients.kappa : 0;
        const right = coefficients.regime === 'tunneling' ? -coefficients.kappa : 0;
        const internalQ = coefficients.regime === 'over_barrier' ? coefficients.kappa : 0;
        psi =
          coefficients.regime === 'tunneling'
            ? add(
                multiply(amplitudes[1], expComplex(left * coordinate)),
                multiply(amplitudes[2], expComplex(right * coordinate)),
              )
            : add(
                multiply(amplitudes[1], expComplex(0, internalQ * coordinate)),
                multiply(amplitudes[2], expComplex(0, -internalQ * coordinate)),
              );
      }
      potentialEv = params.barrierHeightEv;
    } else {
      psi = multiply(amplitudes[3], expComplex(0, coefficients.k * x));
      potentialEv = 0;
    }
    waveProfile.push({
      xNm: Number(xNm.toFixed(4)),
      realPsi: Number(psi.re.toFixed(4)),
      density: Number(magnitudeSquared(psi).toFixed(4)),
      potentialEv,
    });
  }

  return {
    transmissionCoefficient: coefficients.T,
    reflectionCoefficient: coefficients.R,
    wavenumberK: coefficients.k,
    barrierKappa: coefficients.kappa,
    regime: coefficients.regime,
    waveProfile,
  };
}
