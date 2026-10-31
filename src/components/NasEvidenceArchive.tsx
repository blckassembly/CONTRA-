import React, { useState } from 'react';
import {
  HardDrive,
  Folder,
  Search,
  FileText,
  ShieldCheck,
  Tag,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { NASDocument } from '../types/clinical.ts';

interface NasEvidenceArchiveProps {
  documents: NASDocument[];
  onOpenDocument: (doc: NASDocument) => void;
}

export const NasEvidenceArchive: React.FC<NasEvidenceArchiveProps> = ({
  documents,
  onOpenDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'all' || doc.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.abstract.toLowerCase().includes(q) ||
      doc.folderPath.toLowerCase().includes(q) ||
      doc.authorOrSource.toLowerCase().includes(q) ||
      doc.keyKeywords.some((k) => k.toLowerCase().includes(q)) ||
      doc.relevantDiseases.some((r) => r.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* NAS Architecture Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
                <span>UGREEN AI NAS Storage</span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold">UGOS Integrated</span>
              </div>
              <h1 className="text-base font-bold text-slate-900">
                Institutional Medical Reference Archive
              </h1>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded border border-slate-100 self-start sm:self-auto">
            {documents.length} Authoritative Documents Indexed
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          CONTRA searches unstructured institutional documents without requiring manual file reorganization (PRD §5.1). Reference materials are retrieved across separate directories based on clinical concepts, diagnostic criteria, and pathological features.
        </p>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by keyword (e.g. 'PLA2R', 'acanthocytes', 'FSGS', 'steroids')..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-xs shrink-0">
            {[
              { id: 'all', label: 'All Folders' },
              { id: 'guideline', label: 'Guidelines (KDIGO/AHA)' },
              { id: 'pathology_atlas', label: 'Pathology Atlases' },
              { id: 'peer_reviewed_study', label: 'Peer-Reviewed Studies' },
              { id: 'institutional_case', label: 'Grand Rounds / Cases' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap text-[11.5px] font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No NAS reference documents matched your search query.
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-amber-800 truncate max-w-[260px]">
                    <Folder className="w-3 h-3 shrink-0" />
                    {doc.folderPath}
                  </span>
                  <span className="shrink-0">{doc.year}</span>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                  {doc.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{doc.evidenceLevel}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                  {doc.abstract}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1 max-w-[70%]">
                  {doc.relevantDiseases.slice(0, 2).map((d) => (
                    <span
                      key={d}
                      className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                    >
                      {d}
                    </span>
                  ))}
                  {doc.relevantDiseases.length > 2 && (
                    <span className="text-[10px] text-slate-400">
                      +{doc.relevantDiseases.length - 2} more
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onOpenDocument(doc)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors"
                >
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
