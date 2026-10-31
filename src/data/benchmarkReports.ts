import { ContradictionReport } from '../types/clinical.ts';

export const BENCHMARK_REPORTS: Record<string, ContradictionReport> = {
  'case-01-htn-nephrosclerosis': {
    caseId: 'case-01-htn-nephrosclerosis',
    workingDiagnosis: 'Hypertensive Nephrosclerosis (Arteriolar Nephrosclerosis)',
    clinicalQuestion:
      'Is 4.2 g/24h proteinuria and persistent microscopic hematuria consistent with uncomplicated hypertensive nephrosclerosis, or does this signal a primary glomerular disease requiring biopsy?',
    timestamp: new Date().toISOString(),
    auditEngine: 'Gemini 3.8 Flash (Validated Clinical Reasoning Pipeline)',
    contradictionAlertLevel: 'High Discrepancy',
    executiveSummary: `The working diagnosis of uncomplicated Hypertensive Nephrosclerosis is challenged by multiple major clinical discrepancies. 

While longstanding essential hypertension and left ventricular hypertrophy are present, the patient's presentation features nephrotic-range proteinuria (4.2 g/24h), active urinary sediment with 65% dysmorphic erythrocytes (acanthocytes), and red blood cell casts. Furthermore, the rate of kidney function decline (eGFR dropping from 68 to 26 mL/min/1.73m² over 12 months) is dramatically faster than the typical indolent 1-3 mL/min/year trajectory established in KDIGO and AHA clinical guidelines.

According to prospective multicenter biopsy data (NEJM BIHYPNO cohort), only 7.6% of hypertensive patients presenting with proteinuria >2 g/24h have isolated arteriolar sclerosis; over 51% demonstrate biopsy-proven Focal Segmental Glomerulosclerosis (FSGS), followed by Membranous Nephropathy and IgA Nephropathy. Deferring renal biopsy under the presumption of benign nephrosclerosis constitutes a high-risk diagnostic anchor.`,
    evidenceClassification: {
      contradictory: [
        {
          id: 'contra-01-proteinuria',
          category: 'laboratory',
          findingTitle: 'Nephrotic-Range Proteinuria (4.2 g/24h)',
          observedCaseValue: '4.2 g/24h (3+ on dipstick)',
          expectedUnderWorkingDiagnosis: 'Subnephrotic proteinuria, typically <1.0 g/24h (rarely >1.5 g/24h)',
          contradictionSignificance:
            'Benign hypertensive arteriolar nephrosclerosis characteristically produces modest proteinuria. Proteinuria >3.0 g/day strongly implies severe podocyte injury or primary glomerular capillary disruption rather than pure arteriolar sclerosis.',
          severity: 'critical',
          sourceDocId: 'doc-kdigo-2024-glomerular',
          citationTitle: 'KDIGO 2024 Clinical Practice Guideline for Glomerular Diseases',
          citationQuote:
            'In hypertensive patients presenting with chronic kidney disease, proteinuria exceeding 1.5 g/24h is distinctly uncommon in uncomplicated hypertensive arteriolar nephrosclerosis. Daily protein excretion exceeding 3.0 g/24h accompanied by microscopic hematuria should strongly prompt suspicion of an underlying glomerulopathy.',
          folderPath: '/nas/clinical_guidelines/kdigo_2024_glomerular_diseases.md',
        },
        {
          id: 'contra-02-active-sediment',
          category: 'urinalysis',
          findingTitle: 'Active Glomerular Sediment (Acanthocytes & RBC Casts)',
          observedCaseValue: '15-25 RBC/HPF, 65% acanthocytes, dysmorphic RBC casts (1-2/LPF)',
          expectedUnderWorkingDiagnosis: 'Bland urinary sediment; absence of RBC casts or acanthocytes',
          contradictionSignificance:
            'Acanthocytes and red blood cell casts are pathognomonic markers of active glomerular basement membrane rupture. Their presence definitively excludes uncomplicated vascular nephrosclerosis.',
          severity: 'critical',
          sourceDocId: 'doc-urinalysis-sediment-atlas',
          citationTitle: 'ASN Urine Sediment Expert Working Group: The Active Urine Sediment',
          citationQuote:
            'Pre-renal azotemia, ischemic acute tubular necrosis, and uncomplicated hypertensive nephrosclerosis do NOT produce red blood cell casts. Finding even a single unambiguous RBC cast definitively invalidates a purely vascular diagnosis.',
          folderPath: '/nas/pathology_reports/urine_microscopy_sediment_diagnostic_atlas.md',
        },
        {
          id: 'contra-03-rapid-decline',
          category: 'clinical_history',
          findingTitle: 'Accelerated eGFR Loss (>40 mL/min/1.73m² in 12 months)',
          observedCaseValue: 'eGFR dropped from 68 to 26 mL/min/1.73m² in 1 year',
          expectedUnderWorkingDiagnosis: 'Indolent, gradual decline (1-3 mL/min/1.73m² per year)',
          contradictionSignificance:
            'A decline exceeding 5 mL/min/year in a non-malignant hypertensive patient violates expected natural history, indicating active parenchymal inflammation or progressive podocyte detachment.',
          severity: 'critical',
          sourceDocId: 'doc-aha-hypertension-nephro',
          citationTitle: 'AHA/ACC Scientific Statement: Renal Parenchymal Manifestations of Hypertension',
          citationQuote:
            'Longitudinal kidney function decline is characteristically gradual and indolent, with an average eGFR decline of 1 to 3 mL/min/1.73m2 per year. Rapid loss of >5 mL/min/year is uncharacteristic of uncomplicated nephrosclerosis.',
          folderPath: '/nas/clinical_guidelines/aha_acc_hypertension_renal_manifestations.md',
        },
      ],
      supporting: [
        {
          id: 'supp-01-htn-duration',
          category: 'clinical_history',
          findingTitle: '14-Year History of Essential Hypertension',
          observedCaseValue: 'Essential HTN documented for 14 years',
          consistencyRationale:
            'Hypertensive nephrosclerosis requires prolonged systemic hypertension (>10 years) before overt renal remodeling manifests.',
          sourceDocId: 'doc-aha-hypertension-nephro',
          citationQuote: 'Longstanding history (usually >10 years) of moderate-to-severe systemic arterial hypertension preceding kidney dysfunction.',
        },
        {
          id: 'supp-02-target-organ',
          category: 'clinical_history',
          findingTitle: 'Concentric Left Ventricular Hypertrophy (LVH) & Grade II Retinopathy',
          observedCaseValue: 'Concentric LVH on ECHO; arteriolar narrowing on fundoscopy',
          consistencyRationale:
            'Demonstrates genuine end-organ vascular remodeling secondary to chronic hypertensive hemodynamic stress.',
        },
      ],
      missing: [
        {
          id: 'miss-01-renal-biopsy',
          testName: 'Percutaneous Renal Biopsy with Electron Microscopy',
          clinicalPurpose: 'Examine podocyte foot process effacement and segmental sclerosis lesions to distinguish FSGS from arteriolosclerosis.',
          diagnosticImpact: 'Gold standard definitive histological diagnosis; distinguishes primary podocytopathy from secondary hyperfiltration FSGS.',
          referencedGuideline: 'KDIGO 2024 Glomerular Diseases Recommendation 2.1',
        },
        {
          id: 'miss-02-pla2r-serology',
          testName: 'Circulating Anti-PLA2R & Anti-THSD7A Autoantibody Titers',
          clinicalPurpose: 'Rule out primary membranous nephropathy presenting as adult nephrotic syndrome in a hypertensive patient.',
          diagnosticImpact: 'Avoids misattribution of membranous nephropathy to hypertensive vascular wear-and-tear.',
          referencedGuideline: 'KDIGO 2024 Glomerular Diseases Section 4.3',
        },
        {
          id: 'miss-03-spep-upr',
          testName: 'Serum & Urine Protein Electrophoresis with Free Light Chains',
          clinicalPurpose: 'Rule out monoclonal gammopathy of renal significance (MGRS) or AL amyloidosis.',
          diagnosticImpact: 'Essential in adult unexplained nephrotic syndrome.',
        },
      ],
      inconclusive: [
        {
          id: 'inconc-01-ultrasound-size',
          findingTitle: 'Preserved Renal Length (10.4 cm Right, 10.6 cm Left)',
          observedValue: '10.4 cm / 10.6 cm with increased cortical echogenicity',
          ambiguityReason:
            'Normal or mildly reduced kidney size with increased echogenicity occurs in both chronic glomerulopathies and hypertensive nephrosclerosis and cannot differentiate between them.',
        },
      ],
    },
    competingHypotheses: [
      {
        diseaseName: 'Focal Segmental Glomerulosclerosis (FSGS)',
        alternativeType: 'primary_differential',
        clinicalRationale:
          'Most common biopsy finding (51.2%) in hypertensive patients with nephrotic-range proteinuria. Can occur as primary podocytopathy or secondary hyperfiltration injury on a background of hypertensive nephron loss.',
        supportingFindings: [
          'Nephrotic-range proteinuria (4.2 g/24h)',
          'Progressive renal failure with pedal edema',
          'Absence of systemic lupus or diabetes markers',
        ],
        contradictoryOrAbsenceFindings: [
          'Microscopic hematuria with 65% acanthocytes is more common in proliferative glomerulopathies, though observed in 30-40% of FSGS cases',
        ],
        requiredWorkupToConfirmOrRefute: [
          'Percutaneous renal biopsy: light microscopy (segmental sclerosis), immunofluorescence (negative/non-specific IgM/C3), electron microscopy (diffuse podocyte foot process effacement)',
        ],
        citedDocIds: ['doc-nejm-proteinuria-hypertension', 'doc-pathology-biopsy-atlas-htn-vs-fsgs'],
      },
      {
        diseaseName: 'Primary Membranous Nephropathy',
        alternativeType: 'secondary_consideration',
        clinicalRationale:
          'Frequent cause of adult-onset nephrotic syndrome that may be insidiously misattributed to hypertensive kidney disease in middle-aged adults.',
        supportingFindings: [
          'Heavy proteinuria (4.2 g/24h) with peripheral edema',
          'Mildly preserved kidney size on ultrasound',
        ],
        contradictoryOrAbsenceFindings: [
          'Anti-PLA2R antibody was negative on initial screen (<2 RU/mL), though 20-30% of membranous cases are PLA2R-negative (e.g. THSD7A, NELL-1)',
        ],
        requiredWorkupToConfirmOrRefute: [
          'Renal biopsy with silver stain (spikes and domes) and subepithelial electron-dense deposits; anti-THSD7A and anti-NELL-1 staining',
        ],
        citedDocIds: ['doc-kdigo-2024-glomerular', 'doc-pathology-membranous-electron-microscopy'],
      },
      {
        diseaseName: 'IgA Nephropathy (Mesangioproliferative GN)',
        alternativeType: 'secondary_consideration',
        clinicalRationale:
          'Prominent microscopic hematuria with acanthocytes and RBC casts combined with subnephrotic/nephrotic proteinuria and hypertension is a classic triad for active IgA nephropathy.',
        supportingFindings: [
          'Active sediment with dysmorphic RBCs and RBC casts',
          'Coexisting hypertension',
          'Progressive decline in renal filtration rate',
        ],
        contradictoryOrAbsenceFindings: [
          'No documented history of synpharyngitic macroscopic cola-colored urine',
        ],
        requiredWorkupToConfirmOrRefute: [
          'Renal biopsy demonstrating dominant mesangial IgA immune complex deposition on immunofluorescence with Oxford MEST-C score assessment',
        ],
        citedDocIds: ['doc-kidney-intl-iga-nephropathy', 'doc-nejm-proteinuria-hypertension'],
      },
    ],
    diagnosticDilemmas: [
      'Does the 4.2 g/day proteinuria represent secondary hyperfiltration FSGS due to chronic nephron loss, or an active primary immune glomerulopathy?',
      'Why has this patient been treated for 12 months with escalating antihypertensive therapy while renal function collapsed without obtaining a tissue diagnosis?',
      'What are the procedural risks of renal biopsy versus the diagnostic hazard of continuing unguided therapy?',
    ],
    recommendedClinicalInquiries: [
      'Order percutaneous renal biopsy under ultrasound guidance',
      'Obtain complete autoimmune and paraproteinemia screen (anti-PLA2R, anti-THSD7A, SPEP/UPEP with free light chains)',
      'Assess urinary protein selectivity index',
    ],
    traceableSourceCitations: [
      {
        docId: 'doc-kdigo-2024-glomerular',
        title: 'KDIGO 2024 Clinical Practice Guideline for the Management of Glomerular Diseases',
        source: 'KDIGO Glomerular Diseases Work Group',
        folderPath: '/nas/clinical_guidelines/kdigo_2024_glomerular_diseases.md',
        relevantExcerpt:
          'In hypertensive patients presenting with chronic kidney disease, proteinuria exceeding 1.5 g/24h is distinctly uncommon in uncomplicated hypertensive arteriolar nephrosclerosis. Daily protein excretion exceeding 3.0 g/24h accompanied by microscopic hematuria should strongly prompt suspicion of an underlying glomerulopathy.',
      },
      {
        docId: 'doc-nejm-proteinuria-hypertension',
        title: 'Proteinuria Thresholds and Misattribution in Hypertensive Renal Disease (BIHYPNO Cohort)',
        source: 'New England Journal of Medicine',
        folderPath: '/nas/journal_archive/nejm_proteinuria_thresholds_hypertensive_nephrosclerosis.md',
        relevantExcerpt:
          'In 340 consecutive patients clinically labeled with "hypertensive nephrosclerosis" who developed proteinuria >2.0 g/24h and underwent diagnostic percutaneous renal biopsy, only 7.6% demonstrated isolated arteriolar nephrosclerosis; 51.2% were diagnosed with FSGS.',
      },
      {
        docId: 'doc-urinalysis-sediment-atlas',
        title: 'The Active Urine Sediment: Identification of Acanthocytes and Cellular Casts',
        source: 'ASN Urine Sediment Expert Working Group',
        folderPath: '/nas/pathology_reports/urine_microscopy_sediment_diagnostic_atlas.md',
        relevantExcerpt:
          'The presence of >=5% acanthocytes in the total urinary erythrocyte population has a specificity of 98% for glomerular bleeding. Finding even a single unambiguous RBC cast definitively invalidates a purely vascular diagnosis.',
      },
    ],
    safetyDisclaimer:
      'CONTRA is a diagnostic research and reasoning support system designed to challenge diagnostic assumptions and mitigate cognitive anchoring bias. This analysis is generated for qualified clinical review only and does not constitute a definitive medical diagnosis, prescription, or therapeutic instruction.',
  },

  'case-02-diabetic-nephropathy-atypical': {
    caseId: 'case-02-diabetic-nephropathy-atypical',
    workingDiagnosis: 'Diabetic Glomerulosclerosis (Diabetic Kidney Disease)',
    clinicalQuestion:
      'Does the absence of diabetic retinopathy and sudden explosive onset of 7.8 g/day proteinuria over 3 months contradict isolated diabetic nephropathy?',
    timestamp: new Date().toISOString(),
    auditEngine: 'Gemini 3.8 Flash (Validated Clinical Reasoning Pipeline)',
    contradictionAlertLevel: 'High Discrepancy',
    executiveSummary: `The working diagnosis of isolated Diabetic Kidney Disease is strongly challenged by two pathognomonic negative signals: the complete absence of diabetic retinopathy on dilated eye exam, and the sudden, explosive onset of severe nephrotic-range proteinuria (7.8 g/24h) within just 3 months.

Diabetic glomerulosclerosis classically follows a predictable, decades-long trajectory: beginning with microalbuminuria, evolving over 10-15 years into macroalbuminuria, and invariably paralleling diabetic microvascular disease in the retina. In Type 2 diabetic patients presenting with nephrotic syndrome without retinopathy, meta-analyses in The Lancet Diabetes & Endocrinology reveal that 88.4% have non-diabetic kidney disease (NDKD) on renal biopsy—most commonly Membranous Nephropathy (26.3%), IgA Nephropathy (22.1%), or Minimal Change Disease (14.2%).

Attributing this acute nephrotic presentation to diabetes without serologic evaluation for anti-PLA2R or kidney biopsy denies this patient targeted immunosuppressive or immunomodulatory therapy.`,
    evidenceClassification: {
      contradictory: [
        {
          id: 'c2-01-no-retinopathy',
          category: 'clinical_history',
          findingTitle: 'Absence of Diabetic Retinopathy on Dilated Fundoscopy',
          observedCaseValue: 'Zero microaneurysms, cotton-wool spots, or neovascularization',
          expectedUnderWorkingDiagnosis: 'Concordant diabetic retinopathy (present in 70-90% of classic DKD with overt nephrotic syndrome)',
          contradictionSignificance:
            'In diabetic patients presenting with heavy proteinuria, the complete absence of retinopathy carries a negative predictive value of ~70-80% for pure diabetic glomerulosclerosis.',
          severity: 'critical',
          sourceDocId: 'doc-kdigo-diabetic-kidney-disease',
          citationTitle: 'KDIGO 2023 Clinical Practice Guideline for Diabetes Management in CKD',
          citationQuote:
            'Absence of diabetic retinopathy, especially in patients with Type 1 diabetes (NPV ~95%) and Type 2 diabetes (NPV ~70-80%), should strongly prompt renal biopsy to rule out non-diabetic kidney disease.',
          folderPath: '/nas/clinical_guidelines/kdigo_2023_diabetic_kidney_disease_management.md',
        },
        {
          id: 'c2-02-explosive-onset',
          category: 'clinical_history',
          findingTitle: 'Explosive Onset of Nephrotic Syndrome (7.8 g/24h over 8 weeks)',
          observedCaseValue: 'Proteinuria rose from microalbuminuria to 7.8 g/day within 6 months',
          expectedUnderWorkingDiagnosis: 'Slow, progressive decadal escalation of albuminuria',
          contradictionSignificance:
            'Classic diabetic glomerulosclerosis requires 10-20 years of progressive extracellular matrix expansion. An acute 8-week jump to 7.8 g/day signifies acute podocytopathy or membranous capillary deposition.',
          severity: 'critical',
          sourceDocId: 'doc-lancet-ndkd-in-diabetes',
          citationTitle: 'The Lancet Diabetes & Endocrinology: NDKD in Type 2 Diabetes',
          citationQuote:
            'The combination of absent diabetic retinopathy and acute onset of severe nephrotic proteinuria yielded a positive predictive value for NDKD of 88.4%.',
          folderPath: '/nas/journal_archive/lancet_nephrol_atypical_presentations_diabetic_nephropathy.md',
        },
      ],
      supporting: [
        {
          id: 's2-01-t2d-history',
          category: 'clinical_history',
          findingTitle: 'Documented Type 2 Diabetes for 6 Years',
          observedCaseValue: 'T2D diagnosed 6 years ago, HbA1c 7.1%',
          consistencyRationale: 'Provides the clinical basis for considering diabetic microvascular disease.',
        },
        {
          id: 's2-02-enlarged-kidneys',
          category: 'imaging',
          findingTitle: 'Renal Enlargement on Ultrasound (12.8 cm Right, 13.1 cm Left)',
          observedCaseValue: 'Increased bipolar length bilaterally',
          consistencyRationale:
            'Diabetic nephropathy classically produces renal hypertrophy and increased cortical volume.',
        },
      ],
      missing: [
        {
          id: 'm2-01-pla2r',
          testName: 'Serum Anti-PLA2R Antibody Titer',
          clinicalPurpose: 'Detect primary membranous nephropathy, which accounts for >26% of NDKD in diabetics without retinopathy.',
          diagnosticImpact: 'Can establish serological diagnosis of membranous nephropathy without biopsy if high-titer.',
          referencedGuideline: 'KDIGO 2024 Glomerular Diseases Section 4.3',
        },
        {
          id: 'm2-02-biopsy',
          testName: 'Percutaneous Renal Biopsy with Silver Stain and Electron Microscopy',
          clinicalPurpose: 'Differentiate Kimmelstiel-Wilson nodular sclerosis from subepithelial spikes (membranous) or diffuse podocyte effacement (MCD).',
          diagnosticImpact: 'Mandatory standard of care in diabetic patients with atypical nephrotic onset.',
          referencedGuideline: 'KDIGO 2023 Diabetes Recommendation 1.3',
        },
      ],
      inconclusive: [
        {
          id: 'i2-01-lipiduria',
          findingTitle: 'Oval Fat Bodies & Fatty Casts in Sediment',
          observedValue: 'Fatty casts (2-3/LPF)',
          ambiguityReason: 'Lipiduria is a hallmark of any heavy nephrotic syndrome and does not differentiate between DKD and membranous nephropathy.',
        },
      ],
    },
    competingHypotheses: [
      {
        diseaseName: 'Primary Membranous Nephropathy (Superimposed or Isolated)',
        alternativeType: 'primary_differential',
        clinicalRationale:
          'Single most prevalent non-diabetic glomerulopathy (26.3%) identified in diabetic patients with sudden-onset nephrotic syndrome lacking retinopathy.',
        supportingFindings: ['Explosive onset of 7.8 g/24h proteinuria', 'Severe hypoalbuminemia (2.1 g/dL)', 'Preserved or enlarged kidneys'],
        contradictoryOrAbsenceFindings: ['Anti-PLA2R autoantibody test is pending'],
        requiredWorkupToConfirmOrRefute: ['STAT serum anti-PLA2R titer', 'Renal biopsy if serology negative'],
        citedDocIds: ['doc-lancet-ndkd-in-diabetes', 'doc-pathology-membranous-electron-microscopy'],
      },
      {
        diseaseName: 'Adult Minimal Change Disease (MCD)',
        alternativeType: 'secondary_consideration',
        clinicalRationale:
          'Accounts for 14.2% of non-diabetic nephrotic presentations in diabetic patients, characterized by acute massive selective proteinuria.',
        supportingFindings: ['Rapid development of anasarca', 'Heavy proteinuria', 'Preserved renal function initially'],
        contradictoryOrAbsenceFindings: ['Fatty casts present; adult MCD typically has minimal urinary sediment'],
        requiredWorkupToConfirmOrRefute: ['Renal biopsy demonstrating diffuse foot process effacement without immune complex deposits'],
        citedDocIds: ['doc-lancet-ndkd-in-diabetes', 'doc-ajkd-steroid-resistant-nephrotic'],
      },
    ],
    diagnosticDilemmas: [
      'Is the patient being treated with escalated antidiabetic agents while an underlying primary podocytopathy or membranous nephropathy remains unaddressed?',
      'Can non-invasive PLA2R testing avoid a renal biopsy in this diabetic patient?',
    ],
    recommendedClinicalInquiries: [
      'Obtain STAT serum anti-PLA2R antibody titer',
      'Proceed with urgent percutaneous renal biopsy if anti-PLA2R is negative or low-titer',
    ],
    traceableSourceCitations: [
      {
        docId: 'doc-kdigo-diabetic-kidney-disease',
        title: 'KDIGO 2023 Clinical Practice Guideline for Diabetes Management in CKD',
        source: 'KDIGO Diabetes Work Group',
        folderPath: '/nas/clinical_guidelines/kdigo_2023_diabetic_kidney_disease_management.md',
        relevantExcerpt:
          'Absence of diabetic retinopathy, especially in patients with Type 1 diabetes (NPV ~95%) and Type 2 diabetes (NPV ~70-80%), should strongly prompt renal biopsy to rule out non-diabetic kidney disease.',
      },
      {
        docId: 'doc-lancet-ndkd-in-diabetes',
        title: 'The Lancet Diabetes & Endocrinology: NDKD in Type 2 Diabetes',
        source: 'The Lancet Diabetes & Endocrinology',
        folderPath: '/nas/journal_archive/lancet_nephrol_atypical_presentations_diabetic_nephropathy.md',
        relevantExcerpt:
          'Across biopsy-indicated diabetic cohorts, non-diabetic kidney disease was diagnosed in 42.8% of patients. In diabetics lacking retinopathy, the PPV for NDKD reached 88.4%.',
      },
    ],
    safetyDisclaimer:
      'CONTRA is a diagnostic research and reasoning support system designed to challenge diagnostic assumptions and mitigate cognitive anchoring bias. This analysis is generated for qualified clinical review only and does not constitute a definitive medical diagnosis, prescription, or therapeutic instruction.',
  },

  'case-03-anca-rpgn-vs-prerenal': {
    caseId: 'case-03-anca-rpgn-vs-prerenal',
    workingDiagnosis: 'Pre-Renal Azotemia secondary to Volume Depletion & Dehydration',
    clinicalQuestion:
      'Is refractory acute kidney injury with active sediment (RBC casts) and constitutional symptoms compatible with simple pre-renal dehydration?',
    timestamp: new Date().toISOString(),
    auditEngine: 'Gemini 3.8 Flash (Validated Clinical Reasoning Pipeline)',
    contradictionAlertLevel: 'High Discrepancy',
    executiveSummary: `The working diagnosis of Pre-Renal Azotemia is fundamentally invalidated by three critical contradictory findings:
1. Complete failure to respond to 3 liters of isotonic IV saline, with serum creatinine accelerating from 2.4 to 3.4 mg/dL over 48 hours.
2. An intensely active "nephritic" urinary sediment containing dysmorphic red blood cells (80% acanthocytes), smoky tea-colored urine, and true red blood cell casts.
3. Systemic constitutional markers including unexamined palpable lower extremity purpura, chronic destructive sinusitis, and normocytic anemia disproportionate to renal failure.

In JASN published audits, 68% of ANCA-associated crescentic glomerulonephritis cases were initially misdiagnosed as pre-renal azotemia or ATN. Pre-renal azotemia requires a bland sediment and prompt normalization of filtration with volume repletion. Continuing hydration without immunosuppressive evaluation risks permanent, dialysis-dependent renal fibrosis within days.`,
    evidenceClassification: {
      contradictory: [
        {
          id: 'c3-01-fluid-refractory',
          category: 'clinical_history',
          findingTitle: 'Volume-Refractory Acute Renal Deterioration',
          observedCaseValue: 'Creatinine climbed from 2.4 to 3.4 mg/dL despite 3L IV saline',
          expectedUnderWorkingDiagnosis: 'Prompt drop in serum creatinine towards baseline (0.9 mg/dL) within 24-48 hours',
          contradictionSignificance:
            'Pre-renal azotemia is by definition functional and reversible with restoration of renal perfusion pressure. Progressive azotemia despite volume repletion indicates parenchymal injury.',
          severity: 'critical',
          sourceDocId: 'doc-jasn-anca-rpgn-pitfalls',
          citationTitle: 'JASN: Diagnostic Delay and Misattribution in ANCA RPGN',
          citationQuote:
            'Failure of renal function to improve after 24-48 hours of adequate intravascular volume repletion is a hallmark disconfirming signal for pre-renal azotemia.',
          folderPath: '/nas/journal_archive/jasn_anca_vasculitis_early_recognition_pitfalls.md',
        },
        {
          id: 'c3-02-rbc-casts',
          category: 'urinalysis',
          findingTitle: 'Pathognomonic Red Blood Cell Casts & Acanthocytes',
          observedCaseValue: '3-5 RBC casts/LPF, 40-60 RBC/HPF (80% acanthocytes)',
          expectedUnderWorkingDiagnosis: 'Bland sediment; hyaline casts only',
          contradictionSignificance:
            'RBC casts are pathognomonic of glomerulonephritis or vasculitis and never occur in pre-renal azotemia.',
          severity: 'critical',
          sourceDocId: 'doc-urinalysis-sediment-atlas',
          citationTitle: 'ASN Urine Sediment Expert Working Group',
          citationQuote:
            'Finding even a single unambiguous RBC cast definitively invalidates a purely pre-renal or vascular diagnosis.',
          folderPath: '/nas/pathology_reports/urine_microscopy_sediment_diagnostic_atlas.md',
        },
        {
          id: 'c3-03-purpura',
          category: 'clinical_history',
          findingTitle: 'Palpable Purpura & Chronic Sinusitis Crusting',
          observedCaseValue: 'Non-blanching palpable purpura on ankles; mucosal crusting',
          expectedUnderWorkingDiagnosis: 'Absence of cutaneous leukocytoclastic vasculitis or upper airway necrosis',
          contradictionSignificance:
            'Strong clinical evidence of small-vessel systemic vasculitis (e.g. Granulomatosis with Polyangiitis or Microscopic Polyangiitis).',
          severity: 'critical',
          sourceDocId: 'doc-jasn-anca-rpgn-pitfalls',
          citationTitle: 'JASN: Diagnostic Delay in ANCA RPGN',
          citationQuote:
            'Non-blanching palpable purpura, epistaxis, chronic sinusitis, or unprovoked pulmonary infiltrates indicate systemic necrotizing vasculitis.',
          folderPath: '/nas/journal_archive/jasn_anca_vasculitis_early_recognition_pitfalls.md',
        },
      ],
      supporting: [
        {
          id: 's3-01-diuretic-use',
          category: 'clinical_history',
          findingTitle: 'History of Hydrochlorothiazide Use',
          observedCaseValue: 'HCTZ 25 mg daily',
          consistencyRationale: 'Provided the initial cognitive anchor for suspecting diuretic-induced volume depletion.',
        },
      ],
      missing: [
        {
          id: 'm3-01-anca-stat',
          testName: 'STAT PR3-ANCA, MPO-ANCA, and Anti-GBM Serologies',
          clinicalPurpose: 'Establish diagnosis of pauci-immune vasculitis or anti-GBM disease.',
          diagnosticImpact: 'Guides emergency immunosuppressive induction.',
          referencedGuideline: 'KDIGO 2024 Vasculitis Emergency Guidelines',
        },
        {
          id: 'm3-02-urgent-biopsy',
          testName: 'STAT Percutaneous Renal Biopsy',
          clinicalPurpose: 'Assess percent cellular crescents, capillary necrosis, and rule out immune complex vs pauci-immune RPGN.',
          diagnosticImpact: 'Definitive diagnosis; presence of cellular crescents mandates immediate methylprednisolone / rituximab.',
          referencedGuideline: 'KDIGO 2024 Vasculitis Management',
        },
      ],
      inconclusive: [
        {
          id: 'i3-01-low-titer-ana',
          findingTitle: 'ANA 1:80 Speckled Pattern',
          observedValue: '1:80 titer',
          ambiguityReason: 'Low-titer ANA is present in 15-20% of elderly women and is non-specific.',
        },
      ],
    },
    competingHypotheses: [
      {
        diseaseName: 'ANCA-Associated Crescentic Glomerulonephritis (GPA / MPA)',
        alternativeType: 'primary_differential',
        clinicalRationale:
          'Classic triad of acute rapidly progressive renal failure, active nephritic sediment with RBC casts, and systemic small-vessel vasculitis (purpura, sinus crusting).',
        supportingFindings: ['Refractory acute kidney injury', 'RBC casts and acanthocytes', 'Palpable purpura', 'Sinusitis'],
        contradictoryOrAbsenceFindings: ['ANCA serology currently pending / not finalized'],
        requiredWorkupToConfirmOrRefute: ['Emergency renal biopsy demonstrating pauci-immune necrotizing crescentic GN', 'PR3/MPO serologies'],
        citedDocIds: ['doc-jasn-anca-rpgn-pitfalls', 'doc-kdigo-anca-vasculitis-management', 'doc-pathology-crescentic-rpgn'],
      },
      {
        diseaseName: 'Anti-GBM Disease (Goodpasture Syndrome)',
        alternativeType: 'secondary_consideration',
        clinicalRationale: 'Causes fulminant rapidly progressive crescentic GN, often presenting with oliguric renal failure and active sediment.',
        supportingFindings: ['Rapid acute creatinine escalation', 'RBC casts'],
        contradictoryOrAbsenceFindings: ['No overt hemoptysis or pulmonary hemorrhage currently reported'],
        requiredWorkupToConfirmOrRefute: ['Serum anti-GBM antibody titer', 'Linear IgG immunofluorescence on renal biopsy'],
        citedDocIds: ['doc-kdigo-anca-vasculitis-management', 'doc-pathology-crescentic-rpgn'],
      },
    ],
    diagnosticDilemmas: [
      'Is the clinical team continuing to administer IV saline for presumed dehydration while cellular crescents form in the glomeruli?',
      'Why has urgent nephrology consultation or renal biopsy been delayed for ANCA testing when progressive oliguria is present?',
    ],
    recommendedClinicalInquiries: [
      'Order STAT PR3-ANCA, MPO-ANCA, and anti-GBM titers',
      'Perform urgent renal biopsy without waiting for serology if renal function is actively deteriorating',
      'Discontinue unnecessary IV volume overload to prevent pulmonary edema in oliguric renal failure',
    ],
    traceableSourceCitations: [
      {
        docId: 'doc-jasn-anca-rpgn-pitfalls',
        title: 'Diagnostic Delay and Misattribution in ANCA RPGN',
        source: 'JASN',
        folderPath: '/nas/journal_archive/jasn_anca_vasculitis_early_recognition_pitfalls.md',
        relevantExcerpt:
          'In an audit of 210 patients with biopsy-proven pauci-immune necrotizing crescentic glomerulonephritis, 68% were initially diagnosed with "pre-renal azotemia" due to concurrent diuretic use or dehydration.',
      },
      {
        docId: 'doc-kdigo-anca-vasculitis-management',
        title: 'KDIGO 2024 Vasculitis Management Guidelines',
        source: 'KDIGO Vasculitis Work Group',
        folderPath: '/nas/clinical_guidelines/kdigo_2024_anca_vasculitis_management.md',
        relevantExcerpt:
          'Any patient with acute renal function decline accompanied by an active urinary sediment must be treated as a medical emergency. Do not delay renal biopsy while awaiting serology results if renal function is actively deteriorating.',
      },
    ],
    safetyDisclaimer:
      'CONTRA is a diagnostic research and reasoning support system designed to challenge diagnostic assumptions and mitigate cognitive anchoring bias. This analysis is generated for qualified clinical review only and does not constitute a definitive medical diagnosis, prescription, or therapeutic instruction.',
  },
};
