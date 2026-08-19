import { useState, useRef } from "react"
import { ChatMessage } from "../message.model"
import { MoveMessageItem } from "./move-message-item"
import { EditMessageItem } from "./edit-message-item"
import { useConversation } from "../conversation.provider"
import { SquarePen, Reply, Volume2, VolumeX } from "lucide-react"
import { getRecordAudioUrl } from "@/modules/records/record.service"

interface MessageItemProps {
  message: ChatMessage
}

export function MessageItem({ 
  message, 
}: MessageItemProps) {
  const { members, getMessages, selectedConversation, records } = useConversation()
  const [isMoveDrawerOpen, setIsMoveDrawerOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [isHidden] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  if (isHidden) return null;

  const sender = members.find(
    (m) =>
      m.userId === message.fromMemberId ||
      m.id === message.fromMemberId
  )

  const senderName = sender?.name || "Utilisateur inconnu"
  const senderRole = sender?.roleTitles?.length
    ? sender.roleTitles[0]
    : ""

  const currentText = Array.isArray(message.content) 
    ? message.content.map(part => part.text).join(" ") 
    : "";

  const audioRecord = message.recordID 
    ? records.find(r => r.id === message.recordID)
    : null;

  const handlePlayAudio = () => {
    if (!message.recordID) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(getRecordAudioUrl(message.recordID));
        audioRef.current.addEventListener('ended', () => setIsPlaying(false));
        audioRef.current.addEventListener('error', () => {
          setIsPlaying(false);
          console.error('Error playing audio');
        });
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative mb-4 rounded bg-muted border border-border/60 p-4 shadow-sm transition-all duration-300">
      <div className="mb-2 flex items-baseline justify-between text-xs text-muted-foreground">
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-foreground text-sm">
            {senderName}
          </span>
          {senderRole && (
            <span className="italic text-muted-foreground">
              {senderRole}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {audioRecord && (
            <button
              onClick={handlePlayAudio}
              className="p-1 rounded-md hover:bg-border/50 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={isPlaying ? "Arrêter l'audio" : "Lire l'audio"}
            >
              {isPlaying ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
          )}

          <button
            onClick={() => setIsEditDrawerOpen(true)}
            className="p-1 rounded-md hover:bg-border/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Modifier le message"
          >
            <SquarePen className="size-4" />
          </button>

          <button
            onClick={() => setIsMoveDrawerOpen(true)}
            className="p-1 rounded-md hover:bg-border/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Transférer le message"
          >
            <Reply className="size-4" />
          </button>

          <span>
            {message.createdAt
              ? new Date(message.createdAt).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })
              : ""}
          </span>
        </div>
      </div>

      <p className="text-sm text-foreground">
        {Array.isArray(message.content) ? (
          message.content.map((part, index) => (
            <span
              key={index}
              className={
                part.placeId || part.teamId
                  ? "text-blue-500 font-semibold"
                  : ""
              }
            >
              {part.text}
              {index < message.content.length - 1 ? " " : ""}
            </span>
          ))
        ) : (
          <span className="italic text-muted-foreground">
            [Format de message non supporté]
          </span>
        )}
      </p>

      <MoveMessageItem
        messageId={message.id}
        currentConversationId={message.relatedToConversationId}
        isOpen={isMoveDrawerOpen}
        onOpenChange={setIsMoveDrawerOpen}
        onMoveSuccess={() => {
          if (selectedConversation) {
            getMessages(selectedConversation);
          }
        }}
      />

      <EditMessageItem
        messageId={message.id}
        initialContent={currentText}
        isOpen={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        onEditSuccess={() => {
          if (selectedConversation) {
            getMessages(selectedConversation);
          }
        }}
      />
    </div>
  )
}