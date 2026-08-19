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
import { useMember, useMemberForm } from "@/modules/members"
import { useUser } from "@/modules/users"
import { MemberForm } from "./member-form"

export function AddMemberDialog() {
  const { addMember, teams } = useMember()
  const { users } = useUser()
  const [open, setOpen] = useState(false)

  const form = useMemberForm({
    onSubmit: addMember,
    onSuccess: () => {
      form.actions.reset()
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 cursor-pointer">
          <Plus className="size-4" />
          Nouveau membre
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[calc(100vh-2rem)] overflow-y-auto"
        style={{ fontFamily: '"sans-serif", "roboto"'}}
      >
        <DialogHeader>
          <DialogTitle>Créer un membre</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau membre de communication à votre organisation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.actions.handleSubmit} className="flex flex-col gap-4">
          <MemberForm
            name={form.formData.name}
            surnames={form.formData.surnames}
            email={form.formData.email}
            phone={form.formData.phone}
            address={form.formData.address}
            roleTitles={form.formData.roleTitles}
            teams={teams}
            users={users}
            teamIds={form.formData.teamIds}
            userId={form.formData.userId}
            error={form.state.error}
            fieldErrors={form.state.fieldErrors}
            isSubmitting={form.state.isSubmitting}
            onNameChange={form.setters.setName}
            onSurnamesChange={form.setters.setSurnames}
            onEmailChange={form.setters.setEmail}
            onPhoneChange={form.setters.setPhone}
            onLine1Change={(value) =>
              form.setters.setAddress((current) => ({
                ...current,
                line1: value,
              }))
            }
            onLine2Change={(value) =>
              form.setters.setAddress((current) => ({
                ...current,
                line2: value,
              }))
            }
            onPostalCodeChange={(value) =>
              form.setters.setAddress((current) => ({
                ...current,
                postalCode: value,
              }))
            }
            onCityChange={(value) =>
              form.setters.setAddress((current) => ({
                ...current,
                city: value,
              }))
            }
            onCountryChange={(value) =>
              form.setters.setAddress((current) => ({
                ...current,
                country: value,
              }))
            }
            onRoleTitlesChange={form.setters.setRoleTitles}
            onTeamIdsChange={form.setters.setTeamIds}
            onUserIdChange={form.setters.setUserId}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={form.state.isSubmitting}>
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.state.isSubmitting} className={form.state.isSubmitting ? "cursor-progress" : "cursor-pointer"}>
              {form.state.isSubmitting ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
