export type DifferentiableFunction = 'quadratic' | 'cubic-minus-linear' | 'sine' | 'cosine' | 'exponential' | 'logarithm';
export type DifferenceMethod = 'forward' | 'backward' | 'central';

export interface FunctionDefinition {
  label: string;
  equation: string;
  evaluate: (x: number) => number;
  derivative: (x: number) => number;
  domain: (x: number) => boolean;
  domainLabel: string;
}

export interface DerivativeResult {
  method: DifferenceMethod;
  x: number;
  step: number;
  value: number;
  derivative: number;
  analytic: number;
  absoluteError: number;
  relativeError?: number;
  stencil: number[];
}

const DEFINITIONS: Record<DifferentiableFunction, FunctionDefinition> = {
  quadratic: { label: 'Quadrática', equation: 'f(x)=x^2', evaluate: (x) => x * x, derivative: (x) => 2 * x, domain: Number.isFinite, domainLabel: 'x real' },
  'cubic-minus-linear': { label: 'Cúbica', equation: 'f(x)=x^3-x', evaluate: (x) => x ** 3 - x, derivative: (x) => 3 * x * x - 1, domain: Number.isFinite, domainLabel: 'x real' },
  sine: { label: 'Seno', equation: 'f(x)=\\sin(x)', evaluate: Math.sin, derivative: Math.cos, domain: Number.isFinite, domainLabel: 'x real, em radianos' },
  cosine: { label: 'Cosseno', equation: 'f(x)=\\cos(x)', evaluate: Math.cos, derivative: (x) => -Math.sin(x), domain: Number.isFinite, domainLabel: 'x real, em radianos' },
  exponential: { label: 'Exponencial', equation: 'f(x)=e^x', evaluate: Math.exp, derivative: Math.exp, domain: Number.isFinite, domainLabel: 'x real dentro do limite numérico' },
  logarithm: { label: 'Logaritmo natural', equation: 'f(x)=\\ln(x)', evaluate: Math.log, derivative: (x) => 1 / x, domain: (x) => Number.isFinite(x) && x > 0, domainLabel: 'x > 0' },
};

function validateFinite(value: number, label: string): void {
  if (!Number.isFinite(value)) throw new Error(`${label} deve ser finito.`);
}

function validateEvaluation(definition: FunctionDefinition, x: number): number {
  if (!definition.domain(x)) throw new Error(`O ponto x=${x} está fora do domínio: ${definition.domainLabel}.`);
  const value = definition.evaluate(x);
  validateFinite(value, 'A avaliação da função');
  return value;
}

export function getFunctionDefinition(kind: DifferentiableFunction): FunctionDefinition {
  return DEFINITIONS[kind];
}

export function numericalDerivative(
  definition: FunctionDefinition,
  method: DifferenceMethod,
  x: number,
  step = 1e-4,
): DerivativeResult {
  validateFinite(x, 'O ponto');
  validateFinite(step, 'O passo');
  if (step <= 0) throw new Error('O passo deve ser positivo.');
  const offsets = method === 'forward' ? [0, step] : method === 'backward' ? [-step, 0] : [-step, step];
  const values = offsets.map((offset) => validateEvaluation(definition, x + offset));
  const derivative = method === 'forward'
    ? (values[1] - values[0]) / step
    : method === 'backward'
      ? (values[1] - values[0]) / step
      : (values[1] - values[0]) / (2 * step);
  validateFinite(derivative, 'A derivada numérica');
  const analytic = definition.derivative(x);
  validateFinite(analytic, 'A derivada analítica');
  const absoluteError = Math.abs(derivative - analytic);
  return {
    method, x, step, value: values[method === 'backward' ? 1 : 0], derivative, analytic,
    absoluteError,
    relativeError: Math.abs(analytic) > Number.EPSILON * 100 ? absoluteError / Math.abs(analytic) : undefined,
    stencil: offsets.map((offset) => x + offset),
  };
}

export function centralDifference(evaluate: (x: number) => number, x: number, step = 1e-4): number {
  const definition: FunctionDefinition = {
    label: 'Função fornecida', equation: '', evaluate, derivative: () => 0,
    domain: (value) => Number.isFinite(value), domainLabel: 'valores finitos',
  };
  return numericalDerivative(definition, 'central', x, step).derivative;
}

export function sampleDerivative(kind: DifferentiableFunction, minimum: number, maximum: number, points = 81, step = 1e-4): DerivativeResult[] {
  validateFinite(minimum, 'O limite mínimo');
  validateFinite(maximum, 'O limite máximo');
  if (maximum <= minimum) throw new Error('O limite máximo deve ser maior que o mínimo.');
  if (!Number.isInteger(points) || points < 2 || points > 1001) throw new Error('O número de pontos deve ser um inteiro entre 2 e 1001.');
  const definition = getFunctionDefinition(kind);
  return Array.from({ length: points }, (_, index) => {
    const x = minimum + (maximum - minimum) * index / (points - 1);
    return numericalDerivative(definition, 'central', x, step);
  });
}
