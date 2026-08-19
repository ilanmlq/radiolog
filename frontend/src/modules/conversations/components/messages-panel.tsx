import {
  Conversation, ConversationSummary,
  Criticality,
} from "../conversation.model"
import { MessageItem } from "./messages-item.tsx"
import { useConversation } from "../conversation.provider"
import { ChevronLeft } from "lucide-react"
import { useEffect, useRef } from "react"

const criticalityStyles: Record<Criticality, string> = {
  high: "bg-red-600 text-white",
  medium: "bg-yellow-500 text-white",
  low: "bg-green-600 text-white",
}

interface MessagesPanelProps {
  conversation: Conversation | ConversationSummary
}

export function MessagesPanel({
  conversation,
}: MessagesPanelProps) {
  const { messages, isLoading, clearSelectedConversation : onBack, loadMoreMessages, hasMoreMessages, isLoadingMore, totalMessages } = useConversation()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 100

      if (scrolledToBottom && hasMoreMessages && !isLoadingMore) {
        loadMoreMessages()
      }
    }

    const element = scrollRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
  }, [hasMoreMessages, isLoadingMore, loadMoreMessages])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border p-4">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex items-center gap-3 flex-1">
          <div>
            <h2 className="font-bold text-foreground">
              {conversation.summary || "Conversation"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {messages.length} / {totalMessages} message{totalMessages > 1 ? 's' : ''}
            </p>
          </div>

          <span
            className={`rounded px-2 py-1 text-sm font-bold ${criticalityStyles[conversation.criticality || 'low']
              }`}
          >
            {conversation.criticality}
          </span>
        </div>
      </div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="animate-pulse text-muted-foreground">
            Chargement des messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-muted-foreground">
            Aucun message dans cette conversation.
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
              />
            ))}
            {isLoadingMore && (
              <div className="animate-pulse text-muted-foreground text-center py-4">
                Chargement...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
