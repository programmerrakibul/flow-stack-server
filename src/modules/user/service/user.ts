import prisma from "@/config/prisma";
import pagination from "@/shared/utils/pagination";
import { parseOrThrow } from "@/shared/utils/utils";
import { userQuerySchema } from "@/user/validation/user";
import { NotFoundError } from "http-errors-enhanced";

const listUsers = async (query: unknown) => {
  const params = parseOrThrow(userQuerySchema, query);

  const { page, limit, skip } = pagination.getPaginationParams({
    page: params.page ?? "",
    limit: params.limit ?? "",
  });

  const where = params.search?.trim()
    ? {
        OR: [
          {
            name: {
              contains: params.search.trim(),
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: params.search.trim(),
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const paginationMeta = pagination.getPaginationMeta(total, page, limit);

  return {
    users,
    pagination: paginationMeta,
  };
};

const toggleUserActive = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, isActive: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  return updatedUser;
};

const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: "User deleted successfully" };
};

const services = {
  listUsers,
  toggleUserActive,
  deleteUser,
};

export default services;
