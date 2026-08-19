export type TeamID = string;

export interface Team {
  id: TeamID;
  name: string;
  teamLeaders: string[];
  description: string;
  eventId: string;
  parentTeamId?: string;
  canalId?: string;
}

export interface CreateTeamDTO {
  eventId: string;
  parentTeamId?: string;
  canalId?: string;
  name: string;
  teamLeaders: string[];
  description?: string;
}

export interface UpdateTeamDTO {
  parentTeamId?: string;
  canalId?: string;
  name?: string;
  teamLeaders?: string[];
  description?: string;
}