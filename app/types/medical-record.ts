// Medical Record Types

export interface Patient {
  id: string;
  fullName: string;
  idNumber: string;
  insuranceType?: string;
  phone?: string;
  email?: string;
}

export interface MedicalRecordFormData {
  // Patient data
  patientId?: string;
  recordDate: string;
  patientName: string;
  patientIdNumber: string;
  insuranceType: string;

  // Biometric data
  age: number;
  weight: number;
  height: number;
  bmi?: number;

  // Vital signs
  bloodPressure: string;
  heartRate: number;
  oxygenSaturation: number;
  temperature: number;

  // Consultation
  consultationReason: string;
  cie10Code: string;
  currentIllness: string;
  illnessEvolution: string;

  // Personal history
  cardiovascularRiskFactors: string[];
  cardiovascularHistory: string;
  personalPathologicalHistory: string;
  surgicalHistory: string;
  habitualMedication: string[];
  allergies: string;
  familyPathologicalHistory: string;

  // System review
  skinAndAppendages: string;
  respiratorySystem: string;
  cardiovascularSystem: string;
  gastrointestinalSystem: string;
  genitourinarySystem: string;
  musculoskeletalSystem: string;
  endocrineSystem: string;
  neurologicalSystem: string;

  // Physical exam
  generalInspection: string;
  glasgowScale: string;
  neck: string;
  thorax: string;
  heart: string;
  lungs: string;
  abdomen: string;
  upperExtremities: string;
  lowerExtremities: string;

  // Studies
  studiesPerformed: string[];
  studiesResults: string;

  // Treatment plan
  followUpDate: string;
  rest: string;
  diet: string;
  physicalActivity: string;
  alarmSigns: string;
  additionalStudies: string[];

  // Medications
  prescribedMedications: string[];
  treatmentObservations: string;
}

export interface MedicalRecord extends MedicalRecordFormData {
  id: string;
  patientId: string;
  doctorId: string;
  createdAt: Date;
  updatedAt: Date;
}
