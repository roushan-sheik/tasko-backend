import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { TaskValidation } from "../zod/task.validation";
import zodValidateRequest from "../middlewares/zodValidateRequest";

const router = Router();

// Create a new task
router
  .route("/")
  .post(
    zodValidateRequest(TaskValidation.createTaskValidation),
    TaskController.createTask
  )
  .get(
    zodValidateRequest(TaskValidation.taskQueryValidation),
    TaskController.getAllTasks
  );

// Task statistics endpoint
router.route("/stats").get(TaskController.getTaskStats);

// Bulk operations
router.route("/bulk-update").patch(TaskController.bulkUpdateTasks);

router.route("/bulk-delete").delete(TaskController.bulkDeleteTasks);

// Individual task operations
router
  .route("/:id")
  .get(
    zodValidateRequest(TaskValidation.taskParamsValidation),
    TaskController.getTaskById
  )
  .patch(
    zodValidateRequest(TaskValidation.taskParamsValidation),
    zodValidateRequest(TaskValidation.updateTaskValidation),
    TaskController.updateTask
  )
  .delete(
    zodValidateRequest(TaskValidation.taskParamsValidation),
    TaskController.deleteTask
  );

export default router;
