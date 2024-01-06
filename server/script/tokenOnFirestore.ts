import * as admin from "firebase-admin";
import { NETWORK } from "@/config/project";
import { addresses } from "@/utils/addresses";
import { SERVICE_ACCOUNT_KEY_PATH } from "@/config/project";
import { TOKEN } from "@/firestore/const";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT_KEY_PATH),
  });
}
const firestore = admin.firestore();
const tokenAddress = addresses.localNounsToken[NETWORK];

export const writeTokenDataToFirestore = async (
  tokenInfo:TOKEN
) => {
  // 他のドキュメントにも書くかもしれないのでトランザクションで格納しておく
  await admin.firestore().runTransaction(async (tr:any) => {
    const tokenDocumentPath = `/${NETWORK}/${tokenAddress}/tokens/${tokenInfo.tokenId}`;

    await tr.set(firestore.doc(tokenDocumentPath), tokenInfo);
  });

  return {
    result: true,
  };
};

export const updateOwnerOfTokenToFirestore = async (
  tokenId: string,
  to: string,
) => {
  // ドキュメントのパスを指定
  const tokenDocumentPath = `/${NETWORK}/${tokenAddress}/tokens/${tokenId}`;

  const tokenDoc = await firestore.doc(tokenDocumentPath).get();

  // tokenId に関連するドキュメントが存在しない場合、エラーを返す
  if (!tokenDoc.exists) {
    return {
      result: false,
      message: `No token found with tokenId ${tokenId}`,
    };
  }

  // firestore にドキュメントを更新
  await tokenDoc.ref.update({
    holder: to,
    salePrice: 0,
    isOnTrade: false,
    tradeToPrefecture: [0], // firestore上は '0':指定しないをセット
  });

  return {
    result: true,
    message: `Updated owner of token with tokenId ${tokenId} to ${to}`,
  };
};

export const updatePriceOfTokenOnFirestore = async (
  tokenId: string,
  newSalePrice: number,
) => {
  // ドキュメントのパスを指定
  const tokenDocumentPath = `/${NETWORK}/${tokenAddress}/tokens/${tokenId}`;

  const tokenDoc = await firestore.doc(tokenDocumentPath).get();

  // tokenId に関連するドキュメントが存在しない場合、エラーを返す
  if (!tokenDoc.exists) {
    return {
      result: false,
      message: `No token found with tokenId ${tokenId}`,
    };
  }

  // firestore にドキュメントを更新
  await tokenDoc.ref.update({
    salePrice: newSalePrice,
  });

  return {
    result: true,
    message: `Updated salePrice of token with tokenId ${tokenId} to ${newSalePrice}`,
  };
};

export const updateTradeOfTokenOnFirestore = async (
  tokenId: string,
  isOnTrade: boolean,
  tradeToPrefecture: number[],
  tradeAddress: string|null,
) => {
  // ドキュメントのパスを指定
  const tokenDocumentPath = `/${NETWORK}/${tokenAddress}/tokens/${tokenId}`;

  const tokenDoc = await firestore.doc(tokenDocumentPath).get();

  // tokenId に関連するドキュメントが存在しない場合、エラーを返す
  if (!tokenDoc.exists) {
    return {
      result: false,
      message: `No token found with tokenId ${tokenId}`,
    };
  }

  // 都道府県指定がない場合は [0] (指定しない)をセット
  const updatedTradeToPrefecture = [...tradeToPrefecture]; // 新しい配列を作成
  if (updatedTradeToPrefecture.length == 0) {
    updatedTradeToPrefecture.push(0); // 新しい配列に変更を加える
  }

  // firestore にドキュメントを更新
  await tokenDoc.ref.update({
    isOnTrade: isOnTrade,
    tradeToPrefecture: updatedTradeToPrefecture,
    tradeAddress: tradeAddress,
  });

  return {
    result: true,
    message: `Updated salePrice of token with tokenId ${tokenId} isOnTrade:${isOnTrade}`,
  };
};

export const updateHolderOfTokenOnFirestore = async (
  tokenId: string,
  holder: string,
) => {
  // ドキュメントのパスを指定
  const tokenDocumentPath = `/${NETWORK}/${tokenAddress}/tokens/${tokenId}`;

  const tokenDoc = await firestore.doc(tokenDocumentPath).get();

  // tokenId に関連するドキュメントが存在しない場合、エラーを返す
  if (!tokenDoc.exists) {
    return {
      result: false,
      message: `No token found with tokenId ${tokenId}`,
    };
  }

  // firestore にドキュメントを更新
  await tokenDoc.ref.update({
    holder: holder,
    salePrice: 0,
    isOnTrade: false,
    tradeToPrefecture: [0],
    tradeAddress: null,
  });

  return {
    result: true,
    message: `Updated holder of token with tokenId ${tokenId} holder:${holder}`,
  };
};
