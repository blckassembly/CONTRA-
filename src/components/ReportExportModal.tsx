import React, { useState } from 'react';
import { X, Printer, Copy, Check, ShieldAlert, FileText } from 'lucide-react';
import { ContradictionReport, ClinicalCase } from '../types/clinical.ts';

interface ReportExportModalProps {
  report: ContradictionReport | null;
  clinicalCase: ClinicalCase;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  report,
  clinicalCase,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const generateMarkdown = () => {
    return `
# CONTRA CLINICAL CONTRADICTION REPORT
**Case ID:** ${clinicalCase.caseNumber} - ${clinicalCase.title}
**Date & Time:** ${new Date(report.timestamp).toLocaleString()}
**Engine:** ${report.auditEngine}
**Stated Working Diagnosis:** ${report.workingDiagnosis}
**Discrepancy Severity:** ${report.contradictionAlertLevel}

---

## 1. EXECUTIVE CLINICAL CONTRADICTION SUMMARY
${report.executiveSummary}

---

## 2. EVIDENCE CLASSIFICATION MATRIX

### A. CONTRADICTORY FINDINGS (Inconsistent with ${report.workingDiagnosis})
${report.evidenceClassification.contradictory
  .map(
    (c) => `- **${c.findingTitle}** (${c.severity.toUpperCase()}):
  - Observed in Case: ${c.observedCaseValue}
  - Expected: ${c.expectedUnderWorkingDiagnosis}
  - Significance: ${c.contradictionSignificance}
  - Source Reference: ${c.citationTitle || c.folderPath || 'NAS Reference'}`
  )
  .join('\n')}

### B. SUPPORTING FINDINGS (Consistent with ${report.workingDiagnosis})
${report.evidenceClassification.supporting
  .map(
    (s) => `- **${s.findingTitle}**: Observed: ${s.observedCaseValue}. Consistency: ${s.consistencyRationale}`
  )
  .join('\n')}

### C. MISSING WORKUP & DIAGNOSTIC GAPS
${report.evidenceClassification.missing
  .map((m) => `- **${m.testName}**: Purpose: ${m.clinicalPurpose} | Impact: ${m.diagnosticImpact}`)
  .join('\n')}

### D. INCONCLUSIVE FINDINGS
${report.evidenceClassification.inconclusive
  .map((i) => `- **${i.findingTitle}**: ${i.observedValue} (Reason: ${i.ambiguityReason})`)
  .join('\n')}

---

## 3. COMPETING DIAGNOSTIC HYPOTHESES
${report.competingHypotheses
  .map(
    (h) => `### ${h.diseaseName} (${h.alternativeType})
- **Rationale:** ${h.clinicalRationale}
- **Supporting Features:** ${h.supportingFindings.join('; ')}
- **Atypical/Missing Features:** ${h.contradictoryOrAbsenceFindings.join('; ')}
- **Required Workup:** ${h.requiredWorkupToConfirmOrRefute.join('; ')}`
  )
  .join('\n\n')}

---

## 4. CLINICAL SAFETY & GOVERNANCE NOTICE
${report.safetyDisclaimer}
    `.trim();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Clinical Contradiction Dossier Export
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                {clinicalCase.caseNumber} · {report.contradictionAlertLevel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable / Readable Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-xs text-slate-800 leading-relaxed font-sans">
          {/* Header Block */}
          <div className="border-b border-slate-200 pb-4 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>CONTRA · UGREEN AI NAS CLINICAL INTELLIGENCE</span>
              <span>{new Date(report.timestamp).toLocaleDateString()}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 pt-1">
              Clinical Contradiction Review: {clinicalCase.title}
            </h1>
            <div className="text-slate-600 font-mono text-[11px]">
              Working Diagnosis: <strong>{report.workingDiagnosis}</strong> | Alert: <strong>{report.contradictionAlertLevel}</strong>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-1">
              1. Executive Diagnostic Challenge
            </h3>
            <p className="bg-slate-50 p-3.5 rounded border border-slate-200 text-slate-700 whitespace-pre-line leading-relaxed">
              {report.executiveSummary}
            </p>
          </div>

          {/* Section 2: Contradictions */}
          <div className="space-y-2">
            <h3 className="font-bold text-amber-900 text-xs uppercase tracking-wider border-b border-amber-200 pb-1">
              2. Documented Contradictions & Discrepancies ({report.evidenceClassification.contradictory.length})
            </h3>
            <div className="space-y-2">
              {report.evidenceClassification.contradictory.map((c) => (
                <div key={c.id} className="p-3 bg-amber-50/40 rounded border border-amber-200 text-slate-800">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{c.findingTitle}</span>
                    <span className="font-mono text-[10px] uppercase text-amber-800">{c.severity}</span>
                  </div>
                  <div className="mt-1 text-slate-600">
                    <strong>Observed in Patient:</strong> {c.observedCaseValue} ·{' '}
                    <strong>Expected:</strong> {c.expectedUnderWorkingDiagnosis}
                  </div>
                  <div className="mt-1 text-amber-950 font-medium">
                    {c.contradictionSignificance}
                  </div>
                  {c.citationTitle && (
                    <div className="mt-1 text-[11px] text-slate-500 font-mono">
                      Source: {c.citationTitle} ({c.folderPath || 'NAS Archive'})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Competing Hypotheses */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-1">
              3. Alternative Competing Hypotheses
            </h3>
            <div className="space-y-2">
              {report.competingHypotheses.map((h) => (
                <div key={h.diseaseName} className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm">
                    {h.diseaseName} <span className="text-xs font-normal text-slate-500">({h.alternativeType})</span>
                  </div>
                  <p className="mt-1 text-slate-700">{h.clinicalRationale}</p>
                  <div className="mt-1.5 text-slate-600">
                    <span className="text-emerald-700 font-medium">Supporting:</span> {h.supportingFindings.join('; ')}
                  </div>
                  <div className="mt-1 text-slate-600">
                    <span className="text-indigo-700 font-medium">Definitive Tests Needed:</span> {h.requiredWorkupToConfirmOrRefute.join('; ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-4 bg-slate-100 rounded-lg border border-slate-200 text-slate-600 text-[11px] leading-relaxed flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block mb-0.5">Clinical Safety & Non-Diagnostic Notice:</strong>
              {report.safetyDisclaimer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
