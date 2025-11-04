import { Markup } from "telegraf";
import dotenv from "dotenv";
import { Context } from "telegraf";

dotenv.config();

export async function handleBuyCoinCommand(ctx: Context) {
  const upi = process.env.UPI_ID || "anilv4481-5@oksbi";

  const text = `
💰 *Buy Coins — GHost DataHub*

📱 *Scan the QR below or pay via UPI ID:*  
\`${upi}\`

You will receive *coins equal to half* of the amount you send.

🧮 *Example:*  
Send ₹100 → Get 50 coins 💎

Once payment is done, please send your *payment screenshot* to our admin below ⬇️  
After verification, you'll receive a *coupon code* instantly.
`;

  // ✅ Tera actual QR image link yahaan use kar rahe hain
  const qrUrl = "https://i.ibb.co/v4Mvnnyn/qr.jpg";

  try {
    await ctx.replyWithPhoto(
      { url: qrUrl },
      {
        caption: text,
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [
            Markup.button.url(
              "📸 Send Screenshot to Admin",
              "https://t.me/MrAnonymous448"
            ),
          ],
          [Markup.button.callback("⬅️ Back to Menu", "back_main")],
        ]),
      }
    );
  } catch (err) {
    console.error("BuyCoin Error:", err);
    await ctx.reply(
      "⚠️ Something went wrong while loading the Buy Coin section."
    );
  }
}
