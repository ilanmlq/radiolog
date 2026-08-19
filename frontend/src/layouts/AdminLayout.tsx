import { Outlet } from 'react-router-dom'
import { AdminHeader } from '@/modules/admin/components/admin-header'
import { AdminSidebar } from '@/modules/admin/components/admin-sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AdminLayout() {
  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
