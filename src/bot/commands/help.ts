import { Context, Markup } from "telegraf";

export async function handleHelpCommand(ctx: Context) {
  const helpText = `
*📖 Available Commands*

/start - Start the bot  
/no - Get number details  
/aadhar - Get family info by Aadhaar  
/coupon - Generate or redeem coupon  
/help - Show this help menu
`;

  await ctx.replyWithMarkdown(
    helpText,
    Markup.inlineKeyboard([
      [Markup.button.callback("⬅️ Back to Menu", "back_main")],
    ])
  );
}
