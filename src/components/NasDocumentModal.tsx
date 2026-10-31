import React, { useState } from 'react';
import { X, FileText, Folder, Calendar, ShieldCheck, Search, Copy, Check } from 'lucide-react';
import { NASDocument } from '../types/clinical.ts';

interface NasDocumentModalProps {
  document: NASDocument | null;
  onClose: () => void;
}

export const NasDocumentModal: React.FC<NasDocumentModalProps> = ({ document, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `TITLE: ${document.title}\nPATH: ${document.folderPath}\nSOURCE: ${document.authorOrSource} (${document.year})\n\n${document.fullExcerpt}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Highlighting search terms
  const renderHighlightedContent = (text: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery.trim()})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 text-amber-950 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="space-y-1.5 pr-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1 text-amber-800">
                <Folder className="w-3.5 h-3.5" />
                {document.folderPath}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {document.year}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                {document.evidenceLevel}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 leading-snug">{document.title}</h2>
            <p className="text-xs text-slate-600 font-medium">{document.authorOrSource}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close document modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50/80 border-b border-slate-100 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms in document..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
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
                <span>Copy Excerpt</span>
              </>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700">
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-2">
              Executive Abstract
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100">
              {renderHighlightedContent(document.abstract)}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              Full Text Extract & Diagnostic Criteria
            </h3>
            <div className="p-4 bg-white rounded-md border border-slate-200 font-serif leading-relaxed text-[13.5px] whitespace-pre-wrap text-slate-800 shadow-2xs">
              {renderHighlightedContent(document.fullExcerpt)}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Indexed Disease Categories:</span>
            {document.relevantDiseases.map((disease) => (
              <span
                key={disease}
                className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60"
              >
                {disease}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
          <span className="font-mono text-[11px]">Source Provenance: UGREEN AI NAS Index / UGOS-64</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
