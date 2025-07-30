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
  const user = await User.findOne({ email: payload.email }).select(
    "+password +refreshToken"
  );
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
  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
  };
};

const getSingleUserByEmail = async (email: string): Promise<TUser | null> => {
  const user = await User.findOne({ email }).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  return user;
};

const getSingleUser = async (id: string): Promise<TUser | null> => {
  const user = await User.findById(id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }
  return user;
};

const resetPassword = async (
  userId: string,
  newPassword: string
): Promise<void> => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  user.password = newPassword; // Will be hashed via pre('save')
  await user.save();
};

const logoutUser = async (refreshToken: string): Promise<void> => {
  if (!refreshToken) return;

  // Find user with this refresh token
  const user = await User.findOne({ refreshToken });

  if (user) {
    user.refreshToken = undefined;
    await user.save();
  }
};

export const AuthService = {
  registerUser,
  LoginUser,
  logoutUser,
  getSingleUser,
  resetPassword,
  getSingleUserByEmail,
};
