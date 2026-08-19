import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useTeamForm } from "@/modules/teams/hooks/use-team-form";
import { TeamForm } from "./team-form";
import { CanalSummary, listCanals } from "@/modules/canals";
import { useApi } from "@/hooks/use-api";
import { listEvents } from "@/modules/events";
import { Event } from "@/modules/events";
import type { Team } from "@/modules/teams/team.model";
import { MemberSummary } from "@/modules/members";
import { useTeam } from "@/modules/teams"

interface AddTeamDialogProps {
  teams: Team[];
  members: MemberSummary[];
}


export function AddTeamDialog(
  {teams, members}
: AddTeamDialogProps
) {
  const { addTeam } = useTeam();
  const [open, setOpen] = useState(false);
  const api = useApi();
  const [canals, setCanals] = useState<CanalSummary[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchCanals() {
      try {
        const data = await listCanals(api, { limit: 100, offset: 0 });
        setCanals(data.items);
      } catch (e) {
        console.error(e);
      }
    }
    async function fetchEvents() {
      try {
        const data = await listEvents(api, { limit: 100, offset: 0 });
        setEvents(data.items);
      } catch (e) {
        console.error(e);
      }
    }

    fetchEvents();
    fetchCanals();
  }, []);

  const form = useTeamForm({
    onSubmit: addTeam,
    onSuccess: () => {
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nouvelle équipe
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une équipe</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle équipe à votre événement.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.actions.handleSubmit(e);
          }}
          className="flex flex-col gap-4"
        >
          <TeamForm
            teams={teams}
            events={events}
            membres={members}
            canals={canals}
            eventId={form.formData.eventId}
            parentTeamId={form.formData.parentTeamId}
            canalId={form.formData.canalId}
            name={form.formData.name}
            teamLeaders={form.formData.teamLeaders}
            description={form.formData.description}
            error={form.state.error}
            isSubmitting={form.state.isSubmitting}
            onEventIdChange={form.setters.setEvenId}
            onParentTeamChange={form.setters.setParentTeamId}
            onCanalChange={form.setters.setCanalId}
            onNameChange={form.setters.setName}
            onTeamLeadersChange={form.setters.setTeamLeaders}
            onDescriptionChange={form.setters.setDescription}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={form.state.isSubmitting}
              >
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
  );
}
