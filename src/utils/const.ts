import { ref, computed } from "vue";
import { useStore } from "vuex";
import { ethers } from "ethers";
import { addresses } from "@/utils/addresses";
import { svgImageFromSvgPart } from "@/models/point";

interface Token {
  tokenId: number;
  image: string;
}

type Provider =
  | ethers.JsonRpcProvider
  | ethers.AlchemyProvider
  | ethers.InfuraProvider
  | ethers.BrowserProvider;
type ProviderOrSigner = ethers.Provider | ethers.Signer | undefined;

export const getAddresses = (network: string, contentAddress: string) => {
  const EtherscanBase = (() => {
    if (network == "rinkeby") {
      return "https://rinkeby.etherscan.io";
    } else if (network == "goerli") {
      return "https://goerli.etherscan.io";
    } else if (network == "mumbai") {
      return "https://mumbai.polygonscan.com";
    }
    return "https://etherscan.io";
  })();
  const OpenSeaBase = (() => {
    if (network == "rinkeby") {
      return "https://testnets.opensea.io/assets/rinkeby";
    } else if (network == "goerli") {
      return "https://testnets.opensea.io/assets/goerli";
    } else if (network == "mumbai") {
      return "https://testnets.opensea.io/assets/mumbai";
    }
    return "https://opensea.io/assets/ethereum";
  })();
  const EtherscanToken = `${EtherscanBase}/address/${contentAddress}`;
  const OpenSeaPath = `${OpenSeaBase}/${contentAddress}`;

  return {
    EtherscanBase,
    OpenSeaBase,
    EtherscanToken,
    OpenSeaPath,
  };
};
export const getProvider = (
  network: string,
  alchemyKey: string | undefined,
) => {
  let networkName = network;
  if (network == "mumbai") {
    networkName = "maticmum";
  }
  return networkName == "localhost"
    ? new ethers.JsonRpcProvider()
    : alchemyKey
    ? new ethers.AlchemyProvider(networkName, alchemyKey)
    : new ethers.InfuraProvider(networkName);
};

const decodeTokenData = (tokenURI: string) => {
  const data = tokenURI.substring(29); // HACK: hardcoded
  const decoded = Buffer.from(data, "base64");
  const json = JSON.parse(decoded.toString());
  const svgData = json.image.substring(26); // hardcoded
  const svg = Buffer.from(svgData, "base64").toString();

  return { json, svg };
};

const ISVGHelper = {
  wabi: require("@/abis/ISVGHelper.json"), // wrapped abi
};
const ITokenGate = {
  wabi: require("@/abis/ITokenGate.json"), // wrapped abi
};
const ProviderTokenEx = {
  wabi: require("@/abis/ProviderToken.json"), // wrapped abi
};
const ProviderLocalNounsMinter = {
  wabi: require("@/abis/LocalNounsMinter.json"), // wrapped abi
};
const ProviderLocalNounsToken = {
  wabi: require("@/abis/LocalNounsToken.json"), // wrapped abi
};
const ProviderLocalNounsProvider = {
  wabi: require("@/abis/LocalNounsProvider.json"), // wrapped abi
};
// const LocalNounsToken = {
//   wabi: require("@/abis/LocalNounsToken.json"), // wrapped abi
// };
const IAssetProvider = {
  wabi: require("@/abis/IAssetProvider.json"), // wrapped abi
};

export const getSvgHelper = (network: string, provider: ProviderOrSigner) => {
  const svgHelperAddress = addresses["svgHelper"][network];
  const svgHelper = new ethers.Contract(
    svgHelperAddress,
    ISVGHelper.wabi.abi,
    provider,
  );
  return svgHelper;
};

export const getTokenGate = (address: string, provider: ProviderOrSigner) => {
  const tokenGate = new ethers.Contract(address, ITokenGate.wabi.abi, provider);
  return tokenGate;
};

export const getAssetProvider = (
  assetProviderName: string,
  network: string,
  provider: ProviderOrSigner,
) => {
  const providerAddress = addresses[assetProviderName][network];
  const assetProvider = new ethers.Contract(
    providerAddress,
    IAssetProvider.wabi.abi,
    provider,
  );
  return assetProvider;
};

export const getTokenContract = (
  address: string,
  provider: ProviderOrSigner,
): ethers.Contract => {
  const tokenContract = new ethers.Contract(
    address,
    ProviderTokenEx.wabi.abi,
    provider,
  );
  return tokenContract;
};

// Token Contract functions
const getBalanceFromTokenGate = async (
  tokenGate: ethers.Contract,
  account: string,
) => {
  if (!account) {
    return 0;
  }
  const balance = await tokenGate.balanceOf(account);
  return balance;
};
const getTotalSupplyFromTokenContract = async (
  tokenContract: ethers.Contract,
) => {
  const supply = await tokenContract.totalSupply();
  return Number(supply);
};

const getMintLimitFromTokenContract = async (
  tokenContract: ethers.Contract,
) => {
  const limit = await tokenContract.mintLimit();
  return Number(limit);
};

const getMintMaxFromMinterContract = async (
  minterContract: ethers.Contract,
) => {
  const limit = await minterContract.mintMax();
  return Number(limit);
};
const getPhaseFromMinterContract = async (minterContract: ethers.Contract) => {
  const phase = await minterContract.phase();
  return Number(phase);
};
const getMintPriceForSpecifiedFromMinterContract = async (
  minterContract: ethers.Contract,
) => {
  const price = await minterContract.mintPriceForSpecified();
  return BigInt(price);
};
const getMintPriceForNotSpecifiedFromMinterContract = async (
  minterContract: ethers.Contract,
) => {
  const price = await minterContract.mintPriceForNotSpecified();
  return BigInt(price);
};

const getDebugTokenURI = async (
  tokenContract: ethers.Contract,
  tokenId: number,
) => {
  const [tokenURI, gas] = await tokenContract.debugTokenURI(tokenId);
  return { tokenURI, gas: Number(gas) };
};

export const useFetchTokens = (
  network: string,
  assetProvider: string | undefined,
  provider: Provider,
  contractRO: ethers.Contract,
) => {
  const totalSupply = ref<number>(0);
  const mintLimit = ref<number>(0);
  const nextImage = ref<string | null>(null);
  const tokens = ref<Token[]>([]);

  const fetchTokens = async () => {
    try {
      const svgHelper = getSvgHelper(network, provider);
      totalSupply.value = await getTotalSupplyFromTokenContract(contractRO);
      mintLimit.value = await getMintLimitFromTokenContract(contractRO);

      const providerAddress = addresses[assetProvider || "dotNouns"][network];

      console.log("totalSupply/mintLimit", totalSupply.value, mintLimit.value);
      if (totalSupply.value < mintLimit.value) {
        const [svgPart, tag, gas] = await svgHelper.generateSVGPart(
          providerAddress,
          totalSupply.value,
        );
        console.log("gas:", gas);
        nextImage.value = svgImageFromSvgPart(svgPart, tag, "");
      } else {
        nextImage.value = null;
      }
      tokens.value = [];
      for (
        let tokenId = Math.max(0, totalSupply.value - 4);
        tokenId < totalSupply.value;
        tokenId++
      ) {
        const { tokenURI, gas } = await getDebugTokenURI(contractRO, tokenId);
        console.log("gas", tokenId, gas);
        const { json } = decodeTokenData(tokenURI);
        tokens.value.push({ tokenId, image: json.image });
      }
    } catch (e) {
      console.error("fetchTokens", e);
    }
  };
  return {
    totalSupply,
    mintLimit,
    nextImage,
    tokens,

    fetchTokens,
  };
};

export const useMintConditions = (
  network: string,
  contractRO: ethers.Contract,
) => {
  const salePhase = ref<number>(-1);
  const mintLimit = ref<number>(0);
  const mintPriceForSpecified = ref<bigint>(BigInt(0));
  const mintPriceForNotSpecified = ref<bigint>(BigInt(0));

  const mintConditions = async () => {
    try {
      salePhase.value = await getPhaseFromMinterContract(contractRO);
      mintLimit.value = await getMintMaxFromMinterContract(contractRO);
      mintPriceForSpecified.value =
        await getMintPriceForSpecifiedFromMinterContract(contractRO);
      mintPriceForNotSpecified.value =
        await getMintPriceForNotSpecifiedFromMinterContract(contractRO);

      console.log("salePhase/mintLimit", salePhase.value, mintLimit.value);
      console.log(
        "mintPrice",
        mintPriceForSpecified.value,
        mintPriceForNotSpecified.value,
      );
    } catch (e) {
      console.error("mintConditions", e);
    }
  };
  return {
    salePhase,
    mintLimit,
    mintPriceForSpecified,
    mintPriceForNotSpecified,
    mintConditions,
  };
};

export const useCheckTokenGate = (tokenGate: ethers.Contract) => {
  const balanceOf = ref<number>(0);

  const checkTokenGate = async (account: string) => {
    if (account) {
      // tokenGateに存在しないアドレスが登録されている場合はExceptionになる(テスト用)
      try {
        balanceOf.value = await getBalanceFromTokenGate(tokenGate, account);
      } catch (e) {
        balanceOf.value = 0;
      }
    } else {
      balanceOf.value = 0;
    }
  };
  return {
    balanceOf,
    checkTokenGate,
  };
};

export const _useNetworkContext = (
  chainId: string,
  tokenAddress: string,
  func: (address: string, provider: ProviderOrSigner) => ethers.Contract,
) => {
  const store = useStore();

  const networkContext = computed(() => {
    const signer = store.getters.getSigner(chainId);
    console.log(signer, chainId);
    if (signer) {
      const contract = func(tokenAddress, signer);
      return { signer, contract };
    }
    return null;
  });

  return {
    networkContext,
  };
};

export const useTokenNetworkContext = (
  chainId: string,
  tokenAddress: string,
) => {
  return _useNetworkContext(chainId, tokenAddress, getTokenContract);
};

export const getLocalNounsMinterContract = (
  address: string,
  provider: ProviderOrSigner,
): ethers.Contract => {
  const tokenContract = new ethers.Contract(
    address,
    ProviderLocalNounsMinter.wabi.abi,
    provider,
  );
  return tokenContract;
};

export const getLocalNounsTokenContract = (
  address: string,
  provider: ProviderOrSigner,
): ethers.Contract => {
  const tokenContract = new ethers.Contract(
    address,
    ProviderLocalNounsToken.wabi.abi,
    provider,
  );
  return tokenContract;
};

export const getLocalNounsProviderContract = (
  address: string,
  provider: ProviderOrSigner,
): ethers.Contract => {
  const tokenContract = new ethers.Contract(
    address,
    ProviderLocalNounsProvider.wabi.abi,
    provider,
  );
  return tokenContract;
};
