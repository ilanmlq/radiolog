import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useCanal, useCanalForm } from "@/modules/canals"
import { CanalForm } from "./canal-form"

export function AddCanalDialog() {
  const { addCanal } = useCanal()
  const [open, setOpen] = useState(false)

  const form = useCanalForm({
    onSubmit: addCanal,
    onSuccess: () => {
      form.actions.reset({ number: '', name: '', description: '' })
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nouveau canal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un canal</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau canal de communication à votre organisation.
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
              {form.state.isSubmitting ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
