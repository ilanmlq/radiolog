import { ModuleHeader } from '@/modules/admin/components/module-header'
import { ModuleStats } from '@/modules/admin/components/module.stats'
import { DataTable } from '@/modules/admin/components/data-table'
import { AlertCircle } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { useApi } from '@/hooks/use-api'

interface IncidentRow {
  id: string
  resolved: boolean
  description: string
  criticality: number
  createdAt?: string
  updatedAt?: string
}

const columns: ColumnDef<IncidentRow>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'resolved',
    header: 'Statut',
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">Résolu</Badge>
      ) : (
        <Badge variant="destructive">En cours</Badge>
      ),
  },
  {
    accessorKey: 'criticality',
    header: 'Criticité',
    cell: ({ getValue }) => {
      const level = getValue<number>()
      return (
        <Badge variant="outline" className={
          level === 3 ? "text-red-500 border-red-500" :
          level === 2 ? "text-orange-500 border-orange-500" :
          "text-yellow-500 border-yellow-500"
        }>
          Niveau {level}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
]

export default function IncidentPage() {
  const [incidents, setIncidents] = useState<IncidentRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const api = useApi()

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const [resIncidents, resStatuses] = await Promise.all([
          api.get('/incidents'),
          api.get('/status').catch(() => ({ data: { items: [] } })),
        ])

        const allStatuses = resStatuses.data?.items || []

        const rows: IncidentRow[] = (resIncidents.data?.items || []).map((inc: any) => {
          const matchedStatus = allStatuses.find((s: any) =>
            String(s.id ?? s._id) === String(inc.statusId)
          )
          return {
            id: String(inc.id ?? inc._id),
            resolved: matchedStatus?.resolve === true,
            description: inc.description || "",
            criticality: inc.criticality,
            createdAt: inc.createdAt,
            updatedAt: inc.updatedAt,
          }
        })

        setIncidents(rows)
      } catch (err) {
        console.error("Erreur fetch incidents", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchIncidents()
  }, [])

  const resolved = incidents.filter((i) => i.resolved).length
  const ongoing = incidents.filter((i) => !i.resolved).length

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader
        title="Incidents"
        description="Gérez les signalements et les résolutions d'incidents sur le festival"
      >
        <AlertCircle className="size-5" />
      </ModuleHeader>
      <ModuleStats stats={[
        { label: "Nombre d'incidents (totaux)", value: incidents.length },
        { label: 'Incidents résolus', value: resolved },
        { label: 'Incidents en cours', value: ongoing },
      ]} />
      <DataTable
        columns={columns}
        data={incidents}
        searchPlaceholder="Rechercher dans les incidents..."
        pagination={{ pageIndex: 0, pageSize: 50 }}
        sorting={[{ id: 'criticality', desc: true }]}
        globalFilter=""
        rowCount={incidents.length}
        isLoading={isLoading}
        onPageChange={console.log}
        onSortingChange={console.log}
      />
    </div>
  )
}