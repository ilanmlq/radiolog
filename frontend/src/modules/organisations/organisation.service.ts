import { Organisation } from '@/modules/organisations';
import { AxiosInstance } from 'axios';

export async function getOrganisation(api: AxiosInstance): Promise<Organisation> {
  return api.get('/organisations')
    .then((res) => {
      if (!res.status || res.status !== 200) {
        throw new Error("Failed to fetch organisation details");
      }
      return res.data as Organisation;
    });
}