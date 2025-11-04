"use client";

import { useState, useEffect } from "react";
import { MedicalRecordFormData } from "@/app/types/medical-record";
import {
  calculateBMI,
  SYSTEM_REVIEW_DEFAULTS,
  PHYSICAL_EXAM_DEFAULTS,
} from "@/app/lib/medical-constants";

const getInitialFormData = (): MedicalRecordFormData => ({
  // Patient data
  recordDate: new Date().toISOString().split("T")[0],
  patientName: "",
  patientIdNumber: "",
  insuranceType: "",

  // Biometric data
  age: 0,
  weight: 0,
  height: 0,
  bmi: 0,

  // Vital signs
  bloodPressure: "120/80",
  heartRate: 0,
  oxygenSaturation: 0,
  temperature: 0,

  // Consultation
  consultationReason: "",
  cie10Code: "",
  currentIllness: "",
  illnessEvolution: "",

  // Personal history
  cardiovascularRiskFactors: [],
  cardiovascularHistory: "",
  personalPathologicalHistory: "",
  surgicalHistory: "",
  habitualMedication: [],
  allergies: "",
  familyPathologicalHistory: "",

  // System review
  ...SYSTEM_REVIEW_DEFAULTS,

  // Physical exam
  ...PHYSICAL_EXAM_DEFAULTS,

  // Studies
  studiesPerformed: [],
  studiesResults: "",

  // Treatment plan
  followUpDate: "",
  rest: "",
  diet: "",
  physicalActivity: "",
  alarmSigns: "",
  additionalStudies: [],

  // Medications
  prescribedMedications: [],
  treatmentObservations: "",
});

export function useMedicalRecordForm() {
  const [formData, setFormData] = useState<MedicalRecordFormData>(getInitialFormData());
  const [isLoading, setIsLoading] = useState(false);

  // Auto-calculate BMI when weight or height changes
  useEffect(() => {
    const bmi = calculateBMI(formData.weight, formData.height);
    if (bmi !== null && bmi !== formData.bmi) {
      setFormData((prev) => ({ ...prev, bmi }));
    }
  }, [formData.weight, formData.height, formData.bmi]);

  const updateField = <K extends keyof MedicalRecordFormData>(
    field: K,
    value: MedicalRecordFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof Pick<MedicalRecordFormData,
    "cardiovascularRiskFactors" | "habitualMedication" | "studiesPerformed" |
    "additionalStudies" | "prescribedMedications">, item: string) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(item)
        ? currentArray.filter((i) => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: keyof Pick<MedicalRecordFormData,
    "habitualMedication" | "prescribedMedications">, item: string) => {
    if (!item.trim()) return;
    setFormData((prev) => {
      const currentArray = prev[field] as string[];
      if (currentArray.includes(item)) return prev;
      return { ...prev, [field]: [...currentArray, item] };
    });
  };

  const removeArrayItem = (field: keyof Pick<MedicalRecordFormData,
    "habitualMedication" | "prescribedMedications">, index: number) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[];
      return {
        ...prev,
        [field]: currentArray.filter((_, i) => i !== index),
      };
    });
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
  };

  const loadFormData = (data: Partial<MedicalRecordFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return {
    formData,
    isLoading,
    setIsLoading,
    updateField,
    toggleArrayItem,
    addArrayItem,
    removeArrayItem,
    resetForm,
    loadFormData,
  };
}
