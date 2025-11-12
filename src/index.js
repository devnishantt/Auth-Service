import express from "express";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "./routes/apiRoutes.js";
import logger from "./config/loggerConfig.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Press Ctrl+C to stop the server`);
});
