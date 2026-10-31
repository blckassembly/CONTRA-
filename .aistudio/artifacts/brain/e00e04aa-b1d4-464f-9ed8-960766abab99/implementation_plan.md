# CONTRA — Clinical Contradiction Intelligence

> Don't Just Confirm the Diagnosis. Challenge It.

CONTRA is an AI-powered clinical contradiction intelligence system designed to challenge diagnostic assumptions by discovering evidence that supports, conflicts with, or fails to establish a working medical diagnosis. Focusing initially on complex nephrology (kidney disease), CONTRA searches unstructured institutional documents to surface overlooked clinical discrepancies, competing disease hypotheses, and missing workup data without making autonomous prescriptive decisions.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and user experience decisions have been aligned based on Phase 1 clarification:

- **Case Intake Source [CONFIRMED]**: Curated synthetic kidney disease cases only. CONTRA will provide 8 realistic, nuanced clinical scenarios (e.g., Hypertensive Nephrosclerosis vs. FSGS vs. IgA Nephropathy, Diabetic Nephropathy with atypical rapid decline, ANCA Vasculitis vs. Lupus Nephritis, Minimal Change Disease vs. Membranous Nephropathy) designed to test diagnostic edge cases.
- **Contradiction Reasoning Engine [CONFIRMED]**: Live Gemini AI analysis only. Powered by `gemini-3.8-flash` on the server side using the modern `@google/genai` SDK with strict clinical prompting and structured JSON schemas to prevent hallucinated disease probabilities or fabricated patient facts.
- **Evidence & Citation Inspection [CONFIRMED]**: Inline expandable source cards directly inside the contradiction report. Clinicians can click into any finding or alternative hypothesis to instantly inspect verbatim document excerpts, NAS file paths, study authors, and diagnostic criteria without leaving the review stream.

---

## 1. Overview & Core Concept

### What It Does
CONTRA inverts the traditional medical search paradigm. Rather than asking "what matches this diagnosis?", it asks:
**"Given what we currently believe this patient has, what evidence could make that diagnosis incomplete or incorrect?"**

The system processes synthetic patient records against a simulated Network-Attached Storage (NAS) corpus of clinical guidelines (KDIGO, ASN), pathology atlases, and peer-reviewed nephrology studies. It systematically extracts findings, classifies them into four clinical buckets (**Supporting**, **Contradictory**, **Missing**, **Inconclusive**), and compares competing renal hypotheses.

### Target Audience & Persona
- **Nephrologists & Clinical Specialists**: Investigating unexpected disease trajectories, atypical laboratory findings, or rapid eGFR decline.
- **Clinical Researchers & Safety Teams**: Conducting diagnostic quality reviews, evaluating cognitive confirmation bias, and examining institutional knowledge.

### Key Value
- **Mitigating Confirmation Bias**: Explicitly searches for disconfirming signals that conventional diagnostic retrieval tools ignore.
- **Traceable Provenance**: Every contradiction points to an accessible NAS reference document with exact section and quote.
- **Preserved Clinician Autonomy**: CONTRA never dictates a prescription or declares definitive misdiagnosis; it poses critical research questions for qualified clinician review.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme
Following the universal design principles and clinical design reference:
- **Canvas (60%)**: Pristine clinical white (`#FFFFFF`) with ultra-light lab slate tint (`#F8FAFC`).
- **Structural Surfaces (30%)**: Subdued slate panels (`#F1F5F9`), crisp 1px hairline borders (`#E2E8F0`), and dark graphite typography (`#0F172A` / `#334155`).
- **Review Accent (10%)**: Restrained metallic gold/amber (`#D97706` / `#B45309`) strictly reserved for flagged contradictions and findings requiring urgent clinical review (never for decorative pills or scorecards).
- **Zero-Pill Discipline**: Metadata displayed as unboxed clean text separated by typographic bullets (`·` or `/`).

### Top Bar Contract
Adhering strictly to the one-row, three-zone contract:
```
[CONTRA · Clinical Contradiction Intelligence]  —  [Case Dossier   Evidence Library   Contradiction Matrix   Alternative Hypotheses]  —  [Run Contradiction Audit]
```

### Key User Flows & Screen Layout

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: CONTRA · Clinical Contradiction Intelligence  —  Cases · Evidence · Matrix  —  [Audit Case]    │
├──────────────────────────────────────────────────────┬─────────────────────────────────────────────────┤
│ LEFT: CLINICAL CASE DOSSIER                          │ RIGHT: CONTRADICTION INTELLIGENCE REPORT         │
│                                                      │                                                 │
│ Curated Case Selector:                               │ A. Working Diagnosis Assessment                 │
│ [ Case #04: Rapid eGFR Loss in "HTN Nephrosclerosis" ]│    Hypertensive Nephrosclerosis (Stated)        │
│                                                      │                                                 │
│ Patient Parameters:                                  │ B. Discrepancy & Contradiction Summary          │
│ • Age: 54yo male  • BP: 152/94 mmHg                  │    [!] 3 Critical Inconsistencies Detected      │
│ • Serum Creatinine: 2.8 mg/dL (Baseline 1.2 mg/dL)   │                                                 │
│ • Proteinuria: 4.2 g/day (Nephrotic-range)           │ C. 4-Quadrant Evidence Matrix                   │
│ • Urinalysis: Active dysmorphic RBCs & RBC casts     │    ┌──────────────────┬──────────────────┐      │
│ • Ultrasound: Bilateral normal/enlarged kidneys      │    │ SUPPORTING       │ CONTRADICTORY    │      │
│                                                      │    │ • Longstanding HTN│ • Nephrotic prot. │     │
│ Clinical Question:                                   │    │ • Absence of rash│ • RBC casts      │      │
│ "Is nephrotic-range proteinuria consistent with HTN   │    ├──────────────────┼──────────────────┤      │
│ nephrosclerosis, or does this indicate glomerular    │    │ MISSING          │ INCONCLUSIVE     │      │
│ disease?"                                            │    │ • Renal biopsy   │ • Mild ANA titer │      │
│                                                      │    │ • Serologies     │ • Complement C3/4│      │
│ NAS Retrieval Status:                                │    └──────────────────┴──────────────────┘      │
│ 24 Institutional Documents indexed across 4 folders  │                                                 │
│                                                      │ D. Alternative Competing Hypotheses             │
│ [ Challenge Diagnosis ] [ Reset ]                    │    • Focal Segmental Glomerulosclerosis (FSGS)  │
│                                                      │    • IgA Nephropathy with Crescentic Features   │
│                                                      │    • Membranous Nephropathy                     │
│                                                      │                                                 │
│                                                      │ E. Inline Traceable Source Cards (Expandable)   │
│                                                      │    ▼ KDIGO 2024 Glomerular Diseases Guideline   │
│                                                      │      "...proteinuria > 1.5 g/24h in hypertensive │
│                                                      │      patients strongly suggests secondary..."   │
│                                                      │      File: /nas/guidelines/kdigo_glomerular_2024│
│                                                      │                                                 │
│                                                      │ F. Clinical Follow-Up Research Prompt           │
│                                                      │    [ Ask follow-up question on this case... ]   │
└──────────────────────────────────────────────────────┴─────────────────────────────────────────────────┘
```

### Component Details
1. **Case Selector & Dossier**:
   - 8 deep synthetic clinical cases spanning hypertensive nephropathy, diabetic kidney disease, IgA nephropathy, membranous nephropathy, minimal change disease, lupus nephritis class IV, ANCA-associated glomerulonephritis, and renal artery stenosis.
   - Comprehensive clinical parameters: History of Present Illness (HPI), vitals, longitudinal renal trends (eGFR over 12 months), urinalysis with sediment microscopy, serology/immunology panels, and renal ultrasound.
2. **NAS Unstructured Document Explorer**:
   - Simulates institutional storage with real full-text medical documents across folders (`/nas/clinical_guidelines/`, `/nas/pathology_reports/`, `/nas/journal_archive/`, `/nas/internal_case_series/`).
   - Searchable and inspectable without needing manual categorization.
3. **Four-Quadrant Contradiction Matrix**:
   - **Supporting Findings**: Observed facts consistent with working hypothesis.
   - **Contradictory Findings**: Flags conflicts with expected clinical progression or diagnostic criteria (highlighted with restrained metallic gold badge).
   - **Missing Information**: Critical unperformed tests required to confirm or refute (e.g., PLA2R antibody, renal biopsy, serum protein electrophoresis).
   - **Inconclusive**: Non-specific findings that cannot differentiate competing diagnoses.
4. **Alternative Hypotheses Comparison**:
   - Evaluates 2–4 competing conditions.
   - Surfaces what supports it, what conflicts with it, what's missing, and cited references.
   - Strictly avoids fabricating probability scores (following PRD Principle §5.3 and §9).
5. **Inline Expandable Source Cards**:
   - Embedded directly beneath findings and hypotheses.
   - Displays exact quote, document title, publication/institution, file path, and retrieval relevancy.
6. **Follow-Up Clinical Inquiry Bar**:
   - Allows the clinician to ask follow-up questions to probe the evidence further (e.g. "What biopsy findings would definitively differentiate FSGS from hypertensive nephrosclerosis?").
7. **Report Export**:
   - One-click copy or print/PDF generation of the complete structured clinical contradiction report with disclaimer.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Live Gemini 3.8 Flash with Strict Structured Schemas
- **Approach**: Server-side invocation of `gemini-3.8-flash` via `@google/genai` with `ThinkingLevel.MEDIUM` and structured JSON schema for diagnostic contradiction classification.
- **Why**: Clinical contradiction requires nuanced medical reasoning. Structured schemas enforce strict output formatting (`supporting`, `contradictory`, `missing`, `inconclusive`, `alternative_hypotheses`, `inline_citations`, `unresolved_questions`).
- **Safety Safeguard**: System instructions explicitly enforce PRD §15: CONTRA must never declare a patient definitively misdiagnosed, never prescribe or modify medications, never fabricate numeric disease percentages, and always disclose missing evidence.

### Decision 2: Curated Synthetic Case Library with Built-in Medical Ground Truth
- **Approach**: 8 pre-authored, comprehensive synthetic nephrology cases containing subtle clinical traps (e.g. labeling a patient as hypertensive nephrosclerosis when 4.2g/day proteinuria and RBC casts clearly indicate glomerulopathy).
- **Why**: Allows instant, reproducible demonstration of CONTRA's core differentiator (surfacing disconfirming evidence) while guaranteeing zero protected health information (PHI) is processed.

### Decision 3: Express Backend Proxy with Server-Side Gemini API
- **Approach**: Configure a full-stack Node/Express server setup serving the Vite frontend on port 3000 and handling `/api/contra/analyze`, `/api/contra/documents`, and `/api/contra/query`.
- **Why**: Meets the environment constraint that `@google/genai` must never run in the client/browser bundle, protecting the `GEMINI_API_KEY` on the server.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│ BROWSER CLIENT (React 19 + Tailwind CSS + Lucide Icons)                │
│                                                                        │
│  ┌─────────────────────────┐      ┌──────────────────────────────────┐ │
│  │ Case Selector & Dossier │      │ Contradiction Matrix Component   │ │
│  └────────────┬────────────┘      └────────────────▲─────────────────┘ │
│               │                                    │                   │
│  ┌────────────▼────────────┐      ┌────────────────┴─────────────────┐ │
│  │ NAS Document Repository │      │ Inline Source Cards & Citations  │ │
│  └────────────┬────────────┘      └────────────────▲─────────────────┘ │
│               │                                    │                   │
│               └───────────────────┬────────────────┘                   │
│                                   │                                    │
│                         HTTP POST /api/contra/analyze                  │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ SERVER-SIDE PROXY (Node.js Express + TSX)                              │
│                                                                        │
│  ┌───────────────────────────┐     ┌─────────────────────────────────┐ │
│  │ Curated Synthetic Case    │     │ NAS Document Collection         │ │
│  │ Store (8 Nephrology Cases)│     │ (24 Full Clinical References)   │ │
│  └─────────────┬─────────────┘     └────────────────┬────────────────┘ │
│                │                                    │                  │
│                └──────────────────┬─────────────────┘                  │
│                                   │                                    │
│                    ┌──────────────▼──────────────┐                     │
│                    │ Clinical Analysis Pipeline  │                     │
│                    │ - Evidence matching         │                     │
│                    │ - Prompt composition        │                     │
│                    │ - Schema validation         │                     │
│                    └──────────────┬──────────────┘                     │
│                                   │                                    │
│                    ┌──────────────▼──────────────┐                     │
│                    │ @google/genai Client        │                     │
│                    │ Model: gemini-3.8-flash     │                     │
│                    │ User-Agent: aistudio-build  │                     │
│                    └──────────────┬──────────────┘                     │
│                                   │                                    │
│                              GEMINI API                                │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models & Schemas

```ts
export interface ClinicalFinding {
  id: string;
  category: 'clinical_history' | 'laboratory' | 'urinalysis' | 'imaging' | 'biopsy';
  finding: string;
  observedValue: string;
  significance: string;
  sourceDocId?: string;
  citationQuote?: string;
}

export interface ContradictionReport {
  caseId: string;
  workingDiagnosis: string;
  statedQuestion?: string;
  timestamp: string;
  executiveSummary: string;
  evidenceClassification: {
    supporting: ClinicalFinding[];
    contradictory: ClinicalFinding[];
    missing: ClinicalFinding[];
    inconclusive: ClinicalFinding[];
  };
  competingHypotheses: Array<{
    diseaseName: string;
    rationale: string;
    supportingFindings: string[];
    contradictoryFindings: string[];
    unresolvedQuestions: string[];
    citedDocuments: string[];
  }>;
  keyDiagnosticDilemmas: string[];
  disclaimer: string;
}

export interface NASDocument {
  id: string;
  title: string;
  folderPath: string;
  authorOrSource: string;
  year: number;
  category: 'guideline' | 'pathology' | 'study' | 'institutional_case';
  abstract: string;
  fullExcerpt: string;
  relevantDiseases: string[];
}
```

---

## 5. Execution Steps (Post-Approval)

1. **Server Setup**: Implement Express server with `/api/contra/*` endpoints, connecting `@google/genai` (`gemini-3.8-flash`) with structured schema generation and error handling.
2. **Clinical Dataset Construction**: Build the curated synthetic nephrology dataset (8 rich cases) and the 24-document NAS clinical reference archive with authentic clinical excerpts.
3. **Frontend Application**:
   - Header with clean Brand Zone, unboxed links, and Audit trigger.
   - Interactive Case Selector and detailed Patient Dossier panel.
   - Live Contradiction Report engine rendering the 4-quadrant matrix with metallic gold contradiction highlights.
   - Inline expandable Source Cards displaying verbatim quotes, NAS paths, and metadata.
   - Interactive clinical follow-up Q&A console.
   - Clean printable report generator.
4. **Verification**: Run `compile_applet` and verify end-to-end functionality, responsive layout, and error boundaries.
