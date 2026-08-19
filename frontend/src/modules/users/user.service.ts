import { PaginatedResult, PaginationParams } from "@/modules/common.model.ts";
import { User, UserSummary } from "./user.model";
import { AxiosInstance } from 'axios';
import { buildURLSearchParams } from '@/lib/pagination-utils.tsx';

export async function listUsers(api: AxiosInstance, params: PaginationParams): Promise<PaginatedResult<UserSummary>> {
  const urlSearchParams = buildURLSearchParams(params);
  return api.get(`/users?${urlSearchParams}`)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch users");
      }
      return res.data;
    });
}

export async function getUserDetails(api: AxiosInstance, userId: string): Promise<User> {
  return api.get(`/users/${userId}`)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch user details");
      }
      return res.data as User;
    });
}
