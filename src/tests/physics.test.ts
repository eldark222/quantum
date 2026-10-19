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
import { calculateTunnelingCoefficients } from '../core/physics/tunneling';
import { simulateUncertainty } from '../core/physics/uncertainty';
import { calculateQubitState } from '../core/physics/superposition';
import { evaluateChshInequality } from '../core/physics/entanglement';

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
});

describe('Princípio da Incerteza de Heisenberg', () => {
  it('garante que Delta x * Delta p >= hbar / 2 para o pacote Gaussiano', () => {
    const result = simulateUncertainty(0.5);
    expect(result.productJoulesSec).toBeGreaterThanOrEqual(H_BAR / 2 - 1e-38);
    expect(result.productRatioToHbarHalf).toBeCloseTo(1.0, 4);
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
});

describe('Superposição e Qubit', () => {
  it('satisfaz a conservação de probabilidade no estado de qubit: P(0) + P(1) = 1', () => {
    const state = calculateQubitState(Math.PI / 3, Math.PI / 4);
    expect(state.prob0 + state.prob1).toBeCloseTo(1.0, 8);
    // Vetor de Bloch deve estar na superfície da esfera unitária: x^2 + y^2 + z^2 = 1
    const radiusSq = Math.pow(state.bloch.x, 2) + Math.pow(state.bloch.y, 2) + Math.pow(state.bloch.z, 2);
    expect(radiusSq).toBeCloseTo(1.0, 3);
  });
});

describe('Emaranhamento Quântico e Desigualdade de Bell CHSH', () => {
  it('viola o limite clássico de Bell (|S| > 2) para os ângulos de Tsirelson', () => {
    const chsh = evaluateChshInequality(0, 90, 45, 135);
    expect(chsh.sParameter).toBeGreaterThan(2.0);
    expect(chsh.sParameter).toBeCloseTo(2 * Math.SQRT2, 2);
    expect(chsh.violatesClassicalBound).toBe(true);
  });
});
