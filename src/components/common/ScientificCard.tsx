import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface ScientificCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  theoryTitle?: string;
  theoryContent?: React.ReactNode;
  className?: string;
}

export const ScientificCard: React.FC<ScientificCardProps> = ({
  title,
  subtitle,
  badge,
  icon,
  children,
  theoryTitle = 'Fundamentação Teórica & Hipóteses',
  theoryContent,
  className = '',
}) => {
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-xl shadow-black/40 transition-all ${className}`}
    >
      <div className="border-b border-slate-800/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
              {badge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
        </div>

        {theoryContent && (
          <button
            type="button"
            onClick={() => setIsTheoryOpen(!isTheoryOpen)}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            aria-expanded={isTheoryOpen}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isTheoryOpen ? 'Ocultar Teoria' : 'Ver Teoria'}</span>
            {isTheoryOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {theoryContent && isTheoryOpen && (
        <div className="border-b border-slate-800 bg-slate-950/70 p-5 sm:p-6 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3 text-cyan-400 font-semibold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>{theoryTitle}</span>
          </div>
          <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
            {theoryContent}
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
};
