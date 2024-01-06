/*
  npx ts-node -r tsconfig-paths/register server/script/saveAllNounsFromEventLogs.ts
*/
import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import { promises, writeFile } from 'fs';
import {
  getProvider,
  getLocalNounsTokenContract,
} from "@/utils/const";
import { addresses } from "@/utils/addresses";
import { getTokenInfo } from "./tokenOnContract";
import { TOKEN, PARTS } from "@/firestore/const";
import { getPartsNameAndDescription } from "@/utils/partsDataUtil";

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

  let data_ja = `import { TOKEN } from "@/firestore/const";
export const createdTime: string = "${(new Date()).toISOString()}";  
export const tokenInfo_ja: TOKEN[] = [
`;

  let data_en = `export const tokenInfo_en: TOKEN[] = [
`;

  for (const event of events) {
    // EventLog 型の場合のみ実行
    if ("args" in event) {
      // eventからto, tokenIdを取得
      const { to, tokenId } = event.args;

      // if(tokenId > 1){
      //   break;
      // }

      // token情報を取得ß
      const token: TOKEN = await getTokenInfo(tokenId);

      const filePath = `./public/images/${tokenId}.svg`;

      // ファイルの存在を確認します
      try {
        await promises.access(filePath);
        // console.log('ファイルは既に存在します。');
      } catch (error) {
        // ファイルが存在しない場合、ここでエラーが発生します
        console.log('ファイルが存在しないため、書き込みを行います。');
        await promises.writeFile(filePath, token.svg);
      }

      // jaデータの書き込み
      const jaAccessoryParts = getPartsName('Accessories', token, 'ja');
      const jaHeadParts = getPartsName('Heads', token, 'ja');
      data_ja += ` {
    tokenId: \`${tokenId}\`,
    prefecture: \`${token.prefecture}\`,
    prefectureId: ${token.prefectureId},
    head: \`${jaHeadParts.name}\`,
    accessory: \`${jaAccessoryParts.name}\`,
    headDescription: \`${jaHeadParts.description}\`,
    accessoryDescription: \`${jaAccessoryParts.description}\`,
    holder: '',
    svg: '',
    salePrice: 0,
    isOnTrade: false,
    tradeToPrefecture: [ 0 ],
    createdDate: new Date()
  },
`;

      // enデータの書き込み
      const enAccessoryParts = getPartsName('Accessories', token, 'en');
      const enHeadParts = getPartsName('Heads', token, 'en');
      data_en += `   {
    tokenId: \`${tokenId}\`,
    prefecture: \`${token.prefecture}\`,
    prefectureId: ${token.prefectureId},
    head: \`${enHeadParts.name}\`,
    accessory: \`${enAccessoryParts.name}\`,
    headDescription: \`${enHeadParts.description}\`,
    accessoryDescription: \`${enAccessoryParts.description}\`,
    holder: '',
    svg: '',
    salePrice: 0,
    isOnTrade: false,
    tradeToPrefecture: [ 0 ],
    createdDate: new Date()
  },
`;
      console.log(`Write finish, TokenID: ${tokenId}`);
    }
  }

  data_ja += `];
`;
  data_en += `];`;
  // fileに書き込み
  await writeFile(`./src/utils/allNouns.ts`, data_ja + data_en, () => { });

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

const getPartsName = (type: string, token: TOKEN, lang: string) => {
  let partName = '';
  let partDescription = '';
  let key = '';
  if (type == 'Accessories') {
    key = `${token.prefecture.toLowerCase()}-${token.accessory.toLowerCase()}`;
  } else {
    key = `${token.prefecture.toLowerCase()}-${token.head.toLowerCase()}`;
  }

  const partOjbect = getPartsNameAndDescription(
    type,
    key,
    lang,
  );
  if (partOjbect) {
    partName = partOjbect.name;
    partDescription = partOjbect.description;
    if (partOjbect.author) {
      partDescription += " (" + partOjbect.author + ")";
    }
  } else {
    if (type == 'Accessories') {
      partName = token.accessory;
    } else {
      partName = token.head;
    }
  }

  const parts: PARTS = {
    type: type,
    prefecture: token.prefecture,
    key: key,
    language: lang,
    name: partName,
    // description: partDescription,
    description: '',
  }

  return parts;

};

main();
