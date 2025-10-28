const { createClient } = require("@supabase/supabase-js");
const { botToken, adminId, supabaseUrl, supabaseKey } = require("./config");
const TelegramBot = require("node-telegram-bot-api");

const supabase = createClient(supabaseUrl, supabaseKey);
const bot = new TelegramBot(botToken, { polling: true });
let session = {};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const uid = msg.from.id;

  if (uid !== adminId) return bot.sendMessage(chatId, "❌ Bukan admin!");

  if (msg.text === "/start") return bot.sendMessage(chatId, "✅ Kirim video preview preset.");

  if (msg.video) {
    session[uid] = { video: msg.video.file_id };
    return bot.sendMessage(chatId, "✅ Video diterima! Kirim judul preset.");
  }

  if (session[uid] && !session[uid].judul && msg.text) {
    session[uid].judul = msg.text;
    return bot.sendMessage(chatId, "Sekarang kirim link XML.");
  }

  if (session[uid] && session[uid].judul && !session[uid].xml && msg.text) {
    session[uid].xml = msg.text;
    return bot.sendMessage(chatId, "Sekarang kirim link 5MB preset.");
  }

  if (session[uid] && session[uid].xml && !session[uid].preset5mb && msg.text) {
    session[uid].preset5mb = msg.text;
    const file = await bot.getFile(session[uid].video);
    const videoUrl = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;

    const { error } = await supabase
      .from("presets")
      .insert([{
        judul: session[uid].judul,
        video: videoUrl,
        xml: session[uid].xml,
        preset5mb: session[uid].preset5mb
      }]);

    if (error) return bot.sendMessage(chatId, "❌ Gagal upload preset!");

    delete session[uid];
    return bot.sendMessage(chatId, "✅ Preset berhasil masuk DB online!");
  }
});