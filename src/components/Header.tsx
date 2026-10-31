import React from 'react';
import { Play, Loader2, FileDown } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dossier' | 'matrix' | 'hypotheses' | 'archive';
  setActiveTab: (tab: 'dossier' | 'matrix' | 'hypotheses' | 'archive') => void;
  onRunAudit: () => void;
  isAuditing: boolean;
  onOpenExport: () => void;
  hasReport: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRunAudit,
  isAuditing,
  onOpenExport,
  hasReport,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <span className="text-base font-extrabold tracking-tight text-slate-900 font-mono">
            CONTRA<span className="text-amber-700">.</span>
          </span>
          <span className="hidden sm:inline text-xs text-slate-400 font-medium">
            Clinical Contradiction Intelligence
          </span>
        </div>

        {/* Zone 2: 4 Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('dossier')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'dossier'
                ? 'text-slate-900 font-semibold border-b-2 border-amber-700'
                : 'hover:text-slate-900'
            }`}
          >
            Case Dossier
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'matrix'
                ? 'text-slate-900 font-semibold border-b-2 border-amber-700'
                : 'hover:text-slate-900'
            }`}
          >
            Contradiction Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hypotheses')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'hypotheses'
                ? 'text-slate-900 font-semibold border-b-2 border-amber-700'
                : 'hover:text-slate-900'
            }`}
          >
            Competing Hypotheses
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('archive')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'archive'
                ? 'text-slate-900 font-semibold border-b-2 border-amber-700'
                : 'hover:text-slate-900'
            }`}
          >
            NAS Evidence Archive
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {hasReport && (
            <button
              type="button"
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Report</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRunAudit}
            disabled={isAuditing}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-md transition-colors whitespace-nowrap shadow-xs"
          >
            {isAuditing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Auditing Clinical Evidence...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Challenge Diagnosis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
