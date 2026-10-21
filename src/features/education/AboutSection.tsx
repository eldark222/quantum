import React from 'react';
import { Info, Code2, Award, BookCheck, ShieldCheck } from 'lucide-react';
import { MathView } from '../../components/common/MathView';
import {
  H_PLANCK,
  H_BAR,
  SPEED_OF_LIGHT,
  ELEMENTARY_CHARGE,
  ELECTRON_MASS,
  PROTON_MASS,
  NEUTRON_MASS,
} from '../../core/physics/constants';
import { formatScientific } from '../../core/physics/units';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Info className="w-3.5 h-3.5" />
            <span>Sobre o Projeto • Metodologia & Arquitetura</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Quantum Lab: Plataforma Científica e Portfólio
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Desenvolvido para unir rigor matemático, física teórica computacional e as melhores práticas de engenharia de software contemporânea em React, TypeScript e computação científica.
          </p>
        </div>
      </div>

      {/* Grid de Missão e Princípios de Arquitetura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base">
            <Award className="w-5 h-5" />
            <span>Objetivo e Qualidade de Portfólio</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            O <strong>Quantum Lab</strong> foi concebido para estudantes e pesquisadores de Ciência da Computação, Física e Engenharia. Seu objetivo central é erradicar simulações puramente estéticas ou desprovidas de unidades que proliferam na web, substituindo-as por modelos com rigor analítico, conversão dimensional estrita e testes automatizados.
          </p>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li><strong>Separação de Responsabilidades:</strong> Lógica física isolada em funções puras independentes da UI.</li>
            <li><strong>Acessibilidade & Responsividade:</strong> Navegação por teclado, leitor de tela e suporte a telas móveis.</li>
            <li><strong>Desempenho Otimizado:</strong> Renderização eficiente com <MathView math="\text{memo}" />, Canvas 2D acelerado por hardware e pacotes enxutos sem bibliotecas desnecessárias.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base">
            <Code2 className="w-5 h-5" />
            <span>Stack Tecnológico de Produção</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Interface</span>
              <span className="text-cyan-300 font-bold">React 19 + TypeScript</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Build Tool</span>
              <span className="text-cyan-300 font-bold">Vite 6 (ESM)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Estilização</span>
              <span className="text-cyan-300 font-bold">Tailwind CSS v4</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Visualização</span>
              <span className="text-cyan-300 font-bold">Recharts + Canvas 2D</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Matemática</span>
              <span className="text-cyan-300 font-bold">KaTeX (TeX/LaTeX)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-0.5">Testes</span>
              <span className="text-cyan-300 font-bold">Vitest</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Constantes Físicas CODATA 2022 */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
            <ShieldCheck className="w-5 h-5" />
            <span>Constantes Físicas Fundamentais Utilizadas (NIST CODATA 2022)</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Valores exatos e recomendados do SI</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="pb-3 pr-4">Grandeza Física</th>
                <th className="pb-3 pr-4">Símbolo</th>
                <th className="pb-3 pr-4">Valor Numérico</th>
                <th className="pb-3">Unidade SI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              <tr>
                <td className="py-2.5 pr-4 text-white">Constante de Planck</td>
                <td className="py-2.5 pr-4 text-cyan-400 font-serif font-bold">h</td>
                <td className="py-2.5 pr-4">{formatScientific(H_PLANCK, 8)}</td>
                <td className="py-2.5">J · s (Exato)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-white">Constante de Dirac (Planck reduzida)</td>
                <td className="py-2.5 pr-4 text-cyan-400 font-serif font-bold">ℏ = h / 2π</td>
                <td className="py-2.5 pr-4">{formatScientific(H_BAR, 8)}</td>
                <td className="py-2.5">J · s (Exato, derivado de h)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-white">Velocidade da luz no vácuo</td>
                <td className="py-2.5 pr-4 text-cyan-400 font-serif font-bold">c</td>
                <td className="py-2.5 pr-4">{SPEED_OF_LIGHT.toLocaleString('pt-BR')}</td>
                <td className="py-2.5">m / s (Exato)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-white">Carga elementar</td>
                <td className="py-2.5 pr-4 text-cyan-400 font-serif font-bold">e</td>
                <td className="py-2.5 pr-4">{formatScientific(ELEMENTARY_CHARGE, 8)}</td>
                <td className="py-2.5">C (Exato)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-white">Massa de repouso do elétron</td>
                <td className="py-2.5 pr-4 text-cyan-400 font-serif font-bold">m_e</td>
                <td className="py-2.5 pr-4">{formatScientific(ELECTRON_MASS, 10)}</td>
                <td className="py-2.5">kg</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-white">Massa de repouso do próton</td>
                <td className="py-2.5 pr-4 text-cyan-400 font-serif font-bold">m_p</td>
                <td className="py-2.5 pr-4">{formatScientific(PROTON_MASS, 11)}</td>
                <td className="py-2.5">kg</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 text-white">Massa de repouso do nêutron</td>
                <td className="py-2.5 pr-4 text-cyan-400 font-serif font-bold">m_n</td>
                <td className="py-2.5 pr-4">{formatScientific(NEUTRON_MASS, 11)}</td>
                <td className="py-2.5">kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Referências Bibliográficas Científicas */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
          <BookCheck className="w-5 h-5" />
          <span>Referências Bibliográficas e Fontes Acadêmicas Consultadas</span>
        </div>

        <ol className="list-decimal list-inside space-y-2.5 text-xs text-slate-300 leading-relaxed">
          <li>
            <strong className="text-white">Griffiths, D. J., & Schroeter, D. F. (2018).</strong> <em>Introduction to Quantum Mechanics</em> (3ª edição). Cambridge University Press. (Capítulos 1 a 4: Função de onda, Equação de Schrödinger independente do tempo, Poço de potencial infinito e Princípio da Incerteza).
          </li>
          <li>
            <strong className="text-white">Cohen-Tannoudji, C., Diu, B., & Laloë, F. (2019).</strong> <em>Quantum Mechanics</em> (Vols. 1 & 2). Wiley. (Postulados da mecânica quântica, operadores hermitianos, matrizes densidade e tunelamento quântico).
          </li>
          <li>
            <strong className="text-white">Sakurai, J. J., & Napolitano, J. (2020).</strong> <em>Modern Quantum Mechanics</em> (3ª edição). Cambridge University Press. (Estados de dois níveis, rotações na Esfera de Bloch e Teorema de Bell).
          </li>
          <li>
            <strong className="text-white">Feynman, R. P., Leighton, R. B., & Sands, M. (1965).</strong> <em>The Feynman Lectures on Physics, Vol. III: Quantum Mechanics</em>. Addison-Wesley. (O experimento da dupla fenda e a amplitude de probabilidade).
          </li>
          <li>
            <strong className="text-white">Mohr, P. J., et al. — NIST (2024).</strong> <em>CODATA Internationally Recommended 2022 Values of the Fundamental Physical Constants</em>. National Institute of Standards and Technology.
          </li>
          <li>
            <strong className="text-white">Strang, G. (2016).</strong> <em>Introduction to Linear Algebra</em> (5ª edição). Wellesley-Cambridge Press. (Autovalores, autovetores, matrizes simétricas e decomposição espectral).
          </li>
          <li>
            <strong className="text-white">MIT OpenCourseWare (2011).</strong> <em>18.06SC Linear Algebra</em>. Material didático aberto sobre subespaços, autovalores e diagonalização.
          </li>
        </ol>
      </div>
    </div>
  );
};
