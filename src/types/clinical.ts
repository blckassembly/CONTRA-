/**
 * CONTRA — Clinical Contradiction Intelligence Types
 */

export interface UrinalysisData {
  appearance: string;
  specificGravity: number;
  pH: number;
  proteinDipstick: string;
  proteinQuantitative24h: string; // e.g. "4.2 g/24h"
  bloodDipstick: string;
  rbcPerHpf: string;
  wbcPerHpf: string;
  casts: string[];
  dysmorphicRbcPercent?: number; // e.g. 65% acanthocytes
  glucosuria: string;
}

export interface LongitudinalPoint {
  date: string;
  monthOffset: number;
  serumCreatinine: number; // mg/dL
  eGFR: number; // mL/min/1.73m2
  proteinuriaGrams24h: number; // g/day
  systolicBp: number;
  diastolicBp: number;
}

export interface ClinicalCase {
  id: string;
  caseNumber: string;
  title: string;
  shortSummary: string;
  demographics: {
    age: number;
    gender: 'Male' | 'Female';
    ethnicity?: string;
    occupation?: string;
  };
  workingDiagnosis: string;
  workingDiagnosisRationale: string;
  clinicalQuestion: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string[];
  currentMedications: string[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperatureCelsius: number;
    bmi: number;
  };
  physicalExamFindings: string[];
  urinalysis: UrinalysisData;
  laboratoryFindings: {
    serumCreatinine: number;
    baselineCreatinine: number;
    eGFR: number;
    bun: number;
    serumAlbumin: number; // g/dL
    potassium: number;
    hemoglobin: number;
    hba1c?: number;
    complementC3?: string;
    complementC4?: string;
    anaTiter?: string;
    ancaSerology?: string;
    antiPla2r?: string;
    serumFreeLightChains?: string;
    hepatitisPanel?: string;
  };
  imaging: {
    modality: string;
    findings: string;
  };
  biopsy: {
    performed: boolean;
    findings?: string;
    lightMicroscopy?: string;
    immunofluorescence?: string;
    electronMicroscopy?: string;
  };
  longitudinalTrends: LongitudinalPoint[];
  tags: string[];
}

export interface NASDocument {
  id: string;
  title: string;
  folderPath: string;
  authorOrSource: string;
  year: number;
  category: 'guideline' | 'pathology_atlas' | 'peer_reviewed_study' | 'institutional_case';
  abstract: string;
  fullExcerpt: string;
  keyKeywords: string[];
  relevantDiseases: string[];
  evidenceLevel: string;
}

export interface ContradictionFinding {
  id: string;
  category: 'clinical_history' | 'laboratory' | 'urinalysis' | 'imaging' | 'biopsy';
  findingTitle: string;
  observedCaseValue: string;
  expectedUnderWorkingDiagnosis: string;
  contradictionSignificance: string;
  severity: 'critical' | 'moderate' | 'observation';
  sourceDocId?: string;
  citationTitle?: string;
  citationQuote?: string;
  folderPath?: string;
}

export interface SupportingFinding {
  id: string;
  category: string;
  findingTitle: string;
  observedCaseValue: string;
  consistencyRationale: string;
  sourceDocId?: string;
  citationQuote?: string;
}

export interface MissingWorkupItem {
  id: string;
  testName: string;
  clinicalPurpose: string;
  diagnosticImpact: string;
  referencedGuideline?: string;
}

export interface InconclusiveFinding {
  id: string;
  findingTitle: string;
  observedValue: string;
  ambiguityReason: string;
}

export interface AlternativeHypothesis {
  diseaseName: string;
  alternativeType: 'primary_differential' | 'secondary_consideration' | 'underlying_etiology';
  clinicalRationale: string;
  supportingFindings: string[];
  contradictoryOrAbsenceFindings: string[];
  requiredWorkupToConfirmOrRefute: string[];
  citedDocIds: string[];
}

export interface ContradictionReport {
  caseId: string;
  workingDiagnosis: string;
  clinicalQuestion: string;
  timestamp: string;
  auditEngine: string;
  executiveSummary: string;
  contradictionAlertLevel: 'High Discrepancy' | 'Moderate Discrepancy' | 'Low Discrepancy / Consistent';
  evidenceClassification: {
    contradictory: ContradictionFinding[];
    supporting: SupportingFinding[];
    missing: MissingWorkupItem[];
    inconclusive: InconclusiveFinding[];
  };
  competingHypotheses: AlternativeHypothesis[];
  diagnosticDilemmas: string[];
  recommendedClinicalInquiries: string[];
  traceableSourceCitations: Array<{
    docId: string;
    title: string;
    source: string;
    folderPath: string;
    relevantExcerpt: string;
  }>;
  safetyDisclaimer: string;
}

export interface FollowUpResponse {
  answer: string;
  relevantFindings: string[];
  competingConsiderations: string[];
  citations: Array<{
    docId: string;
    title: string;
    quote: string;
  }>;
}
