export type DifferentiableFunction = 'quadratic' | 'sine' | 'exponential';

export interface FunctionDefinition {
  label: string;
  equation: string;
  evaluate: (x: number) => number;
  derivative: (x: number) => number;
}

export interface DerivativeSample {
  x: number;
  value: number;
  numerical: number;
  analytic: number;
  absoluteError: number;
}

const DEFINITIONS: Record<DifferentiableFunction, FunctionDefinition> = {
  quadratic: {
    label: 'Quadrática',
    equation: 'f(x)=x^2',
    evaluate: (x) => x * x,
    derivative: (x) => 2 * x,
  },
  sine: {
    label: 'Seno',
    equation: 'f(x)=\\sin(x)',
    evaluate: (x) => Math.sin(x),
    derivative: (x) => Math.cos(x),
  },
  exponential: {
    label: 'Exponencial',
    equation: 'f(x)=e^x',
    evaluate: (x) => Math.exp(x),
    derivative: (x) => Math.exp(x),
  },
};

function validateFinite(value: number, label: string): void {
  if (!Number.isFinite(value)) throw new Error(`${label} deve ser finito.`);
}

export function getFunctionDefinition(kind: DifferentiableFunction): FunctionDefinition {
  return DEFINITIONS[kind];
}

export function centralDifference(
  evaluate: (x: number) => number,
  x: number,
  step = 1e-4,
): number {
  validateFinite(x, 'O ponto');
  validateFinite(step, 'O passo');
  if (step <= 0) throw new Error('O passo deve ser positivo.');
  const result = (evaluate(x + step) - evaluate(x - step)) / (2 * step);
  validateFinite(result, 'A derivada numérica');
  return result;
}

export function sampleDerivative(
  kind: DifferentiableFunction,
  minimum: number,
  maximum: number,
  points = 81,
  step = 1e-4,
): DerivativeSample[] {
  validateFinite(minimum, 'O limite mínimo');
  validateFinite(maximum, 'O limite máximo');
  if (maximum <= minimum) throw new Error('O limite máximo deve ser maior que o mínimo.');
  if (!Number.isInteger(points) || points < 2 || points > 1001) {
    throw new Error('O número de pontos deve ser um inteiro entre 2 e 1001.');
  }
  const definition = getFunctionDefinition(kind);
  return Array.from({ length: points }, (_, index) => {
    const x = minimum + (maximum - minimum) * index / (points - 1);
    const numerical = centralDifference(definition.evaluate, x, step);
    const analytic = definition.derivative(x);
    return { x, value: definition.evaluate(x), numerical, analytic, absoluteError: Math.abs(numerical - analytic) };
  });
}
