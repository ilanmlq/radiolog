import { ModuleHeader } from '@/modules/admin/components/module-header'
import { Radio } from 'lucide-react'
import { ModuleStats } from '@/modules/admin/components/module.stats'
import ModuleTable from '@/modules/admin/components/module-table'

export default function RadiosPage() {
  const moduleInfo = {
    title: 'Radios',
    description: 'Gérez l\'attribution des radios et équipements',
    icon: <Radio className="size-5" />
  }

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader title={moduleInfo.title} description={moduleInfo.description}>
        {moduleInfo.icon}
      </ModuleHeader>
      <ModuleStats stats={[
        { label: "Radios", value: 36 },
        { label: "Attribuées", value: 28 },
        { label: "Disponibles", value: 8 }
      ]} />
      <ModuleTable
        title={moduleInfo.title}
      />
    </div>
  )
}
