import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";

const app = express();

// middleware
const corseOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corseOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
import AuthRoute from "./routes/auth.route";

app.use("/api/v1/auth", AuthRoute);

// Home Route and Health Route
app.get("/", (req: Request, res: Response) => {
  res.send("Task Management Home");
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(), // how long the app has been running
    timestamp: new Date().toISOString(),
  });
});

// not found middleware and globalErrorHandler
import { globalErrorHandler, notFound } from "./middlewares";
app.use(notFound);
app.use(globalErrorHandler);

export { app };
