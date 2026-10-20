import { H_BAR, ELECTRON_MASS } from './constants';
import { nmToMeters, joulesToEv } from './units';

export interface InfiniteWellPoint {
  x: number; // posição em nm (numérico)
  psi: number; // amplitude em nm^(-1/2)
  probDensity: number; // densidade de probabilidade em nm^(-1)
  classicalProbDensity: number; // densidade clássica 1/L
}

export interface InfiniteWellResult {
  n: number;
  widthNm: number;
  massKg: number;
  energyJoules: number;
  energyEv: number;
  nodes: number[]; // posições dos nós internos em nm
  points: InfiniteWellPoint[];
  expectationXNm: number;
  uncertaintyXNm: number;
  uncertaintyPJoulesSecPerMeter: number;
  uncertaintyProductHbar: number; // produto Delta x * Delta p em unidades de \hbar
}

function validateWellParameters(n: number, widthNm: number): void {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error('O número quântico n deve ser um inteiro maior ou igual a 1.');
  }
  if (!Number.isFinite(widthNm) || widthNm <= 0) {
    throw new Error('A largura do poço L deve ser um número finito positivo.');
  }
}

/**
 * Calcula a energia quantizada E_n do poço infinito
 * E_n = (n^2 * \pi^2 * \hbar^2) / (2 * m * L^2)
 *
 * @param n Número quântico principal (inteiro >= 1)
 * @param widthNm Largura do poço em nanômetros
 * @param massKg Massa da partícula em kg (padrão: massa do elétron)
 */
export function calculateEnergy(n: number, widthNm: number, massKg: number = ELECTRON_MASS): number {
  validateWellParameters(n, widthNm);
  if (!Number.isFinite(massKg) || massKg <= 0) {
    throw new Error('A massa da partícula deve ser um número finito positivo.');
  }

  const widthMeters = nmToMeters(widthNm);
  const numerator = Math.pow(n, 2) * Math.pow(Math.PI, 2) * Math.pow(H_BAR, 2);
  const denominator = 2 * massKg * Math.pow(widthMeters, 2);
  return numerator / denominator;
}

/**
 * Calcula o valor da função de onda \psi_n(x) no ponto x
 * \psi_n(x) = \sqrt{2 / L} * \sin(n * \pi * x / L) para 0 <= x <= L
 */
export function calculateWaveFunction(x: number, n: number, widthNm: number): number {
  validateWellParameters(n, widthNm);
  if (!Number.isFinite(x)) {
    throw new Error('A posição x deve ser um número finito.');
  }
  if (x < 0 || x > widthNm) return 0;
  return Math.sqrt(2 / widthNm) * Math.sin((n * Math.PI * x) / widthNm);
}

/**
 * Calcula a densidade de probabilidade |\psi_n(x)|^2
 */
export function calculateProbabilityDensity(x: number, n: number, widthNm: number): number {
  const psi = calculateWaveFunction(x, n, widthNm);
  return psi * psi;
}

/**
 * Retorna as posições analíticas dos nós internos (0 < x < L)
 * x_k = k * L / n, para k = 1, ..., n - 1
 */
export function calculateNodes(n: number, widthNm: number): number[] {
  validateWellParameters(n, widthNm);
  const nodes: number[] = [];
  for (let k = 1; k < n; k++) {
    nodes.push((k * widthNm) / n);
  }
  return nodes;
}

/**
 * Calcula a probabilidade analítica exata no sub-intervalo [x1, x2]
 * P = \int_{x1}^{x2} |\psi_n(x)|^2 dx
 */
export function calculateIntervalProbability(
  x1: number,
  x2: number,
  n: number,
  widthNm: number,
): number {
  validateWellParameters(n, widthNm);
  if (![x1, x2].every(Number.isFinite)) {
    throw new Error('Os limites do intervalo devem ser números finitos.');
  }
  const a = Math.max(0, Math.min(x1, x2));
  const b = Math.min(widthNm, Math.max(x1, x2));
  if (a >= b) return 0;

  const integral = (x: number) => {
    return x / 2 - (widthNm / (4 * n * Math.PI)) * Math.sin((2 * n * Math.PI * x) / widthNm);
  };

  const prob = (2 / widthNm) * (integral(b) - integral(a));
  return Math.max(0, Math.min(1, prob));
}

/**
 * Gera os dados completos do simulador de poço de potencial infinito 1D
 */
export function simulateInfiniteWell(
  n: number,
  widthNm: number,
  massKg: number = ELECTRON_MASS,
  numPoints: number = 200,
): InfiniteWellResult {
  validateWellParameters(n, widthNm);
  if (!Number.isFinite(massKg) || massKg <= 0) {
    throw new Error('A massa da partícula deve ser um número finito positivo.');
  }
  if (!Number.isInteger(numPoints) || numPoints < 1) {
    throw new Error('O número de pontos deve ser um inteiro positivo.');
  }
  const energyJoules = calculateEnergy(n, widthNm, massKg);
  const energyEv = joulesToEv(energyJoules);
  const nodes = calculateNodes(n, widthNm);

  const points: InfiniteWellPoint[] = [];
  const classicalProbDensity = 1 / widthNm;

  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * widthNm;
    const psi = calculateWaveFunction(x, n, widthNm);
    const probDensity = psi * psi;
    points.push({
      x: Number(x.toFixed(4)),
      psi: Number(psi.toFixed(5)),
      probDensity: Number(probDensity.toFixed(5)),
      classicalProbDensity: Number(classicalProbDensity.toFixed(5)),
    });
  }

  // Grandezas estatísticas e incerteza
  const expectationXNm = widthNm / 2;
  const varianceX = Math.pow(widthNm, 2) * (1 / 12 - 1 / (2 * Math.pow(n, 2) * Math.pow(Math.PI, 2)));
  const uncertaintyXNm = Math.sqrt(varianceX);

  const widthMeters = nmToMeters(widthNm);
  const uncertaintyP = (n * Math.PI * H_BAR) / widthMeters;
  const uncertaintyProductHbar = Math.sqrt((Math.pow(n, 2) * Math.pow(Math.PI, 2)) / 12 - 0.5);

  return {
    n,
    widthNm,
    massKg,
    energyJoules,
    energyEv,
    nodes,
    points,
    expectationXNm,
    uncertaintyXNm,
    uncertaintyPJoulesSecPerMeter: uncertaintyP,
    uncertaintyProductHbar,
  };
}
