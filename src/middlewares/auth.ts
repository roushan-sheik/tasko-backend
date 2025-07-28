import AsyncHandler from "./../utils/AsyncHandler";
import { NextFunction, Response, Request } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import User from "../models/user.model";

export const auth = () => {
  return AsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Extract the token from req.headers.authorization
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "You are unauthorized to access this route."
        );
      }
      // verify token
      const verifyToken = jwt.verify(token, config.JWT_ACCESS_SECRET as string);
      const { email } = verifyToken as JwtPayload;
      // find the user  by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
      }

      // finally let him go call the next function
      next();
    }
  );
};
