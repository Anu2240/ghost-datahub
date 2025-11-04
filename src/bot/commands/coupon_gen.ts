import { Context } from "telegraf";
import { firestore } from "../../services/firebase";
import { v4 as uuidv4 } from "uuid";

export async function handleCouponGenCommand(ctx: Context) {
  // ✅ Fix for TS2339
  const messageText = (ctx.message as any)?.text || "";
  const args = messageText.split(" ");

  const telegramId = String(ctx.from?.id);
  const username = ctx.from?.username || "unknown";

  if (args.length < 2) {
    return ctx.reply("Usage: `/coupon_gen <amount>`", {
      parse_mode: "Markdown",
    });
  }

  const amount = Number(args[1]);
  if (isNaN(amount) || amount <= 0) {
    return ctx.reply("❌ Invalid amount. Please enter a positive number.");
  }

  try {
    const adminRef = firestore.collection("admins").doc(telegramId);
    const adminDoc = await adminRef.get();

    if (!adminDoc.exists) {
      return ctx.reply("🚫 You are not authorized to generate coupons.");
    }

    // Generate unique 8-character alphanumeric code
    const code = uuidv4().replace(/-/g, "").substring(0, 8).toUpperCase();

    const couponData = {
      code,
      value: amount,
      isUsed: false,
      createdBy: telegramId,
      createdAt: new Date(),
    };

    await firestore.collection("coupons").doc(code).set(couponData);

    return ctx.reply(
      `🎟️ *Coupon generated:*\n\n*Code:* \`${code}\`\n*Value:* ₹${amount} (=${amount / 2} coins)\n\nShare this code with a user.`,
      { parse_mode: "Markdown" }
    );
  } catch (err) {
    console.error("Coupon generation failed:", err);
    return ctx.reply("⚠️ Failed to generate coupon. Try again later.");
  }
}
