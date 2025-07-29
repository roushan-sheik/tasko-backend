import { Router } from "express";
import { AuthControllers } from "../controllers/auth.controller";
import { zodValidateRequest } from "../middlewares";
import { AuthValidation } from "../zod/auth.validation";

const router = Router();

router
  .route("/register")
  .post(
    zodValidateRequest(AuthValidation.registerUserValidationSchema),
    AuthControllers.registerUser
  );
router
  .route("/login")
  .post(
    zodValidateRequest(AuthValidation.loginValidationSchema),
    AuthControllers.loginUser
  );

router.route("/logout").post(AuthControllers.logoutUser);

export default router;
