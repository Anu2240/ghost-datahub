import express from "express";
import { apiLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { bot } from "./bot/bot";
import logger from "./utils/logger";

const app = express();

app.use(express.json());
app.use(apiLimiter);

app.get("/", (_, res) => res.send("✅ GHost DataHub Bot is running!"));

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  bot.launch();
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
