import { ConversationSummary, Criticality } from "../conversation.model"

const criticalityStyles: Record<Criticality, string> = {
  high: "bg-red-600 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-green-600 text-white",
}

interface ConversationItemProps {
  conversation: ConversationSummary
  onClick: (conversation: ConversationSummary) => void
}

export function ConversationItem({
  conversation,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      className="border-b border-border p-4 text-left transition-colors hover:bg-accent"
      onClick={() => onClick(conversation)}
    >
      <div className="mb-1 flex items-center justify-between gap-4">
        <span className="font-semibold text-foreground">
          {conversation.summary}
        </span>
        <span
          className={`rounded-md px-2 py-1 text-sm font-bold ${criticalityStyles[conversation.criticality || 'low']
            }`}
        >
          {conversation.criticality}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        Créé le{" "}
        {conversation.createdAt ? new Date(conversation.createdAt).toLocaleString("fr-FR") : 'Date inconnue'}
      </p>
    </button>
  )
}
