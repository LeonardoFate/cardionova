'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileText, Pill, FlaskConical, BedDouble, UserRound, Plus } from 'lucide-react'
import type { IHistoriaClinicaResponse } from '@/types/historia-clinica'
import { RecetaForm } from './RecetaForm'
import { EstudioOrdenForm } from './EstudioOrdenForm'
import { ReposoForm } from './ReposoForm'
import { InterconsultaForm } from './InterconsultaForm'
import { OrdenCard } from './OrdenCard'

interface OrdenesMedicasManagerProps {
  historia: IHistoriaClinicaResponse
  onOrdenCreada: (historiaActualizada: IHistoriaClinicaResponse) => void
  canEdit: boolean
}

export function OrdenesMedicasManager({ historia, onOrdenCreada, canEdit }: OrdenesMedicasManagerProps) {
  const [activeTab, setActiveTab] = useState('recetas')
  const [showDialog, setShowDialog] = useState(false)
  const [tipoOrdenSeleccionada, setTipoOrdenSeleccionada] = useState<'receta' | 'estudio' | 'reposo' | 'interconsulta'>('receta')

  const handleOrdenGuardada = (historiaActualizada: IHistoriaClinicaResponse) => {
    setShowDialog(false)
    onOrdenCreada(historiaActualizada)
  }

  const recetas = historia.ordenesMedicas?.recetas || []
  const estudios = historia.ordenesMedicas?.estudios || []
  const reposos = historia.ordenesMedicas?.reposos || []
  const interconsultas = historia.ordenesMedicas?.interconsultas || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-cardionova-red" />
            Órdenes Médicas
          </span>
          {canEdit && (
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-cardionova-red hover:bg-cardionova-darkred">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Orden
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Orden Médica</DialogTitle>
                </DialogHeader>

                <Tabs value={tipoOrdenSeleccionada} onValueChange={(v) => setTipoOrdenSeleccionada(v as any)}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="receta">
                      <Pill className="mr-2 h-4 w-4" />
                      Receta
                    </TabsTrigger>
                    <TabsTrigger value="estudio">
                      <FlaskConical className="mr-2 h-4 w-4" />
                      Estudio
                    </TabsTrigger>
                    <TabsTrigger value="reposo">
                      <BedDouble className="mr-2 h-4 w-4" />
                      Reposo
                    </TabsTrigger>
                    <TabsTrigger value="interconsulta">
                      <UserRound className="mr-2 h-4 w-4" />
                      Interconsulta
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="receta">
                    <RecetaForm historiaId={historia._id} onSuccess={handleOrdenGuardada} />
                  </TabsContent>
                  <TabsContent value="estudio">
                    <EstudioOrdenForm historiaId={historia._id} onSuccess={handleOrdenGuardada} />
                  </TabsContent>
                  <TabsContent value="reposo">
                    <ReposoForm historiaId={historia._id} onSuccess={handleOrdenGuardada} />
                  </TabsContent>
                  <TabsContent value="interconsulta">
                    <InterconsultaForm historiaId={historia._id} onSuccess={handleOrdenGuardada} />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recetas">
              <Pill className="mr-2 h-4 w-4" />
              Recetas ({recetas.length})
            </TabsTrigger>
            <TabsTrigger value="estudios">
              <FlaskConical className="mr-2 h-4 w-4" />
              Estudios ({estudios.length})
            </TabsTrigger>
            <TabsTrigger value="reposos">
              <BedDouble className="mr-2 h-4 w-4" />
              Reposos ({reposos.length})
            </TabsTrigger>
            <TabsTrigger value="interconsultas">
              <UserRound className="mr-2 h-4 w-4" />
              Interconsultas ({interconsultas.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recetas" className="space-y-4">
            {recetas.length === 0 ? (
              <EmptyState tipo="recetas" />
            ) : (
              recetas.map((receta, idx) => (
                <OrdenCard
                  key={idx}
                  tipo="receta"
                  orden={receta}
                  historiaId={historia._id}
                  indice={idx}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="estudios" className="space-y-4">
            {estudios.length === 0 ? (
              <EmptyState tipo="estudios" />
            ) : (
              estudios.map((estudio, idx) => (
                <OrdenCard
                  key={idx}
                  tipo="estudio"
                  orden={estudio}
                  historiaId={historia._id}
                  indice={idx}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="reposos" className="space-y-4">
            {reposos.length === 0 ? (
              <EmptyState tipo="reposos" />
            ) : (
              reposos.map((reposo, idx) => (
                <OrdenCard
                  key={idx}
                  tipo="reposo"
                  orden={reposo}
                  historiaId={historia._id}
                  indice={idx}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="interconsultas" className="space-y-4">
            {interconsultas.length === 0 ? (
              <EmptyState tipo="interconsultas" />
            ) : (
              interconsultas.map((inter, idx) => (
                <OrdenCard
                  key={idx}
                  tipo="interconsulta"
                  orden={inter}
                  historiaId={historia._id}
                  indice={idx}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function EmptyState({ tipo }: { tipo: string }) {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>No hay {tipo} registradas para esta historia clínica.</p>
      <p className="text-sm mt-2">Use el botón "Nueva Orden" para agregar una.</p>
    </div>
  )
}
