import { Outlet } from 'react-router-dom'
import { MobileNav } from '@/modules/mobile/components/mobile-nav'

export function MobileLayout() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}
