import { Settings } from "lucide-react"
import { ModuleHeader } from '@/modules/admin/components/module-header.tsx';

export default function SettingsPage() {
  const moduleInfo = {
    title: 'Paramètres',
    description: 'Configurez les options générales de votre organisation',
    icon: <Settings className="size-5" />
  }

  return (
    <div className="flex flex-col gap-6">
      <ModuleHeader title={moduleInfo.title} description={moduleInfo.description}>
        {moduleInfo.icon}
      </ModuleHeader>
      <div className="rounded-lg border border-border bg-card px-4 py-16 text-center">
        <Settings className="mx-auto size-10 text-muted-foreground/30" />
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          Les paramètres seront disponibles prochainement
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Cette section est en cours de développement
        </p>
      </div>
    </div>
  )
}
