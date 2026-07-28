import prisma from "@/config/prisma";
import type { Prisma, User } from "@/generated/prisma/client";
import { Role, Status } from "@/generated/prisma/enums";
import pagination from "@/shared/utils/pagination";
import prismaHelpers from "@/shared/utils/prisma-helpers";
import { parseOrThrow } from "@/shared/utils/utils";
import type { TTaskCreator } from "@/task/interface/task";
import {
  createTaskSchema,
  taskQuerySchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "@/task/validation/task";
import { ForbiddenError, NotFoundError } from "http-errors-enhanced";

const create = async (creatorId: string, payload: unknown) => {
  const data = parseOrThrow(createTaskSchema, payload);

  const task = await prisma.task.create({
    data: {
      ...data,
      creatorId,
    },
  });

  return task;
};

const list = async (creator: TTaskCreator, query: unknown) => {
  const params = parseOrThrow(taskQuerySchema, query);
  const { page, limit, skip } = pagination.getPaginationParams({
    page: params.page ?? "",
    limit: params.limit ?? "",
  });

  const where = prismaHelpers.buildWhereClause([
    prismaHelpers.buildSearchFilter(params.search),
    prismaHelpers.buildStatusFilter(params.status),
    prismaHelpers.buildPriorityFilter(params.priority),
    creator.role !== Role.ADMIN ? { creatorId: creator.id } : {},
  ]);

  const orderBy = prismaHelpers.buildOrderBy(params.sortBy, params.sortOrder);

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: pagination.getPaginationMeta(total, page, limit),
  };
};

const getById = async (creator: TTaskCreator, taskId: string) => {
  const where =
    creator.role !== Role.ADMIN
      ? { id: taskId, creatorId: creator.id }
      : { id: taskId };

  const task = await prisma.task.findUnique({
    where,
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  return task;
};

const update = async (
  creator: TTaskCreator,
  taskId: string,
  payload: unknown,
) => {
  const data = parseOrThrow(updateTaskSchema, payload);

  const task = await prisma.task.findUnique({
    where: { id: taskId, creatorId: creator.id },
    select: {
      id: true,
      creatorId: true,
      status: true,
    },
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  if (task.status === Status.COMPLETED) {
    throw new ForbiddenError("Completed tasks cannot be updated");
  }

  const updateData: Prisma.TaskUncheckedUpdateInput = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.priority !== undefined) updateData.priority = data.priority;

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });

  return updatedTask;
};

const updateStatus = async (
  creator: TTaskCreator,
  taskId: string,
  payload: unknown,
) => {
  const { status } = parseOrThrow(updateTaskStatusSchema, payload);

  const task = await prisma.task.findUnique({
    where: { id: taskId, creatorId: creator.id },
    select: {
      id: true,
      creatorId: true,
      status: true,
    },
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  if (task.status === Status.COMPLETED) {
    throw new ForbiddenError(
      "Completed tasks cannot have their status changed",
    );
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  return updatedTask;
};

const remove = async (creator: Pick<User, "id" | "role">, taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      creatorId: true,
    },
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  const isOwner = task.creatorId === creator.id;
  const isAdmin = creator.role === Role.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError("You don't have permission to delete this task");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: "Task deleted successfully" };
};

const services = {
  create,
  list,
  getById,
  update,
  updateStatus,
  remove,
};

export default services;
