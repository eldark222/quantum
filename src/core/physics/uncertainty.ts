import { H_BAR } from './constants';

export interface UncertaintyPoint {
  coordinate: number; // x em nm ou p em unidades relativas de momento
  probDensityX: number; // |\psi(x)|^2 em nm^(-1)
  probDensityP: number; // |\phi(p)|^2
}

export interface UncertaintyResult {
  sigmaXNm: number;
  sigmaPJoulesSecPerM: number;
  sigmaPEvSecPerNm: number;
  productJoulesSec: number;
  productRatioToHbarHalf: number; // (Delta x * Delta p) / (hbar / 2) -> sempre >= 1
  pointsX: { x: number; density: number }[];
  pointsP: { p: number; density: number }[];
}

/**
 * Calcula a densidade de probabilidade espacial para um pacote Gaussiano centrado na origem
 * |\psi(x)|^2 = (1 / (\sqrt{2\pi} * \sigma_x)) * \exp(-x^2 / (2 * \sigma_x^2))
 */
export function calculateGaussianSpatialDensity(xNm: number, sigmaXNm: number): number {
  if (sigmaXNm <= 0) return 0;
  const factor = 1 / (Math.sqrt(2 * Math.PI) * sigmaXNm);
  const exponent = -Math.pow(xNm, 2) / (2 * Math.pow(sigmaXNm, 2));
  return factor * Math.exp(exponent);
}

/**
 * Calcula a densidade de probabilidade no espaço de momentos
 * |\phi(p)|^2 = (1 / (\sqrt{2\pi} * \sigma_p)) * \exp(-p^2 / (2 * \sigma_p^2))
 * com \sigma_p = \hbar / (2 * \sigma_x)
 */
export function calculateGaussianMomentumDensity(pUnits: number, sigmaPUnits: number): number {
  if (sigmaPUnits <= 0) return 0;
  const factor = 1 / (Math.sqrt(2 * Math.PI) * sigmaPUnits);
  const exponent = -Math.pow(pUnits, 2) / (2 * Math.pow(sigmaPUnits, 2));
  return factor * Math.exp(exponent);
}

/**
 * Simula a relação de incerteza conjugada de Heisenberg
 */
export function simulateUncertainty(sigmaXNm: number, numPoints: number = 200): UncertaintyResult {
  const sigmaXMeters = sigmaXNm * 1e-9;
  // Pacote Gaussiano de incerteza mínima: \sigma_p = \hbar / (2 * \sigma_x)
  const sigmaPJoulesSecPerM = H_BAR / (2 * sigmaXMeters);
  const productJoulesSec = sigmaXMeters * sigmaPJoulesSecPerM;
  const productRatioToHbarHalf = productJoulesSec / (H_BAR / 2); // exato: 1.0

  // Gera pontos no espaço das posições: [-4*sigma_x, +4*sigma_x]
  const rangeX = 4 * sigmaXNm;
  const stepX = (2 * rangeX) / numPoints;
  const pointsX: { x: number; density: number }[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const x = -rangeX + i * stepX;
    pointsX.push({
      x: Number(x.toFixed(4)),
      density: Number(calculateGaussianSpatialDensity(x, sigmaXNm).toFixed(5)),
    });
  }

  // Gera pontos no espaço dos momentos em unidades normalizadas de dispersão
  const rangeP = 4; // em múltiplos de sigma_p
  const stepP = (2 * rangeP) / numPoints;
  const pointsP: { p: number; density: number }[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const pMultiple = -rangeP + i * stepP;
    const density = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-Math.pow(pMultiple, 2) / 2);
    pointsP.push({
      p: Number(pMultiple.toFixed(3)),
      density: Number(density.toFixed(5)),
    });
  }

  return {
    sigmaXNm,
    sigmaPJoulesSecPerM,
    sigmaPEvSecPerNm: sigmaPJoulesSecPerM * 6.2415e18 * 1e-9,
    productJoulesSec,
    productRatioToHbarHalf,
    pointsX,
    pointsP,
  };
}
