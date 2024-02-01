/*
  npx ts-node -r tsconfig-paths/register server/script/writeHistoryFromEventLogs.ts
*/
import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import {
  getProvider,
  getLocalNounsTokenContract,
  getNNSENSReverseResolverContract,
  resolveNNSorENS,
} from "@/utils/const";
import { addresses } from "@/utils/addresses";
import { writeHistoryToFirestore } from "./historyOnFirestore";
import { TOKEN, HISTORY, ACTION } from "@/firestore/const";

const provider = getProvider(NETWORK, ALCHEMY_API_KEY);
const tokenContract = getLocalNounsTokenContract(
  addresses.localNounsToken[NETWORK],
  provider,
);
const resolverContract = getNNSENSReverseResolverContract(provider);

const mint = async () => {
  // from address(0) への Transfer イベントをフィルタリング
  const filter = tokenContract.filters.Transfer(
    "0x0000000000000000000000000000000000000000",
    null,
    null,
  );
  const events = await tokenContract.queryFilter(filter);

  for (const event of events) {
    // EventLog 型の場合のみ実行
    if ("args" in event) {
      // eventからto, tokenIdを取得
      const { to, from, tokenId } = event.args;

      if (tokenId > 10) {
        continue;
      }

      // 履歴を書き込み
      const block = await provider.getBlock(event.blockNumber);
      const timestamp = block?.timestamp;

      const history: HISTORY = {
        hash: event.transactionHash,
        blocknumber: event.blockNumber,
        action: ACTION.MINT,
        tokenId: tokenId,
        from: from,
        to: to,
        fromName: await getNNSorENS(from),
        toName: await getNNSorENS(to),
        timestamp: timestamp ? new Date(timestamp * 1000) : new Date(0)
      };
      await writeHistoryToFirestore(history);

      console.log(`Write finish, mint: ${tokenId}, ${event.transactionHash}`);
    }
  }
};

const purchace = async () => {
  // from address(0) への Transfer イベントをフィルタリング
  const filter = tokenContract.filters.Purchase(
    null,
    null,
  );
  const events = await tokenContract.queryFilter(filter);

  for (const event of events) {
    // EventLog 型の場合のみ実行
    if ("args" in event) {
      // eventからto, tokenIdを取得
      const { tokenId, _buyer } = event.args;

      // 履歴を書き込み
      const block = await provider.getBlock(event.blockNumber);
      const timestamp = block?.timestamp;

      const from = await getTransferFromForTransaction(event.transactionHash);

      const history: HISTORY = {
        hash: event.transactionHash,
        blocknumber: event.blockNumber,
        action: ACTION.PURCHASE,
        tokenId: tokenId,
        from: from,
        to: _buyer,
        fromName: await getNNSorENS(from),
        toName: await getNNSorENS(_buyer),
        timestamp: timestamp ? new Date(timestamp * 1000) : new Date(0)
      };
      await writeHistoryToFirestore(history);

      console.log(`Write finish, purchace: ${tokenId}, ${event.transactionHash}`);
    }
  }
};

const executeTrade = async () => {
  // from address(0) への Transfer イベントをフィルタリング
  const filter = tokenContract.filters.ExecuteTrade(
    null, null, null, null,
  );
  const events = await tokenContract.queryFilter(filter);

  for (const event of events) {
    // EventLog 型の場合のみ実行
    if ("args" in event) {
      // eventからto, tokenIdを取得
      const { targetTokenId, _lister, ownedTokenId, _executer } = event.args;

      // 履歴を書き込み
      const block = await provider.getBlock(event.blockNumber);
      const timestamp = block?.timestamp;

      // リストしたToken
      const historyForListed: HISTORY = {
        hash: event.transactionHash,
        blocknumber: event.blockNumber,
        action: ACTION.TRADE,
        tokenId: targetTokenId,
        from: _executer,
        to: _lister,
        fromName: await getNNSorENS(_executer),
        toName: await getNNSorENS(_lister),
        timestamp: timestamp ? new Date(timestamp * 1000) : new Date(0)
      };
      await writeHistoryToFirestore(historyForListed);

      // 交換対象のToken
      const historyForOwned: HISTORY = {
        hash: event.transactionHash,
        blocknumber: event.blockNumber,
        action: ACTION.TRADE,
        tokenId: ownedTokenId,
        from: _lister,
        to: _executer,
        fromName: await getNNSorENS(_lister),
        toName: await getNNSorENS(_executer),
        timestamp: timestamp ? new Date(timestamp * 1000) : new Date(0)
      };
      await writeHistoryToFirestore(historyForOwned);

      console.log(`Write finish, trade: ${targetTokenId}<->${ownedTokenId}, ${event.transactionHash}`);
    }
  }
};


async function getTransferFromForTransaction(transactionHash: string) {
  // すべてのTransferイベントを取得するためのフィルター
  const filter = tokenContract.filters.Transfer();

  // フィルタリングされたイベントをクエリ
  const events = await tokenContract.queryFilter(filter);

  // 特定のトランザクションハッシュに一致するイベントをフィルタリング
  const matchingEvents = events.filter(event => event.transactionHash === transactionHash);

  // 使用されるのはPurchaseのときだけなので該当するeventは一つのみ
  for (const event of matchingEvents) {
    if ("args" in event) {
      const { from, to, tokenId } = event.args;
      return from;
    } else {
      return '';
    }
  }
  // マッチングするイベントを返す
  return matchingEvents;
}

async function getNNSorENS(address: string) {
  return await resolveNNSorENS(
    resolverContract,
    address,
  );
}

const main = async () => {
  await mint();
  await purchace();
  await executeTrade();
};

main();
