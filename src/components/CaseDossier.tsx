import React from 'react';
import {
  Activity,
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  Microscope,
  FileSpreadsheet,
  Stethoscope,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { ClinicalCase } from '../types/clinical.ts';

interface CaseDossierProps {
  selectedCase: ClinicalCase;
  allCases: ClinicalCase[];
  onSelectCase: (c: ClinicalCase) => void;
  onChallenge: () => void;
  isAuditing: boolean;
}

export const CaseDossier: React.FC<CaseDossierProps> = ({
  selectedCase,
  allCases,
  onSelectCase,
  onChallenge,
  isAuditing,
}) => {
  return (
    <div className="space-y-6">
      {/* Case Selector Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Synthetic Clinical Dilemma Library
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs font-bold text-amber-800">
                {selectedCase.caseNumber}
              </span>
              <span className="text-slate-300">·</span>
              <h1 className="text-base font-semibold text-slate-900">{selectedCase.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="case-select" className="text-xs text-slate-500 font-medium whitespace-nowrap">
              Switch Case:
            </label>
            <select
              id="case-select"
              value={selectedCase.id}
              onChange={(e) => {
                const found = allCases.find((c) => c.id === e.target.value);
                if (found) onSelectCase(found);
              }}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
            >
              {allCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber}: {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3">
          <span className="text-xs text-slate-400 font-medium mr-1">Case Tags:</span>
          {selectedCase.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Core Diagnostic Framing Grid: Working Diagnosis vs. The Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Working Hypothesis Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-slate-600" />
            <span>Presumptive Working Diagnosis (D)</span>
          </div>
          <div className="text-lg font-semibold text-slate-900">
            {selectedCase.workingDiagnosis}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
            <span className="font-medium text-slate-700">Initial Attending Rationale: </span>
            {selectedCase.workingDiagnosisRationale}
          </p>
        </div>

        {/* Clinical Question / Contradiction Target */}
        <div className="bg-amber-50/50 rounded-lg border border-amber-200/70 p-5 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Diagnostic Research Question</span>
          </div>
          <div className="text-sm font-medium text-amber-950 italic leading-snug">
            "{selectedCase.clinicalQuestion}"
          </div>
          <div className="pt-1 flex items-center justify-between text-xs text-amber-800">
            <span>Primary Focus: Diagnostic Disconfirmation</span>
            <button
              type="button"
              onClick={onChallenge}
              disabled={isAuditing}
              className="font-medium underline hover:text-amber-950 transition-colors"
            >
              Audit Evidence →
            </button>
          </div>
        </div>
      </div>

      {/* Patient Background & Vitals Strip */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-slate-600" />
            Patient Clinical Profile
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Age: {selectedCase.demographics.age} · Gender: {selectedCase.demographics.gender} · {selectedCase.demographics.ethnicity}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-400 uppercase text-[10px] font-mono block">Blood Pressure</span>
            <span className="text-sm font-mono font-bold text-slate-900">{selectedCase.vitals.bloodPressure}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-400 uppercase text-[10px] font-mono block">Current Serum Cr</span>
            <span className="text-sm font-mono font-bold text-amber-900">
              {selectedCase.laboratoryFindings.serumCreatinine}{' '}
              <span className="text-[10px] font-normal text-slate-500">mg/dL</span>
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-400 uppercase text-[10px] font-mono block">Estimated GFR</span>
            <span className="text-sm font-mono font-bold text-rose-800">
              {selectedCase.laboratoryFindings.eGFR}{' '}
              <span className="text-[10px] font-normal text-slate-500">mL/min/1.73m²</span>
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
            <span className="text-slate-400 uppercase text-[10px] font-mono block">24h Protein Excretion</span>
            <span className="text-sm font-mono font-bold text-indigo-900">
              {selectedCase.urinalysis.proteinQuantitative24h}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-700">
          <div>
            <span className="font-semibold text-slate-800">History of Present Illness: </span>
            <span className="leading-relaxed text-slate-600">{selectedCase.historyOfPresentIllness}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <span className="font-semibold text-slate-800 block mb-1">Past Medical History:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11.5px]">
                {selectedCase.pastMedicalHistory.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-semibold text-slate-800 block mb-1">Current Pharmacotherapy:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11.5px]">
                {selectedCase.currentMedications.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Longitudinal Renal Trajectory Table & Visualization */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-700" />
            Longitudinal Renal Function Trajectory
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            Baseline Cr: {selectedCase.laboratoryFindings.baselineCreatinine} mg/dL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px]">
                <th className="py-2 px-3">Timeline Point</th>
                <th className="py-2 px-3">Serum Creatinine</th>
                <th className="py-2 px-3">eGFR</th>
                <th className="py-2 px-3">24h Proteinuria</th>
                <th className="py-2 px-3">Blood Pressure</th>
                <th className="py-2 px-3 text-right">Clinical State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedCase.longitudinalTrends.map((t, idx) => {
                const isCurrent = idx === selectedCase.longitudinalTrends.length - 1;
                return (
                  <tr
                    key={t.date}
                    className={isCurrent ? 'bg-amber-50/40 font-semibold' : 'hover:bg-slate-50/50'}
                  >
                    <td className="py-2.5 px-3 flex items-center gap-1.5 font-sans">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {t.date}
                    </td>
                    <td className="py-2.5 px-3 tabular-nums text-slate-900">{t.serumCreatinine} mg/dL</td>
                    <td className="py-2.5 px-3 tabular-nums text-slate-900">{t.eGFR} mL/min</td>
                    <td className="py-2.5 px-3 tabular-nums text-indigo-900">{t.proteinuriaGrams24h} g/day</td>
                    <td className="py-2.5 px-3 tabular-nums text-slate-700">
                      {t.systolicBp}/{t.diastolicBp}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isCurrent ? (
                        <span className="text-[10px] text-amber-900 font-medium">Evaluation Point</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-sans">Historical</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Urinalysis & Microscopy vs. Laboratory Diagnostics Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Urinalysis Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Microscope className="w-4 h-4 text-indigo-600" />
              Urinalysis & Urine Sediment
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Brightfield & Phase-Contrast</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Appearance & Color:</span>
              <span className="font-semibold text-slate-800">{selectedCase.urinalysis.appearance}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Protein Dipstick / 24h:</span>
              <span className="font-mono font-bold text-indigo-900">
                {selectedCase.urinalysis.proteinDipstick} ({selectedCase.urinalysis.proteinQuantitative24h})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Occult Blood / RBCs:</span>
              <span className="font-mono font-bold text-rose-900">
                {selectedCase.urinalysis.bloodDipstick} · {selectedCase.urinalysis.rbcPerHpf}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Dysmorphic RBCs (Acanthocytes):</span>
              <span className="font-mono font-bold text-amber-900">
                {selectedCase.urinalysis.dysmorphicRbcPercent !== undefined
                  ? `${selectedCase.urinalysis.dysmorphicRbcPercent}% (Glomerular Origin)`
                  : 'Absent / Not noted'}
              </span>
            </div>
            <div className="pt-1">
              <span className="text-slate-500 block mb-1">Microscopic Casts:</span>
              <div className="flex flex-wrap gap-1">
                {selectedCase.urinalysis.casts.map((cast, i) => (
                  <span
                    key={i}
                    className="text-[11px] bg-indigo-50 text-indigo-900 font-mono px-2 py-0.5 rounded border border-indigo-100"
                  >
                    {cast}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Serology & Laboratory Panel */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Serology & Immunological Panel
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Immunoassays</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-sans">Serum Albumin:</span>
              <span className="font-bold text-slate-800">{selectedCase.laboratoryFindings.serumAlbumin} g/dL</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-sans">Complement C3:</span>
              <span className="text-slate-800">{selectedCase.laboratoryFindings.complementC3 || 'Not ordered'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-sans">Complement C4:</span>
              <span className="text-slate-800">{selectedCase.laboratoryFindings.complementC4 || 'Not ordered'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-sans">ANA Titer:</span>
              <span className="text-slate-800">{selectedCase.laboratoryFindings.anaTiter || 'Not ordered'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-sans">ANCA (PR3 / MPO):</span>
              <span className="text-slate-800">{selectedCase.laboratoryFindings.ancaSerology || 'Not ordered'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-sans">Anti-PLA2R:</span>
              <span className="text-slate-800 font-bold text-indigo-900">
                {selectedCase.laboratoryFindings.antiPla2r || 'Not ordered'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Imaging & Biopsy Status */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Renal Imaging & Biopsy Documentation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-1">
              {selectedCase.imaging.modality}:
            </span>
            <p className="text-slate-600 leading-relaxed">{selectedCase.imaging.findings}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-100">
            <span className="font-semibold text-slate-800 block mb-1">
              Percutaneous Renal Biopsy Status:
            </span>
            <p className="text-slate-600 leading-relaxed">{selectedCase.biopsy.findings}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
