import type { TPagination } from "@/shared/types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const getPaginationParams = (query: { page?: string; limit?: string }) => {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(query.limit) || DEFAULT_LIMIT),
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getPaginationMeta = (
  total: number,
  page: number,
  limit: number,
): TPagination => {
  const totalPage = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPage,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPage,
  };
};

const pagination = {
  getPaginationParams,
  getPaginationMeta,
};

export default pagination;
