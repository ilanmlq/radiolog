import { useEffect, useState } from "react"
import { MapPin, Loader2, AlertCircle } from 'lucide-react'
import { ModuleHeader } from '@/modules/admin/components/module-header'
import { ModuleStats } from '@/modules/admin/components/module.stats'
import { DataTable } from '@/modules/admin/components/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { useApi } from '@/hooks/use-api'
import { useNavigate } from 'react-router-dom'

type Place = {
  id: string
  name: string
  description?: string
  latitude: number
  longitude: number
}

const columns: ColumnDef<Place>[] = [
  { accessorKey: 'name', header: 'Nom du lieu' },
  { accessorKey: 'description', header: 'Description', cell: ({ row }) => row.original.description || '—' },
  { accessorKey: 'latitude', header: 'Latitude' },
  { accessorKey: 'longitude', header: 'Longitude' },
]

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const api = useApi()
  const navigate = useNavigate()

  const loadPlaces = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await api.get('/places')
      setPlaces(res.data?.items ?? res.data ?? [])
    } catch (err) {
      console.error("Erreur lors du chargement des lieux:", err)
      setError("Impossible de charger les lieux.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPlaces()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader title="Lieux" description="Gérez les points d'intérêt du festival">
        <MapPin className="size-5" />
      </ModuleHeader>
      <ModuleStats stats={[
        { label: "Points d'intérêt (Total)", value: places.length },
        { label: "Lieux localisés", value: places.filter(p => p.latitude && p.longitude).length },
        { label: "Sans description", value: places.filter(p => !p.description).length },
      ]} />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-zinc-400 border border-dashed border-zinc-800 rounded-xl">
          <Loader2 className="size-8 animate-spin text-blue-500 mb-4" />
          <p>Chargement des lieux...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 text-red-400 border border-dashed border-red-900/50 bg-red-950/10 rounded-xl">
          <AlertCircle className="size-8 mb-4" />
          <p>{error}</p>
          <button onClick={loadPlaces} className="mt-4 px-4 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors">
            Réessayer
          </button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={places}
          searchPlaceholder="Rechercher dans les lieux..."
          pagination={{ pageIndex: 0, pageSize: 50 }}
          sorting={[{ id: 'name', desc: false }]}
          globalFilter=""
          rowCount={places.length}
          isLoading={false}
          onPageChange={console.log}
          onSortingChange={console.log}
          onRowClick={(row: Place) => navigate(`/admin/places/${row.id}`)}
        />
      )}
    </div>
  )
}