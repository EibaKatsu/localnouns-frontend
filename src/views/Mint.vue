<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <div v-if="!account">
      <p class="mb-2 font-londrina font-yusei text-xl">
        {{ $t("mint.connectWallet") }}
      </p>
    </div>
    <div v-else>
      <p v-if="salePhase == 0" class="mb-2 font-londrina font-yusei text-xl">
        {{ $t("mint.saleLock") }}
      </p>
      <p v-if="salePhase == 1" class="mb-2 font-londrina font-yusei text-xl">
        {{ $t("mint.alSale") }}
      </p>
      <p v-if="salePhase == 2" class="mb-2 font-londrina font-yusei text-xl">
        {{ $t("mint.publicSale") }}
      </p>
    </div>
    <div class="mb-8 space-y-2 font-pt-root font-medium"></div>
  </div>

  <div v-if="salePhase != 0 && account">
    <div class="mx-auto max-w-lg p-2 text-left">
      <Prefectures v-model="selectedPrefecture" />
    </div>

    <div class="mx-auto max-w-lg p-2 text-left">
      <div
        class="grid w-auto grid-cols-1 place-content-center items-center gap-2"
      >
        <span class="font-londrina font-yusei text-xl whitespace-nowrap">
          {{ $t("mint.price") }}: {{ mintPrice }} ETH
        </span>
      </div>
    </div>

    <div class="mx-auto max-w-lg p-2 text-left">
      <NumOfMint limit="10" v-model="selectedNumOfMint" />
    </div>

    <div class="mx-auto max-w-lg p-2 text-left mt-4 mb-4">
      <span class="font-londrina font-yusei text-3xl whitespace-nowrap">
        {{ $t("mint.total") }}: {{ total }} ETH (+ gas fee)
      </span>
    </div>

    <div class="mx-auto max-w-lg p-2 text-left mt-4">
      <input type="checkbox" value="0" v-model="checkExplanation" />
      <router-link
        :to="localizedUrl('/explanation')"
        target="_blank"
        class="font-londrina font-yusei text-xl ml-1"
        >{{ $t("mint.explanation") }}</router-link
      >
    </div>

    <div class="mx-auto max-w-lg p-2 text-left">
      <input type="checkbox" value="0" v-model="checkTerms" />
      <router-link
        :to="localizedUrl('/terms')"
        target="_blank"
        class="font-londrina font-yusei text-xl ml-1"
        >{{ $t("mint.terms") }}</router-link
      >
    </div>

    <div class="mx-auto max-w-lg p-2 text-left">
      <input type="checkbox" value="0" v-model="checkTokushoho" />
      <router-link
        :to="localizedUrl('/tokushoho')"
        target="_blank"
        class="font-londrina font-yusei text-xl ml-1"
        >{{ $t("mint.tokushoho") }}</router-link
      >
    </div>

    <div class="mx-auto max-w-lg p-2 text-left">
      <input type="checkbox" value="0" v-model="checkPrivacy" />
      <router-link
        :to="localizedUrl('/privacy')"
        target="_blank"
        class="font-londrina font-yusei text-xl ml-1"
        >{{ $t("mint.privacy") }}</router-link
      >
    </div>

    <div class="mx-auto max-w-lg p-2 text-left mt-1 mb-4">
      <span class="font-londrina font-yusei">
        <span v-if="balanceOf == 0 && salePhase == 1">
          <!-- ALセールで特定NFTなし-->
          <span
            class="inline-block rounded bg-gray-600 px-6 py-2.5 leading-tight text-white text-xl shadow-md transition duration-150 ease-in-out hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg"
            disabled
          >
            {{ $t("mint.notHasSpecificNFT") }}
          </span>
        </span>
        <span v-else>
          <span v-if="mintLimit < totalSupply + selectedNumOfMint">
            <!-- 最大ミント数オーバー-->
            <span
              class="inline-block rounded bg-gray-600 px-6 py-2.5 leading-tight text-white text-xl shadow-md transition duration-150 ease-in-out hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg"
              disabled
            >
              {{ $t("mint.overMintLimit") }}
            </span>
          </span>
          <span v-else>
            <!-- ミント中 -->
            <span v-if="isMinting">
              <button
                type="button"
                class="inline-block rounded px-6 py-2.5 leading-tight text-gray-600 shadow-md"
                disabled
              >
                <img
                  class="absolute h-3 w-8 animate-spin"
                  src="@/assets/red160px.png"
                />
                <span class="ml-10">{{ $t("message.processing") }}</span>
              </button>
            </span>
            <span v-else>
              <!-- ミントボタン -->
              <button
                v-if="
                  checkExplanation &&
                  checkTerms &&
                  checkTokushoho &&
                  checkPrivacy
                "
                @click="mint"
                class="inline-block rounded bg-green-600 px-6 py-2.5 leading-tight text-white text-3xl shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
              >
                {{ $t("mint.mint") }}
              </button>
              <!-- 各種条件チェック前 -->
              <button
                v-else
                disabled
                class="inline-block rounded bg-gray-600 px-6 py-2.5 leading-tight text-white text-3xl shadow-md transition duration-150 ease-in-out hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg"
              >
                {{ $t("mint.mint") }}
              </button>

              <span
                v-if="
                  checkExplanation &&
                  checkTerms &&
                  checkTokushoho &&
                  checkPrivacy
                "
              >
                <!-- ミントボタン(クレジットカード) 都道府県指定なし-->
                <button
                  v-if="selectedPrefecture == 0"
                  class="inline-block rounded bg-green-600 mt-5 px-6 py-2.5 leading-tight text-white text-3xl shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
                >
                  <a :href="mintByCCUrl">
                    {{ $t("mint.mintCC") }}
                  </a>
                </button>
                <!-- ミントボタン(クレジットカード) 都道府県指定あり-->
                <button
                  v-else
                  class="inline-block rounded bg-green-600 mt-5 px-6 py-2.5 leading-tight text-white text-3xl shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
                >
                  <a :href="mintNotSpecifiedByCCUrl">
                    {{ $t("mint.mintCC") }}
                  </a>
                </button>
              </span>
              <span v-else>
                <!-- 各種条件チェック前 -->
                <button
                  disabled
                  class="inline-block rounded bg-gray-600 mt-5 px-6 py-2.5 leading-tight text-white text-3xl shadow-md transition duration-150 ease-in-out hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg"
                >
                  {{ $t("mint.mintCC") }}
                </button>
              </span>
            </span>
            <a
              v-if="hashLink && isMinting"
              :href="hashLink"
              target="_blank"
              class="ml-10"
            >
              etherscan
            </a>
          </span>
        </span>
      </span>
    </div>

    <!-- ミント終了時のダイアログ -->
    <FinishMintDialog
      :isOpen="displayInformationDialog"
      :mintedTokenId="mintedTokenId"
      :mintedNumber="selectedNumOfMint"
      :hashLink="hashLink"
      @close="closeModal(true)"
    />

    <!-- エラー時のダイアログ -->
    <ErrorDialog
      :isOpen="displayErrorDialog"
      :description="errorDescription"
      @close="closeModal(true)"
    />

    <div class="mb-8 space-y-2 font-pt-root font-medium"></div>
    <hr />
    <div class="mx-auto max-w-lg p-2 text-center">
      <p class="mb-2 font-londrina font-yusei text-3xl flex items-center">
        {{ `${totalSupply}` }} / {{ `${mintLimit}` }} minted
        <button
          @click="reload"
          class="inline-flex justify-center items-center rounded px-2 py-2 ml-2 w-8 h-8 leading-tight shadow-md transition duration-150 ease-in-out hover:shadow-lg hover:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 focus:bg-gray-300 active:shadow-lg active:bg-gray-300 border border-gray-300"
        >
          <img class="w-8 h-7" src="@/assets/reload.png" />
        </button>
      </p>
    </div>

    <p class="mb-2 font-londrina font-yusei">
      {{ $t("mint.recentlyMinted") }}
    </p>
    <div
      v-if="tokens.length > 0"
      class="grid w-screen grid-cols-2 place-content-center items-center gap-2 sm:grid-cols-4 mt-4"
    >
      <span v-for="token in tokens" :key="token.tokenId">
        <div>
          <img :src="token.image" class="mr-1 mb-1 inline-block w-32" />
          <p class="mb-2 font-londrina font-yusei text-s">
            #{{ token.tokenId }}
          </p>
        </div>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { ethers } from "ethers";
import {
  getTokenContract,
  useFetchTokens,
  useMintConditions,
  getLocalNounsMinterContract,
  getTokenGate,
  useCheckTokenGate,
  getAddresses,
} from "@/utils/const";
import { ChainIdMap } from "@/utils/MetaMask";
import { weiToEther } from "@/utils/utils";
import Prefectures from "@/components/Prefectures.vue";
import NumOfMint from "@/components/NumOfMint.vue";
import FinishMintDialog from "@/components/FinishMintDialog.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import { MINT_BY_CC_URL, MINT_NOT_SPECIFIED_BY_CC_URL } from "@/config/project";

export default defineComponent({
  props: {
    network: {
      type: String,
      required: true,
    },
    tokenAddress: {
      type: String,
      required: true,
    },
    // tokenGated: {
    //   type: Boolean,
    //   required: true,
    // },
    tokenGateAddress: {
      type: String,
      required: true,
    },
    // restricted: {
    //   type: String,
    // },
    assetProvider: {
      type: String,
    },
    minterAddress: {
      type: String,
      required: true,
    },
    // limit: {
    //   type: Number,
    // },
  },
  name: "Mint",
  components: {
    Prefectures,
    NumOfMint,
    FinishMintDialog,
    ErrorDialog,
  },
  setup(props) {
    const store = useStore();
    const i18n = useI18n();

    const isMinting = ref(false);
    const displayInformationDialog = ref(false);
    const mintedTokenId = ref(99999);
    const displayErrorDialog = ref(false);
    const errorDescription = ref("");
    const hashLink = ref("");
    const checkExplanation = ref(false);
    const checkTerms = ref(false);
    const checkTokushoho = ref(false);
    const checkPrivacy = ref(false);

    const lang = computed(() => {
      return i18n.locale.value;
    });

    const provider = new ethers.BrowserProvider(store.state.ethereum);

    // RO means read only.
    const contractRO = getTokenContract(props.tokenAddress, provider);
    // Minter
    const minterContract = getLocalNounsMinterContract(
      props.minterAddress,
      provider,
    );
    // TokenGate
    const tokenGateContract = getTokenGate(props.tokenGateAddress, provider);

    const { fetchTokens, totalSupply, tokens } = useFetchTokens(
      props.network,
      props.assetProvider,
      provider,
      contractRO,
    );
    fetchTokens();

    const {
      salePhase,
      mintLimit,
      mintPriceForSpecified,
      mintPriceForNotSpecified,
      mintConditions,
    } = useMintConditions(props.network, minterContract);

    mintConditions();

    // setInterval(() => {
    //   fetchTokens();
    // }, 30000); // 30秒ごとに実行

    const selectedPrefecture = ref(0);
    const selectedNumOfMint = ref(10);

    const mintPrice = computed(() => {
      if (selectedPrefecture.value == 0) {
        return weiToEther(mintPriceForNotSpecified.value);
      } else {
        return weiToEther(mintPriceForSpecified.value);
      }
    });

    const total = computed(() => {
      return mintPrice.value * Number(selectedNumOfMint.value);
    });

    const { balanceOf, checkTokenGate } = useCheckTokenGate(tokenGateContract);

    const account = computed(() => {
      checkTokenGate(store.state.account);
      return store.state.account;
    });

    const reload = async () => {
      await fetchTokens();
    };

    const mintByCCUrl = computed(() => {
      return `${MINT_BY_CC_URL}?quantity=${selectedNumOfMint.value}&recipientAddress=${account.value}`;
    });

    const mintNotSpecifiedByCCUrl = computed(() => {
      return `${MINT_NOT_SPECIFIED_BY_CC_URL}?prefectureId=${selectedPrefecture.value}&quantity=${selectedNumOfMint.value}&recipientAddress=${account.value}`;
    });

    const mint = async () => {
      const chainId = ChainIdMap[props.network];
      const signer = await store.getters.getSigner(chainId);

      const contract = getLocalNounsMinterContract(props.minterAddress, signer);

      isMinting.value = true;

      try {
        const weiValue = ethers.parseEther(total.value.toString());
        const txParams = { value: weiValue };
        const tx = await contract.mintSelectedPrefecture(
          selectedPrefecture.value,
          selectedNumOfMint.value,
          txParams,
        );

        const { EtherscanBase } = getAddresses(
          props.network,
          props.minterAddress,
        );
        hashLink.value = EtherscanBase + "/tx/" + tx.hash;

        const result = await tx.wait();

        // displayInformationDialog.value = true;
        console.log("mint:gasUsed", result.gasUsed);

        isMinting.value = false;
        displayInformationDialog.value = true;

        await fetchTokens();

        // await checkTokenGate(account.value);
      } catch (e) {
        console.error("mintSelectedPrefecture:", e);
        if (e instanceof Error) {
          errorDescription.value = "mintSelectedPrefecture:" + e.message;
        } else {
          errorDescription.value = "mintSelectedPrefecture:" + String(e);
        }
        const indexComma = errorDescription.value.indexOf("(");
        errorDescription.value = errorDescription.value.substring(
          0,
          indexComma,
        );
        if (errorDescription.value.indexOf("user rejected action") < 0) {
          displayErrorDialog.value = true;
        } else {
          isMinting.value = false;
        }
      }
    };

    const closeModal = () => {
      console.log("closeModal-reload");
      isMinting.value = false;
      displayInformationDialog.value = false;
      displayErrorDialog.value = false;
      hashLink.value = "";
    };

    return {
      lang,
      salePhase,
      mintPrice,
      totalSupply,
      mintLimit,
      balanceOf,
      tokens,
      total,
      selectedNumOfMint,
      selectedPrefecture,
      isMinting,
      displayInformationDialog,
      mintedTokenId,
      hashLink,
      displayErrorDialog,
      errorDescription,
      closeModal,
      account,
      mint,
      reload,
      checkExplanation,
      checkTerms,
      checkTokushoho,
      checkPrivacy,
      mintByCCUrl,
      mintNotSpecifiedByCCUrl,
    };
  },
});
</script>
