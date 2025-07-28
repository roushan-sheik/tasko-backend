import { ZodError, ZodIssue } from "zod";
import GlobalErrorObj from "../utils/GlobalErrorObj";

export const handleZodError = (err: ZodError) => {
  const errorSources = err.errors.map((error: ZodIssue) => {
    return {
      path: error?.path[error.path.length - 1] as string,
      message: error?.message,
    };
  });
  return new GlobalErrorObj(400, "Zod Validation Error", errorSources);
};
