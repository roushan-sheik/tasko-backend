import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { auth } from "./middlewares/auth";

const app = express();

// middleware
const corseOptions = {
  origin: [
    "https://taskobd.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  credentials: true,
};
app.use(cors(corseOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import AuthRoute from "./routes/auth.route";
import TaskRoute from "./routes/task.route";

app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/tasks", auth(), TaskRoute);

// Home Route and Health Route
app.get("/", (req: Request, res: Response) => {
  res.send("Task Management Home");
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// not found middleware and globalErrorHandler
import { globalErrorHandler, notFound } from "./middlewares";
app.use(notFound);
app.use(globalErrorHandler);

export default app;
