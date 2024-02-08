import * as admin from "firebase-admin";
import { NETWORK } from "@/config/project";
import { addresses } from "@/utils/addresses";
import { SERVICE_ACCOUNT_KEY_PATH } from "@/config/project";
import { COUNTER, COUNTER_TYPE, ACTION } from "@/firestore/const";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT_KEY_PATH),
  });
}
const firestore = admin.firestore();
const tokenAddress = addresses.localNounsToken[NETWORK];


export const writeCounterToFirestore = async (
  counters: COUNTER[]
) => {
  // 他のドキュメントにも書くかもしれないのでトランザクションで格納しておく
  await admin.firestore().runTransaction(async (tr: any) => {

    for (const counter of counters) {
      // ドキュメントのパスを指定
      const counterDocumentPath = `/${NETWORK}/${tokenAddress}/counter/${counter.key}`;

      await tr.set(firestore.doc(counterDocumentPath), counter);
      console.log('writeHolderToFirestore:', counter.key);
    }
  });

  return {
    result: true,
  };
};


export const initializeCounterOnFirestore = async (
) => {
  // TOKENドキュメントのパスを指定
  const counterDocumentPath = `/${NETWORK}/${tokenAddress}/counter`;
  const collectionRef = firestore.collection(counterDocumentPath);
  const snapshot = await collectionRef.get();

  // トランザクションまたはバッチを使用してドキュメントを削除
  const batch = await firestore.batch();

  await snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // バッチ操作をコミットして変更を適用
  await batch.commit();

  console.log('All counter have been successfully deleted.');

  return {
    result: true,
  };
};
