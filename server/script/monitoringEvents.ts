/*
  npx ts-node -r tsconfig-paths/register server/script/monitoringEvents.ts
*/
import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
} from "@/utils/const";
import { addresses } from "@/utils/addresses";
import { ethers } from "ethers";
import { writeTokenDataToFirestore, updateHolderOfTokenOnFirestore, updatePriceOfTokenOnFirestore, updateTradeOfTokenOnFirestore } from "./tokenOnFirestore";
import { getTokenInfoAtMint } from "./tokenOnContract";
import { TOKEN } from "@/firestore/const";
import { EventQueue } from "@/utils/eventQueue";
import { DiscordBot } from "@/utils/DiscordBot";
import { postForPutSale, postForPutTrade } from "./postToDiscord";
require('dotenv').config();

const provider = getProvider(NETWORK, ALCHEMY_API_KEY);
const tokenContract = getLocalNounsTokenContract(
  addresses.localNounsToken[NETWORK],
  provider,
);

const tokenForBot = process.env.DISCORD_BOT_TOKEN ? process.env.DISCORD_BOT_TOKEN:'';
const channelId = process.env.DISCORD_ANNOUNCE_CHANNEL_ID ? process.env.DISCORD_ANNOUNCE_CHANNEL_ID:'';
const bot = new DiscordBot(tokenForBot);
bot.login()
   .then(() => console.log('Discord Bot Logged in!'))
   .catch(console.error);

const eventQueue = new EventQueue(3);
// Transferイベントの監視
tokenContract.on("Transfer", async (from, to, tokenId, event) => {
  // 同時実行スレッドの数を制限するためキューイングして実行する
  eventQueue.add({ from, to, tokenId, event }, async (event) => {
    try {
      if (from == "0x0000000000000000000000000000000000000000") {
        // mint時のTransfer
        const tokenInfo: TOKEN = await getTokenInfoAtMint(tokenId);
        tokenInfo.holder = to.toLowerCase();
        // firestoreに書き込み
        await writeTokenDataToFirestore(tokenInfo);
        console.log(`Write finish, mint: ${tokenId}`);
      } else {
        // P2PSale, P2PTradeの成立
        await updateHolderOfTokenOnFirestore(tokenId, to.toLowerCase());
        console.log(`Write finish, holder: ${tokenId}, ${to}`);
      }

    } catch (error) {
      console.log("Transfer error:", new Date().toISOString());
      console.error("Error:", tokenId);
    }
  });

});

// SetPriceイベントの監視
tokenContract.on("SetPrice", async (tokenId, price, event) => {
  try {
    const ethPrice = ethers.formatEther(price);
    // firestoreに書き込み
    await updatePriceOfTokenOnFirestore(tokenId, Number(ethPrice));

    // discordへポスト
    await postForPutSale(bot, channelId, tokenId);

    console.log(`SetPrice, TokenID: ${tokenId}/${ethPrice}`);
  } catch (error) {
    console.log("SetPrice error:", new Date().toISOString());
    console.error("Error:", error);
  }
});

// PutTradePrefectureイベントの監視
tokenContract.on("PutTradePrefecture", async (tokenId, prefectures, tradeAddress, event) => {
  try {
    console.log("prefectures", prefectures);
    // firestoreに書き込み
    await updateTradeOfTokenOnFirestore(tokenId, true, prefectures, tradeAddress);

    // discordへポスト
    await postForPutTrade(bot, channelId, tokenId);

    console.log(`PutTradePrefecture, TokenID: ${tokenId}/${prefectures}`);
  } catch (error) {
    console.log("PutTradePrefecture error:", new Date().toISOString());
    console.error("Error:", error);
  }
});

// CancelTradePrefectureイベントの監視
tokenContract.on("CancelTradePrefecture", async (tokenId, event) => {
  try {
    // firestoreに書き込み
    await updateTradeOfTokenOnFirestore(tokenId, false, [], null);

    console.log(`CancelTradePrefecture, TokenID: ${tokenId}`);
  } catch (error) {
    console.log("CancelTradePrefecture error:", new Date().toISOString());
    console.error("Error:", error);
  }
});

console.log("monitoringEvents start:", new Date().toISOString());
