import * as admin from "firebase-admin";
import { NETWORK } from "@/config/project";
import { addresses } from "@/utils/addresses";
import { SERVICE_ACCOUNT_KEY_PATH } from "@/config/project";
import { HISTORY,TOKEN } from "@/firestore/const";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT_KEY_PATH),
  });
}
const firestore = admin.firestore();
const tokenAddress = addresses.localNounsToken[NETWORK];

export const writeHistoryToFirestore = async (
  history: HISTORY
) => {
  // 他のドキュメントにも書くかもしれないのでトランザクションで格納しておく
  await admin.firestore().runTransaction(async (tr: any) => {

    // TOKENドキュメントのパスを指定
    const tokenDocumentPath = `/${NETWORK}/${tokenAddress}/tokens/${history.tokenId}`;
    const tokenDoc = await firestore.doc(tokenDocumentPath).get();
    const tokenData = tokenDoc.data() as TOKEN;
    history.token = tokenData;

    const historyDocumentPath = `/${NETWORK}/${tokenAddress}/history/${history.hash}-${history.tokenId}`;

    await tr.set(firestore.doc(historyDocumentPath), history);
  });

  return {
    result: true,
  };
};
