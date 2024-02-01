import * as admin from "firebase-admin";
import { NETWORK } from "@/config/project";
import { addresses } from "@/utils/addresses";
import { SERVICE_ACCOUNT_KEY_PATH } from "@/config/project";
import { HOLDER, TOKEN } from "@/firestore/const";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT_KEY_PATH),
  });
}
const firestore = admin.firestore();
const tokenAddress = addresses.localNounsToken[NETWORK];

export const writeHolderToFirestore = async (
  holder: HOLDER
) => {
  // 他のドキュメントにも書くかもしれないのでトランザクションで格納しておく
  await admin.firestore().runTransaction(async (tr: any) => {

    // addressを小文字にする
    holder.address = holder.address.toLowerCase();

    // TOKENドキュメントのパスを指定
    const holderDocumentPath = `/${NETWORK}/${tokenAddress}/holders/${holder.address}`;

    await tr.set(firestore.doc(holderDocumentPath), holder);
    console.log('writeHolderToFirestore:', holder.addressName, holder.numOfHold);
  });

  return {
    result: true,
  };
};

export const incrementHolderToFirestore = async (
  address: string,
  addressName: string,
  increment: number
) => {

  // addressを小文字にする
  address = address.toLowerCase();

  // 他のドキュメントにも書くかもしれないのでトランザクションで格納しておく
  await admin.firestore().runTransaction(async (tr: any) => {

    // TOKENドキュメントのパスを指定
    const holderDocumentPath = `/${NETWORK}/${tokenAddress}/holders/${address}`;
    const holderDoc = await firestore.doc(holderDocumentPath).get();

    if (!holderDoc.exists) {
      // 存在しない場合は新規に書き込み

      const holderData: HOLDER = {
        address: address,
        numOfHold: increment,
        addressName: addressName,
        timestamp: new Date(), // 現在のタイムスタンプ
      };

      await tr.set(firestore.doc(holderDocumentPath), holderData);
      console.log('incrementHolderToFirestore:', holderData.addressName, holderData.numOfHold);

    } else {
      const newVal = (holderDoc.data()?.numOfHold || 0) + increment;
      // firestore にドキュメントを更新
      await holderDoc.ref.update({
        addressName: addressName,
        numOfHold: newVal,
        timestamp: new Date(),
      });
      console.log('incrementHolderToFirestore:', addressName, newVal);
    }

  });

  return {
    result: true,
  };
};

export const initializeHolderToFirestore = async (
) => {
  // TOKENドキュメントのパスを指定
  const holdersCollectionPath = `/${NETWORK}/${tokenAddress}/holders`;
  const collectionRef = firestore.collection(holdersCollectionPath);
  const snapshot = await collectionRef.get();

  // トランザクションまたはバッチを使用してドキュメントを削除
  const batch = await firestore.batch();

  await snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // バッチ操作をコミットして変更を適用
  await batch.commit();

  console.log('All holders have been successfully deleted.');

  return {
    result: true,
  };
};
