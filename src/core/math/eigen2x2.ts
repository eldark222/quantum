import type { Matrix2x2, Vector2 } from './matrix2x2';

export type EigenvalueStatus = 'real-distinct' | 'real-repeated' | 'complex-conjugate';

export interface Eigenvalue2x2 {
  real: number;
  imaginary: number;
  eigenvector?: Vector2;
}

export interface EigenAnalysis2x2 {
  trace: number;
  determinant: number;
  discriminant: number;
  status: EigenvalueStatus;
  eigenvalues: [Eigenvalue2x2, Eigenvalue2x2];
  eigenspaceDimension: 1 | 2;
}

function validateMatrix(matrix: Matrix2x2): void {
  if (![matrix.a, matrix.b, matrix.c, matrix.d].every(Number.isFinite)) {
    throw new Error('Todos os elementos da matriz devem ser números finitos.');
  }
}

function toleranceFor(matrix: Matrix2x2): number {
  const scale = Math.max(1, Math.abs(matrix.a), Math.abs(matrix.b), Math.abs(matrix.c), Math.abs(matrix.d));
  return Number.EPSILON * scale * scale * 64;
}

function eigenvectorFor(matrix: Matrix2x2, eigenvalue: number): Vector2 {
  const first = { x: matrix.b, y: eigenvalue - matrix.a };
  const second = { x: eigenvalue - matrix.d, y: matrix.c };
  const candidate = Math.hypot(first.x, first.y) >= Math.hypot(second.x, second.y) ? first : second;

  if (Math.hypot(candidate.x, candidate.y) <= toleranceFor(matrix)) {
    return { x: 1, y: 0 };
  }

  const norm = Math.hypot(candidate.x, candidate.y);
  return { x: candidate.x / norm, y: candidate.y / norm };
}

export function analyzeEigenvalues2x2(matrix: Matrix2x2): EigenAnalysis2x2 {
  validateMatrix(matrix);
  const trace = matrix.a + matrix.d;
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  const discriminant = trace * trace - 4 * determinant;
  const tolerance = toleranceFor(matrix);

  if (discriminant < -tolerance) {
    const real = trace / 2;
    const imaginary = Math.sqrt(-discriminant) / 2;
    return {
      trace,
      determinant,
      discriminant,
      status: 'complex-conjugate',
      eigenvalues: [
        { real, imaginary },
        { real, imaginary: -imaginary },
      ],
      eigenspaceDimension: 1,
    };
  }

  const adjustedDiscriminant = Math.max(0, discriminant);
  const first = (trace + Math.sqrt(adjustedDiscriminant)) / 2;
  const second = (trace - Math.sqrt(adjustedDiscriminant)) / 2;

  if (Math.abs(discriminant) <= tolerance) {
    const isScalar = Math.abs(matrix.b) <= tolerance
      && Math.abs(matrix.c) <= tolerance
      && Math.abs(matrix.a - matrix.d) <= tolerance;
    return {
      trace,
      determinant,
      discriminant,
      status: 'real-repeated',
      eigenvalues: [
        { real: first, imaginary: 0, eigenvector: eigenvectorFor(matrix, first) },
        { real: second, imaginary: 0, eigenvector: isScalar ? { x: 0, y: 1 } : undefined },
      ],
      eigenspaceDimension: isScalar ? 2 : 1,
    };
  }

  return {
    trace,
    determinant,
    discriminant,
    status: 'real-distinct',
    eigenvalues: [
      { real: first, imaginary: 0, eigenvector: eigenvectorFor(matrix, first) },
      { real: second, imaginary: 0, eigenvector: eigenvectorFor(matrix, second) },
    ],
    eigenspaceDimension: 1,
  };
}
