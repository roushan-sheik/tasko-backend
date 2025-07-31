import dotenvFlow from "dotenv-flow";

if (process.env.NODE_ENV !== "production") {
  dotenvFlow.config();
}

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  // Cors origin
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  PORT: process.env.PORT || 5000,
  DB_NAME: process.env.DB_NAME || "task-management",
  // mongodb connection string
  MONGO_URI: process.env.MONGO_URI,
  // bcrypt salt
  BCRYPT_SALT: process.env.BCRYPT_JS_SALT_ROUNDS || "5",
  // json webtoken secret
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY || "7d",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY || "15d",
  GLOBAL: process.env.GLOBAL || "GLOBAL from development",
};
