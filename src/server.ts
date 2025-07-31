/* eslint-disable no-console */
import app from "./app";
import ConnectDB from "./config/db.config";
import config from "./config";

// Database connection
const startServer = async () => {
  try {
    await ConnectDB();
    console.log("MongoDB Connected Successfully!");

    if (process.env.NODE_ENV !== "production") {
      const PORT = config.PORT || 5000;
      app.listen(PORT, () => {
        console.log("Global log:::::>", config.GLOBAL);
        console.log(
          `\n Application is running on port: http://localhost:${PORT}`
        );
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("MongoDB Connection Failed!!", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
