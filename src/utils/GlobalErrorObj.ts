import { StatusCodes } from "http-status-codes";
import { TErrorSources } from "../interfaces/error.interface";

class GlobalErrorObj {
  constructor(
    public statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    public message: string = "An unknown error occurred!",
    public errorSources: TErrorSources = [],
    public success: boolean = false
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.errorSources = errorSources;
  }
}
export default GlobalErrorObj;
