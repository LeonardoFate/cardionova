// lib/pdf/historia-clinica-generator.ts

import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface HistoriaClinicaPDFConfig {
  historia: any
  medico: any
}

const PAGE_WIDTH = 210
const MARGIN = 20
const HEADER_HEIGHT = 40
const FOOTER_Y = 284
const MAX_CONTENT_Y = FOOTER_Y - 6

// ── Brand colours ──────────────────────────────────────────────────────────
const C = {
  primary:      [30,  58, 138] as [number, number, number],
  primaryLight: [59, 130, 246] as [number, number, number],
  sectionBg:    [239, 246, 255] as [number, number, number],
  bioBg:        [241, 245, 249] as [number, number, number],
  vitalBg:      [224, 242, 254] as [number, number, number],
  cieBg:        [255, 251, 235] as [number, number, number],
  white:        [255, 255, 255] as [number, number, number],
  muted:        [100, 100, 100] as [number, number, number],
  label:        [ 80,  80,  80] as [number, number, number],
  separator:    [200, 200, 200] as [number, number, number],
  vitalText:    [  7,  89, 133] as [number, number, number],
}

// ── Header ─────────────────────────────────────────────────────────────────
function drawPageHeader(doc: jsPDF): void {
  doc.setFillColor(...C.primary)
  doc.rect(0, 0, PAGE_WIDTH, HEADER_HEIGHT, 'F')

  // Accent stripe at bottom of header
  doc.setFillColor(...C.primaryLight)
  doc.rect(0, HEADER_HEIGHT - 4, PAGE_WIDTH, 4, 'F')

  // Clinic name
  doc.setTextColor(...C.white)
  doc.setFontSize(17)
  doc.setFont('helvetica', 'bold')
  doc.text('CARDIONOVA', MARGIN, 14)

  // Subtitle
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Centro de Cardiología', MARGIN, 21)
  doc.text('Especialistas en Salud Cardiovascular', MARGIN, 27)

  // Contact info (right-aligned)
  doc.setFontSize(8)
  doc.text('[Teléfono] | info@cardionova.com', PAGE_WIDTH - MARGIN, 18, { align: 'right' })
  doc.text('[Dirección]', PAGE_WIDTH - MARGIN, 26, { align: 'right' })

  doc.setTextColor(0, 0, 0)
}

// ── Footer ──────────────────────────────────────────────────────────────────
function drawPageFooter(doc: jsPDF, pageNum: number, totalPages: number): void {
  doc.setDrawColor(...C.separator)
  doc.setLineWidth(0.3)
  doc.line(MARGIN, FOOTER_Y - 3, PAGE_WIDTH - MARGIN, FOOTER_Y - 3)

  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.muted)
  doc.text('CARDIONOVA - Centro de Cardiología  |  Documento confidencial', MARGIN, FOOTER_Y + 4)
  doc.text(`Página ${pageNum} de ${totalPages}`, PAGE_WIDTH - MARGIN, FOOTER_Y + 4, { align: 'right' })
  doc.setTextColor(0, 0, 0)
}

// ── Section title with accent bar ───────────────────────────────────────────
function sectionTitle(doc: jsPDF, text: string, yPos: number): number {
  const w = PAGE_WIDTH - MARGIN * 2
  doc.setFillColor(...C.sectionBg)
  doc.rect(MARGIN - 2, yPos - 4, w + 4, 10, 'F')
  doc.setFillColor(...C.primary)
  doc.rect(MARGIN - 2, yPos - 4, 3, 10, 'F')

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.primary)
  doc.text(text, MARGIN + 4, yPos + 2)
  doc.setTextColor(0, 0, 0)
  return yPos + 12
}

// ── Bold label + normal value ────────────────────────────────────────────────
function fieldLabel(doc: jsPDF, label: string, value: string, x: number, y: number): void {
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.label)
  doc.text(`${label}:`, x, y)
  const lw = doc.getTextWidth(`${label}: `)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  doc.text(value, x + lw, y)
}

// ── Page-break guard: adds a page + redraws header when needed ──────────────
function checkBreak(doc: jsPDF, yPos: number, neededSpace = 15): number {
  if (yPos + neededSpace > MAX_CONTENT_Y) {
    doc.addPage()
    drawPageHeader(doc)
    return HEADER_HEIGHT + 8
  }
  return yPos
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
export async function generarPDFHistoriaClinica(config: HistoriaClinicaPDFConfig): Promise<Buffer> {
  const doc = new jsPDF()
  const { historia, medico } = config
  const maxWidth = PAGE_WIDTH - MARGIN * 2
  let yPos = HEADER_HEIGHT + 6

  drawPageHeader(doc)

  // Document title bar
  doc.setFillColor(248, 250, 252)
  doc.rect(MARGIN - 2, yPos - 4, maxWidth + 4, 13, 'F')
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.primary)
  doc.text('HISTORIA CLÍNICA', PAGE_WIDTH / 2, yPos + 4, { align: 'center' })
  doc.setTextColor(0, 0, 0)
  yPos += 18

  // ── DATOS DEL PACIENTE ─────────────────────────────────────────────────
  yPos = sectionTitle(doc, 'DATOS DEL PACIENTE', yPos)
  yPos += 2

  const col2 = MARGIN + maxWidth / 2 + 5
  fieldLabel(doc, 'Nombre', historia.paciente.nombre, MARGIN, yPos)
  fieldLabel(doc, 'Cédula', historia.paciente.cedula, col2, yPos)
  yPos += 7
  fieldLabel(doc, 'Tipo de Seguro', historia.paciente.tipoSeguro, MARGIN, yPos)
  fieldLabel(doc, 'Fecha de Consulta',
    format(new Date(historia.fecha), "dd/MM/yyyy", { locale: es }), col2, yPos)
  yPos += 14

  // ── BIOMÉTRICOS Y SIGNOS VITALES ───────────────────────────────────────
  yPos = checkBreak(doc, yPos, 55)
  yPos = sectionTitle(doc, 'DATOS BIOMÉTRICOS Y SIGNOS VITALES', yPos)
  yPos += 3

  const cellW = (maxWidth - 9) / 4

  // Biometrics cards
  const bioData = [
    { lbl: 'Edad',     val: `${historia.datosBiometricos.edad} años` },
    { lbl: 'Peso',     val: `${historia.datosBiometricos.peso} kg` },
    { lbl: 'Estatura', val: `${historia.datosBiometricos.estatura} cm` },
    { lbl: 'IMC',      val: historia.datosBiometricos.imc
        ? `${historia.datosBiometricos.imc.toFixed(2)}`
        : 'N/C' },
  ]
  bioData.forEach((d, i) => {
    const cx = MARGIN + i * (cellW + 3)
    doc.setFillColor(...C.bioBg)
    doc.rect(cx, yPos - 2, cellW, 17, 'F')
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.primary)
    doc.text(d.val, cx + cellW / 2, yPos + 7, { align: 'center' })
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.muted)
    doc.text(d.lbl, cx + cellW / 2, yPos + 13, { align: 'center' })
  })
  doc.setTextColor(0, 0, 0)
  yPos += 23

  // Vital signs cards
  const vitData = [
    { lbl: 'Presión Arterial',  val: historia.signosVitales.presionArterial },
    { lbl: 'Frec. Cardíaca',    val: `${historia.signosVitales.frecuenciaCardiaca} lpm` },
    { lbl: 'Saturación O2',     val: `${historia.signosVitales.satO2}%` },
    { lbl: 'Temperatura',       val: `${historia.signosVitales.temperatura}°C` },
  ]
  vitData.forEach((d, i) => {
    const cx = MARGIN + i * (cellW + 3)
    doc.setFillColor(...C.vitalBg)
    doc.rect(cx, yPos - 2, cellW, 17, 'F')
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.vitalText)
    doc.text(d.val, cx + cellW / 2, yPos + 7, { align: 'center' })
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.muted)
    doc.text(d.lbl, cx + cellW / 2, yPos + 13, { align: 'center' })
  })
  doc.setTextColor(0, 0, 0)
  yPos += 23

  // ── MOTIVO DE CONSULTA Y DIAGNÓSTICO ──────────────────────────────────
  yPos = checkBreak(doc, yPos, 40)
  yPos = sectionTitle(doc, 'MOTIVO DE CONSULTA Y DIAGNÓSTICO', yPos)
  yPos += 2

  let lines: string[]

  // Motivo
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.label)
  doc.text('Motivo de Consulta:', MARGIN, yPos)
  doc.setTextColor(0, 0, 0)
  yPos += 5
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(historia.motivoConsulta, maxWidth)
  yPos = checkBreak(doc, yPos, lines.length * 5 + 5)
  doc.text(lines, MARGIN, yPos)
  yPos += lines.length * 5 + 6

  // CIE-10 highlight box
  doc.setFillColor(...C.cieBg)
  doc.rect(MARGIN - 2, yPos - 3, maxWidth + 4, 11, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(120, 80, 0)
  const cieLabel = 'Código CIE-10:  '
  doc.text(cieLabel, MARGIN + 2, yPos + 4)
  doc.setFont('helvetica', 'normal')
  doc.text(historia.cie10, MARGIN + 2 + doc.getTextWidth(cieLabel), yPos + 4)
  doc.setTextColor(0, 0, 0)
  yPos += 15

  // Enfermedad actual
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.label)
  doc.text('Enfermedad Actual:', MARGIN, yPos)
  doc.setTextColor(0, 0, 0)
  yPos += 5
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(historia.enfermedadActual, maxWidth)
  yPos = checkBreak(doc, yPos, lines.length * 5 + 5)
  doc.text(lines, MARGIN, yPos)
  yPos += lines.length * 5 + 6

  // Evolución
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.label)
  doc.text('Evolución de la Enfermedad:', MARGIN, yPos)
  doc.setTextColor(0, 0, 0)
  yPos += 5
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(historia.evolucionEnfermedad, maxWidth)
  yPos = checkBreak(doc, yPos, lines.length * 5 + 5)
  doc.text(lines, MARGIN, yPos)
  yPos += lines.length * 5 + 12

  // ── ANTECEDENTES PERSONALES ────────────────────────────────────────────
  yPos = checkBreak(doc, yPos, 30)
  yPos = sectionTitle(doc, 'ANTECEDENTES PERSONALES', yPos)
  yPos += 2

  doc.setFontSize(9)

  if (historia.antecedentesPersonales.factoresRiesgoCardiovascular?.length > 0) {
    yPos = checkBreak(doc, yPos, 15)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.label)
    doc.text('Factores de Riesgo Cardiovascular:', MARGIN, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    historia.antecedentesPersonales.factoresRiesgoCardiovascular.forEach((factor: string) => {
      yPos = checkBreak(doc, yPos, 6)
      doc.text(`• ${factor}`, MARGIN + 5, yPos)
      yPos += 5
    })
    yPos += 3
  }

  const antFields = [
    { key: 'antecedentesCardiovasculares',      label: 'Antecedentes Cardiovasculares' },
    { key: 'antecedentesPatologicosPersonales', label: 'Antecedentes Patológicos' },
    { key: 'antecedentesQuirurgicos',           label: 'Antecedentes Quirúrgicos' },
    { key: 'alergias',                          label: 'Alergias' },
    { key: 'habitos',                           label: 'Hábitos' },
  ]
  antFields.forEach(({ key, label }) => {
    if (historia.antecedentesPersonales[key]) {
      yPos = checkBreak(doc, yPos, 20)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...C.label)
      doc.text(`${label}:`, MARGIN, yPos)
      doc.setTextColor(0, 0, 0)
      yPos += 5
      doc.setFont('helvetica', 'normal')
      lines = doc.splitTextToSize(historia.antecedentesPersonales[key], maxWidth)
      yPos = checkBreak(doc, yPos, lines.length * 5)
      doc.text(lines, MARGIN, yPos)
      yPos += lines.length * 5 + 5
    }
  })

  if (historia.antecedentesPersonales.medicacion?.length > 0) {
    yPos = checkBreak(doc, yPos, 15)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.label)
    doc.text('Medicación Habitual:', MARGIN, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    historia.antecedentesPersonales.medicacion.forEach((med: string) => {
      yPos = checkBreak(doc, yPos, 6)
      doc.text(`• ${med}`, MARGIN + 5, yPos)
      yPos += 5
    })
    yPos += 3
  }

  yPos += 5

  // ── ANTECEDENTES FAMILIARES ────────────────────────────────────────────
  if (historia.antecedentesFamiliares) {
    yPos = checkBreak(doc, yPos, 25)
    yPos = sectionTitle(doc, 'ANTECEDENTES FAMILIARES', yPos)
    yPos += 2
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(historia.antecedentesFamiliares, maxWidth)
    yPos = checkBreak(doc, yPos, lines.length * 5)
    doc.text(lines, MARGIN, yPos)
    yPos += lines.length * 5 + 10
  }

  // ── EXAMEN FÍSICO ──────────────────────────────────────────────────────
  yPos = checkBreak(doc, yPos, 30)
  yPos = sectionTitle(doc, 'EXAMEN FÍSICO', yPos)
  yPos += 2

  doc.setFontSize(9)
  const examFields = [
    { key: 'cardiovascular', label: 'Sistema Cardiovascular' },
    { key: 'respiratorio',   label: 'Sistema Respiratorio' },
    { key: 'abdominal',      label: 'Examen Abdominal' },
    { key: 'neurologico',    label: 'Examen Neurológico' },
    { key: 'extremidades',   label: 'Extremidades' },
    { key: 'otros',          label: 'Otros hallazgos' },
  ]
  examFields.forEach(({ key, label }) => {
    if (historia.examenFisico[key]) {
      yPos = checkBreak(doc, yPos, 20)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...C.label)
      doc.text(`${label}:`, MARGIN, yPos)
      doc.setTextColor(0, 0, 0)
      yPos += 5
      doc.setFont('helvetica', 'normal')
      lines = doc.splitTextToSize(historia.examenFisico[key], maxWidth)
      yPos = checkBreak(doc, yPos, lines.length * 5)
      doc.text(lines, MARGIN, yPos)
      yPos += lines.length * 5 + 5
    }
  })

  yPos += 5

  // ── PLAN DIAGNÓSTICO ───────────────────────────────────────────────────
  yPos = checkBreak(doc, yPos, 30)
  yPos = sectionTitle(doc, 'PLAN DIAGNÓSTICO', yPos)
  yPos += 2

  doc.setFontSize(9)

  if (historia.plan.estudios?.length > 0) {
    yPos = checkBreak(doc, yPos, 15)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.label)
    doc.text('Estudios Solicitados:', MARGIN, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    historia.plan.estudios.forEach((estudio: string) => {
      yPos = checkBreak(doc, yPos, 6)
      doc.text(`• ${estudio}`, MARGIN + 5, yPos)
      yPos += 5
    })
    yPos += 3
  }

  if (historia.plan.laboratorios?.length > 0) {
    yPos = checkBreak(doc, yPos, 15)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.label)
    doc.text('Laboratorios:', MARGIN, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    historia.plan.laboratorios.forEach((lab: string) => {
      yPos = checkBreak(doc, yPos, 6)
      doc.text(`• ${lab}`, MARGIN + 5, yPos)
      yPos += 5
    })
    yPos += 3
  }

  if (historia.plan.otros) {
    yPos = checkBreak(doc, yPos, 20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.label)
    doc.text('Otras indicaciones:', MARGIN, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(historia.plan.otros, maxWidth)
    yPos = checkBreak(doc, yPos, lines.length * 5)
    doc.text(lines, MARGIN, yPos)
    yPos += lines.length * 5 + 8
  }

  yPos += 5

  // ── TRATAMIENTO ────────────────────────────────────────────────────────
  yPos = checkBreak(doc, yPos, 30)
  yPos = sectionTitle(doc, 'TRATAMIENTO', yPos)
  yPos += 2

  doc.setFontSize(9)

  if (historia.tratamiento.medicamentos?.length > 0) {
    yPos = checkBreak(doc, yPos, 15)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.label)
    doc.text('Medicamentos:', MARGIN, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    historia.tratamiento.medicamentos.forEach((med: string) => {
      yPos = checkBreak(doc, yPos, 6)
      doc.text(`• ${med}`, MARGIN + 5, yPos)
      yPos += 5
    })
    yPos += 3
  }

  if (historia.tratamiento.recomendaciones) {
    yPos = checkBreak(doc, yPos, 20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.label)
    doc.text('Recomendaciones:', MARGIN, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(historia.tratamiento.recomendaciones, maxWidth)
    yPos = checkBreak(doc, yPos, lines.length * 5)
    doc.text(lines, MARGIN, yPos)
    yPos += lines.length * 5 + 10
  }

  // ── FIRMA DEL MÉDICO ───────────────────────────────────────────────────
  yPos = checkBreak(doc, yPos, 30)
  // Push signature toward bottom of page
  if (yPos < MAX_CONTENT_Y - 38) {
    yPos = MAX_CONTENT_Y - 38
  }

  const sigCenterX = PAGE_WIDTH / 2
  doc.setDrawColor(...C.primary)
  doc.setLineWidth(0.5)
  doc.line(sigCenterX - 30, yPos, sigCenterX + 30, yPos)
  yPos += 5

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(`Dr/a. ${medico.firstName} ${medico.lastName}`, sigCenterX, yPos, { align: 'center' })
  yPos += 5

  if (medico.profile?.speciality) {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.label)
    doc.text(medico.profile.speciality, sigCenterX, yPos, { align: 'center' })
    yPos += 5
  }
  if (medico.profile?.licenseNumber) {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.label)
    doc.text(`Reg. Médico: ${medico.profile.licenseNumber}`, sigCenterX, yPos, { align: 'center' })
  }

  // ── FOOTERS (all pages) ────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    drawPageFooter(doc, i, totalPages)
  }

  return Buffer.from(doc.output('arraybuffer'))
}
