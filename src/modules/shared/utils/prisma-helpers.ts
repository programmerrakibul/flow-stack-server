import type { Priority, Status } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";

const buildOrderBy = (
  sortBy?: string,
  sortOrder?: Prisma.SortOrder,
): Prisma.TaskOrderByWithRelationInput => {
  const allowedSortFields = ["createdAt", "updatedAt", "priority", "status", "title"] as const;
  const field = allowedSortFields.includes(sortBy as typeof allowedSortFields[number])
    ? sortBy as keyof Prisma.TaskOrderByWithRelationInput
    : "createdAt";

  return { [field]: sortOrder ?? "desc" } as Prisma.TaskOrderByWithRelationInput;
};

const buildSearchFilter = (
  search?: string,
): Prisma.TaskWhereInput => {
  if (!search?.trim()) return {};

  return {
    title: {
      contains: search.trim(),
      mode: "insensitive",
    },
  };
};

const buildStatusFilter = (status?: Status): Prisma.TaskWhereInput => {
  if (!status) return {};

  return { status };
};

const buildPriorityFilter = (priority?: Priority): Prisma.TaskWhereInput => {
  if (!priority) return {};

  return { priority };
};

const buildWhereClause = (
  filters: Prisma.TaskWhereInput[],
): Prisma.TaskWhereInput => {
  const validFilters = filters.filter(
    (f) => Object.keys(f).length > 0,
  );

  if (validFilters.length === 0) return {};

  if (validFilters.length === 1) return validFilters[0]!;

  return { AND: validFilters };
};

const prismaHelpers = {
  buildOrderBy,
  buildSearchFilter,
  buildStatusFilter,
  buildPriorityFilter,
  buildWhereClause,
};

export default prismaHelpers;
