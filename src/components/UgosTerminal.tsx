import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ShieldCheck, HardDrive, Cpu, Play } from 'lucide-react';
import { NASDocument, ClinicalCase } from '../types/clinical.ts';

interface UgosTerminalProps {
  documents: NASDocument[];
  currentCase: ClinicalCase;
  onRunAudit: () => void;
  isAuditing: boolean;
}

export const UgosTerminal: React.FC<UgosTerminalProps> = ({
  documents,
  currentCase,
  onRunAudit,
  isAuditing,
}) => {
  const [history, setHistory] = useState<Array<{ command: string; output: string | React.ReactNode }>>([
    {
      command: 'systemctl status ugos-contra-daemon',
      output: (
        <div className="space-y-1 text-emerald-400">
          <div>● ugos-contra-daemon.service - CONTRA Clinical Intelligence Retrieval Daemon</div>
          <div className="text-slate-400">   Loaded: loaded (/lib/systemd/system/ugos-contra-daemon.service; enabled)</div>
          <div className="text-emerald-300">   Active: active (running) since Sat 2026-10-31 09:32:45 UTC</div>
          <div className="text-slate-400">   Server: UGREEN AI NAS (UGOS-64, Quad-Core N100, 32GB DDR5, RAID-5 ZFS)</div>
          <div className="text-slate-300">   Corpus: 18 Authorized Institutional Documents Indexed across 4 Disorganized Directories</div>
        </div>
      ),
    },
    {
      command: 'contra --version',
      output: 'CONTRA v1.0.4-ugos (Clinical Contradiction Search & Reasoning Engine)',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    let output: string | React.ReactNode = '';

    const lower = cmd.toLowerCase();
    if (lower === 'help' || lower === '?') {
      output = (
        <div className="space-y-1 text-slate-300">
          <div className="text-amber-400 font-bold">CONTRA UGOS Terminal Commands:</div>
          <div>  <span className="text-emerald-400">ls /nas/storage</span>         - List unstructured medical reference files on NAS</div>
          <div>  <span className="text-emerald-400">contra audit</span>              - Execute live diagnostic contradiction audit on active case</div>
          <div>  <span className="text-emerald-400">grep &lt;term&gt;</span>               - Search medical references for clinical concepts (e.g. grep proteinuria)</div>
          <div>  <span className="text-emerald-400">status</span>                    - Inspect NAS RAID volume and Gemini API proxy</div>
          <div>  <span className="text-emerald-400">case</span>                      - Inspect active clinical patient parameters</div>
          <div>  <span className="text-emerald-400">clear</span>                     - Clear terminal console</div>
        </div>
      );
    } else if (lower.startsWith('ls')) {
      output = (
        <div className="space-y-1 text-slate-300">
          <div className="text-slate-500 font-mono">drwxr-xr-x 6 ugos ugos 4096 Oct 31 /nas/storage/</div>
          {documents.map((d) => (
            <div key={d.id} className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-slate-500">-rw-r--r-- 1 ugos ugos 124K</span>
              <span className="text-amber-300">{d.folderPath}</span>
              <span className="text-slate-500">({d.evidenceLevel})</span>
            </div>
          ))}
        </div>
      );
    } else if (lower.startsWith('contra audit') || lower === 'audit') {
      onRunAudit();
      output = (
        <div className="text-amber-300 font-mono">
          [CONTRA-DAEMON] Dispatched contradiction challenge for case {currentCase.caseNumber} ("{currentCase.workingDiagnosis}")...
          <br />Scanning NAS references via Gemini 3.8 Flash pipeline... Check Contradiction Matrix window for live output.
        </div>
      );
    } else if (lower.startsWith('grep')) {
      const term = cmd.replace(/^grep\s*/i, '').replace(/["']/g, '').trim().toLowerCase();
      if (!term) {
        output = 'Usage: grep <search_term>';
      } else {
        const matches = documents.filter(
          (d) =>
            d.title.toLowerCase().includes(term) ||
            d.fullExcerpt.toLowerCase().includes(term) ||
            d.keyKeywords.some((k) => k.toLowerCase().includes(term))
        );
        output = (
          <div className="space-y-1">
            <div className="text-slate-400">Found {matches.length} matches for "{term}":</div>
            {matches.map((m) => (
              <div key={m.id} className="text-xs font-mono text-emerald-300">
                <span className="text-amber-400">{m.folderPath}: </span>
                <span>{m.title}</span>
              </div>
            ))}
          </div>
        );
      }
    } else if (lower === 'status') {
      output = (
        <div className="space-y-1 text-xs font-mono text-slate-300">
          <div>[STORAGE] RAID-5 (4x 4TB NVMe SSD): 14.8TB / 16.0TB Free (92%)</div>
          <div>[MEMORY] 32GB DDR5 ECC: 4.8GB in use (15%)</div>
          <div>[REASONING] Google Gemini 3.8 Flash Server Proxy: ONLINE / Low-Latency Thinking Mode</div>
          <div>[CASE] Active: {currentCase.caseNumber} ({currentCase.title})</div>
        </div>
      );
    } else if (lower === 'case') {
      output = (
        <div className="space-y-1 text-xs font-mono text-slate-300">
          <div className="text-amber-400 font-bold">{currentCase.caseNumber}: {currentCase.title}</div>
          <div>Working Diagnosis: {currentCase.workingDiagnosis}</div>
          <div>Vitals: {currentCase.vitals.bloodPressure} | Cr: {currentCase.laboratoryFindings.serumCreatinine} mg/dL | Proteinuria: {currentCase.urinalysis.proteinQuantitative24h}</div>
          <div>Sediment: {currentCase.urinalysis.casts.join(', ')} ({currentCase.urinalysis.dysmorphicRbcPercent}% acanthocytes)</div>
        </div>
      );
    } else if (lower === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else {
      output = `ugos-sh: command not found: ${cmd}. Type "help" for available clinical commands.`;
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
    setInputVal('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0c1017] text-slate-200 font-mono text-xs rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold text-slate-200">ugos@clinical-nas:~ (bash / UGOS-64)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400">● NAS DAEMON ACTIVE</span>
          <span className="text-slate-500">UTF-8</span>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono leading-relaxed select-text">
        <div className="text-slate-500 text-[11px]">
          CONTRA Clinical Contradiction Shell v1.0.4. Type <span className="text-amber-400">"help"</span> for available commands, or <span className="text-amber-400">"contra audit"</span> to challenge diagnosis.
        </div>

        {history.map((h, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-emerald-400 font-bold">ugos@clinical-nas:~$</span>
              <span className="text-slate-100">{h.command}</span>
            </div>
            <div className="pl-4 text-slate-300">{h.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Command Input Prompt */}
      <form onSubmit={handleCommand} className="flex items-center px-4 py-2.5 bg-[#161b22] border-t border-slate-800 gap-2">
        <span className="text-emerald-400 font-bold shrink-0">ugos@clinical-nas:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type command (e.g. 'contra audit', 'ls /nas/storage', 'grep acanthocytes', 'help')..."
          className="flex-1 bg-transparent text-slate-100 focus:outline-hidden font-mono text-xs placeholder:text-slate-600"
          autoFocus
        />
        <button
          type="submit"
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-sans font-medium transition-colors"
        >
          Execute
        </button>
      </form>
    </div>
  );
};
