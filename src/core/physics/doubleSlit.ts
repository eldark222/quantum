import { H_PLANCK } from './constants';

export interface DoubleSlitPoint {
  positionMm: number; // posição y no anteparo em mm
  intensity: number; // intensidade normalizada [0, 1]
  envelope: number; // envelope de difração de fenda única [0, 1]
  classicalIntensity: number; // padrão clássico incoerente (com detector)
}

export interface DoubleSlitParams {
  wavelengthNm: number; // comprimento de onda lambda em nm
  slitSeparationUm: number; // distância d entre fendas em micrometros
  slitWidthUm: number; // largura a de cada fenda em micrometros
  screenDistanceM: number; // distância D até o anteparo em metros
  hasWhichWayDetector: boolean; // se há detector de fenda (destrói coerência)
}

/**
 * Calcula o comprimento de onda de de Broglie para uma partícula
 * \lambda = h / p = h / \sqrt{2 * m * E}
 */
export function calculateDeBroglieWavelengthNm(energyJoules: number, massKg: number): number {
  if (!Number.isFinite(energyJoules) || energyJoules <= 0) {
    throw new Error('A energia deve ser um número finito positivo.');
  }
  if (!Number.isFinite(massKg) || massKg <= 0) {
    throw new Error('A massa deve ser um número finito positiva.');
  }
  const p = Math.sqrt(2 * massKg * energyJoules);
  const lambdaMeters = H_PLANCK / p;
  return lambdaMeters * 1e9;
}

/**
 * Calcula a intensidade em um ponto y no anteparo
 */
export function calculateDoubleSlitIntensity(
  yMm: number,
  params: DoubleSlitParams,
): { intensity: number; envelope: number; classical: number } {
  const { wavelengthNm, slitSeparationUm, slitWidthUm, screenDistanceM, hasWhichWayDetector } = params;
  if (
    ![wavelengthNm, slitSeparationUm, slitWidthUm, screenDistanceM].every(
      (value) => Number.isFinite(value) && value > 0,
    )
  ) {
    throw new Error('Os parâmetros da dupla fenda devem ser finitos e positivos.');
  }
  
  const lambda = wavelengthNm * 1e-9;
  const d = slitSeparationUm * 1e-6;
  const a = slitWidthUm * 1e-6;
  const D = screenDistanceM;
  const y = yMm * 1e-3;

  const sinTheta = y / Math.sqrt(y * y + D * D);

  // Parâmetro de difração de fenda simples: beta = pi * a * sin(theta) / lambda
  const beta = (Math.PI * a * sinTheta) / lambda;
  // Fator de difração sinc^2(beta)
  const sincBeta = Math.abs(beta) < 1e-7 ? 1 : Math.sin(beta) / beta;
  const envelope = sincBeta * sincBeta;

  // Parâmetro de interferência de fenda dupla: alpha = pi * d * sin(theta) / lambda
  const alpha = (Math.PI * d * sinTheta) / lambda;
  const interference = Math.pow(Math.cos(alpha), 2);

  // Padrão clássico (duas fendas independentes sem coerência quântica)
  const classical = envelope;

  const intensity = hasWhichWayDetector ? classical : envelope * interference;

  return {
    intensity,
    envelope,
    classical,
  };
}

/**
 * Gera pontos para o gráfico de interferência no anteparo
 */
export function simulateDoubleSlit(
  params: DoubleSlitParams,
  screenRangeMm: number = 30,
  numPoints: number = 300,
): DoubleSlitPoint[] {
  if (!Number.isFinite(screenRangeMm) || screenRangeMm <= 0) {
    throw new Error('O alcance da tela deve ser um número finito positivo.');
  }
  if (!Number.isInteger(numPoints) || numPoints < 1) {
    throw new Error('O número de pontos deve ser um inteiro positivo.');
  }
  const points: DoubleSlitPoint[] = [];
  const step = (2 * screenRangeMm) / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    const yMm = -screenRangeMm + i * step;
    const { intensity, envelope, classical } = calculateDoubleSlitIntensity(yMm, params);
    points.push({
      positionMm: Number(yMm.toFixed(3)),
      intensity: Number(intensity.toFixed(5)),
      envelope: Number(envelope.toFixed(5)),
      classicalIntensity: Number(classical.toFixed(5)),
    });
  }

  return points;
}
