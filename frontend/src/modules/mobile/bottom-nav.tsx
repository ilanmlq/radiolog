import { Link, useLocation } from "react-router-dom"
import { MessageCircle, Map, Users, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/messages", label: "Conversations", icon: MessageCircle },
  { href: "/map", label: "Carte", icon: Map },
  { href: "/directory", label: "Annuaire", icon: Users },
  { href: "/profile", label: "Profil", icon: UserCircle },
] as const

export function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-md"
      role="tablist"
      aria-label="Navigation principale"
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              to={href}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-xl transition-all",
                  isActive && "bg-primary/10"
                )}
              >
                <Icon
                  className={cn(
                    "size-5 transition-all",
                    isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                  )}
                />
              </div>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
      {/* Safe area padding for notch devices */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
