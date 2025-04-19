/*
  npx ts-node -r tsconfig-paths/register server/script/MintSelectedPrefectureFromEventLogs.ts
*/
import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import {
  getProvider,
  getLocalNounsMinterContract,
} from "@/utils/const";
import { addresses } from "@/utils/addresses";
import { writeTokenDataToFirestore } from "./tokenOnFirestore";
import { getTokenInfo } from "./tokenOnContract";
import { TOKEN } from "@/firestore/const";

const provider = getProvider(NETWORK, ALCHEMY_API_KEY);
const minterContract = getLocalNounsMinterContract(
  addresses.localNounsMinter[NETWORK],
  provider,
);

const main = async () => {
  // from address(0) への Transfer イベントをフィルタリング
  const filter = minterContract.filters.MintSelectedPrefecture(
    null,null,null,
  );
  const events = await minterContract.queryFilter(filter);

  for (const event of events) {
    // EventLog 型の場合のみ実行
    if ("args" in event) {
      // eventからto, tokenIdを取得
      const { prefectureId, amount, minter } = event.args;

      console.log(`MintSelectedPrefecture(${prefectureId}, ${amount}, ${minter})`);

      // getTransactionDetails(event);
    }
  }
};


async function getTransactionDetails(event: any) {
  // トランザクションの取得
  const transaction = await provider.getTransaction(event.transactionHash);

  if (transaction != null && transaction.data) {
      // トランザクションのinputデータを解析
      const txData = transaction.data;

      try {
          // トランザクションデータを解析して関数と引数を取得
          const parsedTransaction = minterContract.interface.parseTransaction({ data: txData });

          console.log(`blockNumber: ${transaction.blockNumber}`);
          console.log(`transaction hash: ${event.transactionHash}`);
          console.log(`Function Name: ${parsedTransaction?.name}`);
          console.log(`Arguments: ${parsedTransaction?.args} `);
          console.log(`Gas Used: ${transaction?.gasLimit?.toString()}`);
          console.log(`Gas Price: ${transaction?.gasPrice?.toString()}`);
      } catch (error) {
          console.error("Error parsing transaction data:", error);
      }
  }
}

main();
