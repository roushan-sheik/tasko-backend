class ApiResponse<T> {
  private success: boolean;
  constructor(
    public statusCode: number,
    public data: T,
    public message: string = "Success"
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = statusCode >= 400 ? "Failed" : message;
    this.success = statusCode < 400;
  }
}
export default ApiResponse;
