import { Hash, MapPin, MessageSquare, Radio, Users, UsersRound, AlertCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  Hash,
  UsersRound,
  Users,
  Radio,
  MessageSquare,
  MapPin,
  AlertCircle,
}

export function NavItem({
  href,
  label,
  icon,
  active,
  onClick,
 }: {
  href: string
  label: string
  icon: string
  active: boolean
  onClick?: () => void
}) {
  const Icon = iconMap[icon] ?? Users

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={href}
          onClick={onClick}
          className={cn(
            "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )}
          aria-current={active ? "page" : undefined}
        >
          <Icon className={cn("size-4 shrink-0", active ? "text-sidebar-primary" : "text-sidebar-foreground/50")} />
          <span>{label}</span>
          {active && (
            <span className="ml-auto size-1.5 rounded-full bg-sidebar-primary" />
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="lg:hidden">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}