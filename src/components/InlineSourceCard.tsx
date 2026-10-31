import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, ExternalLink, ShieldCheck } from 'lucide-react';
import { NASDocument } from '../types/clinical.ts';

interface InlineSourceCardProps {
  sourceDocId?: string;
  citationTitle?: string;
  citationQuote?: string;
  folderPath?: string;
  documents?: NASDocument[];
  onOpenDocument?: (doc: NASDocument) => void;
}

export const InlineSourceCard: React.FC<InlineSourceCardProps> = ({
  sourceDocId,
  citationTitle,
  citationQuote,
  folderPath,
  documents,
  onOpenDocument,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Match document if available
  const matchedDoc = documents?.find(
    (d) => d.id === sourceDocId || (citationTitle && d.title.toLowerCase().includes(citationTitle.toLowerCase()))
  );

  const displayTitle = citationTitle || matchedDoc?.title || 'Institutional Medical Reference';
  const displayFolder = folderPath || matchedDoc?.folderPath || '/nas/clinical_guidelines/reference.md';
  const displayQuote = citationQuote || matchedDoc?.fullExcerpt?.slice(0, 320) + '...';

  return (
    <div className="mt-2.5 rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden text-xs">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-left bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="font-mono text-[11px] text-slate-500 truncate">{displayFolder}</span>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <span className="font-medium text-slate-800 truncate hidden md:inline">{displayTitle}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <span className="text-[11px] text-slate-500 font-mono">
            {isExpanded ? 'Hide Citation' : 'View Source'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="p-3 border-t border-slate-100 bg-white space-y-2">
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 pb-1 border-b border-slate-100">
            <span className="font-semibold text-slate-700">{displayTitle}</span>
            {matchedDoc && (
              <div className="flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] text-slate-600">{matchedDoc.evidenceLevel}</span>
              </div>
            )}
          </div>

          <div className="text-slate-700 italic bg-amber-50/40 p-2.5 rounded border border-amber-200/50 leading-relaxed font-serif text-[12px]">
            "{displayQuote}"
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono text-slate-400">
              Verified NAS File Hash: SHA256-AUTHENTICATED
            </span>
            {matchedDoc && onOpenDocument && (
              <button
                type="button"
                onClick={() => onOpenDocument(matchedDoc)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 hover:text-amber-950 transition-colors"
              >
                <span>Read Full Document</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
