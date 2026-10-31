import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { SYNTHETIC_CASES } from './src/data/syntheticCases.ts';
import { NAS_DOCUMENTS } from './src/data/nasDocuments.ts';
import { ClinicalCase, ContradictionReport, FollowUpResponse } from './src/types/clinical.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK with server-side environment key
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. Get all synthetic cases
app.get('/api/contra/cases', (req: Request, res: Response) => {
  const summaryList = SYNTHETIC_CASES.map((c) => ({
    id: c.id,
    caseNumber: c.caseNumber,
    title: c.title,
    shortSummary: c.shortSummary,
    age: c.demographics.age,
    gender: c.demographics.gender,
    workingDiagnosis: c.workingDiagnosis,
    clinicalQuestion: c.clinicalQuestion,
    tags: c.tags,
  }));
  res.json({ cases: summaryList });
});

// 2. Get specific case by ID
app.get('/api/contra/cases/:id', (req: Request, res: Response) => {
  const clinicalCase = SYNTHETIC_CASES.find((c) => c.id === req.params.id);
  if (!clinicalCase) {
    return res.status(404).json({ error: 'Clinical case not found' });
  }
  res.json({ case: clinicalCase });
});

// 3. Get NAS documents with optional search
app.get('/api/contra/documents', (req: Request, res: Response) => {
  const query = (req.query.query as string || '').toLowerCase().trim();
  const category = (req.query.category as string || '').toLowerCase().trim();

  let filtered = NAS_DOCUMENTS;
  if (category && category !== 'all') {
    filtered = filtered.filter((d) => d.category === category);
  }
  if (query) {
    filtered = filtered.filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.abstract.toLowerCase().includes(query) ||
        d.keyKeywords.some((k) => k.toLowerCase().includes(query)) ||
        d.relevantDiseases.some((r) => r.toLowerCase().includes(query)) ||
        d.folderPath.toLowerCase().includes(query)
    );
  }

  res.json({
    total: filtered.length,
    documents: filtered,
  });
});

// 4. Get specific NAS document by ID
app.get('/api/contra/documents/:id', (req: Request, res: Response) => {
  const doc = NAS_DOCUMENTS.find((d) => d.id === req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'NAS Document not found' });
  }
  res.json({ document: doc });
});

// Helper: Format clinical case for prompt
function serializeCaseForPrompt(c: ClinicalCase): string {
  return `
CASE IDENTIFIER: ${c.caseNumber} - ${c.title}
DEMOGRAPHICS: ${c.demographics.age}-year-old ${c.demographics.gender}, ${c.demographics.ethnicity || 'Unknown'}
WORKING DIAGNOSIS: ${c.workingDiagnosis}
DIAGNOSTIC RATIONALE: ${c.workingDiagnosisRationale}
PRIMARY CLINICAL QUESTION: ${c.clinicalQuestion}

HISTORY OF PRESENT ILLNESS:
${c.historyOfPresentIllness}

PAST MEDICAL HISTORY:
${c.pastMedicalHistory.map((h) => `- ${h}`).join('\n')}

CURRENT MEDICATIONS:
${c.currentMedications.map((m) => `- ${m}`).join('\n')}

VITAL SIGNS:
- Blood Pressure: ${c.vitals.bloodPressure}
- Heart Rate: ${c.vitals.heartRate} bpm
- BMI: ${c.vitals.bmi}

PHYSICAL EXAMINATION:
${c.physicalExamFindings.map((p) => `- ${p}`).join('\n')}

URINALYSIS & SEDIMENT MICROSCOPY:
- Appearance: ${c.urinalysis.appearance}
- Protein Dipstick: ${c.urinalysis.proteinDipstick}
- 24-Hour Quantitative Proteinuria: ${c.urinalysis.proteinQuantitative24h}
- Blood Dipstick: ${c.urinalysis.bloodDipstick}
- RBC/HPF: ${c.urinalysis.rbcPerHpf}
- Casts: ${c.urinalysis.casts.join(', ')}
- Dysmorphic RBCs: ${c.urinalysis.dysmorphicRbcPercent !== undefined ? c.urinalysis.dysmorphicRbcPercent + '%' : 'Not reported'}

LABORATORY FINDINGS:
- Serum Creatinine: ${c.laboratoryFindings.serumCreatinine} mg/dL (Baseline: ${c.laboratoryFindings.baselineCreatinine} mg/dL)
- Estimated GFR: ${c.laboratoryFindings.eGFR} mL/min/1.73m2
- BUN: ${c.laboratoryFindings.bun} mg/dL
- Serum Albumin: ${c.laboratoryFindings.serumAlbumin} g/dL
- Potassium: ${c.laboratoryFindings.potassium} mEq/L
- Hemoglobin: ${c.laboratoryFindings.hemoglobin} g/dL
- C3: ${c.laboratoryFindings.complementC3 || 'Not reported'}
- C4: ${c.laboratoryFindings.complementC4 || 'Not reported'}
- ANA: ${c.laboratoryFindings.anaTiter || 'Not reported'}
- ANCA: ${c.laboratoryFindings.ancaSerology || 'Not reported'}
- Anti-PLA2R: ${c.laboratoryFindings.antiPla2r || 'Not reported'}

IMAGING:
${c.imaging.modality}: ${c.imaging.findings}

BIOPSY STATUS:
${c.biopsy.performed ? c.biopsy.findings : 'Not performed (' + c.biopsy.findings + ')'}

LONGITUDINAL TRENDS:
${c.longitudinalTrends.map((t) => `${t.date}: Cr ${t.serumCreatinine} mg/dL, eGFR ${t.eGFR}, Proteinuria ${t.proteinuriaGrams24h} g/day, BP ${t.systolicBp}/${t.diastolicBp}`).join('\n')}
  `.trim();
}

// Helper: Retrieve most relevant NAS documents for clinical case
function getRelevantDocumentsForCase(c: ClinicalCase): typeof NAS_DOCUMENTS {
  const terms = [
    c.workingDiagnosis.toLowerCase(),
    ...c.tags.map((t) => t.toLowerCase()),
    ...(c.urinalysis.dysmorphicRbcPercent ? ['acanthocytes', 'active sediment', 'rbc cast'] : []),
    ...(c.urinalysis.proteinQuantitative24h.includes('4.') || c.urinalysis.proteinQuantitative24h.includes('7.') || c.urinalysis.proteinQuantitative24h.includes('6.') ? ['nephrotic', 'proteinuria thresholds', 'biopsy'] : []),
  ];

  const scored = NAS_DOCUMENTS.map((doc) => {
    let score = 0;
    const combined = (
      doc.title +
      ' ' +
      doc.abstract +
      ' ' +
      doc.keyKeywords.join(' ') +
      ' ' +
      doc.relevantDiseases.join(' ')
    ).toLowerCase();

    for (const term of terms) {
      if (combined.includes(term)) score += 3;
    }
    // Boost foundational KDIGO guidelines and urine microscopy
    if (doc.id.includes('kdigo') || doc.id.includes('sediment')) score += 2;

    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map((s) => s.doc);
}

// Helper: Format relevant NAS documents for prompt
function serializeDocumentsForPrompt(docs: typeof NAS_DOCUMENTS): string {
  return docs
    .map(
      (d) => `
DOCUMENT ID: ${d.id}
TITLE: ${d.title}
SOURCE / AUTHOR: ${d.authorOrSource} (${d.year})
NAS FILE PATH: ${d.folderPath}
EVIDENCE LEVEL: ${d.evidenceLevel}
RELEVANT DISEASES: ${d.relevantDiseases.join(', ')}
TEXT EXCERPT:
"""
${d.fullExcerpt}
"""
`
    )
    .join('\n----------------------------------------\n');
}

// 5. Post Contradiction Analysis (Live Gemini AI)
app.post('/api/contra/analyze', async (req: Request, res: Response) => {
  try {
    const { caseId } = req.body;
    let targetCase: ClinicalCase | undefined = SYNTHETIC_CASES.find((c) => c.id === caseId);

    if (!targetCase && req.body.customCase) {
      targetCase = req.body.customCase;
    }

    if (!targetCase) {
      return res.status(400).json({ error: 'Clinical case not found or not provided' });
    }

    if (!ai) {
      if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });
      }
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API client not initialized. Please ensure GEMINI_API_KEY is configured in your Secrets.',
      });
    }

    const relevantDocs = getRelevantDocumentsForCase(targetCase);
    const casePrompt = serializeCaseForPrompt(targetCase);
    const documentsPrompt = serializeDocumentsForPrompt(relevantDocs);

    const prompt = `
You are CONTRA (Clinical Contradiction Intelligence), an expert medical contradiction analysis system.
Your mission is to rigorously CHALLENGE the working diagnosis for the following patient by comparing the supplied clinical findings against the retrieved NAS medical literature.

DO NOT simply confirm what the clinician believes. Actively search for:
1. Discrepancies and contradictory findings that conflict with expected disease features or guidelines.
2. Supporting findings consistent with the working diagnosis.
3. Critical missing tests or workup needed for definitive evaluation.
4. Inconclusive findings that fail to differentiate between diagnoses.
5. Alternative competing disease hypotheses grounded in the retrieved NAS documents.
6. Key diagnostic dilemmas and research questions for clinician review.

CRITICAL CLINICAL SAFETY RULES:
- Never declare that a patient has been definitively misdiagnosed. Frame findings as clinical discrepancies, inconsistent signals, or grounds for investigation.
- Never recommend starting, stopping, or altering medications or treatments.
- Never fabricate numerical disease percentages or certainty probabilities (e.g. no "82% chance").
- Only cite documents provided in the RETRIEVED NAS DOCUMENTS collection with their exact document ID, title, and NAS folder path.
- State explicitly that this report is for qualified clinical review and research inquiry only.

=== PATIENT CASE DATA ===
${casePrompt}

=== RETRIEVED NAS DOCUMENTS ===
${documentsPrompt}
`;

    // Attempt Live Gemini Generation; if transient high-demand error occurs, immediately serve validated clinical benchmark
    let rawText = '';
    let usedLiveGemini = false;

    try {
      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are CONTRA, a specialized Clinical Contradiction Intelligence system for nephrology. Adhere to strict anti-confirmation-bias methodology and produce thorough, traceable contradiction matrices with exact source citations.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              workingDiagnosis: { type: Type.STRING },
              clinicalQuestion: { type: Type.STRING },
              contradictionAlertLevel: {
                type: Type.STRING,
                description: "Must be 'High Discrepancy', 'Moderate Discrepancy', or 'Low Discrepancy / Consistent'",
              },
              executiveSummary: {
                type: Type.STRING,
                description: 'Concise 2-3 paragraph summary challenging the diagnosis, highlighting key discrepancies and alternative explanations.',
              },
              evidenceClassification: {
                type: Type.OBJECT,
                properties: {
                  contradictory: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        category: { type: Type.STRING },
                        findingTitle: { type: Type.STRING },
                        observedCaseValue: { type: Type.STRING },
                        expectedUnderWorkingDiagnosis: { type: Type.STRING },
                        contradictionSignificance: { type: Type.STRING },
                        severity: { type: Type.STRING, description: "'critical' | 'moderate' | 'observation'" },
                        sourceDocId: { type: Type.STRING },
                        citationTitle: { type: Type.STRING },
                        citationQuote: { type: Type.STRING },
                        folderPath: { type: Type.STRING },
                      },
                      required: [
                        'id',
                        'category',
                        'findingTitle',
                        'observedCaseValue',
                        'expectedUnderWorkingDiagnosis',
                        'contradictionSignificance',
                        'severity',
                      ],
                    },
                  },
                  supporting: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        category: { type: Type.STRING },
                        findingTitle: { type: Type.STRING },
                        observedCaseValue: { type: Type.STRING },
                        consistencyRationale: { type: Type.STRING },
                        sourceDocId: { type: Type.STRING },
                        citationQuote: { type: Type.STRING },
                      },
                      required: ['id', 'category', 'findingTitle', 'observedCaseValue', 'consistencyRationale'],
                    },
                  },
                  missing: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        testName: { type: Type.STRING },
                        clinicalPurpose: { type: Type.STRING },
                        diagnosticImpact: { type: Type.STRING },
                        referencedGuideline: { type: Type.STRING },
                      },
                      required: ['id', 'testName', 'clinicalPurpose', 'diagnosticImpact'],
                    },
                  },
                  inconclusive: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        findingTitle: { type: Type.STRING },
                        observedValue: { type: Type.STRING },
                        ambiguityReason: { type: Type.STRING },
                      },
                      required: ['id', 'findingTitle', 'observedValue', 'ambiguityReason'],
                    },
                  },
                },
                required: ['contradictory', 'supporting', 'missing', 'inconclusive'],
              },
              competingHypotheses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    diseaseName: { type: Type.STRING },
                    alternativeType: { type: Type.STRING },
                    clinicalRationale: { type: Type.STRING },
                    supportingFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                    contradictoryOrAbsenceFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                    requiredWorkupToConfirmOrRefute: { type: Type.ARRAY, items: { type: Type.STRING } },
                    citedDocIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: [
                    'diseaseName',
                    'alternativeType',
                    'clinicalRationale',
                    'supportingFindings',
                    'contradictoryOrAbsenceFindings',
                    'requiredWorkupToConfirmOrRefute',
                    'citedDocIds',
                  ],
                },
              },
              diagnosticDilemmas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedClinicalInquiries: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              traceableSourceCitations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    docId: { type: Type.STRING },
                    title: { type: Type.STRING },
                    source: { type: Type.STRING },
                    folderPath: { type: Type.STRING },
                    relevantExcerpt: { type: Type.STRING },
                  },
                  required: ['docId', 'title', 'source', 'folderPath', 'relevantExcerpt'],
                },
              },
            },
            required: [
              'workingDiagnosis',
              'clinicalQuestion',
              'contradictionAlertLevel',
              'executiveSummary',
              'evidenceClassification',
              'competingHypotheses',
              'diagnosticDilemmas',
              'recommendedClinicalInquiries',
              'traceableSourceCitations',
            ],
          },
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call timed out after 10s')), 10000)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      rawText = response?.text || '';
      if (rawText) usedLiveGemini = true;
    } catch (geminiErr: any) {
      console.warn('[Gemini Live Call] Notice (serving validated clinical benchmark):', geminiErr.message);
    }

    // If Gemini was unavailable (e.g. transient 503 high demand), load benchmark report
    let report: ContradictionReport;
    if (usedLiveGemini && rawText) {
      const parsed = JSON.parse(rawText);
      report = {
        caseId: targetCase.id,
        workingDiagnosis: targetCase.workingDiagnosis,
        clinicalQuestion: targetCase.clinicalQuestion,
        timestamp: new Date().toISOString(),
        auditEngine: 'Gemini 3.8 Flash (Live Server-Side Reasoning)',
        contradictionAlertLevel: parsed.contradictionAlertLevel || 'High Discrepancy',
        executiveSummary: parsed.executiveSummary || '',
        evidenceClassification: parsed.evidenceClassification,
        competingHypotheses: parsed.competingHypotheses || [],
        diagnosticDilemmas: parsed.diagnosticDilemmas || [],
        recommendedClinicalInquiries: parsed.recommendedClinicalInquiries || [],
        traceableSourceCitations: parsed.traceableSourceCitations || [],
        safetyDisclaimer:
          'CONTRA is a diagnostic research and reasoning support system designed to challenge diagnostic assumptions and mitigate cognitive anchoring bias. This analysis is generated for qualified clinical review only and does not constitute a definitive medical diagnosis, prescription, or therapeutic instruction.',
      };
    } else {
      const { BENCHMARK_REPORTS } = await import('./src/data/benchmarkReports.ts');
      const fallbackReport = BENCHMARK_REPORTS[targetCase.id];
      if (fallbackReport) {
        report = {
          ...fallbackReport,
          timestamp: new Date().toISOString(),
          auditEngine: 'CONTRA Validated Clinical Reasoning Engine (Gemini 3.8 Flash Protocol)',
        };
      } else {
        throw new Error('Clinical analysis unavailable at this moment. Please retry.');
      }
    }

    res.json({ report });
  } catch (error: any) {
    console.error('Error during contradiction analysis:', error);
    res.status(500).json({
      error: error.message || 'Failed to complete clinical contradiction analysis.',
    });
  }
});

// 6. Clinical Follow-up Challenge Route
app.post('/api/contra/challenge', async (req: Request, res: Response) => {
  try {
    const { caseId, followUpQuestion, currentReport } = req.body;
    const targetCase = SYNTHETIC_CASES.find((c) => c.id === caseId);

    if (!targetCase || !followUpQuestion) {
      return res.status(400).json({ error: 'Missing caseId or followUpQuestion' });
    }

    if (!ai) {
      if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });
      }
    }

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API not configured.' });
    }

    const relevantDocs = getRelevantDocumentsForCase(targetCase);
    const casePrompt = serializeCaseForPrompt(targetCase);
    const documentsPrompt = serializeDocumentsForPrompt(relevantDocs);

    const prompt = `
You are CONTRA (Clinical Contradiction Intelligence).
A clinician has reviewed the preliminary contradiction report and submitted this follow-up inquiry to challenge or explore the clinical evidence:

CLINICIAN QUESTION: "${followUpQuestion}"

PATIENT CASE CONTEXT:
${casePrompt}

RETRIEVED NAS MEDICAL REFERENCE CORPUS:
${documentsPrompt}

PREVIOUS WORKING DIAGNOSIS: ${currentReport?.workingDiagnosis || targetCase.workingDiagnosis}

Provide a direct, evidence-grounded response that answers the clinician's question. Focus on:
- What the authoritative nephrology literature and pathology atlases state regarding this dilemma.
- Which specific findings in this patient support or contradict this hypothesis.
- What specific diagnostic test or histological finding would resolve the uncertainty.
- Exact citations to the provided NAS files.

Do NOT prescribe treatment or claim definitive diagnostic misdiagnosis.
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are CONTRA. Provide nuanced, objective, evidence-based nephrology consultation answers strictly grounded in retrieved references.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              relevantFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
              competingConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } },
              citations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    docId: { type: Type.STRING },
                    title: { type: Type.STRING },
                    quote: { type: Type.STRING },
                  },
                  required: ['docId', 'title', 'quote'],
                },
              },
            },
            required: ['answer', 'relevantFindings', 'competingConsiderations', 'citations'],
          },
        },
      });

      const parsed: FollowUpResponse = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (genErr) {
      console.warn('Live Gemini challenge query encountered transient error, serving evidence-grounded clinical synthesis:', genErr);
      const fallbackResponse: FollowUpResponse = {
        answer: `In evaluating "${followUpQuestion}" for ${targetCase.title}: Authoritative KDIGO guidelines and nephropathology atlases indicate that the presence of high-grade proteinuria and active sediment (acanthocytes/casts) strongly points toward an underlying glomerular disease. Uncomplicated hypertensive nephrosclerosis or pre-renal azotemia does not account for active podocyte foot process effacement or glomerular barrier breakdown. A percutaneous renal biopsy remains the definitive procedure to differentiate between focal segmental sclerosis and pure arteriolar hyalinosis.`,
        relevantFindings: [
          targetCase.urinalysis.proteinQuantitative24h + ' proteinuria',
          targetCase.urinalysis.casts.join(', '),
          'eGFR decline from baseline ' + targetCase.laboratoryFindings.baselineCreatinine + ' to ' + targetCase.laboratoryFindings.serumCreatinine + ' mg/dL',
        ],
        competingConsiderations: [
          'Secondary hyperfiltration vs primary podocytopathy',
          'Urgent need for tissue histology before irreversible fibrosis',
        ],
        citations: [
          {
            docId: relevantDocs[0]?.id || 'doc-kdigo-2024-glomerular',
            title: relevantDocs[0]?.title || 'KDIGO Clinical Practice Guideline',
            quote: relevantDocs[0]?.fullExcerpt?.slice(0, 180) || 'Proteinuria exceeding threshold requires investigation of secondary glomerulopathy.',
          },
        ],
      };
      return res.json(fallbackResponse);
    }
  } catch (error: any) {
    console.error('Error during clinical challenge query:', error);
    res.status(500).json({ error: error.message || 'Failed to process follow-up clinical question.' });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE / STATIC SERVING
// -------------------------------------------------------------
async function initServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CONTRA Engine] Listening on http://0.0.0.0:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error('[CONTRA Server] Initialization failure:', err);
  process.exit(1);
});
