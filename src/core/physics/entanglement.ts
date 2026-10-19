export interface BellCorrelationResult {
  thetaADeg: number;
  thetaBDeg: number;
  deltaThetaDeg: number;
  quantumCorrelation: number; // E(a, b) = -cos(theta_A - theta_B)
  classicalLimitMin: number; // -1
  classicalLimitMax: number; // +1
}

export interface ChshResult {
  angleADeg: number;
  angleAPrimeDeg: number;
  angleBDeg: number;
  angleBPrimeDeg: number;
  e_ab: number;
  e_abPrime: number;
  e_aPrimeB: number;
  e_aPrimeBPrime: number;
  sParameter: number; // S = |E(a, b) - E(a, b') + E(a', b) + E(a', b')|
  violatesClassicalBound: boolean; // |S| > 2
  tsirelsonBound: number; // 2 * sqrt(2) ≈ 2.8284
}

/**
 * Calcula a correlação quântica entre Alice e Bob no estado singleto
 * E(a, b) = -\cos(\theta_A - \theta_B)
 */
export function calculateQuantumCorrelation(thetaADeg: number, thetaBDeg: number): number {
  const deltaRad = ((thetaADeg - thetaBDeg) * Math.PI) / 180;
  return -Math.cos(deltaRad);
}

/**
 * Avalia o teste da desigualdade CHSH para 4 ângulos escolhidos
 * Para violação máxima (limite de Tsirelson 2*sqrt(2) ≈ 2.8284):
 * a = 0°, a' = 90°, b = 45°, b' = 135°
 */
export function evaluateChshInequality(
  aDeg: number = 0,
  aPrimeDeg: number = 90,
  bDeg: number = 45,
  bPrimeDeg: number = 135,
): ChshResult {
  const e_ab = calculateQuantumCorrelation(aDeg, bDeg);
  const e_abPrime = calculateQuantumCorrelation(aDeg, bPrimeDeg);
  const e_aPrimeB = calculateQuantumCorrelation(aPrimeDeg, bDeg);
  const e_aPrimeBPrime = calculateQuantumCorrelation(aPrimeDeg, bPrimeDeg);

  // Parâmetro de Bell CHSH: S = |E(a, b) - E(a, b') + E(a', b) + E(a', b')|
  const sParameter = Math.abs(e_ab - e_abPrime + e_aPrimeB + e_aPrimeBPrime);
  const tsirelsonBound = 2 * Math.SQRT2;

  return {
    angleADeg: aDeg,
    angleAPrimeDeg: aPrimeDeg,
    angleBDeg: bDeg,
    angleBPrimeDeg: bPrimeDeg,
    e_ab: Number(e_ab.toFixed(4)),
    e_abPrime: Number(e_abPrime.toFixed(4)),
    e_aPrimeB: Number(e_aPrimeB.toFixed(4)),
    e_aPrimeBPrime: Number(e_aPrimeBPrime.toFixed(4)),
    sParameter: Number(sParameter.toFixed(4)),
    violatesClassicalBound: sParameter > 2.0001,
    tsirelsonBound: Number(tsirelsonBound.toFixed(4)),
  };
}
