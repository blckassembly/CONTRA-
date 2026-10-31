import { NASDocument } from '../types/clinical.ts';

export const NAS_DOCUMENTS: NASDocument[] = [
  {
    id: 'doc-kdigo-2024-glomerular',
    title: 'KDIGO 2024 Clinical Practice Guideline for the Management of Glomerular Diseases',
    folderPath: '/nas/clinical_guidelines/kdigo_2024_glomerular_diseases.md',
    authorOrSource: 'Kidney Disease: Improving Global Outcomes (KDIGO) Glomerular Diseases Work Group',
    year: 2024,
    category: 'guideline',
    evidenceLevel: 'Level 1A Consensus Recommendation',
    abstract: 'Comprehensive evidence-based recommendations on the diagnosis and risk stratification of glomerular nephropathies including membranous nephropathy, IgA nephropathy, minimal change disease, and FSGS.',
    fullExcerpt: `Section 2.1: Evaluation of Proteinuria and Suspected Secondary Glomerular Etiologies
In hypertensive patients presenting with chronic kidney disease, proteinuria exceeding 1.5 g/24h is distinctly uncommon in uncomplicated hypertensive arteriolar nephrosclerosis. Daily protein excretion exceeding 3.0 g/24h (nephrotic range) accompanied by microscopic hematuria (>5 dysmorphic RBCs/HPF or acanthocytes) should strongly prompt suspicion of an underlying primary or secondary glomerulopathy (e.g., FSGS, membranous nephropathy, or IgA nephropathy). Under such circumstances, attributing progressive renal impairment solely to benign hypertensive nephrosclerosis constitutes a high-risk diagnostic trap. A definitive diagnostic renal biopsy is recommended unless specific anatomical contraindications exist.

Section 4.3: Diagnostic Evaluation of Membranous Nephropathy
Patients presenting with unexplained nephrotic syndrome should be tested for circulating anti-phospholipase A2 receptor (anti-PLA2R) autoantibodies. In patients with normal or mildly reduced eGFR (>60 mL/min/1.73m2), nephrotic proteinuria, and high-titer anti-PLA2R autoantibodies (>14 RU/mL), a serologic diagnosis of primary membranous nephropathy can be established with >99% specificity without the strict requirement of an invasive kidney biopsy, provided secondary etiologies (malignancy, lupus, hepatitis B/C, NSAID toxicity) are excluded.`,
    keyKeywords: ['hypertensive nephrosclerosis', 'proteinuria thresholds', 'PLA2R', 'membranous nephropathy', 'renal biopsy criteria', 'dysmorphic hematuria'],
    relevantDiseases: ['Hypertensive Nephrosclerosis', 'Membranous Nephropathy', 'FSGS', 'IgA Nephropathy'],
  },
  {
    id: 'doc-aha-hypertension-nephro',
    title: 'AHA/ACC Scientific Statement: Renal Parenchymal Manifestations of Systemic Hypertension',
    folderPath: '/nas/clinical_guidelines/aha_acc_hypertension_renal_manifestations.md',
    authorOrSource: 'American Heart Association / American College of Cardiology Council on the Kidney',
    year: 2023,
    category: 'guideline',
    evidenceLevel: 'Level 1B Expert Consensus',
    abstract: 'Delineates the clinical, laboratory, and longitudinal trajectories of hypertensive nephrosclerosis and renal microvascular remodeling.',
    fullExcerpt: `Diagnostic Criteria and Caveats for Benign Nephrosclerosis:
1. Longstanding history (usually >10 years) of moderate-to-severe systemic arterial hypertension preceding kidney dysfunction.
2. Presence of hypertensive target-organ damage (e.g., left ventricular hypertrophy, hypertensive retinopathy Grade II-IV).
3. Longitudinal kidney function decline is characteristically gradual and indolent, with an average eGFR decline of 1 to 3 mL/min/1.73m2 per year. Rapid loss of >5 mL/min/year is uncharacteristic of uncomplicated nephrosclerosis and requires immediate search for bilateral renal artery stenosis, accelerated-malignant hypertension, or superimposed glomerulonephritis.
4. Urinalysis reveals bland sediment with absent or sparse cellular casts (<3 hyaline casts/LPF, absence of RBC casts). Proteinuria is typically subnephrotic (<1.0 g/24 hours).
5. Diagnostic Red Flag: The presence of dysmorphic red blood cells (acanthocytes) or proteinuria >2.0 g/24h fundamentally argues against pure hypertensive arteriolar sclerosis.`,
    keyKeywords: ['benign nephrosclerosis', 'bland sediment', 'indolent decline', 'hypertensive retinopathy', 'red flags'],
    relevantDiseases: ['Hypertensive Nephrosclerosis', 'Renal Artery Stenosis', 'Malignant Hypertension'],
  },
  {
    id: 'doc-pathology-biopsy-atlas-htn-vs-fsgs',
    title: 'Renal Pathology Atlas: Distinguishing Hypertensive Vascular Injury from Focal Segmental Glomerulosclerosis',
    folderPath: '/nas/pathology_reports/renal_biopsy_atlas_hypertensive_vs_fsgs.md',
    authorOrSource: 'Department of Renal Pathology, University Medical Center',
    year: 2024,
    category: 'pathology_atlas',
    evidenceLevel: 'Pathologic Gold Standard Analysis',
    abstract: 'Histopathologic comparison of medial hypertrophy, hyaline arteriolosclerosis, podocyte foot process effacement, and segmental sclerosis lesions.',
    fullExcerpt: `Histologic Diagnostic Differential:
Hypertensive nephrosclerosis demonstrates concentric medial hypertrophy and intimal fibroelastic hyperplasia of interlobular arteries, alongside subendothelial hyalinosis of afferent arterioles ("onion-skinning" in malignant phases; homogeneous eosinophilic hyaline in chronic phases). Glomeruli show ischemic wrinkling of basement membranes and global obsolescence (shrinkage without proliferation).

Crucial Pathologic Differentiation from Primary/Secondary FSGS:
FSGS features focal and segmental consolidation of the tuft with obliteration of capillary lumina, hyalinosis, foam cells, and synechiae formation with Bowman's capsule. On electron microscopy:
- Hypertensive nephrosclerosis: Podocyte foot process effacement is patchy, irregular, and typically involves <20-30% of the surface area.
- Primary FSGS: Diffuse, extensive podocyte foot process effacement (>80-90%), accompanied by podocyte detachment.
- When a clinician encounters nephrotic-range proteinuria in a hypertensive patient, biopsy frequently reveals secondary FSGS (hyperfiltration injury due to reduced nephron mass) or an unrecognized primary podocytopathy rather than pure vascular sclerosis.`,
    keyKeywords: ['hyaline arteriolosclerosis', 'foot process effacement', 'podocyte detachment', 'segmental sclerosis', 'synechiae'],
    relevantDiseases: ['Hypertensive Nephrosclerosis', 'Focal Segmental Glomerulosclerosis', 'Minimal Change Disease'],
  },
  {
    id: 'doc-nejm-proteinuria-hypertension',
    title: 'Proteinuria Thresholds and Misattribution in Hypertensive Renal Disease: A Prospective Cohort',
    folderPath: '/nas/journal_archive/nejm_proteinuria_thresholds_hypertensive_nephrosclerosis.md',
    authorOrSource: 'New England Journal of Medicine, Clinical Research Series',
    year: 2023,
    category: 'peer_reviewed_study',
    evidenceLevel: 'Prospective Multicenter Cohort (n=1,420)',
    abstract: 'Investigated clinical misattribution rates in patients diagnosed with hypertensive nephrosclerosis who underwent renal biopsy due to heavy proteinuria.',
    fullExcerpt: `Results of the Biopsy in Hypertensive Nephrosclerosis (BIHYPNO) Cohort:
In 340 consecutive patients clinically labeled with "hypertensive nephrosclerosis" who developed proteinuria >2.0 g/24h and underwent diagnostic percutaneous renal biopsy:
- Only 7.6% demonstrated isolated arteriolar nephrosclerosis as the sole finding.
- 51.2% were diagnosed with biopsy-proven Focal Segmental Glomerulosclerosis (FSGS), predominantly tip or perihilar variants.
- 18.5% exhibited Primary Membranous Nephropathy (PLA2R or THSD7A positive).
- 14.1% were diagnosed with IgA Nephropathy.
- 8.6% had other forms of proliferative or tubulointerstitial disease.

Conclusion:
In hypertensive individuals, heavy proteinuria (>2 g/24h) and active urinary sediment represent definitive clinical disconfirming evidence against isolated hypertensive nephrosclerosis. Diagnostic inertia resulting in failure to biopsy leads to inappropriate management and missed opportunities for targeted immunosuppressive or immunomodulatory therapies.`,
    keyKeywords: ['BIHYPNO cohort', 'misattribution rate', 'FSGS incidence', 'membranous nephropathy', 'biopsy yield'],
    relevantDiseases: ['Hypertensive Nephrosclerosis', 'Focal Segmental Glomerulosclerosis', 'Membranous Nephropathy', 'IgA Nephropathy'],
  },
  {
    id: 'doc-kdigo-diabetic-kidney-disease',
    title: 'KDIGO 2023 Clinical Practice Guideline for Diabetes Management in Chronic Kidney Disease',
    folderPath: '/nas/clinical_guidelines/kdigo_2023_diabetic_kidney_disease_management.md',
    authorOrSource: 'KDIGO Diabetes Work Group',
    year: 2023,
    category: 'guideline',
    evidenceLevel: 'Level 1A Recommendation',
    abstract: 'Guidelines covering screening, diagnosis, and identification of non-diabetic kidney disease (NDKD) in diabetic patients.',
    fullExcerpt: `Recommendation 1.3: Indications for Renal Biopsy to Rule Out Non-Diabetic Kidney Disease (NDKD)
Clinicians should NOT assume that all renal dysfunction in a patient with diabetes is diabetic kidney disease (DKD). Renal biopsy should be strongly considered in patients with diabetes when any of the following atypical features are present:
1. Absence of diabetic retinopathy, especially in patients with Type 1 diabetes (negative predictive value ~95%) and Type 2 diabetes (negative predictive value ~70-80%).
2. Heavy proteinuria (>3.0 g/24h) developing rapidly (<1-2 years) after diabetes onset.
3. Sudden, explosive onset of full nephrotic syndrome (DKD typically follows a predictable decades-long progression from normoalbuminuria to microalbuminuria, macroalbuminuria, and progressive azotemia over 10-20 years).
4. Rapidly declining GFR (>5 mL/min/1.73m2 per year).
5. Active urinary sediment containing red blood cell casts or dysmorphic acanthocytes.
6. Refractory hypertension or clinical signs of another systemic disease (rash, fever, hypocomplementemia).`,
    keyKeywords: ['diabetic kidney disease', 'non-diabetic kidney disease (NDKD)', 'diabetic retinopathy concordance', 'explosive proteinuria', 'active sediment'],
    relevantDiseases: ['Diabetic Kidney Disease', 'Membranous Nephropathy', 'IgA Nephropathy', 'Minimal Change Disease'],
  },
  {
    id: 'doc-lancet-ndkd-in-diabetes',
    title: 'Prevalence and Determinants of Non-Diabetic Kidney Disease in Patients with Type 2 Diabetes',
    folderPath: '/nas/journal_archive/lancet_nephrol_atypical_presentations_diabetic_nephropathy.md',
    authorOrSource: 'The Lancet Diabetes & Endocrinology',
    year: 2024,
    category: 'peer_reviewed_study',
    evidenceLevel: 'Systematic Review and Meta-Analysis (48 studies, n=4,876)',
    abstract: 'Quantifies the frequency of non-diabetic renal pathologies identified on biopsy in diabetic patients with atypical renal findings.',
    fullExcerpt: `Meta-Analysis Findings:
Across biopsy-indicated diabetic cohorts, non-diabetic kidney disease (either isolated NDKD or superimposed on diabetic glomerulosclerosis) was diagnosed in 42.8% of patients.
The most frequent biopsy findings in diabetic patients lacking retinopathy were:
- Membranous Nephropathy (26.3% of NDKD cases)
- IgA Nephropathy (22.1%)
- Minimal Change Disease (14.2%)
- Crescentic Glomerulonephritis / Vasculitis (9.4%)

The combination of absent diabetic retinopathy and acute onset of severe nephrotic proteinuria yielded a positive predictive value for NDKD of 88.4%. The authors conclude that empirical treatment of acute nephrotic syndrome as "diabetic nephropathy" without biopsy or PLA2R serology denies patients specific remission-inducing therapies.`,
    keyKeywords: ['non-diabetic kidney disease', 'meta-analysis', 'retinopathy absence', 'membranous nephropathy in diabetics', 'predictive values'],
    relevantDiseases: ['Diabetic Kidney Disease', 'Membranous Nephropathy', 'IgA Nephropathy', 'Minimal Change Disease'],
  },
  {
    id: 'doc-jasn-anca-rpgn-pitfalls',
    title: 'Diagnostic Delay and Misattribution in ANCA-Associated Rapidly Progressive Glomerulonephritis',
    folderPath: '/nas/journal_archive/jasn_anca_vasculitis_early_recognition_pitfalls.md',
    authorOrSource: 'Journal of the American Society of Nephrology (JASN)',
    year: 2024,
    category: 'peer_reviewed_study',
    evidenceLevel: 'Observational Multicenter Study',
    abstract: 'Analyzes causes of irreversible renal damage in ANCA vasculitis resulting from misdiagnoses of pre-renal azotemia or ATN.',
    fullExcerpt: `Clinical Pitfalls in Rapidly Progressive Glomerulonephritis (RPGN):
In an audit of 210 patients with biopsy-proven pauci-immune necrotizing crescentic glomerulonephritis:
- 68% were initially diagnosed with "pre-renal azotemia" or "septic acute tubular necrosis" due to concurrent diuretic use, dehydration, or constitutional symptoms.
- The mean diagnostic delay from first abnormal creatinine to correct diagnosis was 34 days, during which 44% progressed to dialysis dependency.
- Hallmark Disconfirming Signals for Pre-Renal Azotemia:
  1. Failure of renal function to improve after 24-48 hours of adequate intravascular volume repletion.
  2. Urinalysis showing brown tea-colored urine, dysmorphic RBCs (>5/HPF), or red cell casts. (Pre-renal azotemia must have a completely bland sediment or hyaline casts only).
  3. Non-blanching palpable purpura, epistaxis, chronic sinusitis, or unprovoked pulmonary infiltrates.
  4. Elevated inflammatory markers (CRP, ESR) and normocytic anemia disproportionate to baseline renal stage.`,
    keyKeywords: ['ANCA vasculitis', 'RPGN', 'pre-renal misdiagnosis', 'volume non-responsive', 'palpable purpura', 'crescentic GN'],
    relevantDiseases: ['ANCA-Associated Vasculitis', 'Pre-Renal Azotemia', 'Acute Tubular Necrosis', 'Rapidly Progressive Glomerulonephritis'],
  },
  {
    id: 'doc-kdigo-anca-vasculitis-management',
    title: 'KDIGO 2024 Clinical Practice Guideline for the Management of ANCA-Associated Vasculitis with Renal Involvement',
    folderPath: '/nas/clinical_guidelines/kdigo_2024_anca_vasculitis_management.md',
    authorOrSource: 'KDIGO Vasculitis Guideline Committee',
    year: 2024,
    category: 'guideline',
    evidenceLevel: 'Level 1A Recommendation',
    abstract: 'Criteria for prompt recognition, urgent biopsy, induction immunosuppression with rituximab/cyclophosphamide, and plasma exchange.',
    fullExcerpt: `Emergency Evaluation of Rapidly Progressive Glomerulonephritis (RPGN):
Any patient with acute renal function decline accompanied by an active urinary sediment (dysmorphic erythrocytes, cellular or red cell casts) and proteinuria must be treated as a medical emergency. Serum anti-neutrophil cytoplasmic antibodies (PR3-ANCA, MPO-ANCA) and anti-glomerular basement membrane (anti-GBM) antibodies must be drawn STAT.
Do not delay nephrology consultation or renal biopsy while awaiting serology results if renal function is actively deteriorating. The presence of cellular crescents on biopsy reflects active glomerular necrosis requiring immediate induction immunosuppression before fibrocellular scar formation causes irreversible glomerulosclerosis.`,
    keyKeywords: ['ANCA serology', 'STAT testing', 'cellular crescents', 'anti-GBM', 'emergency biopsy'],
    relevantDiseases: ['ANCA-Associated Vasculitis', 'Anti-GBM Disease (Goodpasture)', 'Rapidly Progressive Glomerulonephritis'],
  },
  {
    id: 'doc-kidney-intl-iga-nephropathy',
    title: 'The International IgA Nephropathy Network: Clinical and Histologic Predictors of Progression',
    folderPath: '/nas/journal_archive/kidney_intl_iga_nephropathy_oxford_classification.md',
    authorOrSource: 'Kidney International, Official Journal of the International Society of Nephrology',
    year: 2023,
    category: 'peer_reviewed_study',
    evidenceLevel: 'International Multicenter Cohort (n=3,200)',
    abstract: 'Details the synpharyngitic presentation, Oxford MEST-C scoring, and differentiation of IgA nephropathy from post-infectious GN and urological causes.',
    fullExcerpt: `Clinical Phenotype and Timing of Hematuria:
1. Synpharyngitic Macroscopic Hematuria: Grossly visible tea- or cola-colored urine coinciding synchronously (within 24-48 hours) with an upper respiratory tract or gastrointestinal infection is the classic pathognomonic presentation of IgA Nephropathy in young adults.
2. Crucial Distinction from Post-Streptococcal / Post-Infectious Glomerulonephritis (PSGN): PSGN characteristically exhibits a latent period of 1 to 3 weeks between streptococcal pharyngitis (or 2-6 weeks for impetigo) and the onset of acute nephritic syndrome, alongside transient hypocomplementemia (low C3). In contrast, IgA Nephropathy exhibits immediate synpharyngitic onset (<48 hours) and typically maintains completely normal serum complement C3 and C4 levels.
3. Crucial Distinction from Urolithiasis and Bacterial UTI: Repeated episodes of macroscopic hematuria labeled as "recurrent cystitis" despite persistently sterile bacterial cultures, normal renal imaging, and the presence of dysmorphic red cells with proteinuria indicate glomerular hemorrhage, virtually ruling out simple cystitis or micro-calculi.`,
    keyKeywords: ['synpharyngitic hematuria', 'latent period distinction', 'PSGN comparison', 'sterile urine culture', 'Oxford classification', 'normal complement'],
    relevantDiseases: ['IgA Nephropathy', 'Post-Streptococcal Glomerulonephritis', 'Recurrent Cystitis', 'Nephrolithiasis'],
  },
  {
    id: 'doc-pathology-crescentic-rpgn',
    title: 'Pathologic Criteria and Microscopic Findings in Crescentic Glomerulonephritis',
    folderPath: '/nas/pathology_reports/nephropathology_crescentic_rpgn_criteria.md',
    authorOrSource: 'International Society of Nephropathology Reference Atlas',
    year: 2023,
    category: 'pathology_atlas',
    evidenceLevel: 'Consensus Diagnostic Standards',
    abstract: 'Defines cellular crescents, fibrocellular transformation, rupture of Bowman capsule, and immunofluorescence categories.',
    fullExcerpt: `Histologic Criteria:
A diagnosis of crescentic glomerulonephritis is rendered when >=50% of sampled glomeruli contain cellular or fibrocellular crescents. A crescent is formed by proliferation of parietal epithelial cells and infiltrating monocytes/macrophages in Bowman's space, typically triggered by breaks in the glomerular basement membrane and fibrin extravasation.
Immunofluorescence Categorization:
- Type I (Anti-GBM Disease): Linear capillary loop staining for IgG.
- Type II (Immune Complex): Granular "full house" staining (Lupus Nephritis Class IV), IgA-dominant mesangial staining (Henoch-Schönlein Purpura / IgA Vasculitis), or subepithelial humps (Post-infectious GN).
- Type III (Pauci-Immune): Scant or negative immunofluorescence staining (<1+), characteristic of ANCA-associated vasculitis (Granulomatosis with Polyangiitis, Microscopic Polyangiitis).`,
    keyKeywords: ['cellular crescents', 'Bowman space', 'pauci-immune', 'linear IgG', 'immune complex deposition'],
    relevantDiseases: ['ANCA-Associated Vasculitis', 'Anti-GBM Disease', 'Lupus Nephritis Class IV', 'IgA Vasculitis'],
  },
  {
    id: 'doc-rheumatology-lupus-nephritis',
    title: 'ACR/EULAR 2023 Recommendations for the Classification and Evaluation of Lupus Nephritis',
    folderPath: '/nas/clinical_guidelines/acr_eular_lupus_nephritis_recommendations.md',
    authorOrSource: 'American College of Rheumatology & EULAR Joint Task Force',
    year: 2023,
    category: 'guideline',
    evidenceLevel: 'Level 1A Guideline',
    abstract: 'Guidelines for kidney biopsy thresholds, complement monitoring, anti-dsDNA correlation, and immunosuppressive selection.',
    fullExcerpt: `Section 3: Renal Biopsy Thresholds in Suspected Systemic Lupus Erythematosus
Kidney biopsy is recommended in patients with suspected or confirmed SLE when there is objective evidence of renal involvement:
1. Persistent proteinuria >=0.5 g/24h (or urine protein-to-creatinine ratio >=0.5 mg/mg).
2. Active urinary sediment with cellular casts (RBC casts, granular casts) or unexplained hematuria (>5 RBCs/HPF, especially with acanthocytes).
3. Unexplained decline in glomerular filtration rate.

Important Clinical Pitfall:
Patients with "undifferentiated connective tissue disease" or mild lupus symptoms who demonstrate profound hypocomplementemia (markedly decreased serum C3 and C4) and active urinary sediment almost invariably have proliferative lupus nephritis (Class III or Class IV). Relying on the absence of rash or arthritis to defer renal biopsy is a dangerous clinical miscalculation, as silent or paucisymptomatic renal lupus can rapidly progress to irreversible glomerulosclerosis and tubular atrophy if untreated.`,
    keyKeywords: ['lupus nephritis', 'biopsy threshold 0.5g', 'hypocomplementemia', 'C3 C4 consumption', 'Class IV diffuse proliferative'],
    relevantDiseases: ['Lupus Nephritis Class IV', 'Undifferentiated Connective Tissue Disease', 'Systemic Lupus Erythematosus'],
  },
  {
    id: 'doc-ajkd-steroid-resistant-nephrotic',
    title: 'Evaluation of Steroid Resistance in Adult Nephrotic Syndrome: MCD vs. Secondary Podocytopathies',
    folderPath: '/nas/journal_archive/ajkd_steroid_resistance_adult_nephrotic_syndrome.md',
    authorOrSource: 'American Journal of Kidney Diseases (AJKD)',
    year: 2023,
    category: 'peer_reviewed_study',
    evidenceLevel: 'Multicenter Cohort Study (n=560)',
    abstract: 'Evaluates outcomes of empirical steroid therapy versus biopsy-first protocols in adult nephrotic syndrome.',
    fullExcerpt: `Steroid Resistance and Diagnostic Reclassification:
In adult patients initially treated empirically for Minimal Change Disease (MCD):
- Over 80% of true adult MCD patients achieve complete remission within 8 to 16 weeks of daily high-dose corticosteroid therapy (1 mg/kg/day).
- In patients who fail to achieve at least partial remission (proteinuria reduction >50% and <3.5 g/day) by 12 weeks:
  - 68% are found on subsequent renal biopsy to have Focal Segmental Glomerulosclerosis (FSGS), frequently missed initially due to deep juxtamedullary sampling error.
  - 19% have Membranous Nephropathy.
  - 8% have AL or AA Amyloidosis.
  - Only 5% have true steroid-resistant MCD.

Key Contradiction Signal:
Adult patients with nephrotic syndrome who experience rising serum creatinine, hypertension, or persistent high-grade proteinuria after 8-12 weeks of corticosteroid therapy have strong evidence against pure Minimal Change Disease. Continuing unmonitored high-dose steroids in such patients causes severe steroid toxicity (infection, aseptic osteonecrosis, diabetes, psychosis) while failing to treat the underlying disorder.`,
    keyKeywords: ['steroid resistance', 'MCD remission rates', 'FSGS sampling error', 'steroid toxicity', 'biopsy mandatory'],
    relevantDiseases: ['Minimal Change Disease', 'Focal Segmental Glomerulosclerosis', 'Membranous Nephropathy', 'Renal Amyloidosis'],
  },
  {
    id: 'doc-circulation-renal-artery-stenosis',
    title: 'Atherosclerotic Renal Artery Stenosis: Hemodynamic Indicators and the Paradox of Renin-Angiotensin Blockade',
    folderPath: '/nas/journal_archive/circulation_renal_artery_stenosis_acei_azotemia.md',
    authorOrSource: 'Circulation: Cardiovascular Interventions',
    year: 2024,
    category: 'peer_reviewed_study',
    evidenceLevel: 'Prospective Clinical Registry',
    abstract: 'Identifies clinical, auscultatory, and pharmacological markers indicative of critical bilateral renovascular disease.',
    fullExcerpt: `Hemodynamic Criteria and Clinical Predictors of Hemodynamically Significant ARAS:
Atherosclerotic Renal Artery Stenosis (ARAS) should be vigorously suspected when the following criteria converge:
1. Acute deterioration in renal function (rise in serum creatinine >=30% or drop in eGFR >=25%) within 14 days of initiating an ACE inhibitor or Angiotensin Receptor Blocker (ARB). This occurs because efferent arteriolar vasoconstriction driven by angiotensin II is required to maintain glomerular capillary hydraulic pressure across a critically stenosed renal artery; blocking this mechanism abruptly collapses intraglomerular filtration pressure.
2. Refractory or accelerated hypertension resistant to >=3 concurrent antihypertensive drugs of different classes.
3. Presence of an epigastric or flank systolic-diastolic bruit radiating laterally (high specificity >90% when diastolic component is audible).
4. Asymmetric renal bipolar length (>1.5 cm discrepancy between right and left kidneys on ultrasound) or unexplained recurrent flash pulmonary edema in the presence of preserved left ventricular systolic function.`,
    keyKeywords: ['renal artery stenosis', 'ARB azotemia', 'efferent arteriolar collapse', 'epigastric bruit', 'asymmetric kidneys', 'flash pulmonary edema'],
    relevantDiseases: ['Atherosclerotic Renal Artery Stenosis', 'Refractory Hypertension', 'Hypertensive Nephrosclerosis'],
  },
  {
    id: 'doc-pathology-membranous-electron-microscopy',
    title: 'Ultrastructural and Immunofluorescence Patterns of Membranous Glomerulopathy',
    folderPath: '/nas/pathology_reports/electron_microscopy_membranous_pla2r_negative.md',
    authorOrSource: 'Pathology Outlines / International Nephropathology Compendium',
    year: 2024,
    category: 'pathology_atlas',
    evidenceLevel: 'Reference Pathologic Classification',
    abstract: 'Stage I to IV Ehrenreich-Churg classification, spike-and-dome silver stains, and podocyte target antigens.',
    fullExcerpt: `Morphologic Hallmarks of Membranous Nephropathy:
Light Microscopy: Diffuse uniform thickening of glomerular capillary basement membranes without endocapillary hypercellularity. Jones methenamine silver stain reveals characteristic subepithelial "spikes" extending between immune complexes.
Immunofluorescence: Granular, diffuse global capillary wall staining for IgG and C3.
Electron Microscopy: Subepithelial electron-dense deposits situated between the outer aspect of the glomerular basement membrane and overlying podocytes, accompanied by extensive effacement of podocyte foot processes.

Antigenic Subtyping:
- PLA2R: Accounts for 70-80% of primary membranous cases. Highly correlated with circulating anti-PLA2R antibody titers.
- THSD7A: 2-3% of cases; associated in some older series with secondary malignancy screening.
- NELL-1: 5-10% of cases; associated with NSAID use, lipoic acid, or malignancy.
- EXT1/EXT2: Strongly associated with autoimmune secondary membranous (Lupus Nephritis Class V).`,
    keyKeywords: ['subepithelial deposits', 'spikes and domes', 'PLA2R', 'THSD7A', 'NELL-1', 'Jones silver stain'],
    relevantDiseases: ['Membranous Nephropathy', 'Minimal Change Disease', 'Lupus Nephritis Class V'],
  },
  {
    id: 'doc-internal-grand-rounds-nephrosclerosis',
    title: 'Clinical Grand Rounds: The Myth of Malignant Proteinuria in Hypertensive Sclerosis',
    folderPath: '/nas/internal_case_series/renal_grand_rounds_proteinuria_dilemma_2025.md',
    authorOrSource: 'Department of Internal Medicine Grand Rounds, Metropolitan Academic Medical Center',
    year: 2025,
    category: 'institutional_case',
    evidenceLevel: 'Institutional Clinical Review',
    abstract: 'Multi-disciplinary nephrology grand rounds discussing clinical diagnostic complacency in hypertensive kidney disease.',
    fullExcerpt: `Summary of Clinical Discussion:
Dr. E. Vance, Chief of Nephrology: "For decades, clinicians have used 'hypertensive nephrosclerosis' as a clinical wastebasket diagnosis for any hypertensive patient presenting with abnormal creatinine. However, rigorous clinical-pathologic correlation demonstrates that benign hypertension rarely produces more than 1 gram of proteinuria per 24 hours. When you observe 3, 4, or 5 grams of urinary protein alongside microscopic hematuria with acanthocytes, you are almost never looking at simple hypertensive vascular wear-and-tear. You are looking at a glomerulopathy that has been missed or ignored. The consequences of this diagnostic anchor are tragic: patients are given additional blood pressure pills while their podocytes detach, leading to end-stage renal disease that could have been arrested with targeted immunosuppressive therapy."`,
    keyKeywords: ['grand rounds', 'diagnostic wastebasket', 'diagnostic anchor', 'acanthocytes', 'clinical complacency'],
    relevantDiseases: ['Hypertensive Nephrosclerosis', 'FSGS', 'Membranous Nephropathy'],
  },
  {
    id: 'doc-thrombosis-nephrotic-membranous',
    title: 'Thromboembolic Complications in Glomerular Disease: Membranous Nephropathy as a Pro-Thrombotic State',
    folderPath: '/nas/journal_archive/chest_nephrotic_thromboembolism_risk_stratification.md',
    authorOrSource: 'CHEST Journal / American College of Chest Physicians',
    year: 2024,
    category: 'peer_reviewed_study',
    evidenceLevel: 'Cohort Registry Study',
    abstract: 'Quantifies the incidence of deep venous thrombosis, pulmonary embolism, and renal vein thrombosis across histologic subtypes of nephrotic syndrome.',
    fullExcerpt: `Thromboembolic Incidence by Histologic Subtype:
Among all adult patients with nephrotic syndrome, Membranous Nephropathy conveys the highest absolute risk of venous thromboembolism (VTE):
- Membranous Nephropathy: 29.4% incidence of venous thromboembolic events (including deep vein thrombosis, pulmonary embolism, and renal vein thrombosis).
- Focal Segmental Glomerulosclerosis (FSGS): 9.2% incidence.
- Minimal Change Disease (MCD): 6.8% incidence.
- Diabetic Nephropathy: 4.1% incidence.

Risk Predictors:
Serum albumin <2.5 g/dL combined with 24-hour proteinuria >8.0 g in membranous nephropathy creates a profound pro-thrombotic state due to urinary loss of antithrombin III, protein C/S, and hepatic hyper-synthesis of fibrinogen.
Diagnostic Implication: When an adult presents with unprovoked deep vein thrombosis in the setting of newly discovered high-grade nephrotic syndrome, membranous nephropathy is the statistical and clinical front-runner over minimal change disease.`,
    keyKeywords: ['thromboembolism', 'DVT', 'renal vein thrombosis', 'antithrombin III loss', 'pro-thrombotic membranous'],
    relevantDiseases: ['Membranous Nephropathy', 'Minimal Change Disease', 'FSGS'],
  },
  {
    id: 'doc-urinalysis-sediment-atlas',
    title: 'The Active Urine Sediment: Identification of Acanthocytes, Dysmorphic Erythrocytes, and Cellular Casts',
    folderPath: '/nas/pathology_reports/urine_microscopy_sediment_diagnostic_atlas.md',
    authorOrSource: 'American Society of Nephrology (ASN) Urine Sediment Expert Working Group',
    year: 2024,
    category: 'pathology_atlas',
    evidenceLevel: 'Diagnostic Competency Atlas',
    abstract: 'Phase-contrast and brightfield microscopy standards for distinguishing glomerular from non-glomerular hematuria.',
    fullExcerpt: `Morphologic Criteria for Glomerular Hematuria:
1. Acanthocytes (G1 cells): Ring-shaped erythrocytes with one or more vesicle-like blebs/protrusions. The presence of >=5% acanthocytes in the total urinary erythrocyte population has a specificity of 98% and positive predictive value of 95% for glomerular bleeding.
2. Red Blood Cell Casts: Cylindrical structures containing intact or degenerating erythrocytes embedded in a Tamm-Horsfall mucoprotein matrix. Pathognomonic for active glomerulonephritis or vasculitis.
3. Pre-renal azotemia, ischemic acute tubular necrosis, and uncomplicated hypertensive nephrosclerosis do NOT produce red blood cell casts. Finding even a single unambiguous RBC cast definitively invalidates a purely pre-renal or vascular diagnosis and demands evaluation for glomerulonephritis.`,
    keyKeywords: ['acanthocytes', 'G1 cells', 'RBC casts', 'glomerular hematuria', 'Tamm-Horsfall'],
    relevantDiseases: ['Glomerulonephritis', 'ANCA Vasculitis', 'Lupus Nephritis', 'Hypertensive Nephrosclerosis'],
  },
  {
    id: 'doc-institutional-pathology-registry',
    title: 'Institutional Nephropathology Registry: Review of 1,200 Adult Renal Biopsies',
    folderPath: '/nas/internal_case_series/institutional_pathology_registry_unexplained_esrd.md',
    authorOrSource: 'Hospital Diagnostic Quality & Patient Safety Committee',
    year: 2025,
    category: 'institutional_case',
    evidenceLevel: 'Institutional Quality Review',
    abstract: 'Reviews diagnostic discordance between pre-biopsy working diagnoses and final renal pathology over a 5-year period.',
    fullExcerpt: `Key Quality Findings:
- Overall Diagnostic Discordance Rate: 41.2% of adult renal biopsies resulted in a major modification of the clinical working diagnosis.
- Top Misdiagnosed Conditions Prior to Biopsy:
  1. Pre-renal failure (ultimately proven to be Crescentic GN / ANCA or AIN in 32% of biopsied cases).
  2. Hypertensive nephrosclerosis (ultimately proven to be FSGS or IgA nephropathy in 54% of cases with proteinuria >1.5g).
  3. Diabetic nephropathy (proven to be Membranous Nephropathy or Minimal Change Disease in 28% of cases lacking retinopathy).
Conclusion: Cognitive anchoring and confirmation bias remain the dominant systemic vulnerabilities in renal medicine. Implementation of structured contradiction review protocols is strongly endorsed.`,
    keyKeywords: ['diagnostic discordance', 'quality review', 'anchoring bias', 'cognitive bias', 'biopsy modification'],
    relevantDiseases: ['All Nephropathies', 'Diagnostic Quality', 'Patient Safety'],
  },
];
