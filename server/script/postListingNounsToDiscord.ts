/*
  npx ts-node -r tsconfig-paths/register server/script/postListingNounsToDiscord.ts
*/
import { TOKEN } from "@/firestore/const";
import { DiscordBot } from "@/utils/DiscordBot";
import { NETWORK } from "@/config/project";
import { addresses } from "@/utils/addresses";
import { getDocs, collection, query, where, Query } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { getPartsNameAndDescription } from "@/utils/partsDataUtil";
import { prefectureList, prefecture_ja } from "@/i18n/prefectures";
import { LOCALNOUNS_URL } from "@/config/project";

require('dotenv').config();

// BOTインスタンスを作ってログイン
const tokenForBot = process.env.DISCORD_BOT_TOKEN ? process.env.DISCORD_BOT_TOKEN : '';
const channelId = process.env.DISCORD_ANNOUNCE_CHANNEL_ID ? process.env.DISCORD_ANNOUNCE_CHANNEL_ID : '';
const bot = new DiscordBot(tokenForBot);

const main = async () => {

  await bot.login()
    .then(() => console.log('Discord Bot Logged in!'))
    .catch(console.error);

  const tokensOnSale = await getTokenList("onSale");
  const tokensOnTrade = await getTokenList("onTrade");

  // メッセージを作成
  let message = `## ⭐️Now On Sale⭐️
`;
  tokensOnSale?.forEach(token => {
    const prefectureName = prefecture_ja[token.prefecture as keyof typeof prefecture_ja];
    message += ` ✅**Local Nouns #${token.tokenId} ${prefectureName}** ${token.head}, ${token.accessory} (=> ${token.salePrice} ETH)
`;
  });
  message += `## 💫Now On Trade💫
`;
  tokensOnTrade?.forEach(token => {
    const prefectureName = prefecture_ja[token.prefecture as keyof typeof prefecture_ja];
    const tradeToPrefectures = token.tradeToPrefecture
      .map((prefectureId) => prefecture_ja[prefectureList[prefectureId] as keyof typeof prefecture_ja])
      .join(", ");
    message += ` ✅**Local Nouns #${token.tokenId} ${prefectureName}** ${token.head}, ${token.accessory} (=> ${tradeToPrefectures})
`;
  });

  message += `
See ${LOCALNOUNS_URL}/list/0
`;

  // discordへポスト
  await bot.sendMessage(channelId, message)
    .then(() => console.log('Message sent!'))
    .catch(console.error);

  await bot.logout();
  process.exit(0);

}

const tokenCollectionPath = `/${NETWORK}/${addresses.localNounsToken[NETWORK]}`;

const getTokenList = async (filterType: string) => {
  let tokens: TOKEN[]
  let tokenQuery: Query<TOKEN> = collection(
    db,
    tokenCollectionPath + "/tokens",
  ) as Query<TOKEN>;

  if (filterType == "onSale") {
    tokenQuery = query(tokenQuery, where("salePrice", ">", 0));
  } else { // onTrade
    tokenQuery = query(tokenQuery, where("isOnTrade", "==", true));
  }

  try {
    const results = await getDocs(tokenQuery);
    tokens = results.docs.map((doc) => {
      return doc.data();
    });
    tokens.sort(
      (a, b) => Number(a.prefectureId) - Number(b.prefectureId),
    );
    getPartsName(tokens);

    return tokens;

  } catch (e) {
    console.error("getTokenList", e);
  }

};

// パーツ名を取得
const getPartsName = async (tokens: TOKEN[]) => {
  for (const token of tokens) {
    const accessoryName = getPartsNameAndDescription(
      "Accessories",
      `${token.prefecture.toLowerCase()}-${token.accessory.toLowerCase()}`,
      "ja",
    );
    if (accessoryName) {
      token.accessory = accessoryName.name;
      token.accessoryDescription = accessoryName.description;
      if (accessoryName.author) {
        token.accessoryDescription += " (" + accessoryName.author + ")";
      }
    }

    const headName = getPartsNameAndDescription(
      "Heads",
      `${token.prefecture.toLowerCase()}-${token.head.toLowerCase()}`,
      "ja",
    );
    if (headName) {
      token.head = headName.name;
      token.headDescription = headName.description;
      if (headName.author) {
        token.headDescription += " (" + headName.author + ")";
      }
    }
  }
};

main();
