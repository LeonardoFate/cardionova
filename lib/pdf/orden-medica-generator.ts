// lib/pdf/orden-medica-generator.ts

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { IReceta, IEstudioOrden, IReposo, IInterconsulta } from '@/types/orden-medica'

interface PDFConfig {
  tipoOrden: 'receta' | 'estudio' | 'reposo' | 'interconsulta'
  orden: IReceta | IEstudioOrden | IReposo | IInterconsulta
  historia: any
  medico: any
}

const PAGE_WIDTH = 210
const MARGIN = 20
const HEADER_HEIGHT = 40
const FOOTER_Y = 284

// ── Brand colours ──────────────────────────────────────────────────────────
const C = {
  primary:    [30,  58, 138] as [number, number, number],
  accent:     [59, 130, 246] as [number, number, number],
  sectionBg:  [239, 246, 255] as [number, number, number],
  infoBg:     [248, 250, 252] as [number, number, number],
  infoBorder: [220, 230, 240] as [number, number, number],
  vitalBg:    [224, 242, 254] as [number, number, number],
  urgentBg:   [254, 226, 226] as [number, number, number],
  urgentText: [185,  28,  28] as [number, number, number],
  warnBg:     [255, 247, 237] as [number, number, number],
  warnText:   [180,  80,   0] as [number, number, number],
  white:      [255, 255, 255] as [number, number, number],
  muted:      [100, 100, 100] as [number, number, number],
  label:      [ 80,  80,  80] as [number, number, number],
  separator:  [200, 200, 200] as [number, number, number],
}

// ── Header ─────────────────────────────────────────────────────────────────
function drawHeader(doc: jsPDF): void {
  doc.setFillColor(...C.primary)
  doc.rect(0, 0, PAGE_WIDTH, HEADER_HEIGHT, 'F')

  doc.setFillColor(...C.accent)
  doc.rect(0, HEADER_HEIGHT - 4, PAGE_WIDTH, 4, 'F')

  doc.setTextColor(...C.white)
  doc.setFontSize(17)
  doc.setFont('helvetica', 'bold')
  doc.text('CARDIONOVA', MARGIN, 14)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Centro de Cardiología', MARGIN, 21)
  doc.text('Especialistas en Salud Cardiovascular', MARGIN, 27)

  doc.setFontSize(8)
  doc.text('[Teléfono] | info@cardionova.com', PAGE_WIDTH - MARGIN, 18, { align: 'right' })
  doc.text('[Dirección]', PAGE_WIDTH - MARGIN, 26, { align: 'right' })

  doc.setTextColor(0, 0, 0)
}

// ── Footer ──────────────────────────────────────────────────────────────────
function drawFooter(doc: jsPDF, pageNum: number, totalPages: number): void {
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
  doc.rect(MARGIN - 2, yPos - 4, w + 4, 12, 'F')
  doc.setFillColor(...C.primary)
  doc.rect(MARGIN - 2, yPos - 4, 3, 12, 'F')

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.primary)
  doc.text(text, MARGIN + 5, yPos + 3)
  doc.setTextColor(0, 0, 0)
  return yPos + 16
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN GENERATOR
// ═══════════════════════════════════════════════════════════════════════════
export async function generarPDFOrden(config: PDFConfig): Promise<Buffer> {
  const doc = new jsPDF()
  const { tipoOrden, orden, historia, medico } = config
  const maxWidth = PAGE_WIDTH - MARGIN * 2
  let yPos = HEADER_HEIGHT + 6

  drawHeader(doc)

  // ── Doctor / Patient info box ────────────────────────────────────────────
  const boxH = 34
  doc.setFillColor(...C.infoBg)
  doc.rect(MARGIN - 2, yPos - 4, maxWidth + 4, boxH, 'F')
  doc.setDrawColor(...C.infoBorder)
  doc.setLineWidth(0.3)
  doc.rect(MARGIN - 2, yPos - 4, maxWidth + 4, boxH, 'S')

  // Divider
  const midX = MARGIN + maxWidth / 2
  doc.line(midX, yPos - 4, midX, yPos - 4 + boxH)

  // Left: Doctor
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.muted)
  doc.text('MÉDICO TRATANTE', MARGIN + 2, yPos + 1)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(`Dr/a. ${medico.firstName} ${medico.lastName}`, MARGIN + 2, yPos + 9)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.label)
  if (medico.profile?.speciality) {
    doc.text(medico.profile.speciality, MARGIN + 2, yPos + 16)
  }
  if (medico.profile?.licenseNumber) {
    doc.text(`Reg. Médico: ${medico.profile.licenseNumber}`, MARGIN + 2, yPos + 23)
  }

  // Right: Patient
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.muted)
  doc.text('PACIENTE', midX + 4, yPos + 1)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(historia.paciente.nombre, midX + 4, yPos + 9)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.label)
  doc.text(`CI: ${historia.paciente.cedula}  |  ${historia.datosBiometricos.edad} años`, midX + 4, yPos + 16)
  doc.text(`Seguro: ${historia.paciente.tipoSeguro}`, midX + 4, yPos + 23)

  doc.setTextColor(0, 0, 0)
  yPos += boxH + 4

  // ── Date / Order-number bar ──────────────────────────────────────────────
  doc.setFillColor(...C.primary)
  doc.rect(MARGIN - 2, yPos - 2, maxWidth + 4, 10, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.white)
  const fechaEmision = format(new Date(orden.fechaEmision), "dd 'de' MMMM 'de' yyyy", { locale: es })
  doc.text(`Fecha de emisión: ${fechaEmision}`, MARGIN + 2, yPos + 4)
  if (orden.numero) {
    doc.text(`N° de orden: ${orden.numero}`, PAGE_WIDTH - MARGIN - 2, yPos + 4, { align: 'right' })
  }
  doc.setTextColor(0, 0, 0)
  yPos += 16

  // ── Order-specific content ───────────────────────────────────────────────
  switch (tipoOrden) {
    case 'receta':
      yPos = generarContenidoReceta(doc, orden as IReceta, yPos)
      break
    case 'estudio':
      yPos = generarContenidoEstudio(doc, orden as IEstudioOrden, yPos)
      break
    case 'reposo':
      yPos = generarContenidoReposo(doc, orden as IReposo, yPos)
      break
    case 'interconsulta':
      yPos = generarContenidoInterconsulta(doc, orden as IInterconsulta, yPos)
      break
  }

  // ── Doctor signature ─────────────────────────────────────────────────────
  const sigY = Math.max(yPos + 10, FOOTER_Y - 36)
  const sigCenterX = PAGE_WIDTH / 2

  doc.setDrawColor(...C.primary)
  doc.setLineWidth(0.5)
  doc.line(sigCenterX - 30, sigY, sigCenterX + 30, sigY)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(`Dr/a. ${medico.firstName} ${medico.lastName}`, sigCenterX, sigY + 5, { align: 'center' })

  if (medico.profile?.licenseNumber) {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.label)
    doc.text(`Reg. ${medico.profile.licenseNumber}`, sigCenterX, sigY + 10, { align: 'center' })
    doc.setTextColor(0, 0, 0)
  }

  // ── Footers (all pages) ───────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    drawFooter(doc, i, totalPages)
  }

  return Buffer.from(doc.output('arraybuffer'))
}

// ─────────────────────────────────────────────────────────────────────────────
// RECETA
// ─────────────────────────────────────────────────────────────────────────────
function generarContenidoReceta(doc: jsPDF, receta: IReceta, yPos: number): number {
  const maxWidth = PAGE_WIDTH - MARGIN * 2

  yPos = sectionTitle(doc, 'RECETA MÉDICA', yPos)

  const medicamentos = receta.medicamentos.map((med, idx) => [
    (idx + 1).toString(),
    `${med.nombre} ${med.concentracion}`,
    med.presentacion,
    med.cantidad,
    `${med.dosificacion} ${med.frecuencia}`,
    med.duracion,
    med.viaAdministracion,
    med.indicaciones || '-',
  ])

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Medicamento', 'Presentación', 'Cantidad', 'Posología', 'Duración', 'Vía', 'Indicaciones']],
    body: medicamentos,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [33, 33, 33],
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 36 },
      5: { cellWidth: 18 },
      6: { cellWidth: 18 },
    },
    margin: { left: MARGIN, right: MARGIN },
  })

  yPos = (doc as any).lastAutoTable.finalY + 8

  if (receta.observaciones) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.label)
    doc.text('Observaciones:', MARGIN, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(receta.observaciones, maxWidth)
    doc.text(lines, MARGIN, yPos)
    yPos += lines.length * 5 + 5
  }

  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...C.muted)
  doc.text(`Vigencia de esta receta: ${receta.vigencia}`, MARGIN, yPos)
  doc.setTextColor(0, 0, 0)
  yPos += 10

  return yPos
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTUDIO
// ─────────────────────────────────────────────────────────────────────────────
function generarContenidoEstudio(doc: jsPDF, estudio: IEstudioOrden, yPos: number): number {
  const maxWidth = PAGE_WIDTH - MARGIN * 2

  yPos = sectionTitle(doc, 'ORDEN DE ESTUDIO', yPos)

  // Type badge
  doc.setFillColor(...C.vitalBg)
  doc.rect(MARGIN - 2, yPos - 3, 65, 9, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(7, 89, 133)
  doc.text(`Tipo: ${estudio.tipo}`, MARGIN + 2, yPos + 3)
  doc.setTextColor(0, 0, 0)
  yPos += 14

  // Study name
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text(estudio.nombre, MARGIN, yPos)
  yPos += 12

  // Clinical justification
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.label)
  doc.text('Justificación clínica:', MARGIN, yPos)
  doc.setTextColor(0, 0, 0)
  yPos += 5
  doc.setFont('helvetica', 'normal')
  const justLines = doc.splitTextToSize(estudio.justificacion, maxWidth)
  doc.text(justLines, MARGIN, yPos)
  yPos += justLines.length * 5 + 8

  // Special indicators
  if (estudio.urgente || estudio.ayunas || estudio.preparacion) {
    doc.setFillColor(...C.warnBg)
    doc.rect(MARGIN - 2, yPos - 4, maxWidth + 4, 10, 'F')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.warnText)
    doc.text('Indicaciones especiales:', MARGIN + 2, yPos + 2)
    doc.setTextColor(0, 0, 0)
    yPos += 13

    if (estudio.urgente) {
      doc.setFillColor(...C.urgentBg)
      doc.rect(MARGIN + 3, yPos - 3, 48, 9, 'F')
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...C.urgentText)
      doc.text('URGENTE', MARGIN + 8, yPos + 3)
      doc.setTextColor(0, 0, 0)
      yPos += 13
    }
    if (estudio.ayunas) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('• Requiere ayuno previo', MARGIN + 5, yPos)
      yPos += 6
    }
    if (estudio.preparacion) {
      const prepLines = doc.splitTextToSize(`• ${estudio.preparacion}`, maxWidth - 5)
      doc.text(prepLines, MARGIN + 5, yPos)
      yPos += prepLines.length * 5
    }
    yPos += 5
  }

  return yPos
}

// ─────────────────────────────────────────────────────────────────────────────
// REPOSO
// ─────────────────────────────────────────────────────────────────────────────
function generarContenidoReposo(doc: jsPDF, reposo: IReposo, yPos: number): number {
  const maxWidth = PAGE_WIDTH - MARGIN * 2

  yPos = sectionTitle(doc, 'CONSTANCIA DE REPOSO MÉDICO', yPos)

  // Duration highlight box
  const boxH = 30
  doc.setFillColor(...C.sectionBg)
  doc.rect(MARGIN - 2, yPos - 4, maxWidth + 4, boxH, 'F')
  doc.setDrawColor(...C.infoBorder)
  doc.setLineWidth(0.3)
  doc.rect(MARGIN - 2, yPos - 4, maxWidth + 4, boxH, 'S')

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.primary)
  doc.text(reposo.tipo, MARGIN + 3, yPos + 5)

  doc.setFontSize(22)
  doc.text(`${reposo.dias} días`, MARGIN + 3, yPos + 18)

  const desde = format(new Date(reposo.desde), 'dd/MM/yyyy')
  const hasta  = format(new Date(reposo.hasta),  'dd/MM/yyyy')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...C.label)
  doc.text(`${desde}  →  ${hasta}`, PAGE_WIDTH - MARGIN - 3, yPos + 12, { align: 'right' })

  doc.setTextColor(0, 0, 0)
  yPos += boxH + 8

  // Diagnosis
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...C.label)
  doc.text('Diagnóstico:', MARGIN, yPos)
  doc.setTextColor(0, 0, 0)
  yPos += 5
  doc.setFont('helvetica', 'normal')
  const diagLines = doc.splitTextToSize(reposo.diagnostico, maxWidth)
  doc.text(diagLines, MARGIN, yPos)
  yPos += diagLines.length * 5 + 7

  // Recommendations
  if (reposo.recomendaciones) {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.label)
    doc.text('Recomendaciones:', MARGIN, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    const recomLines = doc.splitTextToSize(reposo.recomendaciones, maxWidth)
    doc.text(recomLines, MARGIN, yPos)
    yPos += recomLines.length * 5 + 7
  }

  return yPos
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERCONSULTA
// ─────────────────────────────────────────────────────────────────────────────
function generarContenidoInterconsulta(doc: jsPDF, inter: IInterconsulta, yPos: number): number {
  const maxWidth = PAGE_WIDTH - MARGIN * 2

  yPos = sectionTitle(doc, 'SOLICITUD DE INTERCONSULTA', yPos)

  // Specialty
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(`Especialidad: ${inter.especialidad}`, MARGIN, yPos)
  yPos += 9

  if (inter.profesionalSolicitado) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...C.label)
    doc.text(`Profesional solicitado: Dr/a. ${inter.profesionalSolicitado}`, MARGIN, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 9
  }

  // Urgent banner
  if (inter.urgente) {
    doc.setFillColor(...C.urgentBg)
    doc.rect(MARGIN - 2, yPos - 4, maxWidth + 4, 12, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.urgentText)
    doc.text('INTERCONSULTA URGENTE', MARGIN + 4, yPos + 4)
    doc.setTextColor(0, 0, 0)
    yPos += 16
  }

  // Text fields
  const fields: Array<{ label: string; value: string }> = [
    { label: 'Motivo de interconsulta',  value: inter.motivo },
    { label: 'Diagnóstico presuntivo',   value: inter.diagnosticoPresuntivo },
    { label: 'Antecedentes relevantes',  value: inter.antecedentes },
  ]
  if (inter.examenesRealizados) {
    fields.push({ label: 'Exámenes realizados', value: inter.examenesRealizados })
  }

  fields.forEach(({ label, value }) => {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...C.label)
    doc.text(`${label}:`, MARGIN, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(value, maxWidth)
    doc.text(lines, MARGIN, yPos)
    yPos += lines.length * 5 + 7
  })

  return yPos
}
