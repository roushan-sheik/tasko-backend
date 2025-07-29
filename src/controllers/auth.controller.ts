// create admin
import { Request, Response } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import { AuthService } from "../services/auth.service";
import ApiResponse from "../utils/ApiResponse";
import { StatusCodes } from "http-status-codes";
import config from "../config";

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
// update auth
const loginUser = AsyncHandler(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await AuthService.LoginUser(req.body);
  //   set cookie
  res.cookie("refreshToken", refreshToken, {
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

const logoutUser = AsyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  await AuthService.logoutUser(refreshToken);

  // Clear cookie
  res.clearCookie("refreshToken", {
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
};
