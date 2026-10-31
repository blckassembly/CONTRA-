import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Stethoscope,
  ShieldAlert,
  Terminal,
  GitCompare,
  HardDrive,
  FileDown,
  AlertCircle,
} from 'lucide-react';
import { MacTopBar } from './components/MacTopBar.tsx';
import { MacBottomDock, DockItem } from './components/MacBottomDock.tsx';
import { OsWindow } from './components/OsWindow.tsx';
import { NasWorkflowScene } from './components/three/NasWorkflowScene.tsx';
import { CaseDossier } from './components/CaseDossier.tsx';
import { ContradictionMatrix } from './components/ContradictionMatrix.tsx';
import { UgosTerminal } from './components/UgosTerminal.tsx';
import { CompetingHypotheses } from './components/CompetingHypotheses.tsx';
import { NasEvidenceArchive } from './components/NasEvidenceArchive.tsx';
import { NasDocumentModal } from './components/NasDocumentModal.tsx';
import { ReportExportModal } from './components/ReportExportModal.tsx';
import { SYNTHETIC_CASES } from './data/syntheticCases.ts';
import { NAS_DOCUMENTS } from './data/nasDocuments.ts';
import { ClinicalCase, ContradictionReport, NASDocument } from './types/clinical.ts';

interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export default function App() {
  const [selectedCase, setSelectedCase] = useState<ClinicalCase>(SYNTHETIC_CASES[0]);
  const [allCases, setAllCases] = useState<ClinicalCase[]>(SYNTHETIC_CASES);
  const [documents, setDocuments] = useState<NASDocument[]>(NAS_DOCUMENTS);

  // Cached contradiction reports by caseId
  const [reportsByCaseId, setReportsByCaseId] = useState<Record<string, ContradictionReport>>({});
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Modals
  const [activeDocumentModal, setActiveDocumentModal] = useState<NASDocument | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Highest z-index tracking for window focus
  const [topZIndex, setTopZIndex] = useState(10);
  const [activeWindowId, setActiveWindowId] = useState<string>('workflow3d');

  // OS Window States
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    workflow3d: { isOpen: true, isMinimized: false, isMaximized: false, zIndex: 10 },
    dossier: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 5 },
    matrix: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 6 },
    terminal: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 7 },
    hypotheses: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 8 },
    vault: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 9 },
  });

  // Focus Window
  const focusWindow = (id: string) => {
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    setActiveWindowId(id);
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        zIndex: nextZ,
      },
    }));
  };

  // Toggle Window Open/Focus from Dock
  const handleDockSelect = (id: string) => {
    setWindows((prev) => {
      const current = prev[id];
      if (!current.isOpen) {
        const nextZ = topZIndex + 1;
        setTopZIndex(nextZ);
        setActiveWindowId(id);
        return {
          ...prev,
          [id]: { ...current, isOpen: true, isMinimized: false, zIndex: nextZ },
        };
      } else if (current.isMinimized) {
        const nextZ = topZIndex + 1;
        setTopZIndex(nextZ);
        setActiveWindowId(id);
        return {
          ...prev,
          [id]: { ...current, isMinimized: false, zIndex: nextZ },
        };
      } else if (activeWindowId === id) {
        // If clicking already focused window, minimize it
        return {
          ...prev,
          [id]: { ...current, isMinimized: true },
        };
      } else {
        const nextZ = topZIndex + 1;
        setTopZIndex(nextZ);
        setActiveWindowId(id);
        return {
          ...prev,
          [id]: { ...current, zIndex: nextZ },
        };
      }
    });
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  };

  const toggleMaximizeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  };

  // Initial Data Fetch
  useEffect(() => {
    async function loadData() {
      try {
        const [casesRes, docsRes] = await Promise.allSettled([
          fetch('/api/contra/cases').then((r) => r.json()),
          fetch('/api/contra/documents').then((r) => r.json()),
        ]);
        if (docsRes.status === 'fulfilled' && docsRes.value?.documents) {
          setDocuments(docsRes.value.documents);
        }
      } catch (e) {
        console.warn('Using bundled initial dataset:', e);
      }
    }
    loadData();
  }, []);

  // Run Contradiction Audit
  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditError(null);

    try {
      const response = await fetch('/api/contra/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: selectedCase.id }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      if (!data.report) throw new Error('No contradiction report generated');

      setReportsByCaseId((prev) => ({
        ...prev,
        [selectedCase.id]: data.report,
      }));

      // Focus the Contradiction Matrix window
      focusWindow('matrix');
    } catch (err: any) {
      console.error('Audit failed:', err);
      setAuditError(err.message || 'Audit execution notice.');
    } finally {
      setIsAuditing(false);
    }
  };

  const currentReport = reportsByCaseId[selectedCase.id] || null;

  // Dock items
  const dockItems: DockItem[] = [
    {
      id: 'workflow3d',
      name: '3D Strategic Workflow',
      icon: <Boxes className="w-5 h-5" />,
      isOpen: windows.workflow3d.isOpen,
      isFocused: activeWindowId === 'workflow3d' && !windows.workflow3d.isMinimized,
    },
    {
      id: 'dossier',
      name: 'Clinical Case Dossier',
      icon: <Stethoscope className="w-5 h-5" />,
      isOpen: windows.dossier.isOpen,
      isFocused: activeWindowId === 'dossier' && !windows.dossier.isMinimized,
      badge: selectedCase.caseNumber,
    },
    {
      id: 'matrix',
      name: 'Contradiction Matrix',
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      isOpen: windows.matrix.isOpen,
      isFocused: activeWindowId === 'matrix' && !windows.matrix.isMinimized,
      badge: currentReport ? currentReport.contradictionAlertLevel : undefined,
    },
    {
      id: 'terminal',
      name: 'UGOS Linux NAS Shell',
      icon: <Terminal className="w-5 h-5 text-emerald-400" />,
      isOpen: windows.terminal.isOpen,
      isFocused: activeWindowId === 'terminal' && !windows.terminal.isMinimized,
    },
    {
      id: 'hypotheses',
      name: 'Competing Hypotheses',
      icon: <GitCompare className="w-5 h-5" />,
      isOpen: windows.hypotheses.isOpen,
      isFocused: activeWindowId === 'hypotheses' && !windows.hypotheses.isMinimized,
    },
    {
      id: 'vault',
      name: 'NAS Medical Archive',
      icon: <HardDrive className="w-5 h-5 text-indigo-400" />,
      isOpen: windows.vault.isOpen,
      isFocused: activeWindowId === 'vault' && !windows.vault.isMinimized,
      badge: `${documents.length} files`,
    },
  ];

  const windowNames: Record<string, string> = {
    workflow3d: '3D Strategic Workflow Simulator (NAS Server-Side Pipeline)',
    dossier: `Clinical Case: ${selectedCase.caseNumber} - ${selectedCase.title}`,
    matrix: `Contradiction Intelligence Matrix (${selectedCase.workingDiagnosis})`,
    terminal: 'UGOS Linux Shell (Server-Side Diagnostic Terminal)',
    hypotheses: 'Competing Renal Diagnostic Hypotheses',
    vault: 'UGREEN AI NAS File Vault',
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0e17] text-slate-100 font-sans select-none flex flex-col justify-between">
      {/* Dynamic Cybernetic/Clinical Background Grid */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.25),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      {/* Top macOS/Windows Hybrid Menu Bar */}
      <MacTopBar
        currentCase={selectedCase}
        allCases={allCases}
        onSelectCase={(c) => setSelectedCase(c)}
        currentReport={currentReport}
        activeWindowName={windowNames[activeWindowId] || 'Desktop'}
      />

      {/* Desktop Workspace Notification Banner (if any) */}
      {auditError && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur-md">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{auditError}</span>
          <button
            type="button"
            onClick={() => setAuditError(null)}
            className="text-rose-400 hover:text-white underline font-medium ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* OS FLOATING WINDOWS                                               */}
      {/* ----------------------------------------------------------------- */}

      {/* Window 1: Three.js 3D Strategic NAS Data Retrieval Workflow */}
      <OsWindow
        id="workflow3d"
        title="Three.js 3D Strategic Workflow Simulator (NAS Server-Side Data Retrieval)"
        icon={<Boxes className="w-4 h-4 text-amber-500" />}
        isOpen={windows.workflow3d.isOpen}
        isMinimized={windows.workflow3d.isMinimized}
        isMaximized={windows.workflow3d.isMaximized}
        zIndex={windows.workflow3d.zIndex}
        onClose={() => closeWindow('workflow3d')}
        onMinimize={() => minimizeWindow('workflow3d')}
        onToggleMaximize={() => toggleMaximizeWindow('workflow3d')}
        onFocus={() => focusWindow('workflow3d')}
        defaultWidth="max-w-6xl"
        defaultHeight="h-[80vh]"
      >
        <div className="h-full min-h-[500px]">
          <NasWorkflowScene
            currentCase={selectedCase}
            currentReport={currentReport}
            onAuditTrigger={handleRunAudit}
            isAuditing={isAuditing}
          />
        </div>
      </OsWindow>

      {/* Window 2: Clinical Case Dossier */}
      <OsWindow
        id="dossier"
        title={`Clinical Case Dossier: ${selectedCase.caseNumber} - ${selectedCase.title}`}
        icon={<Stethoscope className="w-4 h-4 text-slate-700" />}
        isOpen={windows.dossier.isOpen}
        isMinimized={windows.dossier.isMinimized}
        isMaximized={windows.dossier.isMaximized}
        zIndex={windows.dossier.zIndex}
        onClose={() => closeWindow('dossier')}
        onMinimize={() => minimizeWindow('dossier')}
        onToggleMaximize={() => toggleMaximizeWindow('dossier')}
        onFocus={() => focusWindow('dossier')}
        defaultWidth="max-w-5xl"
        defaultHeight="h-[75vh]"
      >
        <CaseDossier
          selectedCase={selectedCase}
          allCases={allCases}
          onSelectCase={(c) => setSelectedCase(c)}
          onChallenge={handleRunAudit}
          isAuditing={isAuditing}
        />
      </OsWindow>

      {/* Window 3: Contradiction Intelligence Matrix */}
      <OsWindow
        id="matrix"
        title={`Contradiction Intelligence Matrix (${selectedCase.workingDiagnosis})`}
        icon={<ShieldAlert className="w-4 h-4 text-amber-600" />}
        isOpen={windows.matrix.isOpen}
        isMinimized={windows.matrix.isMinimized}
        isMaximized={windows.matrix.isMaximized}
        zIndex={windows.matrix.zIndex}
        onClose={() => closeWindow('matrix')}
        onMinimize={() => minimizeWindow('matrix')}
        onToggleMaximize={() => toggleMaximizeWindow('matrix')}
        onFocus={() => focusWindow('matrix')}
        defaultWidth="max-w-5xl"
        defaultHeight="h-[78vh]"
      >
        <ContradictionMatrix
          report={currentReport}
          documents={documents}
          onOpenDocument={(doc) => setActiveDocumentModal(doc)}
          onChallengeTab={() => focusWindow('hypotheses')}
        />
      </OsWindow>

      {/* Window 4: UGOS Linux NAS Shell Terminal */}
      <OsWindow
        id="terminal"
        title="UGOS-64 Server Shell (Clinical NAS Storage Inspector)"
        icon={<Terminal className="w-4 h-4 text-emerald-500" />}
        isOpen={windows.terminal.isOpen}
        isMinimized={windows.terminal.isMinimized}
        isMaximized={windows.terminal.isMaximized}
        zIndex={windows.terminal.zIndex}
        onClose={() => closeWindow('terminal')}
        onMinimize={() => minimizeWindow('terminal')}
        onToggleMaximize={() => toggleMaximizeWindow('terminal')}
        onFocus={() => focusWindow('terminal')}
        defaultWidth="max-w-4xl"
        defaultHeight="h-[65vh]"
      >
        <div className="h-full min-h-[420px]">
          <UgosTerminal
            documents={documents}
            currentCase={selectedCase}
            onRunAudit={handleRunAudit}
            isAuditing={isAuditing}
          />
        </div>
      </OsWindow>

      {/* Window 5: Competing Hypotheses & Clinical Inspector */}
      <OsWindow
        id="hypotheses"
        title="Alternative Competing Diagnoses & Research Console"
        icon={<GitCompare className="w-4 h-4 text-indigo-600" />}
        isOpen={windows.hypotheses.isOpen}
        isMinimized={windows.hypotheses.isMinimized}
        isMaximized={windows.hypotheses.isMaximized}
        zIndex={windows.hypotheses.zIndex}
        onClose={() => closeWindow('hypotheses')}
        onMinimize={() => minimizeWindow('hypotheses')}
        onToggleMaximize={() => toggleMaximizeWindow('hypotheses')}
        onFocus={() => focusWindow('hypotheses')}
        defaultWidth="max-w-5xl"
        defaultHeight="h-[75vh]"
      >
        <CompetingHypotheses
          report={currentReport}
          documents={documents}
          onOpenDocument={(doc) => setActiveDocumentModal(doc)}
          caseId={selectedCase.id}
        />
      </OsWindow>

      {/* Window 6: NAS Evidence Archive / File Vault */}
      <OsWindow
        id="vault"
        title="UGREEN AI NAS Document Storage (Unstructured File Explorer)"
        icon={<HardDrive className="w-4 h-4 text-indigo-500" />}
        isOpen={windows.vault.isOpen}
        isMinimized={windows.vault.isMinimized}
        isMaximized={windows.vault.isMaximized}
        zIndex={windows.vault.zIndex}
        onClose={() => closeWindow('vault')}
        onMinimize={() => minimizeWindow('vault')}
        onToggleMaximize={() => toggleMaximizeWindow('vault')}
        onFocus={() => focusWindow('vault')}
        defaultWidth="max-w-5xl"
        defaultHeight="h-[75vh]"
      >
        <NasEvidenceArchive
          documents={documents}
          onOpenDocument={(doc) => setActiveDocumentModal(doc)}
        />
      </OsWindow>

      {/* ----------------------------------------------------------------- */}
      {/* macOS BOTTOM BUBBLE NAVIGATION DOCK                              */}
      {/* ----------------------------------------------------------------- */}
      <MacBottomDock
        items={dockItems}
        onSelect={handleDockSelect}
        onAuditTrigger={handleRunAudit}
        isAuditing={isAuditing}
        onOpenExport={() => setIsExportModalOpen(true)}
        hasReport={!!currentReport}
      />

      {/* Full Document Inspector Modal */}
      <NasDocumentModal
        document={activeDocumentModal}
        onClose={() => setActiveDocumentModal(null)}
      />

      {/* Clean Dossier Export Modal */}
      {isExportModalOpen && currentReport && (
        <ReportExportModal
          report={currentReport}
          clinicalCase={selectedCase}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
    </div>
  );
}
