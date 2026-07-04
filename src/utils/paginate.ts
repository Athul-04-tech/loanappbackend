import { Request } from "express";

type Query = Request["query"];

export function buildPagination(query: Query, allowedSortColumns = ["id"]) {
  const page = Math.max(1, parseInt(String(query.page), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit), 10) || 20));
  const offset = (page - 1) * limit;

  const querySort = typeof query.sort === "string" ? query.sort : "";
  const sort = allowedSortColumns.includes(querySort) ? querySort : allowedSortColumns[0];
  const order = query.order === "desc" ? "DESC" : "ASC";

  return { page, limit, offset, sort, order };
}

export function buildPaginationMeta(page: number, limit: number, totalCount: number) {
  return {
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    hasNextPage: page * limit < totalCount,
    hasPrevPage: page > 1,
  };
}
