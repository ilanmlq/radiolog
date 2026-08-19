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
import { useConversation } from "../conversation.provider"
import { Loader2 } from "lucide-react"

interface EditMessageDrawerProps {
  messageId: string;
  initialContent: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEditSuccess: () => void;
}

export function EditMessageItem({
  messageId,
  initialContent,
  isOpen,
  onOpenChange,
  onEditSuccess,
}: EditMessageDrawerProps) {
  const { editMessage } = useConversation()
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // On remet le texte initial à chaque fois qu'on ouvre le tiroir
  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
      setErrorMessage(null);
    }
  }, [isOpen, initialContent]);

  async function handleSave() {
    // Si le texte est vide ou s'il n'a pas changé, on ne fait rien
    if (!content.trim() || content === initialContent) return;

    try {
      setIsEditing(true);
      setErrorMessage(null);
      await editMessage(messageId, { content });
      onEditSuccess();
      onOpenChange(false); // On ferme le tiroir si succès
    } catch (error) {
      console.error("Échec de la modification :", error);
      setErrorMessage("Impossible de modifier le message. Veuillez réessayer.");
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Modifier le message</DrawerTitle>
            <DrawerDescription>
              Corrigez ou mettez à jour le contenu de votre message.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-4 p-4">
            {/* Zone de texte utilisant les classes standard de shadcn/ui pour s'intégrer au design */}
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isEditing}
              placeholder="Contenu du message..."
            />
          </div>

          <DrawerFooter className="flex-col gap-2">
            {errorMessage && (
              <p className="text-sm font-medium text-destructive text-center mb-2">
                {errorMessage}
              </p>
            )}

            <Button 
              onClick={handleSave} 
              disabled={isEditing || !content.trim() || content === initialContent}
              className="w-full"
            >
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>

            <DrawerClose asChild>
              <Button variant="ghost" disabled={isEditing} className="w-full">Annuler</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}