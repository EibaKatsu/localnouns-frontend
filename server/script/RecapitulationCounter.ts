/*
  npx ts-node -r tsconfig-paths/register server/script/RecapitulationCounter.ts
*/
import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import { addresses } from "@/utils/addresses";
import { writeCounterToFirestore, initializeCounterOnFirestore } from "./CounterOnFirestore";
import { HISTORY, ACTION, COUNTER, COUNTER_TYPE } from "@/firestore/const";
import { getDocs, collection, Query } from "firebase/firestore";
import { db } from "@/utils/firebase";


const tokenAddress = addresses.localNounsToken[NETWORK];
const tokenCollectionPath = `/${NETWORK}/${tokenAddress}`;

const main = async () => {

    const histories: HISTORY[] | undefined = await getHistories();
    console.log("histories.length", histories?.length);

    // 日付、月ごとのHISTORYをカウントする
    const historyCounter: { [key: string]: COUNTER } = {};

    for (const history of histories) {

        // tokenId <300のMINTは除外(運営保有分)
        if(history.action == ACTION.MINT && Number(history.tokenId) < 300){
            continue;
        }

        // DAILY分
        await readHistory(history, COUNTER_TYPE.DAILY);
        // MONTHLY分
        await readHistory(history, COUNTER_TYPE.MONTHLY);
    }

    // firestoreを初期化
    await initializeCounterOnFirestore();

    // firestoreに書き込む
    await writeCounterToFirestore(Object.values(historyCounter));

    process.exit(0);

    async function readHistory(history: HISTORY, counterType: COUNTER_TYPE) {
        const key = await getKey(counterType, history.timestamp);

        if (key in historyCounter) {
            // 既にカウントされているholderの場合は、数を増やす
            if (history.action == ACTION.MINT)
                historyCounter[key].numOfMint++;
            if (history.action == ACTION.PURCHASE)
                historyCounter[key].numOfSale++;
            if (history.action == ACTION.TRADE)
                historyCounter[key].numOfTrade++;

        } else {
            // 新しいholderの場合は、Counterを初期化
            historyCounter[key] = {
                key: key,
                counterType: counterType,
                numOfMint: history.action == ACTION.MINT ? 1 : 0,
                numOfSale: history.action == ACTION.PURCHASE ? 1 : 0,
                numOfTrade: history.action == ACTION.TRADE ? 1 : 0,
            };
        }
    }
};

const getKey = async (counterType: string, timestamp: any) => {

    const date = new Date(timestamp.seconds * 1000);
    const year = date.getFullYear();
    // getMonth() は 0 から始まるため、1 を足します
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    let key: string;
    if (counterType == COUNTER_TYPE.DAILY) {
        key = `${year}-${month}-${day}`;
    } else {
        key = `${year}-${month}`;
    }
    return key;
}

const getHistories = async () => {
    let historyQuery: Query<HISTORY> = collection(
        db,
        tokenCollectionPath + "/history",
    ) as Query<HISTORY>;
    try {
        const results = await getDocs(historyQuery);
        return results.docs.map((doc) => {
            return doc.data();
        });
    } catch (e) {
        console.error("getHistories", e);
        process.exit(-1);
    }
};


main();
