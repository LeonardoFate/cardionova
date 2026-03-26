'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Calendar, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { IReceta, IEstudioOrden, IReposo, IInterconsulta } from '@/types/orden-medica'

interface OrdenCardProps {
  tipo: 'receta' | 'estudio' | 'reposo' | 'interconsulta'
  orden: IReceta | IEstudioOrden | IReposo | IInterconsulta
  historiaId: string
  indice: number
}

export function OrdenCard({ tipo, orden, historiaId, indice }: OrdenCardProps) {
  const handleDescargarPDF = async () => {
    try {
      const response = await fetch(`/api/ordenes-medicas/${historiaId}/${tipo}/${indice}/pdf`)

      if (!response.ok) {
        throw new Error('Error al generar PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tipo}-${orden.numero || 'orden'}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error descargando PDF:', error)
      alert('Error al descargar el PDF. Por favor, intente nuevamente.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2">
            {orden.numero && <Badge variant="outline">{orden.numero}</Badge>}
            <span className="text-sm text-gray-500">
              {format(new Date(orden.fechaEmision), "dd 'de' MMMM, yyyy", { locale: es })}
            </span>
            {'urgente' in orden && orden.urgente && (
              <Badge variant="destructive" className="flex items-center">
                <AlertCircle className="mr-1 h-3 w-3" />
                URGENTE
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleDescargarPDF}>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tipo === 'receta' && <RecetaContent orden={orden as IReceta} />}
        {tipo === 'estudio' && <EstudioContent orden={orden as IEstudioOrden} />}
        {tipo === 'reposo' && <ReposoContent orden={orden as IReposo} />}
        {tipo === 'interconsulta' && <InterconsultaContent orden={orden as IInterconsulta} />}
      </CardContent>
    </Card>
  )
}

function RecetaContent({ orden }: { orden: IReceta }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-gray-700">Medicamentos:</p>
        <ul className="mt-2 space-y-2">
          {orden.medicamentos.map((med, idx) => (
            <li key={idx} className="text-sm border-l-2 border-cardionova-red pl-3">
              <p className="font-medium">{med.nombre} {med.concentracion} - {med.presentacion}</p>
              <p className="text-gray-600">
                {med.dosificacion} {med.frecuencia} por {med.duracion}
              </p>
              <p className="text-gray-500 text-xs">Vía: {med.viaAdministracion}</p>
              {med.indicaciones && <p className="text-gray-600 text-xs italic">{med.indicaciones}</p>}
            </li>
          ))}
        </ul>
      </div>
      {orden.observaciones && (
        <div>
          <p className="text-sm font-semibold text-gray-700">Observaciones:</p>
          <p className="text-sm text-gray-600 mt-1">{orden.observaciones}</p>
        </div>
      )}
      <p className="text-xs text-gray-500">Vigencia: {orden.vigencia}</p>
    </div>
  )
}

function EstudioContent({ orden }: { orden: IEstudioOrden }) {
  return (
    <div className="space-y-2">
      <div>
        <Badge>{orden.tipo}</Badge>
        <p className="font-medium mt-2">{orden.nombre}</p>
      </div>
      <div>
        <p className="text-sm text-gray-700">Justificación:</p>
        <p className="text-sm text-gray-600">{orden.justificacion}</p>
      </div>
      <div className="flex space-x-2">
        {orden.ayunas && <Badge variant="secondary">Requiere ayunas</Badge>}
      </div>
      {orden.preparacion && (
        <div>
          <p className="text-sm text-gray-700">Preparación:</p>
          <p className="text-sm text-gray-600">{orden.preparacion}</p>
        </div>
      )}
      {orden.indicaciones && (
        <div>
          <p className="text-sm text-gray-700">Indicaciones:</p>
          <p className="text-sm text-gray-600">{orden.indicaciones}</p>
        </div>
      )}
    </div>
  )
}

function ReposoContent({ orden }: { orden: IReposo }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Badge>{orden.tipo}</Badge>
        <p className="font-medium">{orden.dias} días</p>
      </div>
      <div className="text-sm text-gray-600">
        <p>Desde: {format(new Date(orden.desde), "dd/MM/yyyy")}</p>
        <p>Hasta: {format(new Date(orden.hasta), "dd/MM/yyyy")}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Diagnóstico:</p>
        <p className="text-sm text-gray-600">{orden.diagnostico}</p>
      </div>
      {orden.recomendaciones && (
        <div>
          <p className="text-sm font-semibold text-gray-700">Recomendaciones:</p>
          <p className="text-sm text-gray-600">{orden.recomendaciones}</p>
        </div>
      )}
    </div>
  )
}

function InterconsultaContent({ orden }: { orden: IInterconsulta }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Badge>{orden.especialidad}</Badge>
        {orden.profesionalSolicitado && (
          <p className="text-sm text-gray-600">Dr/a. {orden.profesionalSolicitado}</p>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Motivo:</p>
        <p className="text-sm text-gray-600">{orden.motivo}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Diagnóstico Presuntivo:</p>
        <p className="text-sm text-gray-600">{orden.diagnosticoPresuntivo}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700">Antecedentes:</p>
        <p className="text-sm text-gray-600">{orden.antecedentes}</p>
      </div>
      {orden.examenesRealizados && (
        <div>
          <p className="text-sm font-semibold text-gray-700">Exámenes Realizados:</p>
          <p className="text-sm text-gray-600">{orden.examenesRealizados}</p>
        </div>
      )}
    </div>
  )
}
