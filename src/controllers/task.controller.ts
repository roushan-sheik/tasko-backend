import { StatusCodes } from "http-status-codes";
import AsyncHandler from "../utils/AsyncHandler";
import ApiResponse from "../utils/ApiResponse";
import { TaskService } from "../services/task.service";

const createTask = AsyncHandler(async (req: Request, res: Response) => {
  // get payload from req body
  const payload = req.body;

  const result = await TaskService.createTaskIntoDB(payload);
  res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(StatusCodes.CREATED, result, "Register Successfully")
    );
});

export const TaskController = {
  createTask,
};
