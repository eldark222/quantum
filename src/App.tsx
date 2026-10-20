import React, { lazy, Suspense, useState } from 'react';
import { Header } from './components/layout/Header';
import type { TabId } from './components/layout/Header';
import { Atom, GitBranch } from 'lucide-react';

const InfiniteWellSimulator = lazy(() => import('./features/simulators/InfiniteWellSimulator').then((module) => ({ default: module.InfiniteWellSimulator })));
const DoubleSlitSimulator = lazy(() => import('./features/simulators/DoubleSlitSimulator').then((module) => ({ default: module.DoubleSlitSimulator })));
const UncertaintySimulator = lazy(() => import('./features/simulators/UncertaintySimulator').then((module) => ({ default: module.UncertaintySimulator })));
const TunnelingSimulator = lazy(() => import('./features/simulators/TunnelingSimulator').then((module) => ({ default: module.TunnelingSimulator })));
const SuperpositionSimulator = lazy(() => import('./features/simulators/SuperpositionSimulator').then((module) => ({ default: module.SuperpositionSimulator })));
const EntanglementSimulator = lazy(() => import('./features/simulators/EntanglementSimulator').then((module) => ({ default: module.EntanglementSimulator })));
const ApplicationsSection = lazy(() => import('./features/education/ApplicationsSection').then((module) => ({ default: module.ApplicationsSection })));
const GlossarySection = lazy(() => import('./features/education/GlossarySection').then((module) => ({ default: module.GlossarySection })));
const AboutSection = lazy(() => import('./features/education/AboutSection').then((module) => ({ default: module.AboutSection })));
const LinearSystemSection = lazy(() => import('./features/mathematics/LinearSystemSection').then((module) => ({ default: module.LinearSystemSection })));

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
      case 'linear-system':
        return <LinearSystemSection />;
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
        <Suspense
          fallback={
            <div className="flex min-h-96 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 text-sm text-slate-400">
              Carregando experimento...
            </div>
          }
        >
          {renderContent()}
        </Suspense>
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
