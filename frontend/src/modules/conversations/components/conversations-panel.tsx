import { useState, useMemo, useEffect, useRef } from "react"
import { ConversationItem } from "./conversations-item"
import { useConversation } from "../conversation.provider"
import { sortConversations, SortOption } from "../conversation.utils"
import { ChevronLeft } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface ConversationsPanelProps {
  onBack?: () => void
}

export function ConversationsPanel() {
  const { 
    selectedCanal: canal, 
    conversations, 
    isLoading, 
    getMessages: onSelectConversation, 
    clearSelectedCanal : onBack,
    loadMoreConversations,
    hasMoreConversations,
    isLoadingMoreConversations,
    totalConversations
  } = useConversation()
  const [sortOption, setSortOption] = useState<SortOption>("date_desc")
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const sortedConversations = useMemo(() => {
    return sortConversations(conversations, sortOption)
  }, [conversations, sortOption])

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 100

      if (scrolledToBottom && hasMoreConversations && !isLoadingMoreConversations) {
        loadMoreConversations()
      }
    }

    const element = scrollRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
  }, [hasMoreConversations, isLoadingMoreConversations, loadMoreConversations])

  if (!canal) {
    return <div className="p-4 text-muted-foreground">Sélectionnez un canal.</div>
  }

  if (isLoading) {
    return (
      <div className="p-4 text-muted-foreground animate-pulse">
        Chargement des conversations...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <div className="flex items-center justify-between border-b border-border p-4 bg-card w-full">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <ChevronLeft className="size-5" />
            </button>
          )}
          <div>
            <h2 className="font-bold text-foreground truncate">
              {canal.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              {conversations.length} / {totalConversations} conversation{totalConversations > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="text-[10px] uppercase font-bold text-muted-foreground hidden sm:inline">
            Trier par :
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="text-xs bg-muted rounded-md border-none font-bold py-1.5 px-2 focus:ring-1 focus:ring-primary outline-none cursor-pointer"
          >
            <option value="date_desc">Plus récentes</option>
            <option value="date_asc">Plus anciennes</option>
            <option value="criticality_desc">Criticité (↑)</option>
            <option value="criticality_asc">Criticité (↓)</option>
          </select>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto w-full">
        {sortedConversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Aucune conversation dans <span className="font-semibold">{canal.name}</span>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {sortedConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onClick={onSelectConversation}
              />
            ))}
            {isLoadingMoreConversations && (
              <div className="animate-pulse text-muted-foreground text-center py-4">
                Chargement...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}