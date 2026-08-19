import { PaginatedResult, PaginationParams } from "@/modules/common.model.ts";
import { Member, MemberSummary, CreateMemberDTO, UpdateMemberDTO, MemberID } from "./member.model";
import { AxiosInstance } from 'axios';
import { buildURLSearchParams } from '@/lib/pagination-utils.tsx';

export async function listMembers(api: AxiosInstance, params: PaginationParams): Promise<PaginatedResult<MemberSummary>> {
  const urlSearchParams = buildURLSearchParams(params);
  return api.get(`/members?${urlSearchParams}`)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch members");
      }
      return res.data;
    });
}

export async function listMembersForTeam(
  api: AxiosInstance,
  teamId: string,
  params: PaginationParams
): Promise<PaginatedResult<MemberSummary>> {

  const res = await api.get(`/teams/${teamId}/members`, {
    params,
  });

  return res.data;
}

export async function getMemberDetails(api: AxiosInstance, memberId: MemberID): Promise<Member> {
  return api.get(`/members/${memberId}`)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch member details");
      }
      return res.data as Member;
    });
}

export async function createMember(api: AxiosInstance, data: CreateMemberDTO): Promise<Member> {
  return api.post(`/members`, data)
    .then((res) => {
      if (!res.status || res.status !== 201) {
        throw new Error("Failed to create member");
      }
      return res.data as Member;
    });
}

export async function updateMember(api: AxiosInstance, memberId: string, data: UpdateMemberDTO): Promise<Member> {
  return api.put(`/members/${memberId}`, data)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to update member");
      }
      return res.data as Member;
    });
}

export async function deleteMember(api: AxiosInstance, memberId: string): Promise<void> {
  return api.delete(`/members/${memberId}`)
    .then((res) => {
      if (!res.status || (res.status !== 200 && res.status !== 204)) {
        throw new Error("Failed to delete member");
      }
    });
}


