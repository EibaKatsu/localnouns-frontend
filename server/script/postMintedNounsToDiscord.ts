/*
  npx ts-node -r tsconfig-paths/register server/script/postMintedNounsToDiscord.ts
*/
import { DISCORD_ANNOUNCE_CHANNEL_ID } from "@/config/project";
import { DiscordBot } from "@/utils/DiscordBot";
import { postForMint, } from "./postToDiscord";
require('dotenv').config();

const tokenForBot = process.env.DISCORD_BOT_TOKEN ? process.env.DISCORD_BOT_TOKEN : '';
const bot = new DiscordBot(tokenForBot);
bot.login()
  .then(() => console.log('Discord Bot Logged in!'))
  .catch(console.error);


const main = async () => {
  // discordへポスト
  for(var i=551; i<=551; i++){
    await postForMint(bot, DISCORD_ANNOUNCE_CHANNEL_ID, String(i));
  }

  bot.logout();
}

main();