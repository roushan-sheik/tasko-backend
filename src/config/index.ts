import dotenvFlow from "dotenv-flow";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  try {
    dotenvFlow.config({
      path: path.resolve(process.cwd()),
      silent: true,
    });
  } catch (error) {
    console.log("Dotenv flow config failed, using process.env directly");
  }
}

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  PORT: Number(process.env.PORT) || 5000,
  DB_NAME: process.env.DB_NAME || "task-management",

  // Multiple possible names for MongoDB URI
  MONGO_URI:
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    process.env.MONGO_URL,

  BCRYPT_SALT: Number(process.env.BCRYPT_JS_SALT_ROUNDS) || 5,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY || "3d",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY || "15d",
  GLOBAL: process.env.GLOBAL || process.env.GlOBAL || "GLOBAL from development",
};

// Debug environment variables
console.log("🔍 Environment Variables Debug:");
console.log("NODE_ENV:", config.NODE_ENV);
console.log("PORT:", config.PORT);
console.log("MONGO_URI:", config.MONGO_URI ? "✅ Found" : "❌ Not Found");
console.log(
  "JWT_ACCESS_SECRET:",
  config.JWT_ACCESS_SECRET ? "✅ Found" : "❌ Not Found"
);

// Validation
if (!config.MONGO_URI) {
  console.error("❌ MongoDB URI is missing!");
  console.log(
    "Available env vars:",
    Object.keys(process.env).filter(
      (key) =>
        key.toLowerCase().includes("mongo") ||
        key.toLowerCase().includes("database") ||
        key.toLowerCase().includes("uri")
    )
  );
  process.exit(1);
}

if (!config.JWT_ACCESS_SECRET) {
  console.error("❌ JWT_ACCESS_TOKEN_SECRET is missing!");
  process.exit(1);
}

export default config;
