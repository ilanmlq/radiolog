import { PaginationParams } from '@/modules/common.model.ts';

export function buildURLSearchParams(params: PaginationParams) {
  const searchParams = new URLSearchParams();
  searchParams.append('limit', params.limit.toString());
  searchParams.append('offset', params.offset.toString());

  if (params.query) {
    searchParams.append('query', params.query);
  }

  if (params.sortBy) {
    searchParams.append('sortBy', params.sortBy);
  }

  if (params.sortOrder) {
    searchParams.append('sortOrder', params.sortOrder);
  }
  return searchParams.toString();
}
