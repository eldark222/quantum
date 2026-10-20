import React from 'react';
import { Cpu, Zap, Microscope, Binary, Clock, Radio, Sigma } from 'lucide-react';
import { MathView } from '../../components/common/MathView';

interface ApplicationItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  principle: string;
  mechanism: string;
  impact: string;
  equation: string;
}

const APPLICATIONS: ApplicationItem[] = [
  {
    id: 'semiconductors',
    title: 'Transistores e Semicondutores',
    category: 'Eletrônica do Estado Sólido',
    icon: <Cpu className="w-5 h-5 text-cyan-400" />,
    principle: 'Teoria de Bandas e Confinamento de Portadores',
    mechanism: 'O comportamento dos elétrons na rede cristalina do silício é governado pela Equação de Schrödinger periódica (Teorema de Bloch). O gap de energia (bandgap Eg ≈ 1.1 eV no silício) entre a banda de valência e a de condução determina o controle da condutividade através de dopagem.',
    impact: 'A base de toda a microeletrônica moderna, smartphones, GPUs e processadores com bilhões de transistores de escala nanométrica.',
    equation: 'E_g = E_c - E_v \\approx 1.12\\text{ eV (Si)}',
  },
  {
    id: 'lasers',
    title: 'Lasers (Emissão Estimulada)',
    category: 'Óptica Quântica',
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    principle: 'Coeficientes de Einstein e Inversão de População',
    mechanism: 'Quando um fóton com energia exatamente igual à diferença entre dois níveis atômicos (ΔE = hν) interage com um átomo no estado excitado, induz a emissão de um segundo fóton com idêntica fase, polarização, frequência e direção (emissão estimulada de radiação).',
    impact: 'Comunicações por fibra óptica global, cirurgias oftalmológicas de precisão, espectroscopia e armazenamento óptico.',
    equation: 'h\\nu = E_2 - E_1 = \\frac{hc}{\\lambda}',
  },
  {
    id: 'stm',
    title: 'Microscópio de Varredura por Tunelamento (STM)',
    category: 'Nanotecnologia',
    icon: <Microscope className="w-5 h-5 text-emerald-400" />,
    principle: 'Tunelamento Quântico de Elétrons',
    mechanism: 'Uma ponta condutora atômica ultrafina é aproximada a frações de nanômetro de uma superfície. Elétrons tunelam através do vácuo. Como a corrente de tunelamento I decai exponencialmente com a distância z (I ∝ e^(-2κz)), variações de centésimos de angstrom na altura dos átomos produzem alterações gigantescas na corrente.',
    impact: 'Permite visualizar e manipular átomos individuais sobre superfícies, inaugurando a era da nanotecnologia atômica experimental.',
    equation: 'I \\propto V \\cdot e^{-2\\kappa z}, \\quad \\kappa = \\frac{\\sqrt{2m\\Phi}}{\\hbar}',
  },
  {
    id: 'quantum-computing',
    title: 'Computação Quântica e Criptografia',
    category: 'Informação Quântica',
    icon: <Binary className="w-5 h-5 text-purple-400" />,
    principle: 'Superposição de Estados e Emaranhamento',
    mechanism: 'Qubits exploram espaços de Hilbert de 2^N dimensões. Algoritmos quânticos como o algoritmo de Shor (fatoração em tempo polinomial) e o algoritmo de Grover (busca quadrática) utilizam interferência destrutiva para anular caminhos computacionais incorretos e amplificar a amplitude da resposta correta.',
    impact: 'Simulação de novos materiais e fármacos moleculares, otimização combinatorial e novos padrões de criptografia pós-quântica.',
    equation: '|\\psi_N\\rangle = \\sum_{x=0}^{2^N-1} c_x |x\\rangle',
  },
  {
    id: 'atomic-clocks',
    title: 'Relógios Atômicos e Sistemas GPS',
    category: 'Metrologia Fundamental',
    icon: <Clock className="w-5 h-5 text-rose-400" />,
    principle: 'Transições Quânticas Hiperfinas do Césio-133',
    mechanism: 'O padrão internacional do segundo é definido pela frequência de oscilação exata da transição hiperfina do estado fundamental do átomo de Césio-133 não perturbado (9.192.631.770 Hz). A estabilidade extrema permite sincronização temporal com incerteza menor que um segundo em dezenas de milhões de anos.',
    impact: 'Funcionamento do GPS, Galileo e GLONASS, redes financeiras de alta frequência e telecomunicações globais.',
    equation: '\\Delta\\nu_{\\text{Cs}} = 9\\,192\\,631\\,770\\text{ Hz (Exato SI)}',
  },
  {
    id: 'mri',
    title: 'Ressonância Magnética Nuclear (RMN/MRI)',
    category: 'Medicina e Diagnóstico',
    icon: <Radio className="w-5 h-5 text-cyan-300" />,
    principle: 'Precessão de Larmor e Desdobramento Zeeman de Spin',
    mechanism: 'Os spins nucleares dos átomos de hidrogênio (prótons) na água do corpo humano alinham-se na presença de um campo magnético intenso B0. Pulsos de radiofrequência na frequência de Larmor (ω0 = γ B0) excitam os spins. Ao relaxarem, emitem sinais de RF detectados por bobinas para reconstruir imagens tomográficas com resolução milimétrica sem radiação ionizante.',
    impact: 'Diagnóstico médico não-invasivo de tumores, lesões cerebrais, tecidos moles e doenças cardíacas.',
    equation: '\\omega_0 = \\gamma B_0, \\quad \\Delta E = \\hbar \\gamma B_0',
  },
  {
    id: 'spectral-decomposition',
    title: 'Análise de Dados e Controle',
    category: 'Matemática Aplicada',
    icon: <Sigma className="w-5 h-5 text-fuchsia-400" />,
    principle: 'Autovalores, autovetores e decomposição espectral',
    mechanism: 'Matrizes simétricas reais podem ser escritas como A = QΛQᵀ. Essa mudança para eixos ortogonais separa direções independentes de uma transformação e é a base de análise de componentes principais, vibrações normais e muitos métodos de controle.',
    impact: 'Reduz problemas multivariados a coordenadas principais, ajudando a identificar padrões em dados, modos de vibração e respostas dominantes de sistemas lineares.',
    equation: 'A = Q\\Lambda Q^T, \\quad Q^TQ = I',
  },
];

export const ApplicationsSection: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Mundo Real • Engenharia e Inovação</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Aplicações Tecnológicas da Física Quântica
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            A mecânica quântica não é uma teoria abstrata restrita aos laboratórios: mais de um terço do PIB das nações desenvolvidas é sustentado por tecnologias que dependem diretamente de efeitos quânticos.
          </p>
        </div>
      </div>

      {/* Grid de Aplicações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {APPLICATIONS.map((app) => (
          <div
            key={app.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg shadow-black/20"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  {app.icon}
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                  {app.category}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{app.title}</h3>
                <div className="text-xs font-semibold text-cyan-400 mt-1">{app.principle}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                <MathView math={app.equation} block />
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p><strong>Mecanismo Físico:</strong> {app.mechanism}</p>
                <p><strong className="text-emerald-400">Impacto Real:</strong> {app.impact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
