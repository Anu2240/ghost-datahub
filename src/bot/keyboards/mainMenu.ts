import { Markup } from "telegraf";

export function mainMenuKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("📱 Number Info", "number_info"),
      Markup.button.callback("👨‍👩‍👧 Family Info", "family_info"),
    ],
    [
      Markup.button.callback("💰 Buy Coin", "buy_coin"),
      Markup.button.callback("🎟 Coupon", "coupon"),
    ],
  ]);
}
