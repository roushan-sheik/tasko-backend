/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Task,
  TaskCreatePayload,
  TaskUpdatePayload,
  TaskQueryParams,
} from "../interfaces/task.interface";
import TaskModel from "../models/task.model";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { QueryBuilder } from "../builder/QueryBuilder";

const createTaskIntoDB = async (payload: TaskCreatePayload): Promise<Task> => {
  try {
    // Convert endDate string to Date object
    const taskData = {
      ...payload,
      endDate: new Date(payload.endDate),
    };

    const task = await TaskModel.create(taskData);
    return task.toObject();
  } catch (error: any) {
    if (error.name === "ValidationError") {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        Object.values(error.errors)
          .map((err: any) => err.message)
          .join(", ")
      );
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create task"
    );
  }
};

const getAllTasksFromDB = async (query: TaskQueryParams) => {
  try {
    // Build the query using QueryBuilder
    const taskQuery = new QueryBuilder(TaskModel.find({}), query)
      .search(["title", "description"]) // Searchable fields
      .filter() // Apply filters like category, status
      .sort() // Apply sorting
      .paginate() // Apply pagination
      .fields(); // Field selection

    const tasks = await taskQuery.modelQuery.exec();

    // Get total count for pagination
    const totalQuery = new QueryBuilder(TaskModel.find(), query)
      .search(["title", "description"])
      .filter();

    const total = await TaskModel.countDocuments(
      totalQuery.modelQuery.getFilter()
    );

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to fetch tasks"
    );
  }
};

const getTaskByIdFromDB = async (taskId: string): Promise<Task> => {
  try {
    const task = await TaskModel.findById(taskId);

    if (!task) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Task not found");
    }

    return task.toObject();
  } catch (error: any) {
    if (error.name === "CastError") {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid task ID");
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to fetch task"
    );
  }
};

const updateTaskInDB = async (
  taskId: string,
  payload: TaskUpdatePayload
): Promise<Task> => {
  try {
    // Convert endDate string to Date object if provided
    const updateData = {
      ...payload,
      ...(payload.endDate && { endDate: new Date(payload.endDate) }),
    };

    const task = await TaskModel.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Task not found");
    }

    return task.toObject();
  } catch (error: any) {
    if (error.name === "CastError") {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid task ID");
    }
    if (error.name === "ValidationError") {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        Object.values(error.errors)
          .map((err: any) => err.message)
          .join(", ")
      );
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to update task"
    );
  }
};

const deleteTaskFromDB = async (taskId: string): Promise<void> => {
  try {
    const task = await TaskModel.findByIdAndDelete(taskId);

    if (!task) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Task not found");
    }
  } catch (error: any) {
    if (error.name === "CastError") {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid task ID CastError");
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete task"
    );
  }
};

const getTaskStatsFromDB = async () => {
  try {
    const stats = await TaskModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalPoints: { $sum: "$points" },
        },
      },
    ]);

    const categoryStats = await TaskModel.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const overdueTasks = await TaskModel.countDocuments({
      endDate: { $lt: new Date() },
      status: { $ne: "Done" },
    });

    return {
      statusStats: stats,
      categoryStats,
      overdueTasks,
      totalTasks: await TaskModel.countDocuments(),
    };
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to fetch task statistics"
    );
  }
};

export const TaskService = {
  createTaskIntoDB,
  getAllTasksFromDB,
  getTaskByIdFromDB,
  updateTaskInDB,
  deleteTaskFromDB,
  getTaskStatsFromDB,
};
