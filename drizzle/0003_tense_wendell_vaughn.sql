CREATE TABLE "medical_record" (
	"id" text PRIMARY KEY NOT NULL,
	"patient_id" text NOT NULL,
	"doctor_id" text NOT NULL,
	"record_date" date NOT NULL,
	"age" integer NOT NULL,
	"weight" numeric(5, 2),
	"height" numeric(5, 2),
	"bmi" numeric(4, 2),
	"blood_pressure" text,
	"heart_rate" integer,
	"oxygen_saturation" integer,
	"temperature" numeric(4, 2),
	"consultation_reason" text NOT NULL,
	"cie10_code" text,
	"current_illness" text,
	"illness_evolution" text,
	"cardiovascular_risk_factors" json,
	"cardiovascular_history" text,
	"personal_pathological_history" text,
	"surgical_history" text,
	"habitual_medication" json,
	"allergies" text,
	"family_pathological_history" text,
	"skin_and_appendages" text DEFAULT 'NADA QUE LLAME LA ATENCIÓN',
	"respiratory_system" text DEFAULT 'NADA QUE LLAME LA ATENCIÓN',
	"cardiovascular_system" text DEFAULT 'NADA QUE LLAME LA ATENCIÓN',
	"gastrointestinal_system" text DEFAULT 'NADA QUE LLAME LA ATENCIÓN',
	"genitourinary_system" text DEFAULT 'NADA QUE LLAME LA ATENCIÓN',
	"musculoskeletal_system" text DEFAULT 'NADA QUE LLAME LA ATENCIÓN',
	"endocrine_system" text DEFAULT 'NADA QUE LLAME LA ATENCIÓN',
	"neurological_system" text DEFAULT 'NADA QUE LLAME LA ATENCIÓN',
	"general_inspection" text DEFAULT 'PACIENTE ORIENTADO EN TIEMPO Y ESPACIO, COLABORA CON EL INTERROGATORIO',
	"glasgow_scale" text DEFAULT '15/15',
	"neck" text DEFAULT 'MOVIL - NO ADENOPATIAS PALPABLES - YUGULAR 0/3',
	"thorax" text DEFAULT 'SIMETRICO',
	"heart" text DEFAULT 'RUIDOS CARDIACOS RITMICOS, NO SOPLOS, NO RUIDOS AGREGADOS',
	"lungs" text DEFAULT 'CLAROS Y VENTILADOS',
	"abdomen" text DEFAULT 'BLANDO DEPRESIBLE NO DOLOROSO, NO MASAS RUIDOS HIDROAEREOS PRESENTES',
	"upper_extremities" text DEFAULT 'SIMETRICAS - MOVILES - NO DOLOROSOS - PULSOS PRESENTES',
	"lower_extremities" text DEFAULT 'SIMETRICAS - MOVILES - NO DOLOROSOS - PULSOS PRESENTES - NO EDEMA',
	"studies_performed" json,
	"studies_results" text,
	"follow_up_date" date,
	"rest" text,
	"diet" text,
	"physical_activity" text,
	"alarm_signs" text,
	"additional_studies" json,
	"prescribed_medications" json,
	"treatment_observations" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"id_number" text NOT NULL,
	"insurance_type" text,
	"phone" text,
	"email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patient_id_number_unique" UNIQUE("id_number")
);
--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "name" TO "first_names";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_names" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "education" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "certifications" text;--> statement-breakpoint
ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_patient_id_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patient"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_doctor_id_user_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;