import { Error as MongooseError } from "mongoose";
import { TErrorSources } from "../interfaces/error.interface";
import GlobalErrorObj from "../utils/GlobalErrorObj";

const handleCastError = (err: MongooseError.CastError) => {
  const errorSources: TErrorSources = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];
  return new GlobalErrorObj(400, "Invalid ID", errorSources);
};

export default handleCastError;
