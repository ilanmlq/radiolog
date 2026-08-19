import { ConversationProvider, useConversation } from "@/modules/conversations"
import { CanalsPanel } from "@/modules/conversations/components/canals-panel"
import { ConversationsPanel } from "@/modules/conversations/components/conversations-panel"
import { MessagesPanel } from "@/modules/conversations/components/messages-panel"
import { useIsMobile } from "@/hooks/use-mobile"

export function MessagesView() {
  return (
    <ConversationProvider>
      <MessagesViewContent />
    </ConversationProvider>
  )
}

function MessagesViewContent() {
  const isMobile = useIsMobile()

  const {
    selectedCanal,
    selectedConversation,
    error,
  } = useConversation()


  if (isMobile) {
    if (selectedConversation) {
      return (
        <MessagesPanel
          conversation={selectedConversation}
        />
      )
    }

    if (selectedCanal) {
      return (
        <ConversationsPanel/>
      )
    }

    return (
      <CanalsPanel />
    )
  }
  return (
    <div className="flex flex-1 h-full bg-background text-foreground">
      <div className="w-[320px] border-r border-border overflow-y-auto">
        <CanalsPanel />
      </div>

      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4 text-red-400">{error}</div>
        )}

        {!error && selectedConversation ? (
          <MessagesPanel
            conversation={selectedConversation}
          />
        ) : !error && (
          <ConversationsPanel />
        )}
      </div>
    </div>
  )
}
