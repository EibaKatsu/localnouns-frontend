/*
  npx ts-node -r tsconfig-paths/register server/script/monitoringEvents.ts
*/
import { ALCHEMY_API_KEY, NETWORK, DISCORD_ANNOUNCE_CHANNEL_ID } from "@/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
  getNNSENSReverseResolverContract,
  resolveNNSorENS,
} from "@/utils/const";
import { addresses } from "@/utils/addresses";
import { ethers } from "ethers";
import { writeTokenDataToFirestore, updateHolderOfTokenOnFirestore, updatePriceOfTokenOnFirestore, updateTradeOfTokenOnFirestore } from "./tokenOnFirestore";
import { writeHistoryToFirestore } from "./historyOnFirestore";
import { incrementHolderToFirestore } from "./holderOnFirestore";
import { getTokenInfoAtMint } from "./tokenOnContract";
import { TOKEN, HISTORY, ACTION } from "@/firestore/const";
import { EventQueue } from "@/utils/eventQueue";
import { DiscordBot } from "@/utils/DiscordBot";
import { postForMint, postForPutSale, postForPutTrade, postForPurchase, postForExecuteTrade } from "./postToDiscord";
require('dotenv').config();

const provider = getProvider(NETWORK, ALCHEMY_API_KEY);
const tokenContract = getLocalNounsTokenContract(
  addresses.localNounsToken[NETWORK],
  provider,
);
const resolverContract = getNNSENSReverseResolverContract(provider);

const tokenForBot = process.env.DISCORD_BOT_TOKEN ? process.env.DISCORD_BOT_TOKEN : '';
const bot = new DiscordBot(tokenForBot);
bot.login()
  .then(() => console.log('Discord Bot Logged in!'))
  .catch(console.error);

const eventQueue = new EventQueue(1); // firestoreのholderをシリアルに書き込むために多重度は1とする
// Transferイベントの監視
tokenContract.on("Transfer", async (from, to, tokenId, event: any) => {
  // 同時実行スレッドの数を制限するためキューイングして実行する
  eventQueue.add({ from, to, tokenId, event }, async (event) => {
    try {

      const fromName = await resolveNNSorENS(resolverContract, from);
      const toName = await resolveNNSorENS(resolverContract, to);

      if (from == "0x0000000000000000000000000000000000000000") {
        // mint時のTransfer
        const tokenInfo: TOKEN = await getTokenInfoAtMint(tokenId);
        tokenInfo.holder = to.toLowerCase();
        // firestoreに書き込み
        await writeTokenDataToFirestore(tokenInfo);

        // 履歴を書き込み
        const transactionHash = event.event.log.transactionHash;
        const blockNumber = event.event.log.blockNumber;
        const block = await provider.getBlock(blockNumber);
        const timestamp = block?.timestamp;

        const history: HISTORY = {
          hash: transactionHash,
          blocknumber: blockNumber,
          action: ACTION.MINT,
          tokenId: tokenId,
          from: from,
          to: to,
          fromName: fromName,
          toName: toName,
          timestamp: timestamp ? new Date(timestamp * 1000) : new Date(0)
        };

        await writeHistoryToFirestore(history);
        await incrementHolderToFirestore(to, toName, 1);

        // discordへポスト
        await postForMint(bot, DISCORD_ANNOUNCE_CHANNEL_ID, tokenId);

        console.log(`Write finish, mint: ${tokenId}`);
      } else {
        // P2PSale, P2PTradeの成立
        await updateHolderOfTokenOnFirestore(tokenId, to.toLowerCase());
        await incrementHolderToFirestore(to, toName, 1);
        await incrementHolderToFirestore(from, fromName, -1);
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
    await postForPutSale(bot, DISCORD_ANNOUNCE_CHANNEL_ID, tokenId);

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
    await postForPutTrade(bot, DISCORD_ANNOUNCE_CHANNEL_ID, tokenId);

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

// Purchaseイベントの監視
tokenContract.on("Purchase", async (tokenId, _buyer, event) => {
  try {

    const transactionHash = event.log.transactionHash;
    const blockNumber = event.log.blockNumber;
    console.log("transactionHash", transactionHash);
    console.log("blockNumber", blockNumber);

    // discordへポスト
    await postForPurchase(bot, DISCORD_ANNOUNCE_CHANNEL_ID, tokenId);

    // 履歴を書き込み
    const block = await provider.getBlock(blockNumber);
    const timestamp = block?.timestamp;

    const from = await getTransferFromForTransaction(transactionHash);

    const history: HISTORY = {
      hash: transactionHash,
      blocknumber: blockNumber,
      action: ACTION.PURCHASE,
      tokenId: tokenId,
      from: from,
      to: _buyer,
      fromName: await resolveNNSorENS(resolverContract, from),
      toName: await resolveNNSorENS(resolverContract, _buyer),
      timestamp: timestamp ? new Date(timestamp * 1000) : new Date(0)
    };
    await writeHistoryToFirestore(history);

    console.log(`Purchase, TokenID: ${tokenId}`);
  } catch (error) {
    console.log("Purchase error:", new Date().toISOString());
    console.error("Error:", error);
  }
});

// // ExecuteTradeイベントの監視
tokenContract.on("ExecuteTrade", async (targetTokenId, _lister, ownedTokenId, _executer, event) => {
  try {

    // discordへポスト
    await postForExecuteTrade(bot, DISCORD_ANNOUNCE_CHANNEL_ID, targetTokenId, ownedTokenId);

    // 履歴を書き込み
    const transactionHash = event.log.transactionHash;
    const blockNumber = event.log.blockNumber;
    console.log("transactionHash", transactionHash);
    console.log("blockNumber", blockNumber);

    // 履歴を書き込み
    const block = await provider.getBlock(blockNumber);
    const timestamp = block?.timestamp;

    // リストしたToken
    const historyForListed: HISTORY = {
      hash: transactionHash,
      blocknumber: blockNumber,
      action: ACTION.TRADE,
      tokenId: targetTokenId,
      from: _executer,
      to: _lister,
      fromName: await resolveNNSorENS(resolverContract, _executer),
      toName: await resolveNNSorENS(resolverContract, _lister),
      timestamp: timestamp ? new Date(timestamp * 1000) : new Date(0)
    };
    await writeHistoryToFirestore(historyForListed);

    // 交換対象のToken
    const historyForOwned: HISTORY = {
      hash: transactionHash,
      blocknumber: blockNumber,
      action: ACTION.TRADE,
      tokenId: ownedTokenId,
      from: _lister,
      to: _executer,
      fromName: await resolveNNSorENS(resolverContract, _lister),
      toName: await resolveNNSorENS(resolverContract, _executer),
      timestamp: timestamp ? new Date(timestamp * 1000) : new Date(0)
    };
    await writeHistoryToFirestore(historyForOwned);

    console.log(`ExecuteTrade, TokenID: ${targetTokenId} <-> ${ownedTokenId}`);
  } catch (error) {
    console.log("ExecuteTrade error:", new Date().toISOString());
    console.error("Error:", error);
  }
});

async function getTransferFromForTransaction(transactionHash: string) {
  // すべてのTransferイベントを取得するためのフィルター
  const filter = tokenContract.filters.Transfer();

  // フィルタリングされたイベントをクエリ
  const events = await tokenContract.queryFilter(filter);

  // 特定のトランザクションハッシュに一致するイベントをフィルタリング
  const matchingEvents = events.filter(event => event.transactionHash === transactionHash);

  // 使用されるのはPurchaseのときだけなので該当するeventは一つのみ
  for (const event of matchingEvents) {
    if ("args" in event) {
      const { from, to, tokenId } = event.args;
      return from;
    } else {
      return '0x9999999999';
    }
  }
  // マッチングするイベントを返す
  return '0x8888888888';
}

console.log("monitoringEvents start:", new Date().toISOString());
