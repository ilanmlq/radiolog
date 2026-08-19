import { ModuleHeader } from '@/modules/admin/components/module-header'
import { MessageSquare } from 'lucide-react'
import { ModuleStats } from '@/modules/admin/components/module.stats'
import ModuleTable from '@/modules/admin/components/module-table'

export default function ConversationsPage() {
  const moduleInfo = {
    title: 'Conversations',
    description: 'Consultez et gérez les échanges entre les équipes',
    icon: <MessageSquare className="size-5" />
  }

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader title={moduleInfo.title} description={moduleInfo.description}>
        {moduleInfo.icon}
      </ModuleHeader>
      <ModuleStats stats={[
        { label: "Conversations", value: 12 },
        { label: "Échanges", value: 384 },
        { label: "Conversation critiques", value: 1 }
      ]} />
      <ModuleTable
        title={moduleInfo.title}
      />
    </div>
  )
}
