import type { Matrix2x2, Vector2 } from './matrix2x2';

export interface SpectralDecomposition2x2 {
  eigenvalues: [number, number];
  eigenvectors: [Vector2, Vector2];
  reconstructed: Matrix2x2;
  residual: number;
  isSymmetric: true;
}

function validateSymmetric(matrix: Matrix2x2): void {
  if (![matrix.a, matrix.b, matrix.c, matrix.d].every(Number.isFinite)) {
    throw new Error('Todos os elementos da matriz devem ser números finitos.');
  }
  const scale = Math.max(1, Math.abs(matrix.a), Math.abs(matrix.b), Math.abs(matrix.c), Math.abs(matrix.d));
  if (Math.abs(matrix.b - matrix.c) > Number.EPSILON * scale * 64) {
    throw new Error('A decomposição espectral real exige uma matriz simétrica: b = c.');
  }
}

function multiply(left: Matrix2x2, right: Matrix2x2): Matrix2x2 {
  return {
    a: left.a * right.a + left.b * right.c,
    b: left.a * right.b + left.b * right.d,
    c: left.c * right.a + left.d * right.c,
    d: left.c * right.b + left.d * right.d,
  };
}

function transpose(matrix: Matrix2x2): Matrix2x2 {
  return { a: matrix.a, b: matrix.c, c: matrix.b, d: matrix.d };
}

export function decomposeSymmetric2x2(matrix: Matrix2x2): SpectralDecomposition2x2 {
  validateSymmetric(matrix);
  const mean = (matrix.a + matrix.d) / 2;
  const halfGap = Math.hypot((matrix.a - matrix.d) / 2, matrix.b);
  const lambda1 = mean + halfGap;
  const lambda2 = mean - halfGap;
  const angle = halfGap === 0 ? 0 : 0.5 * Math.atan2(2 * matrix.b, matrix.a - matrix.d);
  const first = { x: Math.cos(angle), y: Math.sin(angle) };
  const second = { x: -Math.sin(angle), y: Math.cos(angle) };
  const orthogonal = {
    a: first.x,
    b: second.x,
    c: first.y,
    d: second.y,
  };
  const diagonal = { a: lambda1, b: 0, c: 0, d: lambda2 };
  const reconstructed = multiply(multiply(orthogonal, diagonal), transpose(orthogonal));
  const residual = Math.max(
    Math.abs(reconstructed.a - matrix.a),
    Math.abs(reconstructed.b - matrix.b),
    Math.abs(reconstructed.c - matrix.c),
    Math.abs(reconstructed.d - matrix.d),
  );

  return {
    eigenvalues: [lambda1, lambda2],
    eigenvectors: [first, second],
    reconstructed,
    residual,
    isSymmetric: true,
  };
}
