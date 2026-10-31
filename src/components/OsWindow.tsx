import React from 'react';
import { Minus, Square, X, Maximize2 } from 'lucide-react';

interface OsWindowProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  defaultWidth?: string;
  defaultHeight?: string;
}

export const OsWindow: React.FC<OsWindowProps> = ({
  title,
  icon,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  children,
  defaultWidth = 'max-w-5xl',
  defaultHeight = 'h-[75vh]',
}) => {
  if (!isOpen || isMinimized) return null;

  return (
    <div
      onClick={onFocus}
      style={{ zIndex }}
      className={`fixed transition-all duration-200 flex flex-col overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-300/80 shadow-2xl rounded-xl ${
        isMaximized
          ? 'inset-3 sm:inset-5 bottom-24'
          : `left-1/2 top-14 -translate-x-1/2 w-[95vw] ${defaultWidth} ${defaultHeight}`
      }`}
    >
      {/* macOS / Windows Hybrid Window Title Bar */}
      <div className="h-10 px-4 bg-slate-100/90 border-b border-slate-200/90 flex items-center justify-between select-none shrink-0">
        {/* Apple Traffic Light Controls (Close, Minimize, Maximize) */}
        <div className="flex items-center gap-2 group">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 border border-rose-600/60 flex items-center justify-center transition-colors shadow-2xs"
            title="Close Window"
          >
            <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 border border-amber-500/60 flex items-center justify-center transition-colors shadow-2xs"
            title="Minimize Window"
          >
            <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMaximize();
            }}
            className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 border border-emerald-600/60 flex items-center justify-center transition-colors shadow-2xs"
            title={isMaximized ? 'Restore Window' : 'Maximize Window'}
          >
            <Maximize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Window Title & Icon */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <span className="text-amber-700">{icon}</span>
          <span className="truncate max-w-xs sm:max-w-md">{title}</span>
        </div>

        {/* Right Corner Accent */}
        <div className="w-14 flex justify-end items-center text-[11px] font-mono text-slate-400">
          <span>UGOS</span>
        </div>
      </div>

      {/* Window Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFC]">
        {children}
      </div>
    </div>
  );
};
