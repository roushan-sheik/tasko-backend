export type TUser = {
  fullName: string;
  email: string;
  password: string;
  refreshToken?: string;
  passwordChangedAt?: Date;
};
