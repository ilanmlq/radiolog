import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CanalSummary } from "../canal.model"
import { useCanal, useCanalForm } from "@/modules/canals"
import { CanalForm } from "./canal-form"

interface EditCanalDialogProps {
  canal: CanalSummary
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCanalDialog({
  canal,
  open,
  onOpenChange,
}: EditCanalDialogProps) {
  const { updateCanal } = useCanal()

  const handleSubmit = useCallback(
    async (data: { number: number; name: string; description: string }) => {
      await updateCanal(canal.id, data)
    },
    [canal.id, updateCanal]
  )

  const form = useCanalForm({
    initialData: {
      number: canal.number.toString(),
      name: canal.name,
      description: canal.description || '',
    },
    onSubmit: handleSubmit,
    onSuccess: () => {
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le canal</DialogTitle>
          <DialogDescription>
            Modifiez les informations du canal de communication.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.actions.handleSubmit} className="flex flex-col gap-4">
          <CanalForm
            number={form.formData.number}
            name={form.formData.name}
            description={form.formData.description}
            error={form.state.error}
            isSubmitting={form.state.isSubmitting}
            onNumberChange={form.setters.setNumber}
            onNameChange={form.setters.setName}
            onDescriptionChange={form.setters.setDescription}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={form.state.isSubmitting}>
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.state.isSubmitting}>
              {form.state.isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
