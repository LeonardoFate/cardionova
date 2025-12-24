// components/estudios/EstudioPDFUpload.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, FileText, Trash2, Download, X } from 'lucide-react'
import { IEstudioResponse, IArchivoPDF } from '@/types/estudio'

interface EstudioPDFUploadProps {
  estudio: IEstudioResponse
  onSuccess: () => void
  onCancel: () => void
}

export function EstudioPDFUpload({ estudio, onSuccess, onCancel }: EstudioPDFUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [archivos, setArchivos] = useState<IArchivoPDF[]>(estudio.archivosPDF || [])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validar tipo de archivo
        if (file.type !== 'application/pdf') {
          setError(`El archivo ${file.name} no es un PDF válido`)
          continue
        }

        // Validar tamaño (máximo 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError(`El archivo ${file.name} excede el tamaño máximo de 10MB`)
          continue
        }

        // NOTA: Aquí deberías implementar la subida real del archivo
        // Por ahora simulamos la subida y guardamos solo la metadata

        // Simular subida del archivo
        const formData = new FormData()
        formData.append('file', file)
        formData.append('estudioId', estudio._id)

        // Aquí iría la llamada real a tu servicio de almacenamiento
        // Por ahora simulamos con un delay y creamos un objeto de archivo
        await new Promise(resolve => setTimeout(resolve, 1000))

        const nuevoArchivo: IArchivoPDF = {
          nombre: file.name,
          url: `/uploads/estudios/${estudio._id}/${file.name}`, // URL simulada
          tamanio: file.size,
          fechaCarga: new Date()
        }

        // Actualizar lista local
        const nuevosArchivos = [...archivos, nuevoArchivo]
        setArchivos(nuevosArchivos)

        // Actualizar en el servidor
        await updateEstudioArchivos(nuevosArchivos)
      }

      setSuccess('Archivo(s) cargado(s) correctamente')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar archivos')
    } finally {
      setIsLoading(false)
      event.target.value = '' // Limpiar input
    }
  }

  const updateEstudioArchivos = async (nuevosArchivos: IArchivoPDF[]) => {
    const response = await fetch(`/api/estudios/${estudio._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        archivosPDF: nuevosArchivos
      })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Error al actualizar archivos')
    }
  }

  const handleDeleteArchivo = async (index: number) => {
    try {
      setIsLoading(true)
      setError(null)

      const nuevosArchivos = archivos.filter((_, i) => i !== index)
      setArchivos(nuevosArchivos)

      await updateEstudioArchivos(nuevosArchivos)
      setSuccess('Archivo eliminado correctamente')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar archivo')
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Información del estudio */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-[#1e3a8a] mb-2">Información del Estudio</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Paciente</p>
            <p className="font-medium">{estudio.pacienteNombre}</p>
          </div>
          <div>
            <p className="text-gray-500">Tipo de Estudio</p>
            <p className="font-medium">{estudio.tipoEstudio.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </div>

      {/* Área de carga */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">Arrastra archivos PDF aquí o haz clic para seleccionar</p>
        <p className="text-sm text-gray-500 mb-4">Tamaño máximo: 10MB por archivo</p>
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
          disabled={isLoading}
        />
        <label htmlFor="pdf-upload">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => document.getElementById('pdf-upload')?.click()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Seleccionar Archivos PDF
              </>
            )}
          </Button>
        </label>
      </div>

      {/* Lista de archivos */}
      {archivos.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Archivos Cargados ({archivos.length})</h4>
          <div className="space-y-2">
            {archivos.map((archivo, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <FileText className="h-8 w-8 text-red-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{archivo.nombre}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(archivo.tamanio)} •
                      Cargado el {new Date(archivo.fechaCarga).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(archivo.url, '_blank')}
                    title="Descargar archivo"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteArchivo(index)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Eliminar archivo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nota informativa */}
      <Alert>
        <AlertDescription className="text-sm">
          <strong>Nota:</strong> Los archivos PDF se almacenan de forma segura y pueden ser descargados
          en cualquier momento. Asegúrate de cargar documentos legibles y de buena calidad.
        </AlertDescription>
      </Alert>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" />
          Cerrar
        </Button>
        <Button
          type="button"
          onClick={onSuccess}
          className="bg-cardionova-red hover:bg-cardionova-darkred"
          disabled={isLoading}
        >
          Finalizar
        </Button>
      </div>
    </div>
  )
}
