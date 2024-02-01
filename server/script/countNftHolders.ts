/*
  npx ts-node -r tsconfig-paths/register server/script/countNftHolders.ts
*/
import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import {
    getProvider,
    getNNSENSReverseResolverContract,
    resolveNNSorENS,
} from "@/utils/const";
import { addresses } from "@/utils/addresses";
import { writeHolderToFirestore, initializeHolderToFirestore } from "./holderOnFirestore";
import { TOKEN, HOLDER } from "@/firestore/const";
import { getDocs, collection, Query } from "firebase/firestore";
import { db } from "@/utils/firebase";


const provider = getProvider(NETWORK, ALCHEMY_API_KEY);
const resolverContract = getNNSENSReverseResolverContract(provider);


const tokenAddress = addresses.localNounsToken[NETWORK];
const tokenCollectionPath = `/${NETWORK}/${tokenAddress}`;

const main = async () => {

    const tokens: TOKEN[] | undefined = await getMyTokenList();
    console.log("tokens.length", tokens?.length);

    // holderごとのtokenの数をカウントする
    const holderTokenCounts: { [key: string]: number } = {};

    tokens?.forEach((token) => {
        if (token.holder in holderTokenCounts) {
            // 既にカウントされているholderの場合は、数を増やす
            holderTokenCounts[token.holder]++;
        } else {
            // 新しいholderの場合は、カウントを1で初期化
            holderTokenCounts[token.holder] = 1;
        }
    });

    // firestoreを初期化
    await initializeHolderToFirestore();

    // ループしてfirestoreに書き込む
    for (const [address, numOfHold] of Object.entries(holderTokenCounts)) {
        const holderData: HOLDER = {
            address,
            numOfHold,
            addressName: await resolveNNSorENS(resolverContract, address),
            timestamp: new Date(), // 現在のタイムスタンプ
        };

        // Firestoreにデータを追加
        await writeHolderToFirestore(holderData);
    }

    process.exit(0);
};

const getMyTokenList = async () => {
    let tokenQuery: Query<TOKEN> = collection(
        db,
        tokenCollectionPath + "/tokens",
    ) as Query<TOKEN>;
    try {
        const results = await getDocs(tokenQuery);
        return results.docs.map((doc) => {
            return doc.data();
        });
    } catch (e) {
        console.error("getMyTokenList", e);
        process.exit(-1);
    }
};


main();
