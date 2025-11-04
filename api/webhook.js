import { Telegraf } from "telegraf";
import express from "express";

const app = express();
app.use(express.json());

// Initialize bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// --- Basic commands ---
bot.start((ctx) => {
  ctx.reply(
    "👋 Welcome to GHost DataHub!\n\nBot is live and running on Vercel ✅"
  );
});

bot.hears("hi", (ctx) => ctx.reply("Hey there! 👻"));

bot.on("text", (ctx) => {
  ctx.reply(`You said: ${ctx.message.text}`);
});

// --- Webhook endpoint ---
app.post("/api/webhook", async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Error handling update");
  }
});

// Required export for Vercel
export default app;
