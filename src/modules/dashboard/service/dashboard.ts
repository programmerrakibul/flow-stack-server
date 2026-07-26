import { toggleUserActiveSchema } from "@/dashboard/validation/dashboard";
import prisma from "@/config/prisma";
import pagination from "@/shared/utils/pagination";
import { parseOrThrow } from "@/shared/utils/utils";
import { NotFoundError } from "http-errors-enhanced";
import z from "zod";

const THIRTY_DAYS_AGO = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date;
};

const getUserDashboard = async (userId: string) => {
  const thirtyDaysAgo = THIRTY_DAYS_AGO();

  const [
    totalTasks,
    tasksByStatus,
    tasksByPriority,
    recentActivity,
  ] = await Promise.all([
    prisma.task.count({
      where: { creatorId: userId },
    }),
    prisma.task.groupBy({
      by: ["status"],
      where: { creatorId: userId },
      _count: { status: true },
    }),
    prisma.task.groupBy({
      by: ["priority"],
      where: { creatorId: userId },
      _count: { priority: true },
    }),
    prisma.task.findMany({
      where: {
        creatorId: userId,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  const statusCounts = {
    TODO: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
  };

  for (const item of tasksByStatus) {
    statusCounts[item.status] = item._count.status;
  }

  const priorityCounts = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
  };

  for (const item of tasksByPriority) {
    priorityCounts[item.priority] = item._count.priority;
  }

  return {
    totalTasks,
    tasksByStatus: statusCounts,
    tasksByPriority: priorityCounts,
    recentActivity,
  };
};

const getAdminDashboard = async () => {
  const thirtyDaysAgo = THIRTY_DAYS_AGO();

  const [
    totalUsers,
    activeUsers,
    totalTasks,
    tasksByStatus,
    tasksByPriority,
    topCreators,
    recentActivity,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.task.count(),
    prisma.task.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.task.groupBy({
      by: ["priority"],
      _count: { priority: true },
    }),
    prisma.task.groupBy({
      by: ["creatorId"],
      _count: { creatorId: true },
      orderBy: { _count: { creatorId: "desc" } },
      take: 5,
    }),
    prisma.task.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  const statusCounts = {
    TODO: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
  };

  for (const item of tasksByStatus) {
    statusCounts[item.status] = item._count.status;
  }

  const priorityCounts = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
  };

  for (const item of tasksByPriority) {
    priorityCounts[item.priority] = item._count.priority;
  }

  const creatorIds = topCreators.map((c) => c.creatorId);
  const creators = await prisma.user.findMany({
    where: { id: { in: creatorIds } },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const creatorMap = new Map(creators.map((c) => [c.id, c]));

  const topActiveCreators = topCreators.map((c) => ({
    ...creatorMap.get(c.creatorId),
    taskCount: c._count.creatorId,
  }));

  return {
    totalUsers,
    activeUsers,
    totalTasks,
    tasksByStatus: statusCounts,
    tasksByPriority: priorityCounts,
    topActiveCreators,
    recentActivity,
  };
};

const listUsers = async (query: Record<string, string>) => {
  const params = parseOrThrow(
    z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      search: z.string().optional(),
    }),
    query,
  );

  const { page, limit, skip } = pagination.getPaginationParams({
    page: params.page ?? "",
    limit: params.limit ?? "",
  });

  const where = params.search?.trim()
    ? {
        OR: [
          { name: { contains: params.search.trim(), mode: "insensitive" as const } },
          { email: { contains: params.search.trim(), mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
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

const toggleUserActive = async (userId: string, payload: unknown) => {
  const { isActive } = parseOrThrow(toggleUserActiveSchema, payload);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
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
  getUserDashboard,
  getAdminDashboard,
  listUsers,
  toggleUserActive,
  deleteUser,
};

export default services;
