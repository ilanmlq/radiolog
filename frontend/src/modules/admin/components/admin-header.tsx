import { useEvent } from "@/modules/events"
import {
  ChevronDown,
  Globe, LogOut,
  Menu,
  Settings,
  User,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useOrganisation } from '@/modules/organisations'
import { useAuth } from '@/hooks/use-auth.ts';

export function AdminHeader() {
  const { organisationName } = useOrganisation()
  const { setSidebarOpen } = useEvent()
  const { user, logout } = useAuth()

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border bg-card px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 lg:hidden text-muted-foreground"
        onClick={() => setSidebarOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <Menu className="size-5" />
      </Button>

      {/* Organization + Event */}
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="size-4" />
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold leading-none text-foreground">
            {organisationName}
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2 text-foreground hover:bg-accent"
          >
            <span className="hidden text-sm font-medium md:inline-block">
              {user?.name}
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>
              <User className="mr-2 size-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings className="mr-2 size-4" />
              Paramètres du compte
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Globe className="mr-2 size-4" />
              Langue et préférences
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={logout}>
            <LogOut className="mr-2 size-4" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
