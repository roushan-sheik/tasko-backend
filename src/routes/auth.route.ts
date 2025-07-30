import { Router } from "express";
import { AuthControllers } from "../controllers/auth.controller";
import { zodValidateRequest } from "../middlewares";
import { AuthValidation } from "../zod/auth.validation";
import { auth } from "../middlewares/auth";

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
router.route("/me").get(auth(), AuthControllers.getCurrentUser);
router.route("/user/:id").get(auth(), AuthControllers.getSingleUser);

router
  .route("/reset-password/:id")
  .patch(
    zodValidateRequest(AuthValidation.resetPasswordValidationSchema),
    auth(),
    AuthControllers.resetPassword
  );

router.route("/logout").post(AuthControllers.logoutUser);

export default router;
