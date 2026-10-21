/**
 * Constantes Físicas Fundamentais
 * Valores recomendados pelo CODATA 2022 (NIST Reference on Constants, Units, and Uncertainty)
 */

export interface PhysicalConstant {
  symbol: string;
  name: string;
  value: number;
  unit: string;
  description: string;
}

/**
 * Constante de Planck: h em J.s
 */
export const H_PLANCK = 6.62607015e-34; // J s (valor exato SI)

/**
 * Constante de Planck reduzida: hbar = h / (2 pi) em J.s.
 * O valor numérico é derivado da definição exata de h e do valor
 * matemático de pi, não uma constante SI independente.
 */
export const H_BAR = H_PLANCK / (2 * Math.PI);

/**
 * Velocidade da luz no vácuo: c em m/s
 */
export const SPEED_OF_LIGHT = 299792458; // m/s (valor exato SI)

/**
 * Carga elementar: e em Coulombs (C)
 */
export const ELEMENTARY_CHARGE = 1.602176634e-19; // C (valor exato SI)

/**
 * Massa de repouso do elétron: m_e em kg
 */
export const ELECTRON_MASS = 9.1093837139e-31; // kg

/**
 * Massa de repouso do próton: m_p em kg
 */
export const PROTON_MASS = 1.67262192595e-27; // kg

/**
 * Massa de repouso do nêutron: m_n em kg
 */
export const NEUTRON_MASS = 1.67492750056e-27; // kg

/**
 * Massa do múon: m_\mu em kg
 */
export const MUON_MASS = 1.883531627e-28; // kg

/**
 * Constante de Boltzmann: k_B em J/K
 */
export const BOLTZMANN_CONSTANT = 1.380649e-23; // J/K (valor exato SI)

/**
 * Permissividade elétrica do vácuo: \varepsilon_0 em F/m
 */
export const VACUUM_PERMITTIVITY = 8.8541878188e-12; // F/m

/**
 * Tabela de partículas disponíveis nos simuladores com massas em kg
 */
export interface ParticleOption {
  id: string;
  name: string;
  symbol: string;
  massKg: number;
  chargeC: number;
  description: string;
}

export const PARTICLE_PRESETS: ParticleOption[] = [
  {
    id: 'electron',
    name: 'Elétron',
    symbol: 'e⁻',
    massKg: ELECTRON_MASS,
    chargeC: -ELEMENTARY_CHARGE,
    description: 'Lépton fundamental de carga negativa, massa m_e ≈ 9.109 × 10⁻³¹ kg.',
  },
  {
    id: 'proton',
    name: 'Próton',
    symbol: 'p⁺',
    massKg: PROTON_MASS,
    chargeC: ELEMENTARY_CHARGE,
    description: 'Bárion composto por três quarks (uud), massa m_p ≈ 1.673 × 10⁻²⁷ kg.',
  },
  {
    id: 'neutron',
    name: 'Nêutron',
    symbol: 'n⁰',
    massKg: NEUTRON_MASS,
    chargeC: 0,
    description: 'Bárion neutro composto (udd), massa m_n ≈ 1.675 × 10⁻²⁷ kg.',
  },
  {
    id: 'muon',
    name: 'Múon',
    symbol: 'μ⁻',
    massKg: MUON_MASS,
    chargeC: -ELEMENTARY_CHARGE,
    description: 'Lépton de segunda geração, aproximadamente 207 vezes mais massivo que o elétron.',
  },
];
