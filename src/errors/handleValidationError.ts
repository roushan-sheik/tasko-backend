import { Error as MongooseError } from "mongoose";
import { TErrorSources } from "../interfaces/error.interface";
import GlobalErrorObj from "../utils/GlobalErrorObj";

const handleValidationError = (err: MongooseError.ValidationError) => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (singleError: MongooseError.ValidatorError | MongooseError.CastError) => {
      return {
        path: singleError?.path,
        message: singleError?.message,
      };
    }
  );
  return new GlobalErrorObj(400, "Validation Error", errorSources);
};

export default handleValidationError;
