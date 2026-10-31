import React, { useState } from 'react';
import {
  GitCompare,
  CheckCircle,
  XCircle,
  HelpCircle,
  Send,
  Loader2,
  FileText,
  Sparkles,
} from 'lucide-react';
import { AlternativeHypothesis, ContradictionReport, NASDocument, FollowUpResponse } from '../types/clinical.ts';
import { InlineSourceCard } from './InlineSourceCard.tsx';

interface CompetingHypothesesProps {
  report: ContradictionReport | null;
  documents: NASDocument[];
  onOpenDocument: (doc: NASDocument) => void;
  caseId: string;
}

export const CompetingHypotheses: React.FC<CompetingHypothesesProps> = ({
  report,
  documents,
  onOpenDocument,
  caseId,
}) => {
  const [selectedHypothesis, setSelectedHypothesis] = useState<number>(0);
  const [followUpQuery, setFollowUpQuery] = useState('');
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const [followUpHistory, setFollowUpHistory] = useState<Array<{ query: string; response: FollowUpResponse }>>([]);

  if (!report || !report.competingHypotheses || report.competingHypotheses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs space-y-3">
        <GitCompare className="w-10 h-10 text-slate-300 mx-auto" />
        <h2 className="text-base font-semibold text-slate-800">
          No Competing Hypotheses Generated
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Run the Contradiction Audit on the selected case to evaluate alternative renal diagnoses grounded in the retrieved NAS literature.
        </p>
      </div>
    );
  }

  const hypotheses = report.competingHypotheses;
  const activeHypothesis = hypotheses[selectedHypothesis] || hypotheses[0];

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuery.trim() || isSubmittingQuery) return;

    setIsSubmittingQuery(true);
    try {
      const res = await fetch('/api/contra/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          followUpQuestion: followUpQuery,
          currentReport: report,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to query clinical challenge engine');
      }

      const data: FollowUpResponse = await res.json();
      setFollowUpHistory((prev) => [...prev, { query: followUpQuery, response: data }]);
      setFollowUpQuery('');
    } catch (err: any) {
      console.error('Follow-up error:', err);
    } finally {
      setIsSubmittingQuery(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-amber-700" />
          <h1 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Alternative Competing Hypotheses (Grounded in NAS Corpus)
          </h1>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          CONTRA evaluates competing renal etiologies without generating fabricated probability scores. Each hypothesis is compared against observed patient findings and cited literature to highlight what supports, what weakens, and what diagnostics remain unresolved.
        </p>

        {/* Hypotheses Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {hypotheses.map((h, idx) => (
            <button
              key={h.diseaseName}
              type="button"
              onClick={() => setSelectedHypothesis(idx)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                selectedHypothesis === idx
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              {h.diseaseName}
            </button>
          ))}
        </div>
      </div>

      {/* Active Hypothesis Detailed View */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Hypothesis #{selectedHypothesis + 1}
            </span>
            <h2 className="text-lg font-bold text-slate-900">{activeHypothesis.diseaseName}</h2>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 self-start sm:self-auto font-medium">
            {activeHypothesis.alternativeType.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>

        {/* Clinical Rationale */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Diagnostic Relevance & Rationale
          </span>
          <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
            {activeHypothesis.clinicalRationale}
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Supporting Findings */}
          <div className="p-4 bg-emerald-50/40 rounded-lg border border-emerald-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950 uppercase tracking-wider text-[11px]">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Findings Supporting {activeHypothesis.diseaseName}</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 text-[11.5px]">
              {activeHypothesis.supportingFindings.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weakening or Absent Findings */}
          <div className="p-4 bg-rose-50/40 rounded-lg border border-rose-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-rose-950 uppercase tracking-wider text-[11px]">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Weakening Features / Atypical Gaps</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 text-[11.5px]">
              {activeHypothesis.contradictoryOrAbsenceFindings.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">✗</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Required Diagnostic Workup */}
        <div className="p-4 bg-indigo-50/40 rounded-lg border border-indigo-100 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950 uppercase tracking-wider text-[11px]">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Definitive Testing Needed to Confirm or Refute</span>
          </div>
          <ul className="space-y-1 text-slate-700 text-[11.5px]">
            {activeHypothesis.requiredWorkupToConfirmOrRefute.map((w, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-mono">→</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cited NAS References */}
        {activeHypothesis.citedDocIds && activeHypothesis.citedDocIds.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Retrieved NAS Evidence & Citations
            </span>
            <div className="space-y-2">
              {activeHypothesis.citedDocIds.map((docId) => (
                <InlineSourceCard
                  key={docId}
                  sourceDocId={docId}
                  documents={documents}
                  onOpenDocument={onOpenDocument}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Clinical Inquiry Console */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Interactive Clinical Challenge Console
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          Pose targeted diagnostic questions to challenge the working diagnosis against the institutional NAS medical archive.
        </p>

        {/* Suggested Quick Prompts */}
        <div className="flex flex-wrap gap-2 text-[11px]">
          <button
            type="button"
            onClick={() =>
              setFollowUpQuery(
                `What biopsy findings would definitively differentiate ${activeHypothesis.diseaseName} from ${report.workingDiagnosis}?`
              )
            }
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors text-left"
          >
            "What biopsy findings would distinguish {activeHypothesis.diseaseName}?"
          </button>
          <button
            type="button"
            onClick={() =>
              setFollowUpQuery(
                'How does the presence of dysmorphic red blood cells affect the likelihood of hypertensive nephrosclerosis?'
              )
            }
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors text-left"
          >
            "How do dysmorphic RBCs affect this differential?"
          </button>
          <button
            type="button"
            onClick={() =>
              setFollowUpQuery(
                'What are the clinical hazards of delaying kidney biopsy in this presentation?'
              )
            }
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors text-left"
          >
            "What are the risks of delaying biopsy?"
          </button>
        </div>

        {/* Follow-up History Stream */}
        {followUpHistory.length > 0 && (
          <div className="space-y-4 pt-2">
            {followUpHistory.map((item, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                <div className="font-semibold text-slate-800">
                  <span className="text-amber-800 font-mono">Q: </span>
                  {item.query}
                </div>
                <div className="text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-100 whitespace-pre-wrap">
                  {item.response.answer}
                </div>

                {item.response.citations && item.response.citations.length > 0 && (
                  <div className="pt-1 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Citations:</span>
                    {item.response.citations.map((c, i) => (
                      <div key={i} className="text-[11px] text-slate-600 bg-amber-50/50 p-2 rounded border border-amber-200/50">
                        <strong className="text-slate-800">{c.title}: </strong>
                        <span className="italic">"{c.quote}"</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Query Input Box */}
        <form onSubmit={handleSendFollowUp} className="flex gap-2">
          <input
            type="text"
            value={followUpQuery}
            onChange={(e) => setFollowUpQuery(e.target.value)}
            placeholder="Type a clinical challenge question..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!followUpQuery.trim() || isSubmittingQuery}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 disabled:bg-slate-300 transition-colors shrink-0"
          >
            {isSubmittingQuery ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Query</span>
          </button>
        </form>
      </div>
    </div>
  );
};
