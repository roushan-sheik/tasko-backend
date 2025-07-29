import { Router } from "express";
import { TaskController } from "../controllers/task.controller";

const router = Router();

router.route("/task").post(TaskController.createTask);

export default router;
