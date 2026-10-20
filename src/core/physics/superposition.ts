export interface BlochCoordinates {
  x: number; // sin(theta) * cos(phi)
  y: number; // sin(theta) * sin(phi)
  z: number; // cos(theta)
}

export interface QubitState {
  thetaRad: number; // polar angle [0, pi]
  phiRad: number; // azimuthal angle [0, 2*pi]
  prob0: number; // cos^2(theta/2)
  prob1: number; // sin^2(theta/2)
  bloch: BlochCoordinates;
}

/**
 * Calcula o estado quântico de um qubit a partir dos ângulos de Bloch theta e phi
 */
export function calculateQubitState(thetaRad: number, phiRad: number): QubitState {
  if (!Number.isFinite(thetaRad) || thetaRad < 0 || thetaRad > Math.PI) {
    throw new Error('O ângulo polar theta deve estar no intervalo [0, pi].');
  }
  if (!Number.isFinite(phiRad)) {
    throw new Error('O ângulo azimutal phi deve ser um número finito.');
  }
  const theta = thetaRad;
  const phi = (phiRad % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

  const halfTheta = theta / 2;
  const prob0 = Math.pow(Math.cos(halfTheta), 2);
  const prob1 = Math.pow(Math.sin(halfTheta), 2);

  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  return {
    thetaRad: theta,
    phiRad: phi,
    prob0,
    prob1,
    bloch: {
      x,
      y,
      z,
    },
  };
}

/**
 * Aplica a porta de Hadamard ao estado
 */
export function applyHadamardGate(state: QubitState): QubitState {
  // Matriz de rotação de Hadamard na esfera de Bloch:
  // H leva o eixo Z para o eixo X e vice-versa (rotaciona pi em torno do eixo (X+Z)/sqrt(2))
  const newX = state.bloch.z;
  const newY = -state.bloch.y;
  const newZ = state.bloch.x;

  const theta = Math.acos(Math.max(-1, Math.min(1, newZ)));
  let phi = Math.atan2(newY, newX);
  if (phi < 0) phi += 2 * Math.PI;

  return calculateQubitState(theta, phi);
}

/**
 * Aplica a porta Pauli-X (NOT quântico)
 */
export function applyPauliXGate(state: QubitState): QubitState {
  return calculateQubitState(Math.PI - state.thetaRad, (2 * Math.PI - state.phiRad) % (2 * Math.PI));
}

/**
 * Aplica a porta Pauli-Z (Phase Flip)
 */
export function applyPauliZGate(state: QubitState): QubitState {
  return calculateQubitState(state.thetaRad, (state.phiRad + Math.PI) % (2 * Math.PI));
}

/**
 * Simula N medições projetivas com colapso na base computacional {|0>, |1>}
 */
export function simulateMeasurements(state: QubitState, count: number = 100): { count0: number; count1: number } {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error('A quantidade de medições deve ser um inteiro não negativo.');
  }
  let count0 = 0;
  for (let i = 0; i < count; i++) {
    if (Math.random() < state.prob0) {
      count0++;
    }
  }
  return {
    count0,
    count1: count - count0,
  };
}
