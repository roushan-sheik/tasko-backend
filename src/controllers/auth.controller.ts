// create admin
import { Request, Response } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import { AuthService } from "../services/auth.service";
import ApiResponse from "../utils/ApiResponse";
import { StatusCodes } from "http-status-codes";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

interface MyJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

const registerUser = AsyncHandler(async (req: Request, res: Response) => {
  // get payload from req body
  const payload = req.body;

  const result = await AuthService.registerUser(payload);
  res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(StatusCodes.CREATED, result, "Register Successfully")
    );
});

const loginUser = AsyncHandler(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await AuthService.LoginUser(req.body);
  //   set cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  });
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { accessToken },
        "User LoggedIn Successfully."
      )
    );
});

const getCurrentUser = AsyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(
    token,
    config.JWT_ACCESS_SECRET as string
  ) as MyJwtPayload;

  const email = decoded.email;

  const result = await AuthService.getSingleUserByEmail(email);

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, result, "User fetched successfully"));
});

const getSingleUser = AsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AuthService.getSingleUser(id);

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, result, "User fetched successfully"));
});

const resetPassword = AsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  await AuthService.resetPassword(id, newPassword);

  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, "Password reset successfully"));
});

const logoutUser = AsyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  await AuthService.logoutUser(refreshToken);

  // Clear cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  });
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  });
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, null, "User logged out successfully")
    );
});

export const AuthControllers = {
  registerUser,
  loginUser,
  logoutUser,
  getSingleUser,
  resetPassword,
  getCurrentUser,
};
