import { EventStatus } from '../event.model';
import {
  Check,
  Clock,
  Loader2,
} from "lucide-react"

export function getStatusConfig(status: EventStatus) {
  switch(status) {
    case "preparation":
      return {
        label: "Préparation",
        className: "bg-primary/10 text-primary border-primary/20",
        icon: Clock,
      }
    case "active":
      return {
        label: "En cours",
        className: "bg-warning/10 text-warning-foreground border-warning/20",
        icon: Loader2,
      }
    case "completed":
      return {
        label: "Terminé",
        className: "bg-success/10 text-success border-success/20",
        icon: Check,
      }
  }
}