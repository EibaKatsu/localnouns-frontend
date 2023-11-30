/*
  npx ts-node -r tsconfig-paths/register server/script/TransferFromEventLogs.ts
*/
import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
} from "@/utils/const";
import { addresses } from "@/utils/addresses";
import { writeTokenDataToFirestore } from "./tokenOnFirestore";
import { getTokenInfo } from "./tokenOnContract";
import { TOKEN } from "@/firestore/const";

const provider = getProvider(NETWORK, ALCHEMY_API_KEY);
const tokenContract = getLocalNounsTokenContract(
  addresses.localNounsToken[NETWORK],
  provider,
);

const main = async () => {
  // from address(0) への Transfer イベントをフィルタリング
  const filter = tokenContract.filters.Transfer(
    "0x0000000000000000000000000000000000000000",
    null,
    null,
  );
  const events = await tokenContract.queryFilter(filter);

  for (const event of events) {
    // EventLog 型の場合のみ実行
    if ("args" in event) {
      // eventからto, tokenIdを取得
      const { to, tokenId } = event.args;

      // if(tokenId < 267){
      //   continue;
      // }

      // token情報を取得ß
      const tokenInfo: TOKEN = await getTokenInfo(tokenId);

      // firestoreに書き込み
      await writeTokenDataToFirestore(tokenInfo);

      console.log(`Write finish, TokenID: ${tokenId}`);
    }
  }
};

/**
 * Opensea用に生成したTraits情報からPrefecture,head,accessoryを取得
 * @param traits 例： {"trait_type": "prefecture" , "value":"Hokkaido"},{"trait_type": "head" , "value":"goryokaku"},{"trait_type": "accessory" , "value":"melon"}
 * @returns prefecture:string, head:string, accessory:string
 */
const convertTrais = (traits: any) => {
  let prefecture = "";
  let head = "";
  let accessory = "";
  for (let trait of traits) {
    switch (trait.trait_type) {
      case "prefecture":
        prefecture = trait.value;
        break;
      case "head":
        head = trait.value;
        break;
      case "accessory":
        accessory = trait.value;
        break;
    }
  }
  return { prefecture, head, accessory };
};

main();
