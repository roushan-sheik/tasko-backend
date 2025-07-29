import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { TaskValidation } from "../zod/task.validation";
import { zodValidateRequest } from "../middlewares";

const router = Router();

router
  .route("/")
  .post(
    zodValidateRequest(TaskValidation.createTaskValidation),
    TaskController.createTask
  )
  .get(TaskController.getAllTasks);

router.route("/stats").get(TaskController.getTaskStats);
router.route("/bulk-update").patch(TaskController.bulkUpdateTasks);
router.route("/bulk-delete").delete(TaskController.bulkDeleteTasks);
router.route("/category/:category").get(TaskController.getTasksByCategory);

router
  .route("/:id")
  .get(TaskController.getTaskById)
  .patch(
    zodValidateRequest(TaskValidation.updateTaskValidation),
    TaskController.updateTask
  )
  .delete(TaskController.deleteTask);

export default router;
