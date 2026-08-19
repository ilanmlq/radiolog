import { CanalSummary } from "@/modules/canals/canal.model"
import { CanalItem } from "./canal-item"
import { useConversation } from "../conversation.provider"

export function CanalsPanel() {
  const { canals, selectedCanal, loadConversations } = useConversation()
  
  return (
    <div className="flex flex-col bg-background text-foreground">
      {canals.map((canal) => (
        <CanalItem
          key={canal.id}
          canal={canal}
          isSelected={selectedCanal?.id === canal.id}
          onClick={loadConversations}
        />
      ))}
    </div>
  )
}
