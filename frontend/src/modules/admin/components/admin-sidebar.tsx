import { NavItem } from "./nav-item"
import { Link, useLocation } from "react-router-dom"
import {
  Settings,
  UserCog,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEvent } from "@/modules/events"

export function AdminSidebar() {
  const { sidebarOpen, setSidebarOpen, selectedEvent } = useEvent()
  const { pathname } = useLocation()

  const isEventsActive = pathname === "/admin"
  const navModules = [
    { id: "canals", label: "Canaux", icon: "Hash" },
    { id: "teams", label: "Équipes", icon: "UsersRound" },
    { id: "members", label: "Membres", icon: "Users" },
    { id: "radios", label: "Radios", icon: "Radio" },
    { id: "conversations", label: "Conversations", icon: "MessageSquare" },
    { id: "places", label: "Lieux", icon: "MapPin" },
    { id: "incidents", label: "Incidents", icon: "AlertCircle" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
          {/* Event section header */}
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "mb-2 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
              isEventsActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
            aria-current={isEventsActive ? "page" : undefined}
          >
            <div className={cn(
              "flex size-7 items-center justify-center rounded-md",
              isEventsActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "bg-sidebar-foreground/10 text-sidebar-foreground/50"
            )}>
              <Zap className="size-3.5" />
            </div>
            <span>{selectedEvent?.name ?? "Evenements"}</span>
            {isEventsActive && (
              <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />
            )}
          </Link>

          <ul className="flex flex-col gap-0.5" role="list">
            {navModules.map((mod) => (
              <li key={mod.id}>
                <NavItem
                  href={`/admin/${mod.id}`}
                  label={mod.label}
                  icon={mod.icon}
                  active={pathname === `/admin/${mod.id}`}
                  onClick={() => setSidebarOpen(false)}
                />
              </li>
            ))}
          </ul>
        </nav>

        {/* Config items pinned at bottom */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <ul className="flex flex-col gap-0.5" role="list">
            <li>
              <Link
                to="/admin/users"
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === "/admin/users"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
                aria-current={pathname === "/admin/users" ? "page" : undefined}
              >
                <UserCog className={cn("size-4 shrink-0", pathname === "/admin/users" ? "text-sidebar-primary" : "text-sidebar-foreground/50")} />
                <span>Utilisateurs</span>
                {pathname === "/admin/users" && (
                  <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === "/admin/settings"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
                aria-current={pathname === "/admin/settings" ? "page" : undefined}
              >
                <Settings className={cn("size-4 shrink-0", pathname === "/admin/settings" ? "text-sidebar-primary" : "text-sidebar-foreground/50")} />
                <span>Paramètres</span>
                {pathname === "/admin/settings" && (
                  <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />
                )}
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  )
}
