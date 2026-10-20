import { describe, it, expect } from 'vitest';
import {
  calculateEnergy,
  calculateWaveFunction,
  calculateNodes,
  calculateIntervalProbability,
  simulateInfiniteWell,
} from '../core/physics/infiniteWell';
import { joulesToEv, evToJoules, nmToMeters, metersToNm } from '../core/physics/units';
import { ELECTRON_MASS, H_BAR, PROTON_MASS } from '../core/physics/constants';
import { calculateTunnelingCoefficients, simulateTunneling } from '../core/physics/tunneling';
import { simulateUncertainty } from '../core/physics/uncertainty';
import { applyHadamardGate, calculateQubitState } from '../core/physics/superposition';
import { calculateQuantumCorrelation, evaluateChshInequality } from '../core/physics/entanglement';
import { calculateDoubleSlitIntensity, calculateDeBroglieWavelengthNm } from '../core/physics/doubleSlit';
import { solveLinearSystem2x2 } from '../core/math/linearSystem';
import { determinant2x2, inverse2x2, multiplyMatrixVector, trace2x2 } from '../core/math/matrix2x2';
import { analyzeEigenvalues2x2 } from '../core/math/eigen2x2';
import { decomposeSymmetric2x2 } from '../core/math/spectral2x2';
import { centralDifference, getFunctionDefinition, numericalDerivative, sampleDerivative } from '../core/math/numericalDifferentiation';

describe('Cálculo diferencial numérico', () => {
  it('aproxima derivadas conhecidas pela diferença central', () => {
    expect(centralDifference((x) => x * x, 2)).toBeCloseTo(4, 7);
    expect(centralDifference(Math.sin, 0)).toBeCloseTo(1, 7);
  });

  it('implementa as três fórmulas de diferenças finitas', () => {
    const definition = getFunctionDefinition('quadratic');
    expect(numericalDerivative(definition, 'forward', 2).derivative).toBeCloseTo(4.0001, 7);
    expect(numericalDerivative(definition, 'backward', 2).derivative).toBeCloseTo(3.9999, 7);
    expect(numericalDerivative(definition, 'central', 2).derivative).toBeCloseTo(4, 7);
  });

  it('cobre as funções do catálogo e respeita o domínio do logaritmo', () => {
    expect(numericalDerivative(getFunctionDefinition('cubic-minus-linear'), 'central', 2).analytic).toBe(11);
    expect(numericalDerivative(getFunctionDefinition('cosine'), 'central', 0).analytic).toBeCloseTo(0);
    expect(numericalDerivative(getFunctionDefinition('exponential'), 'central', 0).analytic).toBe(1);
    expect(numericalDerivative(getFunctionDefinition('logarithm'), 'central', 1).analytic).toBe(1);
    expect(() => numericalDerivative(getFunctionDefinition('logarithm'), 'central', 0)).toThrow();
    expect(() => numericalDerivative(getFunctionDefinition('logarithm'), 'backward', 0.1, 0.2)).toThrow();
  });

  it('compara amostras numéricas com a derivada analítica', () => {
    const samples = sampleDerivative('quadratic', -3, 3, 41);
    expect(samples).toHaveLength(41);
    expect(Math.max(...samples.map((sample) => sample.absoluteError))).toBeLessThan(1e-7);
  });

  it('rejeita passo e domínio inválidos', () => {
    expect(() => centralDifference(Math.sin, 0, 0)).toThrow();
    expect(() => sampleDerivative('sine', 1, 1)).toThrow();
    expect(() => sampleDerivative('sine', 0, 1, 1)).toThrow();
  });
});

describe('Decomposição espectral de matrizes simétricas 2×2', () => {
  it('reconstrói a matriz a partir de QΛQᵀ', () => {
    const matrix = { a: 3, b: 1, c: 1, d: 2 };
    const result = decomposeSymmetric2x2(matrix);
    expect(result.eigenvalues[0]).toBeGreaterThan(result.eigenvalues[1]);
    expect(result.residual).toBeLessThan(1e-12);
    expect(result.eigenvectors[0].x * result.eigenvectors[1].x
      + result.eigenvectors[0].y * result.eigenvectors[1].y).toBeCloseTo(0, 12);
  });

  it('usa a base canônica para uma matriz escalar', () => {
    const result = decomposeSymmetric2x2({ a: 2, b: 0, c: 0, d: 2 });
    expect(result.eigenvectors[0]).toEqual({ x: 1, y: 0 });
    expect(result.eigenvectors[1]).toEqual({ x: -0, y: 1 });
    expect(result.residual).toBe(0);
  });

  it('rejeita matrizes não simétricas e entradas não finitas', () => {
    expect(() => decomposeSymmetric2x2({ a: 1, b: 2, c: 1, d: 1 })).toThrow(/simétrica/);
    expect(() => decomposeSymmetric2x2({ a: Number.NaN, b: 0, c: 0, d: 1 })).toThrow();
  });
});

describe('Álgebra linear: autovalores 2×2', () => {
  it('calcula autovalores e autovetores reais distintos', () => {
    const result = analyzeEigenvalues2x2({ a: 2, b: 1, c: 1, d: 3 });
    expect(result.status).toBe('real-distinct');
    expect(result.eigenvalues.map((value) => value.real)).toEqual([3.618033988749895, 1.381966011250105]);
    result.eigenvalues.forEach((value) => {
      expect(value.eigenvector).toBeDefined();
    });
  });

  it('classifica autovalores complexos conjugados', () => {
    const result = analyzeEigenvalues2x2({ a: 0, b: -1, c: 1, d: 0 });
    expect(result.status).toBe('complex-conjugate');
    expect(result.eigenvalues[0].real).toBeCloseTo(0);
    expect(Math.abs(result.eigenvalues[0].imaginary)).toBeCloseTo(1);
    expect(result.eigenvalues[0].eigenvector).toBeUndefined();
  });

  it('distingue matriz escalar e caso repetido degenerado', () => {
    const scalar = analyzeEigenvalues2x2({ a: 2, b: 0, c: 0, d: 2 });
    const defective = analyzeEigenvalues2x2({ a: 2, b: 1, c: 0, d: 2 });
    expect(scalar.status).toBe('real-repeated');
    expect(scalar.eigenspaceDimension).toBe(2);
    expect(defective.status).toBe('real-repeated');
    expect(defective.eigenspaceDimension).toBe(1);
    expect(() => analyzeEigenvalues2x2({ a: Number.NaN, b: 0, c: 0, d: 1 })).toThrow();
  });
});

describe('Álgebra linear: matrizes 2×2', () => {
  it('calcula determinante e traço', () => {
    const matrix = { a: 2, b: 1, c: 1, d: 3 };
    expect(determinant2x2(matrix)).toBe(5);
    expect(trace2x2(matrix)).toBe(5);
  });

  it('transforma vetor e recupera o vetor pela inversa', () => {
    const matrix = { a: 2, b: 1, c: 1, d: 3 };
    const vector = { x: 1, y: 2 };
    const transformed = multiplyMatrixVector(matrix, vector);
    const inverse = inverse2x2(matrix);
    expect(transformed).toEqual({ x: 4, y: 7 });
    expect(inverse).not.toBeNull();
    expect(multiplyMatrixVector(inverse!.matrix, transformed).x).toBeCloseTo(vector.x, 12);
    expect(multiplyMatrixVector(inverse!.matrix, transformed).y).toBeCloseTo(vector.y, 12);
  });

  it('não fornece inversa para matriz singular e rejeita entradas inválidas', () => {
    expect(inverse2x2({ a: 1, b: 2, c: 2, d: 4 })).toBeNull();
    expect(() => determinant2x2({ a: Number.NaN, b: 0, c: 0, d: 1 })).toThrow();
  });
});

describe('Conversões de Unidades Físicas', () => {
  it('converte corretamente entre Joules e eV', () => {
    const oneEvInJoules = 1.602176634e-19;
    expect(evToJoules(1)).toBeCloseTo(oneEvInJoules, 25);
    expect(joulesToEv(oneEvInJoules)).toBeCloseTo(1, 10);
    expect(joulesToEv(evToJoules(13.6))).toBeCloseTo(13.6, 10);
  });

  it('converte corretamente entre nanômetros e metros', () => {
    expect(nmToMeters(1)).toBe(1e-9);
    expect(metersToNm(1e-9)).toBe(1);
    expect(metersToNm(nmToMeters(500))).toBeCloseTo(500, 10);
  });

  it('rejeita valores não finitos', () => {
    expect(() => evToJoules(Number.NaN)).toThrow();
    expect(() => nmToMeters(Number.POSITIVE_INFINITY)).toThrow();
  });
});

describe('Poço de Potencial Infinito 1D', () => {
  it('calcula energia quantizada com dependência quadrática em n', () => {
    const widthNm = 1.0;
    const e1 = calculateEnergy(1, widthNm, ELECTRON_MASS);
    const e2 = calculateEnergy(2, widthNm, ELECTRON_MASS);
    const e3 = calculateEnergy(3, widthNm, ELECTRON_MASS);

    expect(e2 / e1).toBeCloseTo(4, 5); // 2^2 = 4
    expect(e3 / e1).toBeCloseTo(9, 5); // 3^2 = 9
  });

  it('reproduz a energia fundamental analítica do elétron em 1 nm', () => {
    expect(joulesToEv(calculateEnergy(1, 1, ELECTRON_MASS))).toBeCloseTo(0.376030, 5);
  });

  it('respeita a dependência inversa do quadrado da largura L', () => {
    const eL1 = calculateEnergy(1, 1.0, ELECTRON_MASS);
    const eL2 = calculateEnergy(1, 2.0, ELECTRON_MASS);
    expect(eL1 / eL2).toBeCloseTo(4, 5); // (2/1)^2 = 4
  });

  it('respeita a dependência inversa da massa', () => {
    const eElectron = calculateEnergy(1, 1.0, ELECTRON_MASS);
    const eProton = calculateEnergy(1, 1.0, PROTON_MASS);
    expect(eElectron / eProton).toBeCloseTo(PROTON_MASS / ELECTRON_MASS, 2);
  });

  it('satisfaz as condições de contorno psi(0) = psi(L) = 0', () => {
    const L = 1.5;
    for (let n = 1; n <= 4; n++) {
      expect(calculateWaveFunction(0, n, L)).toBeCloseTo(0, 8);
      expect(calculateWaveFunction(L, n, L)).toBeCloseTo(0, 8);
    }
  });

  it('calcula o número exato de nós internos (n - 1)', () => {
    const L = 1.0;
    for (let n = 1; n <= 5; n++) {
      const nodes = calculateNodes(n, L);
      expect(nodes.length).toBe(n - 1);
      // Todos os nós devem estar estritamente dentro do poço (0, L)
      nodes.forEach((x) => {
        expect(x).toBeGreaterThan(0);
        expect(x).toBeLessThan(L);
        // No nó, a função de onda deve ser zero
        expect(calculateWaveFunction(x, n, L)).toBeCloseTo(0, 8);
      });
    }
  });

  it('mantém a normalização integral de probabilidade aproximadamente igual a 1', () => {
    const sim = simulateInfiniteWell(2, 1.0, ELECTRON_MASS, 1000);
    // Integração numérica pela regra dos trapézios
    let integral = 0;
    for (let i = 0; i < sim.points.length - 1; i++) {
      const p1 = sim.points[i];
      const p2 = sim.points[i + 1];
      const dx = p2.x - p1.x;
      integral += 0.5 * (p1.probDensity + p2.probDensity) * dx;
    }
    expect(integral).toBeCloseTo(1.0, 3);
  });

  it('calcula a probabilidade por sub-intervalo corretamente', () => {
    const L = 1.0;
    // Probabilidade na caixa inteira [0, L] deve ser 1
    expect(calculateIntervalProbability(0, L, 1, L)).toBeCloseTo(1.0, 5);
    // Probabilidade na primeira metade [0, L/2] para n=1 e n=2 deve ser 0.5 por simetria
    expect(calculateIntervalProbability(0, L / 2, 1, L)).toBeCloseTo(0.5, 5);
    expect(calculateIntervalProbability(0, L / 2, 2, L)).toBeCloseTo(0.5, 5);
  });

  it('rejeita parâmetros inválidos em vez de gerar valores silenciosamente', () => {
    expect(() => calculateEnergy(0, 1, ELECTRON_MASS)).toThrow();
    expect(() => calculateWaveFunction(0, 1, Number.NaN)).toThrow();
    expect(() => simulateInfiniteWell(1, 1, ELECTRON_MASS, 0)).toThrow();
  });
});

describe('Princípio da Incerteza de Heisenberg', () => {
  it('garante que Delta x * Delta p >= hbar / 2 para o pacote Gaussiano', () => {
    const result = simulateUncertainty(0.5);
    expect(result.productJoulesSec).toBeGreaterThanOrEqual(H_BAR / 2 - 1e-38);
    expect(result.productRatioToHbarHalf).toBeCloseTo(1.0, 4);
    expect(result.sigmaPEvSecPerNm).toBeCloseTo(
      result.sigmaPJoulesSecPerM / 1.602176634e-19 * 1e-9,
      12,
    );
    expect(() => simulateUncertainty(0)).toThrow();
  });

  describe('Dupla fenda', () => {
    const params = {
      wavelengthNm: 500,
      slitSeparationUm: 20,
      slitWidthUm: 4,
      screenDistanceM: 1,
      hasWhichWayDetector: false,
    };

    it('tem máximo central normalizado sem detector de caminho', () => {
      const result = calculateDoubleSlitIntensity(0, params);
      expect(result.intensity).toBeCloseTo(1, 12);
      expect(result.envelope).toBeCloseTo(1, 12);
    });

    it('remove o termo de interferência quando o detector de caminho está ativo', () => {
      const coherent = calculateDoubleSlitIntensity(0.5, params);
      const incoherent = calculateDoubleSlitIntensity(0.5, { ...params, hasWhichWayDetector: true });
      expect(incoherent.intensity).toBeCloseTo(incoherent.classical, 12);
      expect(coherent.intensity).toBeLessThanOrEqual(coherent.envelope + 1e-12);
    });

    it('usa de Broglie com unidades SI consistentes', () => {
      const wavelength = calculateDeBroglieWavelengthNm(1.602176634e-19, ELECTRON_MASS);
      expect(wavelength).toBeCloseTo(1.226, 3);
    });
  });
});

describe('Tunelamento Quântico', () => {
  it('conserva o fluxo de probabilidade: T + R = 1', () => {
    const resTunneling = calculateTunnelingCoefficients({
      particleEnergyEv: 3.0,
      barrierHeightEv: 8.0,
      barrierWidthNm: 0.2,
      massKg: ELECTRON_MASS,
    });
    expect(resTunneling.T + resTunneling.R).toBeCloseTo(1.0, 6);
    expect(resTunneling.T).toBeGreaterThan(0);
    expect(resTunneling.T).toBeLessThan(1);

    const resOverBarrier = calculateTunnelingCoefficients({
      particleEnergyEv: 10.0,
      barrierHeightEv: 8.0,
      barrierWidthNm: 0.2,
      massKg: ELECTRON_MASS,
    });
    expect(resOverBarrier.T + resOverBarrier.R).toBeCloseTo(1.0, 6);
    expect(resOverBarrier.T).toBeGreaterThan(0.5);
  });

  it('trata o limiar somente quando E/V0 é numericamente próximo de 1', () => {
    const nearThreshold = calculateTunnelingCoefficients({
      particleEnergyEv: 8 * (1 + 1e-13),
      barrierHeightEv: 8,
      barrierWidthNm: 0.2,
      massKg: ELECTRON_MASS,
    });
    expect(nearThreshold.regime).toBe('threshold');

    const distinctEnergy = calculateTunnelingCoefficients({
      particleEnergyEv: 7.999,
      barrierHeightEv: 8,
      barrierWidthNm: 0.2,
      massKg: ELECTRON_MASS,
    });
    expect(distinctEnergy.regime).toBe('tunneling');
  });

  it('permanece finito para uma barreira espessa e gera um perfil contínuo', () => {
    const result = simulateTunneling({
      particleEnergyEv: 1,
      barrierHeightEv: 20,
      barrierWidthNm: 1,
      massKg: ELECTRON_MASS,
    }, 200);
    expect(Number.isFinite(result.transmissionCoefficient)).toBe(true);
    expect(result.waveProfile.every((point) => Number.isFinite(point.density))).toBe(true);
    expect(result.waveProfile[0].density).toBeGreaterThan(0);
    expect(() => calculateTunnelingCoefficients({
      particleEnergyEv: 0,
      barrierHeightEv: 8,
      barrierWidthNm: 0.2,
      massKg: ELECTRON_MASS,
    })).toThrow();
  });
});

describe('Superposição e Qubit', () => {
  it('satisfaz a conservação de probabilidade no estado de qubit: P(0) + P(1) = 1', () => {
    const state = calculateQubitState(Math.PI / 3, Math.PI / 4);
    expect(state.prob0 + state.prob1).toBeCloseTo(1.0, 8);
    // Vetor de Bloch deve estar na superfície da esfera unitária: x^2 + y^2 + z^2 = 1
    const radiusSq = Math.pow(state.bloch.x, 2) + Math.pow(state.bloch.y, 2) + Math.pow(state.bloch.z, 2);
    expect(radiusSq).toBeCloseTo(1.0, 3);
  });

  it('preserva a norma ao aplicar Hadamard', () => {
    const state = applyHadamardGate(calculateQubitState(Math.PI / 3, Math.PI / 4));
    expect(state.prob0 + state.prob1).toBeCloseTo(1, 12);
    expect(state.bloch.x ** 2 + state.bloch.y ** 2 + state.bloch.z ** 2).toBeCloseTo(1, 12);
  });

  it('rejeita um ângulo polar fora do domínio físico', () => {
    expect(() => calculateQubitState(-0.1, 0)).toThrow();
    expect(() => calculateQubitState(Math.PI + 0.1, 0)).toThrow();
  });
});

describe('Emaranhamento Quântico e Desigualdade de Bell CHSH', () => {
  it('viola o limite clássico de Bell (|S| > 2) para os ângulos de Tsirelson', () => {
    const chsh = evaluateChshInequality(0, 90, 45, 135);
    expect(chsh.sParameter).toBeGreaterThan(2.0);
    expect(chsh.sParameter).toBeCloseTo(2 * Math.SQRT2, 2);
    expect(chsh.violatesClassicalBound).toBe(true);
  });

  describe('Álgebra Linear — Sistemas 2x2', () => {
    it('resolve um sistema determinado e produz resíduos nulos', () => {
      const result = solveLinearSystem2x2({ a: 2, b: 1, c: 1, d: -1, e: 5, f: 1 });
      expect(result.status).toBe('unique');
      expect(result.x).toBeCloseTo(2, 12);
      expect(result.y).toBeCloseTo(1, 12);
      expect(result.residualX).toBeCloseTo(0, 12);
      expect(result.residualY).toBeCloseTo(0, 12);
    });

    it('classifica retas paralelas e coincidentes', () => {
      expect(solveLinearSystem2x2({ a: 1, b: 1, c: 2, d: 2, e: 1, f: 3 }).status).toBe('inconsistent');
      expect(solveLinearSystem2x2({ a: 1, b: 1, c: 2, d: 2, e: 1, f: 2 }).status).toBe('underdetermined');
    });

    it('rejeita coeficientes não finitos', () => {
      expect(() => solveLinearSystem2x2({ a: Number.NaN, b: 1, c: 1, d: 1, e: 1, f: 1 })).toThrow();
    });
  });

  it('produz anticorrelação perfeita para eixos coincidentes', () => {
    expect(calculateQuantumCorrelation(32, 32)).toBeCloseTo(-1, 12);
  });
});
