import React, { useState, useMemo } from 'react';
import { BookMarked, Search } from 'lucide-react';
import { MathView } from '../../components/common/MathView';

interface GlossaryTerm {
  term: string;
  category: 'Fundamentos' | 'Observáveis & Operadores' | 'Fenômenos Quânticos' | 'Informação Quântica' | 'Matemática Aplicada';
  symbol?: string;
  unit?: string;
  definition: string;
  equation?: string;
  details: string;
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Autovalor',
    category: 'Matemática Aplicada',
    symbol: '\\lambda',
    definition: 'Escalar que mede o fator de escala de uma transformação linear em uma direção própria, sem alterar sua direção.',
    equation: 'A\\vec{v}=\\lambda\\vec{v},\\quad \\vec{v}\\ne\\vec{0}',
    details: 'Em matrizes simétricas reais, os autovalores são reais e os autovetores de autovalores distintos são ortogonais.',
  },
  {
    term: 'Autovetor',
    category: 'Matemática Aplicada',
    symbol: '\\vec{v}',
    definition: 'Vetor não nulo cuja direção permanece invariável quando uma matriz é aplicada, sofrendo apenas uma escala λ.',
    equation: '(A-\\lambda I)\\vec{v}=\\vec{0}',
    details: 'A normalização de um autovetor não muda a direção física ou geométrica que ele representa.',
  },
  {
    term: 'Decomposição Espectral',
    category: 'Matemática Aplicada',
    symbol: 'A=Q\\Lambda Q^T',
    definition: 'Representação de uma matriz simétrica real por uma base ortonormal de autovetores e uma matriz diagonal de autovalores.',
    equation: 'Q^TQ=I',
    details: 'O teorema espectral garante essa forma para matrizes reais simétricas; matrizes gerais exigem hipóteses e decomposições diferentes.',
  },
  {
    term: 'Função de Onda',
    category: 'Fundamentos',
    symbol: '\\psi(\\vec{r}, t)',
    unit: 'm⁻³ᐟ² em 3D, m⁻¹ᐟ² em 1D',
    definition: 'Amplitude de probabilidade complexa que descreve completamente o estado quântico de um sistema de partículas.',
    equation: '\\int_{-\\infty}^{+\\infty} |\\psi(x)|^2 dx = 1',
    details: 'A função de onda em si não é diretamente mensurável. De acordo com a interpretação de Copenhague (Regra de Born), seu módulo ao quadrado representa uma densidade de probabilidade.',
  },
  {
    term: 'Densidade de Probabilidade',
    category: 'Fundamentos',
    symbol: 'P(x) = |\\psi(x)|^2',
    unit: 'm⁻¹ em 1D',
    definition: 'Probabilidade por unidade de comprimento de encontrar a partícula infinitesimalmente em torno do ponto x.',
    equation: 'P(x_1 \\le x \\le x_2) = \\int_{x_1}^{x_2} |\\psi(x)|^2 dx',
    details: 'Deve ser estritamente real e não-negativa em todos os pontos do domínio.',
  },
  {
    term: 'Operador Hermitiano (Auto-adjunto)',
    category: 'Observáveis & Operadores',
    symbol: '\\hat{A} = \\hat{A}^\\dagger',
    definition: 'Operador linear cujos autovalores são garantidamente reais e cujos autovetores associados a autovalores distintos são ortogonais.',
    equation: '\\langle \\phi | \\hat{A} \\psi \\rangle = \\langle \\hat{A} \\phi | \\psi \\rangle',
    details: 'Na mecânica quântica, qualquer grandeza física observável (energia, momento, posição, spin) é representada por um operador hermitiano.',
  },
  {
    term: 'Comutador Canônico',
    category: 'Observáveis & Operadores',
    symbol: '[\\hat{A}, \\hat{B}] = \\hat{A}\\hat{B} - \\hat{B}\\hat{A}',
    definition: 'Mede a não-comutatividade de dois operadores na ordem de aplicação sucessiva.',
    equation: '[\\hat{x}, \\hat{p}] = i\\hbar \\hat{I}',
    details: 'Se dois operadores comutam ([A, B] = 0), eles compartilham uma base simultânea de autovetores e podem ser medidos simultaneamente sem incerteza conjunta.',
  },
  {
    term: 'Tunelamento Quântico',
    category: 'Fenômenos Quânticos',
    symbol: 'T',
    unit: 'Adimensional [0, 1]',
    definition: 'Fenômeno puramente ondulatório no qual uma partícula atravessa uma barreira de potencial de energia maior do que a energia mecânica da partícula.',
    equation: 'T \\approx e^{-2\\kappa a}, \\quad \\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}',
    details: 'Ocorre devido à natureza evanescente da função de onda dentro da barreira, mantendo amplitude não-nula na região posterior à barreira.',
  },
  {
    term: 'Decoerência Quântica',
    category: 'Fenômenos Quânticos',
    definition: 'Processo dinâmico pelo qual um sistema quântico em superposição perde suas interferências de fase devido à interação irreversível com os graus de liberdade do ambiente.',
    details: 'Explica a emergência da física clássica macroscopicamente a partir dos princípios quânticos subjacentes, sem necessidade de colapso mágico.',
  },
  {
    term: 'Qubit (Quantum Bit)',
    category: 'Informação Quântica',
    symbol: '|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle',
    definition: 'Unidade fundamental de informação quântica parametrizada como uma superposição contínua de dois estados ortogonais.',
    equation: '|\\alpha|^2 + |\\beta|^2 = 1',
    details: 'Geometrizado sobre a Esfera de Bloch, permitindo paralelismo em algoritmos quânticos.',
  },
  {
    term: 'Desigualdade de Bell (CHSH)',
    category: 'Informação Quântica',
    symbol: '|S| \\le 2',
    definition: 'Restrição matemática fundamental imposta a qualquer teoria física baseada em variáveis ocultas e realismo local.',
    equation: 'S = E(a, b) - E(a, b\') + E(a\', b) + E(a\', b\')',
    details: 'A mecânica quântica viola esta desigualdade atingindo o limite de Tsirelson 2√2 ≈ 2.828, demonstrando que a natureza é fundamentalmente não-local.',
  },
];

export const GlossarySection: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Fundamentos', 'Observáveis & Operadores', 'Fenômenos Quânticos', 'Informação Quântica', 'Matemática Aplicada'];

  const filtered = useMemo(() => {
    return GLOSSARY_TERMS.filter((t) => {
      const matchesSearch =
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase()) ||
        t.details.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-900 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <BookMarked className="w-3.5 h-3.5" />
            <span>Fundamentos Matemáticos e Físicos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Glossário Científico de Física Quântica
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Consulte definições rigorosas, equações operacionais e unidades no Sistema Internacional (SI) dos conceitos centrais da mecânica quântica.
          </p>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar termos, equações ou conceitos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'Todos os Termos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Termos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-all shadow-lg shadow-black/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/20">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mt-2">{item.term}</h3>
              </div>
              {item.symbol && (
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-serif text-cyan-300">
                  <MathView math={item.symbol} />
                </div>
              )}
            </div>

            {item.equation && (
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                <MathView math={item.equation} block />
              </div>
            )}

            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p><strong>Definição Formal:</strong> {item.definition}</p>
              {item.unit && <p className="font-mono text-slate-400"><strong>Unidade SI:</strong> {item.unit}</p>}
              <p className="text-slate-400 border-t border-slate-800/80 pt-2">{item.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
