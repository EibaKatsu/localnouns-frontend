import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
} from "@/utils/const";
import { addresses } from "@/utils/addresses";
import { ethers } from "ethers";
import { writeTokenDataToFirestore, updatePriceOfTokenOnFirestore, updateTradeOfTokenOnFirestore } from "./tokenOnFirestore";
import { getTokenInfo } from "./tokenOnContract";
import { TOKEN } from "@/firestore/const";

const provider = getProvider(NETWORK, ALCHEMY_API_KEY);
const tokenContract = getLocalNounsTokenContract(
  addresses.localNounsToken[NETWORK],
  provider,
);

// Transferイベントの監視
tokenContract.on("Transfer", async (from, to, tokenId, event) => {
  try {

    // token情報を取得ß
    const tokenInfo: TOKEN = await getTokenInfo(tokenId);

    // firestoreに書き込み
    await writeTokenDataToFirestore(tokenInfo);

    console.log(`Write finish, TokenID: ${tokenId}`);
  } catch (error) {
    console.error("Error:", error);
  }
});

// SetPriceイベントの監視
tokenContract.on("SetPrice", async (tokenId, price, event) => {
  try {
    const ethPrice = ethers.formatEther(price);
    // firestoreに書き込み
    await updatePriceOfTokenOnFirestore(tokenId, Number(ethPrice));

    console.log(`SetPrice, TokenID: ${tokenId}/${ethPrice}`);
  } catch (error) {
    console.error("Error:", error);
  }
});

// PutTradePrefectureイベントの監視
tokenContract.on("PutTradePrefecture", async (tokenId, prefectures, tradeAddress, event) => {
  try {
    console.log("prefectures", prefectures);
    // firestoreに書き込み
    await updateTradeOfTokenOnFirestore(tokenId, true, prefectures, tradeAddress);

    console.log(`PutTradePrefecture, TokenID: ${tokenId}/${prefectures}`);
  } catch (error) {
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
    console.error("Error:", error);
  }
});
