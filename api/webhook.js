import express from "express";
import { Telegraf } from "telegraf";

const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply("👋 Hey! Bot is active and running on Vercel."));
bot.on("text", (ctx) => ctx.reply(`You said: ${ctx.message.text}`));

app.post("/api/webhook", async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send("Error handling update");
  }
});

export default app;
