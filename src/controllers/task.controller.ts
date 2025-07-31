import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AsyncHandler from "../utils/AsyncHandler";
import ApiResponse from "../utils/ApiResponse";
import { TaskService } from "../services/task.service";
import {
  TaskCreatePayload,
  TaskUpdatePayload,
  TaskQueryParams,
} from "../interfaces/task.interface";

const createTask = AsyncHandler(async (req: Request, res: Response) => {
  const payload: TaskCreatePayload = req.body;

  const result = await TaskService.createTaskIntoDB(payload);

  res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(StatusCodes.CREATED, result, "Task created successfully")
    );
});

const getAllTasks = AsyncHandler(async (req: Request, res: Response) => {
  const query: TaskQueryParams = req.query;

  const result = await TaskService.getAllTasksFromDB(query);

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, result, "Tasks retrieved successfully")
    );
});
const getSpinWheelTasks = AsyncHandler(async (req: Request, res: Response) => {
  const query: TaskQueryParams = req.query;

  const result = await TaskService.getSpinWheelTasksFromDB(query);

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, result, "Tasks retrieved successfully")
    );
});

const getTaskById = AsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TaskService.getTaskByIdFromDB(id);

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, result, "Task retrieved successfully")
    );
});

const updateTask = AsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload: TaskUpdatePayload = req.body;

  const result = await TaskService.updateTaskInDB(id, payload);

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, result, "Task updated successfully"));
});

const deleteTask = AsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await TaskService.deleteTaskFromDB(id);

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, "Task deleted successfully"));
});

const getTaskStats = AsyncHandler(async (req: Request, res: Response) => {
  const result = await TaskService.getTaskStatsFromDB();

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        result,
        "Task statistics retrieved successfully"
      )
    );
});

// Bulk operations
const bulkUpdateTasks = AsyncHandler(async (req: Request, res: Response) => {
  const { taskIds, updateData } = req.body;

  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ApiResponse(
          StatusCodes.BAD_REQUEST,
          null,
          "Task IDs array is required"
        )
      );
  }

  const updatePromises = taskIds.map((id) =>
    TaskService.updateTaskInDB(id, updateData)
  );

  const results = await Promise.allSettled(updatePromises);

  const successful = results.filter(
    (result) => result.status === "fulfilled"
  ).length;
  const failed = results.length - successful;

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { successful, failed, total: results.length },
        `Bulk update completed: ${successful} successful, ${failed} failed`
      )
    );
});

const bulkDeleteTasks = AsyncHandler(async (req: Request, res: Response) => {
  const { taskIds } = req.body;

  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ApiResponse(
          StatusCodes.BAD_REQUEST,
          null,
          "Task IDs array is required"
        )
      );
  }

  const deletePromises = taskIds.map((id) => {
    TaskService.deleteTaskFromDB(id);
  });

  const results = await Promise.allSettled(deletePromises);

  const successful = results.filter(
    (result) => result.status === "fulfilled"
  ).length;
  const failed = results.length - successful;

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { successful, failed, total: results.length },
        `Bulk delete completed: ${successful} successful, ${failed} failed`
      )
    );
});

const getTasksByCategory = AsyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;

  const result = await TaskService.getTasksByCategoryFromDB(category);

  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, result, "Tasks retrieved by category")
    );
});

export const TaskController = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
  bulkUpdateTasks,
  bulkDeleteTasks,
  getTasksByCategory,
  getSpinWheelTasks,
};
