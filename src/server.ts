import express from "express";
import dotenv from "dotenv";
import { bot } from "./bot";
import rateLimiter from "./middleware/rateLimiter";
import errorHandler from "./middleware/errorHandler";

dotenv.config();
const app = express();
app.use(rateLimiter);
app.use(express.json());

// ✅ Webhook route (for Vercel deployment)
app.post(`/api/${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
  bot.handleUpdate(req.body, res);
});

// ✅ Local testing ke liye direct polling (only if not on Vercel)
if (!process.env.VERCEL) {
  bot.launch();
  console.log("🤖 Telegram bot started locally (polling mode)");
}

// ✅ Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
