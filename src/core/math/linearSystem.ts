export interface LinearSystem2x2 {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export type LinearSystemStatus = 'unique' | 'inconsistent' | 'underdetermined';

export interface LinearSystem2x2Result {
  determinant: number;
  status: LinearSystemStatus;
  x?: number;
  y?: number;
  residualX?: number;
  residualY?: number;
}

function validateSystem(system: LinearSystem2x2): void {
  if (!Object.values(system).every(Number.isFinite)) {
    throw new Error('Todos os coeficientes do sistema devem ser números finitos.');
  }
}

/**
 * Resolve ax + by = e e cx + dy = f pela regra de Cramer.
 *
 * Sistemas singulares são classificados comparando os determinantes com uma
 * tolerância relativa à escala dos coeficientes, evitando uma divisão instável.
 */
export function solveLinearSystem2x2(system: LinearSystem2x2): LinearSystem2x2Result {
  validateSystem(system);
  const { a, b, c, d, e, f } = system;
  const determinant = a * d - b * c;
  const coefficientScale = Math.max(1, Math.abs(a), Math.abs(b), Math.abs(c), Math.abs(d));
  const tolerance = Number.EPSILON * coefficientScale * coefficientScale * 32;
  const determinantX = e * d - b * f;
  const determinantY = a * f - e * c;

  if (Math.abs(determinant) > tolerance) {
    const x = determinantX / determinant;
    const y = determinantY / determinant;
    return {
      determinant,
      status: 'unique',
      x,
      y,
      residualX: a * x + b * y - e,
      residualY: c * x + d * y - f,
    };
  }

  const augmentedScale = Math.max(1, Math.abs(e), Math.abs(f));
  const consistencyTolerance = Number.EPSILON * coefficientScale * augmentedScale * 32;
  const sameLine = Math.abs(determinantX) <= consistencyTolerance
    && Math.abs(determinantY) <= consistencyTolerance;

  return {
    determinant,
    status: sameLine ? 'underdetermined' : 'inconsistent',
  };
}
