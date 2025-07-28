import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/ApiResponse";
import { RequestHandler } from "express";

const notFound: RequestHandler = (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json(new ApiResponse(StatusCodes.NOT_FOUND, "Not Found"));
};

export default notFound;
