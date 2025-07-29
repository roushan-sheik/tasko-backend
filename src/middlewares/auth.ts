/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Authorization token missing or malformed"
        );
      }

      const token = authHeader.split(" ")[1]; // Get the token part only

      try {
        // verify token
        const verifyToken = jwt.verify(
          token,
          config.JWT_ACCESS_SECRET as string
        );
        const { email } = verifyToken as JwtPayload;

        // find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
        }

        // attach user to request (optional)
        (req as any).user = user;

        // move to next middleware
        next();
      } catch (err) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Invalid or expired token"
        );
      }
    }
  );
};
