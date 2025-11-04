import { Context, Markup } from "telegraf";
import { firestore } from "../../services/firebase";
import { getUserById, updateUserCoins } from "../../services/userService";

export async function handleCouponCommand(ctx: Context) {
  // ✅ Fix for TS2339 (safe text extraction)
  const messageText = (ctx.message as any)?.text || "";
  const args = messageText.split(" ");

  if (args.length < 2) {
    return ctx.reply("Send your coupon like this:\n`/coupon CODE1234`", {
      parse_mode: "Markdown",
    });
  }

  const couponCode = args[1].trim().toUpperCase();
  const telegramId = String(ctx.from?.id);

  try {
    const couponRef = firestore.collection("coupons").doc(couponCode);
    const couponDoc = await couponRef.get();

    if (!couponDoc.exists) {
      return ctx.reply("❌ Invalid coupon code.");
    }

    const couponData = couponDoc.data() as any;

    if (couponData.isUsed) {
      return ctx.reply("⚠️ This coupon has already been used.");
    }

    const user = await getUserById(telegramId);
    if (!user) return ctx.reply("⚠️ User not found. Please use /start first.");

    const coinsToAdd = couponData.value / 2;

    await updateUserCoins(telegramId, coinsToAdd);
    await couponRef.update({
      isUsed: true,
      usedBy: telegramId,
    });

    return ctx.reply(
      `✅ Coupon redeemed! Added *${coinsToAdd} coins* to your account.`,
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("⬅️ Back to Menu", "back_main")],
        ]),
      }
    );
  } catch (error) {
    console.error("Coupon Error:", error);
    return ctx.reply("⚠️ Something went wrong. Try again later.");
  }
}
