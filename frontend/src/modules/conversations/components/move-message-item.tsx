import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { ConversationSummary } from "../conversation.model"
import { useConversation } from "../conversation.provider"
import { Loader2, Check } from "lucide-react"

interface MoveMessageItemProps {
  messageId: string;
  currentConversationId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMoveSuccess: () => void;
}

export function MoveMessageItem({
  messageId,
  currentConversationId,
  isOpen,
  onOpenChange,
  onMoveSuccess,
}: MoveMessageItemProps) {
  const { fetchAllConversations, moveMessage } = useConversation()
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  // stocker la sélection avant de valider
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoadingList(true);
      try {
        const allItems = await fetchAllConversations();
        const filtered = allItems.filter(
          (c) => c.id && c.id !== currentConversationId
        );
        setConversations(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingList(false);
      }
    }

    if (isOpen) {
      loadData();
    } else {
      // On réinitialise la liste et la sélection quand on ferme le menu
      setConversations([]); 
      setSelectedId(null);
    }
  }, [isOpen, currentConversationId, fetchAllConversations]);

  // fonction est appelée au clic sur le bouton valider
  async function handleConfirmMove() {
    if (!selectedId) return;

    try {
      setIsMoving(true);
      await moveMessage(messageId, selectedId);
      onMoveSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Échec du déplacement :", error);
    } finally {
      setIsMoving(false);
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Déplacer vers...</DrawerTitle>
            <DrawerDescription>
              Sélectionnez la conversation de destination puis validez.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-2 p-4 max-h-[40vh] overflow-y-auto">
            {isLoadingList ? (
              <div className="flex justify-center py-8 text-muted-foreground">
                <Loader2 className="animate-spin size-6" />
              </div>
            ) : (
              <>
                {conversations.map((conv) => {
                  const isSelected = selectedId === conv.id;

                  return (
                    <Button
                      key={conv.id}
                      // Si sélectionné, on change le style pour le mettre en évidence
                      variant={isSelected ? "default" : "outline"}
                      className="group flex items-center justify-between h-12 px-4 transition-all"
                      disabled={isMoving}
                      onClick={() => setSelectedId(conv.id as string)}
                    >
                      <span className="truncate">
                        {conv.summary || `Conversation #${conv.id.slice(0, 4)}`}
                      </span>

                      {isSelected && (
                        <Check className="size-4" />
                      )}
                    </Button>
                  );
                })}

                {conversations.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Aucune autre conversation disponible.
                  </p>
                )}
              </>
            )}
          </div>

          <DrawerFooter className="flex-col gap-2">
            <Button 
              onClick={handleConfirmMove} 
              disabled={!selectedId || isMoving || conversations.length === 0}
              className="w-full"
            >
              {isMoving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Déplacement...
                </>
              ) : (
                "Valider le déplacement"
              )}
            </Button>

            <DrawerClose asChild>
              <Button variant="ghost" disabled={isMoving} className="w-full">Annuler</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}