import { ELEMENTARY_CHARGE } from './constants';

/**
 * Converte valor de Joules (J) para elétron-volts (eV)
 */
export function joulesToEv(joules: number): number {
  if (!Number.isFinite(joules)) {
    throw new Error('A energia em joules deve ser um número finito.');
  }
  return joules / ELEMENTARY_CHARGE;
}

/**
 * Converte valor de elétron-volts (eV) para Joules (J)
 */
export function evToJoules(ev: number): number {
  if (!Number.isFinite(ev)) {
    throw new Error('A energia em elétron-volts deve ser um número finito.');
  }
  return ev * ELEMENTARY_CHARGE;
}

/**
 * Converte nanômetros (nm) para metros (m)
 */
export function nmToMeters(nm: number): number {
  if (!Number.isFinite(nm)) {
    throw new Error('O comprimento em nanômetros deve ser um número finito.');
  }
  return nm * 1e-9;
}

/**
 * Converte metros (m) para nanômetros (nm)
 */
export function metersToNm(meters: number): number {
  if (!Number.isFinite(meters)) {
    throw new Error('O comprimento em metros deve ser um número finito.');
  }
  return meters * 1e9;
}

/**
 * Formata um número em notação científica ou padrão com número especificado de dígitos significativos
 */
export function formatScientific(value: number, precision: number = 3): string {
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 0.01 && abs < 10000) {
    return value.toLocaleString('pt-BR', { maximumFractionDigits: precision });
  }
  return value.toExponential(precision).replace('e', ' × 10^').replace('+', '');
}

/**
 * Formata energia exibindo tanto em eV quanto em Joules
 */
export function formatEnergy(joules: number): { ev: string; joules: string; compact: string } {
  const ev = joulesToEv(joules);
  return {
    ev: `${formatScientific(ev, 4)} eV`,
    joules: `${formatScientific(joules, 4)} J`,
    compact: Math.abs(ev) >= 1e6 
      ? `${(ev / 1e6).toFixed(3)} MeV`
      : Math.abs(ev) >= 1e3
      ? `${(ev / 1e3).toFixed(3)} keV`
      : `${ev.toFixed(3)} eV`,
  };
}
