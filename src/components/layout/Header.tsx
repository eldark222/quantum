import React, { useState } from 'react';
import {
  Atom,
  Layers,
  Split,
  Activity,
  ArrowRightLeft,
  CircleDot,
  Network,
  Cpu,
  BookMarked,
  Info,
  Menu,
  X,
} from 'lucide-react';

export type TabId =
  | 'infinite-well'
  | 'double-slit'
  | 'uncertainty'
  | 'tunneling'
  | 'superposition'
  | 'entanglement'
  | 'applications'
  | 'glossary'
  | 'about';

interface HeaderProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  category: 'simulators' | 'knowledge';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'infinite-well', label: 'Poço 1D', icon: <Layers className="w-4 h-4" />, category: 'simulators' },
  { id: 'double-slit', label: 'Dupla Fenda', icon: <Split className="w-4 h-4" />, category: 'simulators' },
  { id: 'uncertainty', label: 'Incerteza', icon: <Activity className="w-4 h-4" />, category: 'simulators' },
  { id: 'tunneling', label: 'Tunelamento', icon: <ArrowRightLeft className="w-4 h-4" />, category: 'simulators' },
  { id: 'superposition', label: 'Qubit & Bloch', icon: <CircleDot className="w-4 h-4" />, category: 'simulators' },
  { id: 'entanglement', label: 'Emaranhamento', icon: <Network className="w-4 h-4" />, category: 'simulators' },
  { id: 'applications', label: 'Aplicações', icon: <Cpu className="w-4 h-4" />, category: 'knowledge' },
  { id: 'glossary', label: 'Glossário', icon: <BookMarked className="w-4 h-4" />, category: 'knowledge' },
  { id: 'about', label: 'Sobre & Fontes', icon: <Info className="w-4 h-4" />, category: 'knowledge' },
];

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelect = (id: TabId) => {
    onSelectTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelect('infinite-well')}>
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
              <Atom className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white font-mono">
                  QUANTUM<span className="text-cyan-400">LAB</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">
                  CODATA 2022
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
                Laboratório Científico Interativo
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação Principal">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 focus:outline-none"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-3 py-1">
              Simuladores Quânticos
            </div>
            <div className="space-y-1 mt-1">
              {NAV_ITEMS.filter((i) => i.category === 'simulators').map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-3 py-1">
              Conhecimento & Referências
            </div>
            <div className="space-y-1 mt-1">
              {NAV_ITEMS.filter((i) => i.category === 'knowledge').map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
