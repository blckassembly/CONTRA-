import React from 'react';
import {
  Boxes,
  Stethoscope,
  ShieldAlert,
  Terminal,
  GitCompare,
  HardDrive,
  Play,
  Loader2,
  FileDown,
  Sparkles,
} from 'lucide-react';

export interface DockItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isFocused: boolean;
  badge?: string;
  isAction?: boolean;
}

interface MacBottomDockProps {
  items: DockItem[];
  onSelect: (id: string) => void;
  onAuditTrigger: () => void;
  isAuditing: boolean;
  onOpenExport: () => void;
  hasReport: boolean;
}

export const MacBottomDock: React.FC<MacBottomDockProps> = ({
  items,
  onSelect,
  onAuditTrigger,
  isAuditing,
  onOpenExport,
  hasReport,
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      {/* Outer Glow / Floating Glass Bubble */}
      <div className="relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 bg-slate-900/90 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            {/* Hover Tooltip Bubble */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900/95 text-white text-[11px] font-medium rounded-md shadow-md border border-slate-700/60 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50">
              {item.name}
              {item.badge && <span className="ml-1 text-amber-400 font-bold">({item.badge})</span>}
            </div>

            {/* Dock Icon Button */}
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={`relative p-2.5 sm:p-3 rounded-xl transition-all duration-200 flex flex-col items-center justify-center transform group-hover:-translate-y-1 group-active:translate-y-0.5 ${
                item.isFocused
                  ? 'bg-amber-500/25 text-amber-400 shadow-md ring-1 ring-amber-500/60'
                  : item.isOpen
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                {item.icon}
              </div>

              {/* Active Dot Indicator beneath icon */}
              {item.isOpen && (
                <div
                  className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${
                    item.isFocused ? 'bg-amber-400 shadow-xs' : 'bg-slate-400'
                  }`}
                />
              )}
            </button>
          </div>
        ))}

        <div className="w-px h-6 bg-slate-700/80 mx-1" />

        {/* Challenge Diagnosis Primary Action Button */}
        <div className="relative group">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-amber-900/95 text-amber-200 text-[11px] font-medium rounded-md shadow-md border border-amber-700/60 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50">
            Challenge Diagnosis (Live Audit)
          </div>

          <button
            type="button"
            onClick={onAuditTrigger}
            disabled={isAuditing}
            className="p-2.5 sm:p-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white transition-all transform group-hover:-translate-y-1 shadow-lg shadow-amber-900/30 flex items-center justify-center"
          >
            {isAuditing ? (
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-amber-200" />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
            )}
          </button>
        </div>

        {/* Export Report Action if Report Exists */}
        {hasReport && (
          <div className="relative group">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900/95 text-white text-[11px] font-medium rounded-md shadow-md border border-slate-700/60 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50">
              Export Dossier (Print / Markdown)
            </div>

            <button
              type="button"
              onClick={onOpenExport}
              className="p-2.5 sm:p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all transform group-hover:-translate-y-1 shadow-md flex items-center justify-center"
            >
              <FileDown className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
