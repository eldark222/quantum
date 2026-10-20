export interface Matrix2x2 {
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Matrix2x2Inverse {
  matrix: Matrix2x2;
  determinant: number;
}

function validateFinite(values: number[], message: string): void {
  if (!values.every(Number.isFinite)) {
    throw new Error(message);
  }
}

function validateMatrix(matrix: Matrix2x2): void {
  validateFinite(
    [matrix.a, matrix.b, matrix.c, matrix.d],
    'Todos os elementos da matriz devem ser números finitos.',
  );
}

function validateVector(vector: Vector2): void {
  validateFinite([vector.x, vector.y], 'Todos os componentes do vetor devem ser números finitos.');
}

export function determinant2x2(matrix: Matrix2x2): number {
  validateMatrix(matrix);
  return matrix.a * matrix.d - matrix.b * matrix.c;
}

export function trace2x2(matrix: Matrix2x2): number {
  validateMatrix(matrix);
  return matrix.a + matrix.d;
}

export function multiplyMatrixVector(matrix: Matrix2x2, vector: Vector2): Vector2 {
  validateMatrix(matrix);
  validateVector(vector);
  return {
    x: matrix.a * vector.x + matrix.b * vector.y,
    y: matrix.c * vector.x + matrix.d * vector.y,
  };
}

export function inverse2x2(matrix: Matrix2x2): Matrix2x2Inverse | null {
  const determinant = determinant2x2(matrix);
  const scale = Math.max(1, Math.abs(matrix.a), Math.abs(matrix.b), Math.abs(matrix.c), Math.abs(matrix.d));
  const tolerance = Number.EPSILON * scale * scale * 32;

  if (Math.abs(determinant) <= tolerance) {
    return null;
  }

  return {
    determinant,
    matrix: {
      a: matrix.d / determinant,
      b: -matrix.b / determinant,
      c: -matrix.c / determinant,
      d: matrix.a / determinant,
    },
  };
}
