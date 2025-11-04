import { NextRequest, NextResponse } from "next/server";
import { medicalRecord, patient } from "@/app/db/schema";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/app";

// GET - Get a specific medical record by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id: recordId } = await params;

    // Fetch medical record with patient information
    const records = await db
      .select()
      .from(medicalRecord)
      .innerJoin(patient, eq(medicalRecord.patientId, patient.id))
      .where(eq(medicalRecord.id, recordId))
      .limit(1);

    if (records.length === 0) {
      return NextResponse.json(
        { error: "Historia clínica no encontrada" },
        { status: 404 }
      );
    }

    const record = records[0];

    // Transform the data to match the form structure
    const transformedRecord = {
      // Patient data
      recordDate: record.medical_record.recordDate,
      patientName: record.patient.fullName,
      patientIdNumber: record.patient.idNumber,
      insuranceType: record.patient.insuranceType || "",

      // Biometric data
      age: record.medical_record.age,
      weight: record.medical_record.weight ? parseFloat(record.medical_record.weight) : 0,
      height: record.medical_record.height ? parseFloat(record.medical_record.height) : 0,
      bmi: record.medical_record.bmi ? parseFloat(record.medical_record.bmi) : undefined,

      // Vital signs
      bloodPressure: record.medical_record.bloodPressure || "",
      heartRate: record.medical_record.heartRate || 0,
      oxygenSaturation: record.medical_record.oxygenSaturation || 0,
      temperature: record.medical_record.temperature ? parseFloat(record.medical_record.temperature) : 0,

      // Consultation
      consultationReason: record.medical_record.consultationReason || "",
      cie10Code: record.medical_record.cie10Code || "",
      currentIllness: record.medical_record.currentIllness || "",
      illnessEvolution: record.medical_record.illnessEvolution || "",

      // Personal history
      cardiovascularRiskFactors: record.medical_record.cardiovascularRiskFactors || [],
      cardiovascularHistory: record.medical_record.cardiovascularHistory || "",
      personalPathologicalHistory: record.medical_record.personalPathologicalHistory || "",
      surgicalHistory: record.medical_record.surgicalHistory || "",
      habitualMedication: record.medical_record.habitualMedication || [],
      allergies: record.medical_record.allergies || "",
      familyPathologicalHistory: record.medical_record.familyPathologicalHistory || "",

      // System review
      skinAndAppendages: record.medical_record.skinAndAppendages || "",
      respiratorySystem: record.medical_record.respiratorySystem || "",
      cardiovascularSystem: record.medical_record.cardiovascularSystem || "",
      gastrointestinalSystem: record.medical_record.gastrointestinalSystem || "",
      genitourinarySystem: record.medical_record.genitourinarySystem || "",
      musculoskeletalSystem: record.medical_record.musculoskeletalSystem || "",
      endocrineSystem: record.medical_record.endocrineSystem || "",
      neurologicalSystem: record.medical_record.neurologicalSystem || "",

      // Physical exam
      generalInspection: record.medical_record.generalInspection || "",
      glasgowScale: record.medical_record.glasgowScale || "",
      neck: record.medical_record.neck || "",
      thorax: record.medical_record.thorax || "",
      heart: record.medical_record.heart || "",
      lungs: record.medical_record.lungs || "",
      abdomen: record.medical_record.abdomen || "",
      upperExtremities: record.medical_record.upperExtremities || "",
      lowerExtremities: record.medical_record.lowerExtremities || "",

      // Studies
      studiesPerformed: record.medical_record.studiesPerformed || [],
      studiesResults: record.medical_record.studiesResults || "",

      // Treatment plan
      followUpDate: record.medical_record.followUpDate || "",
      rest: record.medical_record.rest || "",
      diet: record.medical_record.diet || "",
      physicalActivity: record.medical_record.physicalActivity || "",
      alarmSigns: record.medical_record.alarmSigns || "",
      additionalStudies: record.medical_record.additionalStudies || [],

      // Treatment
      prescribedMedications: record.medical_record.prescribedMedications || [],
      treatmentObservations: record.medical_record.treatmentObservations || "",
    };

    return NextResponse.json(transformedRecord);
  } catch (error) {
    console.error("Error fetching medical record:", error);
    return NextResponse.json(
      { error: "Error al obtener la historia clínica" },
      { status: 500 }
    );
  }
}
