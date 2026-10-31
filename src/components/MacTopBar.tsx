import React from 'react';
import { HardDrive, Server, ShieldCheck, ChevronDown, Flame, Clock } from 'lucide-react';
import { ClinicalCase, ContradictionReport } from '../types/clinical.ts';

interface MacTopBarProps {
  currentCase: ClinicalCase;
  allCases: ClinicalCase[];
  onSelectCase: (c: ClinicalCase) => void;
  currentReport: ContradictionReport | null;
  activeWindowName: string;
}

export const MacTopBar: React.FC<MacTopBarProps> = ({
  currentCase,
  allCases,
  onSelectCase,
  currentReport,
  activeWindowName,
}) => {
  const [currentTime, setCurrentTime] = React.useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-8 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-xs text-slate-300 px-4 flex items-center justify-between select-none z-40 fixed top-0 left-0 right-0">
      {/* Left Menu Items (macOS Style) */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-bold text-white tracking-tight">
          <span className="text-amber-500 font-mono">⌘</span>
          <span className="font-mono">CONTRA OS</span>
        </div>

        <span className="text-slate-600 hidden sm:inline">|</span>

        {/* Case Switcher Quick Menu */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-mono hidden md:inline">Case:</span>
          <select
            value={currentCase.id}
            onChange={(e) => {
              const found = allCases.find((c) => c.id === e.target.value);
              if (found) onSelectCase(found);
            }}
            className="bg-transparent text-amber-300 font-semibold cursor-pointer focus:outline-hidden hover:text-amber-200 text-xs"
          >
            {allCases.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                {c.caseNumber}: {c.workingDiagnosis}
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-600 hidden lg:inline">|</span>

        {/* Active Window Title */}
        <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Active Window:</span>
          <span className="text-slate-200 font-medium">{activeWindowName}</span>
        </div>
      </div>

      {/* Right System Indicators (Windows / macOS Hybrid Status Tray) */}
      <div className="flex items-center gap-3.5 text-[11px] font-mono text-slate-400">
        <div className="hidden sm:flex items-center gap-1.5 text-emerald-400">
          <Server className="w-3 h-3" />
          <span>UGOS NAS (RAID-5 ZFS)</span>
        </div>

        {currentReport && (
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Flame className="w-3 h-3 text-amber-500" />
            <span>{currentReport.contradictionAlertLevel}</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-slate-200">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{currentTime}</span>
        </div>
      </div>
    </header>
  );
};
