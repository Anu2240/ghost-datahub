import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
import { saveOrUpdateUser, getUser } from "../services/userService";
import { mainMenuKeyboard } from "./keyboards/mainMenu";

import { handleCouponCommand } from "./commands/coupon";
import { handleBuyCoinCommand } from "./commands/buycoin";

import { handleHelpCommand } from "./commands/help";
import { User } from "../types/user";
import logger from "../utils/logger";
import { handleNumberCommand, handleNumberInput } from "./commands/number";
import { handleAadhaarInput, handleFamilyCommand } from "./commands/family";
import { handleCouponGenCommand } from "./commands/coupon_gen";

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN not set in .env");
}

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// 🟢 /start Command
bot.start(async (ctx) => {
  try {
    const telegramId = String(ctx.from?.id);
    const username = ctx.from?.username || "UnknownUser";

    // Create or update user in Firebase
    const user: User = await saveOrUpdateUser(telegramId, username);

    const welcomeMessage = `
*Welcome to GHost DataHub!* 🌟

👤 *Username:* @${user.username}
💰 *Coins:* ${user.coins} coins

Each test costs *2 coins*.
`;

    await ctx.replyWithMarkdown(welcomeMessage, mainMenuKeyboard());
  } catch (error) {
    logger.error("Error in /start:", error);
    await ctx.reply("⚠️ Something went wrong while starting the bot.");
  }
});

// Other commands (will be defined in Part 3 onwards)
bot.command("number", handleNumberCommand);
bot.command("family", handleFamilyCommand);
bot.command("coupon", handleCouponCommand);
bot.command("buycoin", handleBuyCoinCommand);
bot.command("coupon_gen", handleCouponGenCommand);
bot.command("help", handleHelpCommand);

bot.command("no", handleNumberInput);
bot.command("aadhar", handleAadhaarInput);
