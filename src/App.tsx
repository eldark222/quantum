import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import type { TabId } from './components/layout/Header';
import { InfiniteWellSimulator } from './features/simulators/InfiniteWellSimulator';
import { DoubleSlitSimulator } from './features/simulators/DoubleSlitSimulator';
import { UncertaintySimulator } from './features/simulators/UncertaintySimulator';
import { TunnelingSimulator } from './features/simulators/TunnelingSimulator';
import { SuperpositionSimulator } from './features/simulators/SuperpositionSimulator';
import { EntanglementSimulator } from './features/simulators/EntanglementSimulator';
import { ApplicationsSection } from './features/education/ApplicationsSection';
import { GlossarySection } from './features/education/GlossarySection';
import { AboutSection } from './features/education/AboutSection';
import { Atom, GitBranch } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('infinite-well');

  const renderContent = () => {
    switch (activeTab) {
      case 'infinite-well':
        return <InfiniteWellSimulator />;
      case 'double-slit':
        return <DoubleSlitSimulator />;
      case 'uncertainty':
        return <UncertaintySimulator />;
      case 'tunneling':
        return <TunnelingSimulator />;
      case 'superposition':
        return <SuperpositionSimulator />;
      case 'entanglement':
        return <EntanglementSimulator />;
      case 'applications':
        return <ApplicationsSection />;
      case 'glossary':
        return <GlossarySection />;
      case 'about':
        return <AboutSection />;
      default:
        return <InfiniteWellSimulator />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/25 selection:text-cyan-200">
      {/* Barra de Navegação Superior */}
      <Header activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {renderContent()}
      </main>

      {/* Rodapé Científico */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">Quantum Lab</span>
            <span>— Plataforma Científica e Educacional de Física Quântica</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className="hover:text-cyan-400 transition-colors"
            >
              Metodologia & Fontes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('glossary')}
              className="hover:text-cyan-400 transition-colors"
            >
              Glossário
            </button>
            <a
              href="https://github.com/eldark222/quantum"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
