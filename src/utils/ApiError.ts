/* eslint-disable @typescript-eslint/no-explicit-any */

class ApiError extends Error {
  public success: boolean;
  public timeStamp: string;

  constructor(
    public statusCode: number,
    public message: string = "Internal Server Error!!",
    public errors: string[] | any[] = [],
    public data: any = undefined,
    public errorType: string = "General",
    public stack: string = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false; // by default false
    this.errors = errors;
    this.data = data;
    this.timeStamp = new Date().toISOString();
    this.errorType = errorType;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  //  format the error
  public toResponseFormat() {
    return {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      errors: this.errors,
      data: this.data,
      timestamp: this.timeStamp,
      errorType: this.errorType,
      stack: process.env.NODE_ENV === "production" ? undefined : this.stack, // প্রডাকশনে স্ট্যাক না দেখানো
    };
  }
}

export default ApiError;

// Input Data  ==================>
// 1. statusCode
// 2. message
// 3. errors
// 4. data
// 5. timestamp
// 6. stack

// // Output obj ================>
// 1. statusCode
// 2. message
// 3. errors
// 4. data
// 5. timestamp
// 6. success
// 7. errorType
// 8. stack
