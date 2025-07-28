/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable prefer-const */
import { Schema, model } from "mongoose";
import { TUser } from "../interfaces/user.interface";
import bcryptjs from "bcryptjs";
import config from "../config";

const userSchema = new Schema<TUser>({
  email: {
    type: String,
    required: [true, "Email is required"],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    select: 0,
  },

  passwordChangedAt: {
    type: Date,
  },
});

// password hash method
userSchema.pre("save", async function (next) {
  let user = this;
  user.password = await bcryptjs.hash(
    user.password,
    Number(config.BCRYPT_SALT)
  );
  next();
});

// empty the user pass
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

const User = model<TUser>("User", userSchema);

export default User;
