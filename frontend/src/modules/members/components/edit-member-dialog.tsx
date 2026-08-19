import { useEffect, useState } from "react"
import { Pencil } from "lucide-react"
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
import { useApi } from "@/hooks/use-api"
import {
  getMemberDetails,
  type Member,
  type MemberSummary,
  useMember,
  useMemberForm,
} from "@/modules/members"
import { useUser } from "@/modules/users"
import { MemberForm } from "./member-form"

interface UpdateMemberDialogProps {
  member: MemberSummary
}

export function UpdateMemberDialog({ member }: UpdateMemberDialogProps) {
  const { updateMember, teams } = useMember()
  const { users } = useUser()
  const api = useApi()
  const [open, setOpen] = useState(false)
  const [memberDetails, setMemberDetails] = useState<Member | MemberSummary>(member)

  useEffect(() => {
    if (!open) {
      return
    }

    let active = true

    getMemberDetails(api, member.id)
      .then((details) => {
        if (active) {
          setMemberDetails({
            ...member,
            ...details,
          })
        }
      })
      .catch((error) => {
        console.error("Failed to load member details:", error)
        setMemberDetails(member)
      })

    return () => {
      active = false
    }
  }, [api, member, open])

  const form = useMemberForm({
    initialData: memberDetails,
    onSubmit: (data) => updateMember(member.id, data),
    onSuccess: () => {
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon" aria-label="Modifier le membre">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[calc(100vh-2rem)] overflow-y-auto"
        style={{ fontFamily: '"sans-serif", "roboto"'}}
      >
        <DialogHeader>
          <DialogTitle>Modifier un membre</DialogTitle>
          <DialogDescription>
            Modifiez les informations de {member.name}.
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
              {form.state.isSubmitting ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
