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
  refreshToken: {
    type: String,
    select: false,
  },
  passwordChangedAt: {
    type: Date,
  },
});

// password hash method
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(
    this.password,
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
