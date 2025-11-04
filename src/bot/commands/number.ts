import axios from "axios";
import { Markup, Context } from "telegraf";
import {
  getUser,
  saveOrUpdateUser,
  updateUserCoins,
} from "../../services/userService";
import { cacheGet, cacheSet } from "../../utils/cache";
import logger from "../../utils/logger"; // ✅ FIXED import
import { db } from "../../services/firebase"; // ✅ FIXED filename

// When user sends /number command
export async function handleNumberCommand(ctx: Context) {
  await ctx.reply("📲 Send your number in format: `/no 9016962240`", {
    parse_mode: "Markdown",
  });
}

// When user sends /no {number}
export async function handleNumberInput(ctx: Context) {
  try {
    // ✅ Type-safe message text handling
    const messageText =
      "text" in (ctx.message ?? {}) ? (ctx.message as any).text : "";
    const parts = messageText.split(" ");
    const number = parts[1];

    if (!number || !/^[0-9]{10}$/.test(number)) {
      return ctx.reply(
        "⚠️ Please send a valid 10-digit number. Example: `/no 9876543210`",
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

    // ✅ Cache check first
    const cacheKey = `number:${number}`;
    const cachedData = await cacheGet(cacheKey);
    if (cachedData) {
      await showNumberInfo(ctx, cachedData, number, user);
      return;
    }

    // ✅ API call
    const apiUrl = `https://number-info-anmol.vercel.app/?number=${number}`;
    const response = await axios.get(apiUrl);

    if (!response.data?.data?.result?.length) {
      return ctx.reply("❌ No data found for this number.");
    }

    const record = response.data.data.result[0];

    const info = {
      Name: record.name || "N/A",
      Mobile: record.mobile || number,
      Alt_mobile: record.alt_mobile || "N/A",
      Aadhaar: record.id_number || "N/A",
      Address: record.address?.replace(/!/g, " ").trim() || "N/A",
      Email: record.email || "N/A",
      FatherName: record.father_name || "N/A",
      Sim: record.circle || "N/A",
    };

    await cacheSet(cacheKey, info, 86400); // ✅ Cache for 24h
    await showNumberInfo(ctx, info, number, user);

    // ✅ Deduct 2 coins
    await db
      .collection("users")
      .doc(telegramId)
      .update({
        coins: user.coins - 2,
        lastUsed: new Date(),
      });
  } catch (err) {
    logger.error("Error in handleNumberInput:", err);
    ctx.reply(
      "⚠️ Something went wrong while fetching number info. Try again later."
    );
  }
}

async function showNumberInfo(
  ctx: Context,
  info: any,
  number: string,
  user: any
) {
  const text = `
*Number Info* 📱
*Name:* ${info.Name}
*Mobile:* ${info.Mobile}
*Alt_mobile:* ${info.Alt_mobile}
*Aadhaar:* ${info.Aadhaar}
*Address:* ${info.Address}
*Email:* ${info.Email}
*Father Name:* ${info.FatherName}
*Sim:* ${info.Sim}
`;

  await ctx.replyWithMarkdown(
    text,
    Markup.inlineKeyboard([
      [Markup.button.callback("⬅️ Back to Menu", "back_main")],
    ])
  );
}
