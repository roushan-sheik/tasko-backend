import bcryptjs from "bcryptjs";

//   check password matched
export const isPasswordMatched = (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcryptjs.compare(plainPassword, hashedPassword);
};
