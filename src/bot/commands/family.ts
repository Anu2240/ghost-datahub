import axios from "axios";
import { Markup, Context } from "telegraf";
import { getUser } from "../../services/userService";
import { db } from "../../services/firebase"; // ✅ make sure it's firebaseService
import { cacheGet, cacheSet } from "../../utils/cache";
import logger from "../../utils/logger"; // ✅ FIXED import

export async function handleFamilyCommand(ctx: Context) {
  await ctx.reply("👨‍👩‍👧 Send Aadhaar number in format: `/aadhar 658014451208`", {
    parse_mode: "Markdown",
  });
}

// Handle /aadhar {number}
export async function handleAadhaarInput(ctx: Context) {
  try {
    // ✅ Safe message text extraction
    const messageText =
      "text" in (ctx.message ?? {}) ? (ctx.message as any).text : "";
    const parts = messageText.split(" ");
    const aadhaar = parts[1];

    if (!aadhaar || !/^[0-9]{12}$/.test(aadhaar)) {
      return ctx.reply(
        "⚠️ Please send a valid 12-digit Aadhaar number. Example: `/aadhar 658014451208`",
        { parse_mode: "Markdown" }
      );
    }

    const telegramId = String(ctx.from?.id);
    const user = await getUser(telegramId);
    if (!user) return ctx.reply("⚠️ User not found. Please use /start first.");

    if (user.coins < 2) {
      return ctx.replyWithMarkdown(
        "🚫 *Insufficient coins!* Please add coins via *Buy Coin.*",
        Markup.inlineKeyboard([
          [Markup.button.callback("💰 Buy Coin", "buy_coin")],
        ])
      );
    }

    // ✅ Cache check
    const cacheKey = `aadhaar:${aadhaar}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      await showFamilyInfo(ctx, cached);
      return;
    }

    // ✅ API call
    const apiUrl = `https://addartofamily.vercel.app/fetch?aadhaar=${aadhaar}&key=fxt`;
    const response = await axios.get(apiUrl);

    if (!response.data?.data || response.data.data.length === 0) {
      return ctx.reply("❌ No family information found for this Aadhaar.");
    }

    const records = response.data.data.map((rec: any) => ({
      Name: rec.name || "N/A",
      Mobile: rec.mobile || "N/A",
      Alt_mobile: rec.alt_mobile || "N/A",
      Aadhaar: rec.aadhaar || aadhaar,
      Address: rec.address?.replace(/!/g, " ") || "N/A",
      Email: rec.email || "N/A",
      FatherName: rec.father_name || "N/A",
      Sim: rec.circle || "N/A",
    }));

    await cacheSet(cacheKey, records, 86400); // 24h cache
    await showFamilyInfo(ctx, records);

    // ✅ Deduct coins
    await db
      .collection("users")
      .doc(telegramId)
      .update({
        coins: user.coins - 2,
        lastUsed: new Date(),
      });
  } catch (err) {
    logger.error("Error in handleAadhaarInput:", err);
    ctx.reply(
      "⚠️ Something went wrong while fetching family info. Try again later."
    );
  }
}

async function showFamilyInfo(ctx: Context, records: any[]) {
  let text = "*Family Member Info* 👨‍👩‍👧\n\n";
  records.forEach((r, i) => {
    text += `*${i + 1}. ${r.Name || "N/A"}*\n`;
    text += `Mobile: ${r.Mobile || "N/A"}\n`;
    text += `Alt_mobile: ${r.Alt_mobile || "N/A"}\n`;
    text += `Aadhaar: ${r.Aadhaar || "N/A"}\n`;
    text += `Address: ${r.Address || "N/A"}\n`;
    text += `Email: ${r.Email || "N/A"}\n`;
    text += `Father Name: ${r.FatherName || "N/A"}\n`;
    text += `Sim: ${r.Sim || "N/A"}\n\n`;
  });

  await ctx.replyWithMarkdown(
    text,
    Markup.inlineKeyboard([
      [Markup.button.callback("⬅️ Back to Menu", "back_main")],
    ])
  );
}
