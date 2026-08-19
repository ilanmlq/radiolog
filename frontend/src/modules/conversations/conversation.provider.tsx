import { ConversationID, ConversationSummary, CreateConversationDTO, UpdateConversationDTO, Conversation } from './conversation.model';
import { ChatMessage, MessageID, EditMessageDTO } from './message.model';
import { CanalID, CanalSummary } from '@/modules/canals/canal.model';
import { listCanals } from '@/modules/canals/canal.service';
import { listConversations, listConversationsByCanal, moveMessage, editMessage, listMessagesForConversation } from './conversation.service';
import { listRecordsForConversation } from '@/modules/records/record.service';
import { Record } from '@/modules/records/record.model';
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/hooks/use-auth';

export interface Member {
  id: string
  teamId: string
  userId: string
  name: string
  roleTitles: string[]
}

interface ConversationContextValue {
  conversations: ConversationSummary[]
  canals: CanalSummary[]
  members: Member[]
  selectedCanal: CanalSummary | null
  selectedConversation: Conversation | ConversationSummary | null
  globalFilter: string
  isLoading: boolean
  messages: ChatMessage[]
  records: Record[]
  error: string
  hasMoreMessages: boolean
  isLoadingMore: boolean
  hasMoreConversations: boolean
  isLoadingMoreConversations: boolean
  totalConversations: number
  totalMessages: number
  setGlobalFilter: (filter: string) => void
  setSelectedCanal: (canal: CanalSummary | null) => void
  setSelectedConversation: (conversation: Conversation | null) => void
  loadConversations: (canal: CanalSummary) => Promise<void>
  loadMoreConversations: () => Promise<void>
  moveMessage: (messageId: MessageID, targetConversationId: ConversationID) => Promise<void>
  editMessage: (messageId: MessageID, data: EditMessageDTO) => Promise<void>
  getMessages: (conversation: Conversation | ConversationSummary) => Promise<void>
  loadMoreMessages: () => Promise<void>
  fetchAllConversations: () => Promise<ConversationSummary[]>
  clearSelectedConversation: () => void
  clearSelectedCanal: () => void
}

const ConversationContext = createContext<ConversationContextValue | undefined>(undefined)

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [canals, setCanals] = useState<CanalSummary[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [selectedCanal, setSelectedCanal] = useState<CanalSummary | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | ConversationSummary | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [records, setRecords] = useState<Record[]>([])
  
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLoadingMoreConversations, setIsLoadingMoreConversations] = useState(false)
  const [error, setError] = useState('')
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const [hasMoreConversations, setHasMoreConversations] = useState(false)
  const [totalMessages, setTotalMessages] = useState(0)
  const [totalConversations, setTotalConversations] = useState(0)

  const { toast } = useToast()
  const api = useApi()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const fetchCanals = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;
    try {
      const result = await listCanals(api, { limit: 100, offset: 0 });
      setCanals(result.items);
    } catch (error) {
      console.error("Failed to load canals:", error);
    }
  }, [api, isAuthenticated, authLoading]);

  const fetchMembers = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;
    try {
      const response = await api.get("/members");
      setMembers(response.data.items || []);
    } catch (error) {
      console.error("Failed to load members:", error);
    }
  }, [api, isAuthenticated, authLoading]);

  const handleLoadConversations = useCallback(async (canal: CanalSummary) => {
    setSelectedCanal(canal);
    setSelectedConversation(null);
    setIsLoading(true);
    setError('');
    try {
      const result = await listConversationsByCanal(api, canal.id, 50, 0);
      setConversations(result.items);
      setTotalConversations(result.total);
      setHasMoreConversations(result.items.length < result.total);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError('Impossible de charger les conversations.');
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des conversations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [api, toast]);

  const handleSetGlobalFilter = useCallback((filter: string) => {
    setGlobalFilter(filter)
  }, [setGlobalFilter])

  const handleMoveMessage = useCallback(async (messageId: MessageID, targetConversationId: ConversationID) => {
    try {
      await moveMessage(api, messageId, targetConversationId)
      toast({
        title: "Message déplacé",
        description: "Le message a été déplacé avec succès.",
      })
    } catch (error) {
      console.error("Failed to move message:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du déplacement du message.",
        variant: "destructive",
      })
      throw error
    }
  }, [api, toast])

  const handleEditMessage = useCallback(async (messageId: MessageID, data: EditMessageDTO) => {
    try {
      await editMessage(api, messageId, data)
      toast({
        title: "Message modifié",
        description: "Le message a été modifié avec succès.",
      })
    } catch (error) {
      console.error("Failed to edit message:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du message.",
        variant: "destructive",
      })
      throw error
    }
  }, [api, toast])

  const handleGetMessages = useCallback(async (conversation: Conversation | ConversationSummary): Promise<void> => {
    setIsLoading(true);
    setError('');
    try {
      const [messagesData, audioRecordsData] = await Promise.all([
        listMessagesForConversation(api, conversation.id, 50, 0),
        listRecordsForConversation(api, conversation.id)
      ]);

      setSelectedConversation(conversation);
      setMessages(messagesData.items);
      setRecords(audioRecordsData);
      setTotalMessages(messagesData.total);
      setHasMoreMessages(messagesData.items.length < messagesData.total);
    } catch (err) {
      console.error("Failed to load records:", err);
      setError('Impossible de charger les messages.');
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  const handleFetchAllConversations = useCallback(async () => {
    try {
      const result = await listConversations(api, 1000, 0);
      return result.items;
    } catch (error) {
      console.error("Failed to fetch all conversations:", error);
      return [];
    }
  }, [api]);

  const handleLoadMoreConversations = useCallback(async () => {
    if (!selectedCanal || isLoadingMoreConversations || !hasMoreConversations) return;
    
    setIsLoadingMoreConversations(true);
    try {
      const result = await listConversationsByCanal(api, selectedCanal.id, 50, conversations.length);
      
      setConversations(prev => [...prev, ...result.items]);
      setHasMoreConversations(conversations.length + result.items.length < result.total);
    } catch (err) {
      console.error("Failed to load more conversations:", err);
    } finally {
      setIsLoadingMoreConversations(false);
    }
  }, [api, selectedCanal, conversations.length, hasMoreConversations, isLoadingMoreConversations]);

  const handleLoadMoreMessages = useCallback(async () => {
    if (!selectedConversation || isLoadingMore || !hasMoreMessages) return;
    
    setIsLoadingMore(true);
    try {
      const messagesData = await listMessagesForConversation(
        api, 
        selectedConversation.id, 
        50, 
        messages.length
      );
      
      setMessages(prev => [...prev, ...messagesData.items]);
      setHasMoreMessages(messages.length + messagesData.items.length < messagesData.total);
    } catch (err) {
      console.error("Failed to load more messages:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [api, selectedConversation, messages.length, hasMoreMessages, isLoadingMore]);

  const clearSelectedConversation = useCallback(() => {
    setSelectedConversation(null);
    setMessages([]);
    setHasMoreMessages(false);
    setTotalMessages(0);
  }, []);

  const clearSelectedCanal = useCallback(() => {
    setSelectedCanal(null);
    setConversations([]);
    setHasMoreConversations(false);
    setTotalConversations(0);
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchCanals()
      fetchMembers()
    }
  }, [isAuthenticated, authLoading, fetchCanals, fetchMembers])

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        canals,
        members,
        selectedCanal,
        selectedConversation,
        globalFilter,
        isLoading,
        messages,
        records,
        error,
        hasMoreMessages,
        isLoadingMore,
        hasMoreConversations,
        isLoadingMoreConversations,
        totalConversations,
        totalMessages,
        setGlobalFilter: handleSetGlobalFilter,
        setSelectedCanal,
        setSelectedConversation,
        loadConversations: handleLoadConversations,
        loadMoreConversations: handleLoadMoreConversations,
        moveMessage: handleMoveMessage,
        editMessage: handleEditMessage,
        getMessages: handleGetMessages,
        loadMoreMessages: handleLoadMoreMessages,
        fetchAllConversations: handleFetchAllConversations,
        clearSelectedConversation,
        clearSelectedCanal,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}

export function useConversation() {
  const ctx = useContext(ConversationContext)
  if (!ctx) throw new Error("useConversation must be used within ConversationProvider")
  return ctx
}
