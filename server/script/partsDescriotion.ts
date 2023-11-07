import * as admin from "firebase-admin";
import { NETWORK } from "@/config/project";
import { addresses } from "@/utils/addresses";
import { SERVICE_ACCOUNT_KEY_PATH } from "@/config/project";
import { PARTS } from "@/firestore/const";
import { partsData } from "../data/partsData";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT_KEY_PATH),
  });
}
const firestore = admin.firestore();
const tokenAddress = addresses.localNounsToken[NETWORK];

export const writePartsDescriotionToFirestore = async (
  parts: PARTS
) => {
  // 他のドキュメントにも書くかもしれないのでトランザクションで格納しておく
  await admin.firestore().runTransaction(async (tr) => {
    const tokenDocumentPath = `/${NETWORK}/${tokenAddress}/parts/${parts.type}-${parts.key}-${parts.language}`;

    parts.createdDate = new Date();
    await tr.set(firestore.doc(tokenDocumentPath), parts);
  });

  return {
    result: true,
  };
};


const main = async () => {
  partsData.forEach((parts: PARTS) => {
    writePartsDescriotionToFirestore(parts);
    console.log(parts.key);
  })
};

main();