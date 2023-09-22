import { ALCHEMY_API_KEY, NETWORK } from "@/config/project";
import { getProvider, getLocalNounsTokenContract } from "@/utils/const";
import { addresses } from "../../utils/addresses";

const provider = getProvider(NETWORK, ALCHEMY_API_KEY);
const contract = getLocalNounsTokenContract(
  addresses.localNounsToken[NETWORK],
  provider,
);

// mintイベントの監視 TODO コントラクトにMint イベントを作る
contract.on("Transfer", async (from, to, tokenId, event) => {
  try {
    console.log("mint", tokenId, to);
  } catch (error) {
    console.error("Error:", error);
  }
});
