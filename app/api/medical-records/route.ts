import { NextRequest, NextResponse } from "next/server";
import { medicalRecord, patient } from "@/app/db/schema";
import { nanoid } from "nanoid";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { db } from "@/app";

// GET - List all medical records
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Fetch medical records with patient information
    const records = await db
      .select({
        id: medicalRecord.id,
        recordDate: medicalRecord.recordDate,
        patientName: patient.fullName,
        patientIdNumber: patient.idNumber,
        consultationReason: medicalRecord.consultationReason,
        cie10Code: medicalRecord.cie10Code,
        createdAt: medicalRecord.createdAt,
      })
      .from(medicalRecord)
      .innerJoin(patient, eq(medicalRecord.patientId, patient.id))
      .orderBy(desc(medicalRecord.createdAt));

    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return NextResponse.json(
      { error: "Error al obtener las historias clínicas" },
      { status: 500 }
    );
  }
}

// POST - Create a new medical record
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();

    // Check if patient already exists by ID number
    let existingPatient = await db
      .select()
      .from(patient)
      .where(eq(patient.idNumber, data.patientIdNumber))
      .limit(1);

    let patientId: string;

    if (existingPatient.length > 0) {
      // Patient exists, use existing ID
      patientId = existingPatient[0].id;

      // Update patient information
      await db
        .update(patient)
        .set({
          fullName: data.patientName,
          insuranceType: data.insuranceType,
          updatedAt: new Date(),
        })
        .where(eq(patient.id, patientId));
    } else {
      // Create new patient
      patientId = nanoid();
      await db.insert(patient).values({
        id: patientId,
        fullName: data.patientName,
        idNumber: data.patientIdNumber,
        insuranceType: data.insuranceType,
      });
    }

    // Create medical record
    const recordId = nanoid();
    await db.insert(medicalRecord).values({
      id: recordId,
      patientId: patientId,
      doctorId: session.user.id,
      recordDate: data.recordDate,

      // Biometric data
      age: data.age,
      weight: data.weight?.toString(),
      height: data.height?.toString(),
      bmi: data.bmi?.toString(),

      // Vital signs
      bloodPressure: data.bloodPressure,
      heartRate: data.heartRate,
      oxygenSaturation: data.oxygenSaturation,
      temperature: data.temperature?.toString(),

      // Consultation
      consultationReason: data.consultationReason,
      cie10Code: data.cie10Code,
      currentIllness: data.currentIllness,
      illnessEvolution: data.illnessEvolution,

      // Personal history
      cardiovascularRiskFactors: data.cardiovascularRiskFactors || [],
      cardiovascularHistory: data.cardiovascularHistory,
      personalPathologicalHistory: data.personalPathologicalHistory,
      surgicalHistory: data.surgicalHistory,
      habitualMedication: data.habitualMedication || [],
      allergies: data.allergies,
      familyPathologicalHistory: data.familyPathologicalHistory,

      // System review
      skinAndAppendages: data.skinAndAppendages || null,
      respiratorySystem: data.respiratorySystem || null,
      cardiovascularSystem: data.cardiovascularSystem || null,
      gastrointestinalSystem: data.gastrointestinalSystem || null,
      genitourinarySystem: data.genitourinarySystem || null,
      musculoskeletalSystem: data.musculoskeletalSystem || null,
      endocrineSystem: data.endocrineSystem || null,
      neurologicalSystem: data.neurologicalSystem || null,

      // Physical exam
      generalInspection: data.generalInspection || null,
      glasgowScale: data.glasgowScale || null,
      neck: data.neck || null,
      thorax: data.thorax || null,
      heart: data.heart || null,
      lungs: data.lungs || null,
      abdomen: data.abdomen || null,
      upperExtremities: data.upperExtremities || null,
      lowerExtremities: data.lowerExtremities || null,

      // Studies
      studiesPerformed: data.studiesPerformed || [],
      studiesResults: data.studiesResults,

      // Treatment plan
      followUpDate: data.followUpDate || null,
      rest: data.rest,
      diet: data.diet,
      physicalActivity: data.physicalActivity,
      alarmSigns: data.alarmSigns,
      additionalStudies: data.additionalStudies || [],

      // Treatment
      prescribedMedications: data.prescribedMedications || [],
      treatmentObservations: data.treatmentObservations,
    });

    return NextResponse.json(
      { id: recordId, message: "Historia clínica guardada exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating medical record:", error);
    return NextResponse.json(
      { error: "Error al guardar la historia clínica" },
      { status: 500 }
    );
  }
}
