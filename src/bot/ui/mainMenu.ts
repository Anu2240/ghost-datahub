import { Markup } from "telegraf";
import { Context } from "telegraf";
import { getUserById } from "../../services/userService";

export async function showMainMenu(ctx: Context) {
  const telegramId = String(ctx.from?.id);
  const user = await getUserById(telegramId);

  const username = ctx.from?.username ? `@${ctx.from.username}` : "Unknown";
  const coins = user?.coins ?? 0;

  const text = `
*Welcome to GHost DataHub!* 🌟

👤 Username: *${username}*
💰 Coins: *${coins}*

Each test costs *2 coins*.

Select an option below 👇
`;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("📱 Number Info", "number_info"),
      Markup.button.callback("👨‍👩‍👧 Family Info", "family_info"),
    ],
    [
      Markup.button.callback("💰 Buy Coin", "buy_coin"),
      Markup.button.callback("🎟️ Coupon", "coupon"),
    ],
  ]);

  // Clean old messages, replace with new one
  if ("editMessageText" in ctx) {
    await ctx.editMessageText(text, { parse_mode: "Markdown", ...keyboard });
  } else {
    await ctx.reply(text, { parse_mode: "Markdown", ...keyboard });
  }
}
