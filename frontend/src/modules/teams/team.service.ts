import { PaginatedResult, PaginationParams } from "@/modules/common.model.ts";
import { Team, CreateTeamDTO, UpdateTeamDTO, TeamID } from "./team.model";
import { AxiosInstance } from "axios";
import { buildURLSearchParams } from "@/lib/pagination-utils.tsx";

export async function listTeams(
  api: AxiosInstance,
  params: PaginationParams
): Promise<PaginatedResult<Team>> {
  const urlSearchParams = buildURLSearchParams(params);

  return api
    .get(`/teams?${urlSearchParams}`)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch teams");
      }
      return res.data;
    });
}

export async function getTeamDetails(
  api: AxiosInstance,
  teamId: TeamID
): Promise<Team> {
  try {
    const res = await api.get<Team>(`/teams/${teamId}`);
    return res.data;
  } catch (error) {
    console.error("getTeamDetails failed:", {
      teamId,
      error,
    });

    throw new Error("Failed to fetch team details");
  }
}

export async function createTeam(
  api: AxiosInstance,
  data: CreateTeamDTO
): Promise<Team> {
  return api
    .post(`/teams`, data)
    .then((res) => {
      if (!res.status || res.status !== 201) {
        console.log(res);
        throw new Error("Failed to create team");
      }
      return res.data as Team;
    });
}

export async function updateTeam(
  api: AxiosInstance,
  teamId: TeamID,
  data: UpdateTeamDTO
): Promise<Team> {
  return api
    .put(`/teams/${teamId}`, data)
    .then((res) => {
      if (!res.status || (res.status !== 200 && res.status !== 201)) {
        throw new Error("Failed to update team");
      }
      return res.data as Team;
    });
}

export async function deleteTeam(
  api: AxiosInstance,
  teamId: TeamID
): Promise<void> {
  return api
    .delete(`/teams/${teamId}`)
    .then((res) => {
      if (!res.status || (res.status !== 200 && res.status !== 204)) {
        throw new Error("Failed to delete team");
      }
    });
}