import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  ShieldAlert,
  FileQuestion,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { ContradictionReport, NASDocument } from '../types/clinical.ts';
import { InlineSourceCard } from './InlineSourceCard.tsx';

interface ContradictionMatrixProps {
  report: ContradictionReport | null;
  documents: NASDocument[];
  onOpenDocument: (doc: NASDocument) => void;
  onChallengeTab: () => void;
}

export const ContradictionMatrix: React.FC<ContradictionMatrixProps> = ({
  report,
  documents,
  onOpenDocument,
  onChallengeTab,
}) => {
  if (!report) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-base font-semibold text-slate-900">
            No Contradiction Audit Run Yet
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Click <strong className="text-slate-800">"Challenge Diagnosis"</strong> in the top bar to analyze the patient's findings against the unstructured NAS medical reference archive.
          </p>
        </div>
      </div>
    );
  }

  const { contradictory, supporting, missing, inconclusive } = report.evidenceClassification;

  return (
    <div className="space-y-6">
      {/* Executive Contradiction Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Diagnostic Challenge Assessment
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-mono text-slate-500">
                {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-1">
              Challenging: <span className="text-amber-900">{report.workingDiagnosis}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                report.contradictionAlertLevel === 'High Discrepancy'
                  ? 'bg-amber-100/80 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-slate-800 border border-slate-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-700" />
              <span>{report.contradictionAlertLevel}</span>
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2 text-xs leading-relaxed text-slate-700">
          <h2 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
            Clinical Contradiction Findings
          </h2>
          <p className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 text-slate-700 whitespace-pre-line leading-relaxed">
            {report.executiveSummary}
          </p>
        </div>

        {/* Key Diagnostic Dilemmas */}
        {report.diagnosticDilemmas && report.diagnosticDilemmas.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Critical Unresolved Clinical Questions
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {report.diagnosticDilemmas.map((dilemma, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 p-2 bg-amber-50/40 rounded border border-amber-100 text-amber-950 font-medium"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{dilemma}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 4-QUADRANT EVIDENCE MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QUADRANT 1: CONTRADICTORY EVIDENCE (Restrained Metallic Gold / Amber Accent) */}
        <div className="bg-amber-50/30 rounded-xl border-2 border-amber-300/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                1. Contradictory Evidence ({contradictory.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-amber-800 font-medium">
              Findings Inconsistent with Working Diagnosis
            </span>
          </div>

          <div className="space-y-3.5">
            {contradictory.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3">No direct contradictory evidence identified.</p>
            ) : (
              contradictory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-lg border border-amber-200/90 shadow-2xs space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 text-[13px]">{item.findingTitle}</h3>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        item.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px] bg-slate-50 p-2 rounded border border-slate-100">
                    <div>
                      <span className="text-slate-400 block font-mono text-[10px]">OBSERVED IN PATIENT</span>
                      <span className="font-semibold text-slate-800">{item.observedCaseValue}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono text-[10px]">EXPECTED IN {report.workingDiagnosis}</span>
                      <span className="text-slate-600">{item.expectedUnderWorkingDiagnosis}</span>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed text-[12px]">
                    <span className="font-medium text-amber-900">Clinical Discrepancy: </span>
                    {item.contradictionSignificance}
                  </p>

                  {/* Inline Expandable Source Card */}
                  <InlineSourceCard
                    sourceDocId={item.sourceDocId}
                    citationTitle={item.citationTitle}
                    citationQuote={item.citationQuote}
                    folderPath={item.folderPath}
                    documents={documents}
                    onOpenDocument={onOpenDocument}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* QUADRANT 2: SUPPORTING EVIDENCE */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Supporting Evidence ({supporting.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Consistent Features</span>
          </div>

          <div className="space-y-3">
            {supporting.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3">No supporting findings identified.</p>
            ) : (
              supporting.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/80 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">{item.findingTitle}</h3>
                    <span className="font-mono text-[10px] text-slate-400">{item.observedCaseValue}</span>
                  </div>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    {item.consistencyRationale}
                  </p>
                  {item.citationQuote && (
                    <InlineSourceCard
                      sourceDocId={item.sourceDocId}
                      citationQuote={item.citationQuote}
                      documents={documents}
                      onOpenDocument={onOpenDocument}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* QUADRANT 3: MISSING WORKUP (Diagnostic Information Gaps) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Missing Workup & Evidence Gaps ({missing.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Required for Resolution</span>
          </div>

          <div className="space-y-3">
            {missing.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3">No critical missing workup identified.</p>
            ) : (
              missing.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-indigo-50/30 rounded-lg border border-indigo-100 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-indigo-950">{item.testName}</h3>
                    {item.referencedGuideline && (
                      <span className="text-[10px] font-mono text-indigo-700">
                        {item.referencedGuideline}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 text-[11.5px]">
                    <span className="font-medium text-slate-900">Clinical Purpose: </span>
                    {item.clinicalPurpose}
                  </p>
                  <p className="text-indigo-900 font-medium text-[11.5px]">
                    <span className="text-indigo-700">Impact: </span>
                    {item.diagnosticImpact}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* QUADRANT 4: INCONCLUSIVE FINDINGS */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                4. Inconclusive Findings ({inconclusive.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Non-Determining Features</span>
          </div>

          <div className="space-y-3">
            {inconclusive.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3">No indeterminate findings flagged.</p>
            ) : (
              inconclusive.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">{item.findingTitle}</h3>
                    <span className="text-[10px] font-mono text-slate-500">{item.observedValue}</span>
                  </div>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    <span className="font-medium text-slate-700">Ambiguity Reason: </span>
                    {item.ambiguityReason}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recommended Clinical Inquiries Action Strip */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider text-amber-400 font-mono">
            Next Research Step
          </span>
          <p className="text-xs text-slate-300">
            Review alternative competing hypotheses or submit follow-up clinical inquiries to probe specific biopsy indications.
          </p>
        </div>
        <button
          type="button"
          onClick={onChallengeTab}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white text-xs font-medium rounded-md transition-colors whitespace-nowrap shadow-xs"
        >
          <span>Explore Competing Hypotheses</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
