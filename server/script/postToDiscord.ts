import sharp from 'sharp';
import { TOKEN } from "@/firestore/const";
import { DiscordBot } from "@/utils/DiscordBot";
import { getTokenInfo } from "./tokenOnContract";
import { prefectureList, prefecture_ja } from "@/i18n/prefectures";
import { getPartsNameAndDescription } from "@/utils/partsDataUtil";
import { LOCALNOUNS_URL } from "@/config/project";

export async function postForMint(bot: DiscordBot, channelId: string, tokenId: string) {
    // トークン情報を取得
    const token: TOKEN = await getTokenInfo(tokenId);
    const prefectureName = prefecture_ja[token.prefecture as keyof typeof prefecture_ja];
    const headName = getPartsNameAndDescription('Heads', `${token.prefecture.toLowerCase()}-${token.head.toLowerCase()}`, 'ja')?.name;
    const accessoryName = getPartsNameAndDescription('Accessories', `${token.prefecture.toLowerCase()}-${token.accessory.toLowerCase()}`, 'ja')?.name;

    // pngファイルに保存
    const path = await svgStreamToPngFile(token);

    let message = `### 🌟ご当地Nounsが誕生しました🌟
## Local Nouns #${tokenId} ${prefectureName}
ヘッド    : ${headName}
アクセサリ: ${accessoryName}
`;
    console.log(message);
    bot.sendMessage(channelId, message, [path])
        .then(() => console.log('postForMint sent!'))
        .catch(console.error);
} 

export async function postForPutSale(bot: DiscordBot, channelId: string, tokenId: string) {
    // トークン情報を取得
    const token: TOKEN = await getTokenInfo(tokenId);
    const prefectureName = prefecture_ja[token.prefecture as keyof typeof prefecture_ja];
    const headName = getPartsNameAndDescription('Heads', `${token.prefecture.toLowerCase()}-${token.head.toLowerCase()}`, 'ja')?.name;
    const accessoryName = getPartsNameAndDescription('Accessories', `${token.prefecture.toLowerCase()}-${token.accessory.toLowerCase()}`, 'ja')?.name;

    // pngファイルに保存
    const path = await svgStreamToPngFile(token);

    let message = `### ⭐️P2Pセールにリストされました⭐️
## Local Nouns #${tokenId} ${prefectureName}
ヘッド    : ${headName}
アクセサリ: ${accessoryName}
セール価格: ${token.salePrice} ETH
${LOCALNOUNS_URL}/list/${token.prefectureId}
`;
    console.log(message);
    bot.sendMessage(channelId, message, [path])
        .then(() => console.log('postForPutSale sent!'))
        .catch(console.error);
} 

export async function postForPutTrade(bot: DiscordBot, channelId: string, tokenId: string) {
    // トークン情報を取得
    const token: TOKEN = await getTokenInfo(tokenId);
    const prefectureName = prefecture_ja[token.prefecture as keyof typeof prefecture_ja];
    const headName = getPartsNameAndDescription('Heads', `${token.prefecture.toLowerCase()}-${token.head.toLowerCase()}`, 'ja')?.name;
    const accessoryName = getPartsNameAndDescription('Accessories', `${token.prefecture.toLowerCase()}-${token.accessory.toLowerCase()}`, 'ja')?.name;
    const tradeToPrefectures = token.tradeToPrefecture
    .map((prefectureId) =>  prefecture_ja[prefectureList[prefectureId] as keyof typeof prefecture_ja])
    .join(", ");

    // pngファイルに保存
    const path = await svgStreamToPngFile(token);

    let message = `### 💫P2Pトレードにリストされました💫
## Local Nouns #${tokenId} ${prefectureName}
ヘッド    : ${headName}
アクセサリ: ${accessoryName}
交換希望  : ${tradeToPrefectures} 
${LOCALNOUNS_URL}/list/${token.prefectureId}
`;
    console.log(message);
    bot.sendMessage(channelId, message, [path])
        .then(() => console.log('postForPutTrade sent!'))
        .catch(console.error);
} 

export async function postForPurchase(bot: DiscordBot, channelId: string, tokenId: string) {
    // トークン情報を取得
    const token: TOKEN = await getTokenInfo(tokenId);
    const prefectureName = prefecture_ja[token.prefecture as keyof typeof prefecture_ja];
    const headName = getPartsNameAndDescription('Heads', `${token.prefecture.toLowerCase()}-${token.head.toLowerCase()}`, 'ja')?.name;
    const accessoryName = getPartsNameAndDescription('Accessories', `${token.prefecture.toLowerCase()}-${token.accessory.toLowerCase()}`, 'ja')?.name;

    // pngファイルに保存
    const path = await svgStreamToPngFile(token);

    let message = `### ⭐️P2Pセールから購入されました⭐️
## Local Nouns #${tokenId} ${prefectureName}
ヘッド    : ${headName}
アクセサリ: ${accessoryName}
`;
    console.log(message);
    bot.sendMessage(channelId, message, [path])
        .then(() => console.log('postForPurchase sent!'))
        .catch(console.error);
} 

export async function postForExecuteTrade(bot: DiscordBot, channelId: string, ownedTokenId: string, targetTokenId: string) {
    // トークン情報を取得
    const ownedToken: TOKEN = await getTokenInfo(ownedTokenId);
    const ownedPrefectureName = prefecture_ja[ownedToken.prefecture as keyof typeof prefecture_ja];
    const ownedHeadName = getPartsNameAndDescription('Heads', `${ownedToken.prefecture.toLowerCase()}-${ownedToken.head.toLowerCase()}`, 'ja')?.name;
    const ownedAccessoryName = getPartsNameAndDescription('Accessories', `${ownedToken.prefecture.toLowerCase()}-${ownedToken.accessory.toLowerCase()}`, 'ja')?.name;

    const targetToken: TOKEN = await getTokenInfo(targetTokenId);
    const targetPrefectureName = prefecture_ja[targetToken.prefecture as keyof typeof prefecture_ja];
    const targetHeadName = getPartsNameAndDescription('Heads', `${targetToken.prefecture.toLowerCase()}-${targetToken.head.toLowerCase()}`, 'ja')?.name;
    const targetAccessoryName = getPartsNameAndDescription('Accessories', `${targetToken.prefecture.toLowerCase()}-${targetToken.accessory.toLowerCase()}`, 'ja')?.name;

    // pngファイルに保存
    const ownedTokenPath = await svgStreamToPngFile(ownedToken);
    const targetTokenPath = await svgStreamToPngFile(targetToken);

    let message = `### ⭐️P2Pトレードが成立しました⭐️
## Local Nouns #${ownedTokenId} ${ownedPrefectureName}
ヘッド    : ${ownedHeadName}
アクセサリ: ${ownedAccessoryName}
   ⇧⇩ ⇧⇩ ⇧⇩
## Local Nouns #${targetTokenId} ${targetPrefectureName}
ヘッド    : ${targetHeadName}
アクセサリ: ${targetAccessoryName}
`;
    console.log(message);
    bot.sendMessage(channelId, message, [ownedTokenPath, targetTokenPath])
        .then(() => console.log('postForExecuteTrade sent!'))
        .catch(console.error);
} 

async function svgStreamToPngFile(token: TOKEN){
    const path = `./tmp/${token.tokenId}.png`;
    const roundedCorners = Buffer.from(token.svg);
    await sharp(roundedCorners)
    .resize(160, 160)
    .png()
    .toFile(path);

    return path;
}