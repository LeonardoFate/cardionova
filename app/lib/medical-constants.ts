// Medical Records Constants

// Cardiovascular Risk Factors
export const CARDIOVASCULAR_RISK_FACTORS = [
  "HIPERTENSION ARTERIAL",
  "DIABETES MELLITUS TIPO 2 IR",
  "DIABETES MELLITUS TIPO 2 NIR",
  "DISLIPEMIA",
  "HIPERTRIGLICERIDEMIA",
  "HIPERCOLESTEROLEMIA",
  "TABAQUISMO",
  "OBESIDAD",
  "ESTRÉS",
  "ENFERMEDAD RENAL CRONICA",
  "CONSUMO DE DROGAS",
] as const;

// Common Medications
export const COMMON_MEDICATIONS = [
  "Enalapril 10mg",
  "Losartán 50mg",
  "Amlodipina 5mg",
  "Atenolol 50mg",
  "Metoprolol 50mg",
  "Simvastatina 20mg",
  "Atorvastatina 20mg",
  "Aspirina 100mg",
  "Clopidogrel 75mg",
  "Furosemida 40mg",
] as const;

// Available Medical Studies
export const MEDICAL_STUDIES = [
  "Electrocardiograma",
  "Ecocardiograma",
  "Prueba de esfuerzo",
  "Holter de ritmo 24hs",
  "Holter de presión 24hs",
  "Radiografía de tórax",
  "Tomografía cardíaca",
  "Cateterismo cardíaco",
  "Laboratorio completo",
  "Perfil lipídico",
] as const;

// Default values for system review
export const SYSTEM_REVIEW_DEFAULTS = {
  skinAndAppendages: "NADA QUE LLAME LA ATENCIÓN",
  respiratorySystem: "NADA QUE LLAME LA ATENCIÓN",
  cardiovascularSystem: "NADA QUE LLAME LA ATENCIÓN",
  gastrointestinalSystem: "NADA QUE LLAME LA ATENCIÓN",
  genitourinarySystem: "NADA QUE LLAME LA ATENCIÓN",
  musculoskeletalSystem: "NADA QUE LLAME LA ATENCIÓN",
  endocrineSystem: "NADA QUE LLAME LA ATENCIÓN",
  neurologicalSystem: "NADA QUE LLAME LA ATENCIÓN",
} as const;

// Default values for physical exam
export const PHYSICAL_EXAM_DEFAULTS = {
  generalInspection: "PACIENTE ORIENTADO EN TIEMPO Y ESPACIO, COLABORA CON EL INTERROGATORIO",
  glasgowScale: "15/15",
  neck: "MOVIL - NO ADENOPATIAS PALPABLES - YUGULAR 0/3",
  thorax: "SIMETRICO",
  heart: "RUIDOS CARDIACOS RITMICOS, NO SOPLOS, NO RUIDOS AGREGADOS",
  lungs: "CLAROS Y VENTILADOS",
  abdomen: "BLANDO DEPRESIBLE NO DOLOROSO, NO MASAS RUIDOS HIDROAEREOS PRESENTES",
  upperExtremities: "SIMETRICAS - MOVILES - NO DOLOROSOS - PULSOS PRESENTES",
  lowerExtremities: "SIMETRICAS - MOVILES - NO DOLOROSOS - PULSOS PRESENTES - NO EDEMA",
} as const;

// BMI calculation helper
export function calculateBMI(weight: number, height: number): number | null {
  if (!weight || !height || weight <= 0 || height <= 0) {
    return null;
  }
  // height is in cm, convert to meters
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 100) / 100; // Round to 2 decimal places
}

// BMI classification
export function getBMIClassification(bmi: number): string {
  if (bmi < 18.5) return "Bajo peso";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Sobrepeso";
  if (bmi < 35) return "Obesidad I";
  if (bmi < 40) return "Obesidad II";
  return "Obesidad III";
}

// Validation helpers
export function isValidBloodPressure(bp: string): boolean {
  const regex = /^\d{2,3}\/\d{2,3}$/;
  return regex.test(bp);
}

export function formatBloodPressure(systolic: number, diastolic: number): string {
  return `${systolic}/${diastolic}`;
}
