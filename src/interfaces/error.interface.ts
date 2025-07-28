export type TErrorSources = {
  path: string;
  message: string;
}[];

export interface ICustomGlobalError {
  success: boolean;
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
}
