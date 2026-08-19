import { useEffect, useMemo, useState } from "react";
import { Pencil } from "lucide-react";
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

import { useTeam } from "@/modules/teams/team.provider";
import { useTeamForm } from "@/modules/teams/hooks/use-team-form";
import { TeamForm } from "./team-form";
import { CanalSummary, listCanals } from "@/modules/canals";
import { useApi } from "@/hooks/use-api";
import { listEvents } from "@/modules/events";
import { Event } from "@/modules/events";
import type { Team } from "../team.model"
import { MemberSummary } from "@/modules/members";

interface UpdateTeamDialogProps {
  team: Team;
  teams: Team[];
  membres: MemberSummary[];
  fetch:  () => Promise<void> | void;
}

export function UpdateTeamDialog({team, teams, membres, fetch}: UpdateTeamDialogProps) {
  const { updateTeam } = useTeam();
  const [open, setOpen] = useState(false);
  const api = useApi()
  const [canals, setCanals] = useState<CanalSummary[]>([])
  const [events, setEvents] = useState<Event[]>([])
  
  useEffect(() => {
    async function fetchCanals() {
      try {
        const data = await listCanals(api, { limit: 100, offset: 0 })
        setCanals(data.items);
      } catch (e) {
        console.error(e)
      }
    }
    async function fetchEvents() {
      try {
        const data = await listEvents(api, { limit: 100, offset: 0 })
        setEvents(data.items);
      } catch (e) {
        console.error(e)
      }
    }

    fetchEvents();
    fetchCanals();
  }, [])
  
  const form = useTeamForm({
    initialData: team,
    onSubmit: (data) => updateTeam(team.id, data),
    onSuccess: () => {
      setOpen(false);
      fetch();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier une équipe</DialogTitle>
          <DialogDescription>
            Modifier l'équipe {team.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.actions.handleSubmit} className="flex flex-col gap-4">

          <TeamForm
            teams={teams}
            events={events}
            membres={membres}
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
              <Button type="button" variant="outline" disabled={form.state.isSubmitting}>
                Annuler
              </Button>
            </DialogClose>

            <Button type="submit" disabled={form.state.isSubmitting}>
              {form.state.isSubmitting ? "Modification..." : "Modification"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
