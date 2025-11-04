import { Telegraf } from "telegraf";
import { showMainMenu } from "./ui/mainMenu";
import { handleNumberInfoCommand } from "./commands/number";
import { handleFamilyInfoCommand } from "./commands/family";
import { handleBuyCoinCommand } from "./commands/buycoin";
import { handleCouponCommand } from "./commands/coupon";
import { handleCouponGenCommand } from "./commands/coupon_gen";
import {
  setUserState,
  getUserState,
  clearUserState,
} from "./states/stateManager";

export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// /start command
bot.start(async (ctx) => {
  await showMainMenu(ctx);
});

// Inline menu buttons
bot.action("number_info", async (ctx) => {
  clearUserState(String(ctx.from?.id));
  await handleNumberInfoCommand(ctx);
});
bot.action("family_info", async (ctx) => {
  clearUserState(String(ctx.from?.id));
  await handleFamilyInfoCommand(ctx);
});
bot.action("buy_coin", async (ctx) => {
  clearUserState(String(ctx.from?.id));
  await handleBuyCoinCommand(ctx);
});
bot.action("coupon", async (ctx) => {
  clearUserState(String(ctx.from?.id));
  await ctx.reply("Enter your coupon code using /coupon CODE123");
});
bot.action("back_main", async (ctx) => {
  clearUserState(String(ctx.from?.id));
  await showMainMenu(ctx);
});

// Commands
bot.command("coupon_gen", handleCouponGenCommand);

// Handle dynamic input states (/no, /aadhar)
bot.hears(/^\/no (.+)/, async (ctx) => {
  await handleNumberInfoCommand(ctx);
});
bot.hears(/^\/aadhar (.+)/, async (ctx) => {
  await handleFamilyInfoCommand(ctx);
});
