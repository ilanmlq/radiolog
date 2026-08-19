import { PaginatedResult, PaginationParams } from "@/modules/common.model.ts";
import { Canal, CanalSummary, CreateCanalDTO, UpdateCanalDTO } from "./canal.model";
import { AxiosInstance } from 'axios';
import { buildURLSearchParams } from '@/lib/pagination-utils.tsx';

export async function listCanals(api: AxiosInstance, params: PaginationParams): Promise<PaginatedResult<CanalSummary>> {
  const urlSearchParams = buildURLSearchParams(params);
  return api.get(`/canals?${urlSearchParams}`)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch canals");
      }
      return res.data;
    });
}

export async function getCanalDetails(api: AxiosInstance, canalId: number): Promise<Canal> {
  return api.get(`/canals/${canalId}`)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch canal details");
      }
      return res.data as Canal;
    });
}

export async function createCanal(api: AxiosInstance, data: CreateCanalDTO): Promise<Canal> {
  return api.post(`/canals`, data)
    .then((res) => {
      if (!res.status || res.status !== 201) {
        throw new Error("Failed to create canal");
      }
      return res.data as Canal;
    });
}

export async function updateCanal(api: AxiosInstance, canalId: string, data: UpdateCanalDTO): Promise<Canal> {
  return api.put(`/canals/${canalId}`, data)
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to update canal");
      }
      return res.data as Canal;
    });
}

export async function deleteCanal(api: AxiosInstance, canalId: string): Promise<void> {
  return api.delete(`/canals/${canalId}`)
    .then((res) => {
      if (!res.status || (res.status !== 200 && res.status !== 204)) {
        throw new Error("Failed to delete canal");
      }
    });
}



