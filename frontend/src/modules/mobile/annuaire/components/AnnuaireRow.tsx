import { cn } from "@/lib/utils"

export interface AnnuaireMember {
  name: string
  surname: string
  phone: string
  roleTitles: string
}

type AnnuaireRowProps = {
  member: AnnuaireMember
  className?: string
}

export function AnnuaireRow({
  member,
  className,
}: AnnuaireRowProps) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground flex items-center justify-between rounded-xl border p-4 shadow-sm",
        className
      )}
    >
      {/* Nom */}
      <div className="flex flex-col">
        <p className="font-semibold">
          {member.name} {member.surname}
        </p>

        <p className="text-sm text-muted-foreground">
          {member.roleTitles}
        </p>
      </div>

      {/* Téléphone */}
      <a
        href={`tel:${member.phone}`}
        className="text-sm text-blue-500 hover:underline"
      >
        {member.phone}
      </a>
    </div>
  )
}