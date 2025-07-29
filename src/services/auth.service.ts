/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import { TUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";
import { TLoginUser } from "../interfaces/auth.interface";
import { isPasswordMatched } from "../utils/functions/auth.utils";
import jwt from "jsonwebtoken";
import config from "../config";

const registerUser = async (payload: TUser): Promise<TUser> => {
  // check user already exists
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw new ApiError(StatusCodes.CONFLICT, "User already exists.");
  }
  //   hash the user password by pre hook
  //   create new user
  const newUser = await User.create(payload);
  return newUser;
};

const LoginUser = async (payload: TLoginUser): Promise<any> => {
  // check user
  const user = await User.findOne({ email: payload.email }).select("+password");
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found!");
  }

  // check password
  const passwordMatch = await isPasswordMatched(
    payload.password,
    user.password
  );
  if (!passwordMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  //   generate a access token
  const jwtPayload = {
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS_SECRET as string, {
    expiresIn: config.JWT_ACCESS_EXPIRY,
  });
  const refreshToken = jwt.sign(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    {
      expiresIn: config.JWT_REFRESH_EXPIRY,
    }
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  registerUser,
  LoginUser,
};
