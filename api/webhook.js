import { Telegraf } from "telegraf";
import express from "express";

const app = express();
app.use(express.json());

// Initialize bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// --- Commands ---
bot.start((ctx) => {
  ctx.reply(
    "👋 Welcome to GHost DataHub!\nBot is live and running on Vercel ✅"
  );
});

bot.command("buy", (ctx) => {
  ctx.reply(
    "💰 To buy coins, send payment to the QR code and DM your screenshot!"
  );
});

bot.on("text", (ctx) => {
  ctx.reply(`You said: ${ctx.message.text}`);
});

// --- Webhook Endpoint ---
app.post("/api/webhook", async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).send("Error handling update");
  }
});

export default app;
