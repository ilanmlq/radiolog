import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Canal } from "@/modules/canals";
import { Team } from "../team.model";
import { Event } from "@/modules/events";
import { Member } from "@/modules/members/member.model";
// import { Trash2 } from "lucide-react";

import { MemberSummary } from "@/modules/members";
import { useEffect } from "react";

interface TeamFormProps {
  teams: Team[];
  events: Event[];
  membres: MemberSummary[];
  canals: Canal[];
  eventId?: string;
  parentTeamId?: string;
  canalId?: string;
  name: string;
  teamLeaders: string[];
  description?: string;

  error?: string | null;
  isSubmitting?: boolean;

  onEventIdChange: (value: string) => void;
  onParentTeamChange: (value: string | undefined) => void;
  onCanalChange: (value: string | undefined) => void;
  onNameChange: (value: string) => void;
  onTeamLeadersChange: (value: string[]) => void;
  onDescriptionChange: (value: string) => void;
}

export function TeamForm({
  teams,
  events,
  membres,
  canals,
  parentTeamId,
  eventId,
  canalId,
  name,
  teamLeaders,
  description,
  error,
  isSubmitting,
  onEventIdChange,
  onParentTeamChange,
  onCanalChange,
  onNameChange,
  onTeamLeadersChange,
  onDescriptionChange,
}: TeamFormProps) {

  useEffect(() => {
    const normalizedLeaders = teamLeaders.map((leader) => {
      // Si déjà un id existant
      const memberById = membres.find((m) => m.id === leader);
      if (memberById) return leader;
  
      // Sinon on cherche par nom
      const memberByName = membres.find((m) => m.name === leader);
  
      return memberByName ? memberByName.id : leader;
    });
  
    // Évite boucle infinie
    const changed =
      JSON.stringify(normalizedLeaders) !== JSON.stringify(teamLeaders);
  
    if (changed) {
      onTeamLeadersChange(normalizedLeaders);
    }
  }, [teamLeaders, membres, onTeamLeadersChange]);


  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* NAME */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="team-name">Nom de l'équipe *</Label>
        <Input
          id="team-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="parent-team">Choisis l'event</Label>
        <select
          value={eventId}
          onChange={(e) => onEventIdChange(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="">Choisir un event...</option>

          {events.map((event) => (
            <option value={event.id}>{event.name}</option>
          ))}
        </select>
      </div>
      {/* DESCRIPTION */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="team-description">Description</Label>
        <Textarea
          id="team-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      {/* CANAL */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="team-canal">Canal</Label>
        <select
          value={canalId}
          onChange={(e) => onCanalChange(e.target.value || undefined)}
          disabled={isSubmitting}
        >
          <option value="">Choisir un canal...</option>

          {canals.map((canal) => (
            <option value={canal.id}>{canal.name}</option>
          ))}
        </select>
      </div>
      {/* PARENT TEAM */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="parent-team">Équipe parente</Label>
        <select
          value={parentTeamId}
          onChange={(e) => onParentTeamChange(e.target.value || undefined)}
          disabled={isSubmitting}
        >
          <option value="">Choisir une team parent...</option>

          {teams.map((team) => (
            <option value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>
      {/* TEAM LEADERS */}
      <div className="flex flex-col gap-2">
        <Label>Team leaders</Label>

        <div className="flex flex-col gap-2">
          {teamLeaders.map((leaderId, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                value={leaderId}
                disabled={isSubmitting}
                className="border rounded px-2 py-1"
                onChange={(e) => {
                  const updated = [...teamLeaders];
                  updated[index] = e.target.value;

                  onTeamLeadersChange(updated);
                }}
              >
                <option value="">Choisis un team leader</option>

                {membres.map((member) => {
  const alreadySelected =
    teamLeaders.includes(member.id) &&
    member.id !== leaderId;

  return (
    <option
      key={member.id}
      value={member.id}
      disabled={alreadySelected}
    >
      {member.name}
    </option>
  );
})}
              </select>

              <button
                type="button"
                disabled={isSubmitting}
                className="text-red-500"
                onClick={() => {
                  onTeamLeadersChange(
                    teamLeaders.filter((_, i) => i !== index)
                  );
                }}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            disabled={isSubmitting}
            className="w-fit"
            onClick={() => {
              onTeamLeadersChange([...teamLeaders, ""]);
            }}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>{" "}
    </div>
  );
}
