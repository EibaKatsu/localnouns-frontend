<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y bg-gray-500 bg-opacity-75 flex justify-center items-center"
  >
    <div
      class="relative p-6 bg-white w-3/4 h-4/5 overflow-y-auto flex flex-col justify-between items-center"
    >
      <span class="absolute top-4 right-4 cursor-pointer">
        <button
          @click="closeModal(false)"
          class="mt-4 inline-block rounded bg-green-500 px-6 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
        >
          {{ $t("tokenManagement.close") }}
        </button>
      </span>

      <TokenDetail :token="token" size="L" />
      <hr class="border-t border-gray-600 my-4 w-full" />

      <p class="mb-2 font-londrina font-yusei text-3xl">
        {{ $t("TokenSaleOrTrade.sale") }}
      </p>
      <p class="mb-2 font-londrina font-yusei text-l">
        {{ $t("TokenSaleOrTrade.saleDescription") }}
      </p>

      <div class="mt-4 flex flex-col items-center">
        <InformationDialog
          :isOpen="displayInformationDialog"
          :message="informationMessage"
          @close="closeModal(true)"
        />
        <div v-if="!isSaleBusy">
          <div class="flex justify-center gap-2 w-full">
            <button
              v-if="token.salePrice > 0 && account"
              @click="buyNoun"
              class="mt-4 inline-block rounded bg-red-500 px-8 py-4 font-londrina font-yusei text-3xl leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg"
            >
              {{ $t("TokenSaleOrTrade.buy") }}
            </button>
            <button
              v-else
              class="mt-4 inline-block rounded bg-gray-500 px-8 py-4 font-londrina font-yusei text-3xl leading-tight text-white shadow-md transition duration-150"
              disabled
            >
              {{ $t("TokenSaleOrTrade.buy") }}
            </button>
          </div>
        </div>
        <!-- isSaleBusy -->
        <button
          type="button"
          v-else
          class="inline-block rounded px-8 py-4 leading-tight text-gray-500 shadow-md"
          disabled
        >
          <img
            class="absolute h-4 w-10 animate-spin"
            src="@/assets/red160px.png"
          />
          <span class="ml-10">{{ $t("message.processing") }}</span>
        </button>
      </div>

      <hr class="border-t border-gray-600 my-4 w-full" />

      <p class="mb-2 font-londrina font-yusei text-3xl">
        {{ $t("TokenSaleOrTrade.trade") }}
      </p>
      <p class="mb-2 font-londrina font-yusei text-l">
        {{ $t("TokenSaleOrTrade.tradeDescription") }}
      </p>
      <div>
        <div class="flex justify-center w-full mt-4">
          <div class="flex flex-wrap">
            <div>{{ $t("TokenSaleOrTrade.tradeForPrefecture") }} :</div>
            <div
              v-for="(option, index) in tradeForPrefectures"
              :key="index"
              class="flex items-center mr-4 mb-2"
            >
              <label class="ml-2 font-londrina font-yusei text-l">{{
                $t("prefecture." + option)
              }}</label>
            </div>
          </div>
        </div>
        <MyNounsRadioButton
          v-if="token.isOnTrade && account"
          :myTokens="myTokens"
          :tradeForPrefectures="tradeForPrefectures"
          @updateValues="handleUpdateMyTokens"
        />

        <div v-if="!isTradeBusy">
          <div class="flex justify-center gap-2 w-full">
            <button
              v-if="token.isOnTrade && account"
              @click="tradeNoun"
              class="mt-4 inline-block rounded bg-blue-500 px-8 py-4 font-londrina font-yusei text-3xl leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-blue hover:shadow-lg focus:bg-red-blue focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-blue active:shadow-lg"
            >
              {{ $t("TokenSaleOrTrade.trade") }}
            </button>
            <button
              v-else
              class="mt-4 inline-block rounded bg-gray-500 px-8 py-4 font-londrina font-yusei text-3xl leading-tight text-white shadow-md transition duration-150"
              disabled
            >
              {{ $t("TokenSaleOrTrade.trade") }}
            </button>
          </div>
        </div>
        <!-- end of isTradeBusy -->
        <button
          type="button"
          v-else
          class="inline-block rounded px-8 py-4 leading-tight text-gray-500 shadow-md"
          disabled
        >
          <img
            class="absolute h-4 w-10 animate-spin"
            src="@/assets/red160px.png"
          />
          <span class="ml-10">{{ $t("message.processing") }}</span>
        </button>
      </div>

      <hr class="border-t border-gray-600 my-4 w-full" />
      <button
        @click="closeModal(false)"
        class="mt-4 inline-block rounded bg-green-500 px-6 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
      >
        {{ $t("tokenManagement.close") }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { ethers } from "ethers";
import { getLocalNounsTokenContract } from "@/utils/const";
import { ChainIdMap } from "@/utils/MetaMask";
import TokenDetail from "@/components/TokenDetail.vue";
import InformationDialog from "@/components/InformationDialog.vue";
import MyNounsRadioButton from "@/components/MyNounsRadioButton.vue";
import { prefectureList } from "@/i18n/prefectures";
import { addresses } from "@/utils/addresses";

export default {
  components: {
    TokenDetail,
    InformationDialog,
    MyNounsRadioButton,
  },
  props: {
    network: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    token: {
      type: Object,
      required: true,
    },
    myTokens: {
      type: Array,
      required: true,
    },
  },
  setup(props, context) {
    const store = useStore();
    const i18n = useI18n();

    const account = computed(() => store.state.account);
    // const { token, network } = toRefs(props);
    console.log("myTokens:", props.myTokens);
    console.log("Token:", props.Token);

    const salePrice = ref(""); // 初期値として空文字を設定
    const isSaleBusy = ref(false);
    const isTradeBusy = ref(false);
    const displayInformationDialog = ref(false);
    const informationMessage = ref("");

    const buyNoun = async () => {
      const contract = await getContract(props.network);
      isSaleBusy.value = true;
      try {
        const weiValue = ethers.parseEther(props.token.salePrice.toString());
        const txParams = { value: weiValue };
        const tx = await contract.purchase(
          props.token.tokenId,
          account.value,
          "0x0000000000000000000000000000000000000000",
          txParams,
        );
        const result = await tx.wait();
        console.log("removeSalePrice:tx", result);
        isSaleBusy.value = false;
        informationMessage.value = "TokenSaleOrTrade.finishBuyNoun";
        displayInformationDialog.value = true;
      } catch (e) {
        isSaleBusy.value = false;
        console.error(e);
      }
    };

    const tradeNoun = async () => {
      if (selectedMyTokenId == -1) {
        alert(i18n.t("TokenSaleOrTrade.selectNounForTrade"));
        return;
      }

      const contract = await getContract(props.network);
      isTradeBusy.value = true;
      try {
        const txParams = { value: ethers.parseEther("0.003") };
        const tx = await contract.executeTradeLocalNoun(
          selectedMyTokenId,
          props.token.tokenId,
          txParams,
        );
        await tx.wait();
        isTradeBusy.value = false;
        informationMessage.value = "TokenSaleOrTrade.finishTradeNoun";
        displayInformationDialog.value = true;
      } catch (e) {
        isTradeBusy.value = false;
        console.error(e);
      }
    };

    // 都道府県リストの要素番号からキーに変換
    const tradeForPrefectures = computed(() => {
      const tradeToPrefecture = props.token?.tradeToPrefecture || [];
      return tradeToPrefecture.map((index) => prefectureList[index]);
    });
    let selectedMyTokenId = -1;

    const handleUpdateMyTokens = (tokenId) => {
      selectedMyTokenId = tokenId;
    };

    const closeModal = (reload) => {
      isSaleBusy.value = false;
      isTradeBusy.value = false;
      displayInformationDialog.value = false;
      context.emit("close", reload);
    };

    const getContract = async (network) => {
      const chainId = ChainIdMap[network];
      const signer = await store.getters.getSigner(chainId);

      return getLocalNounsTokenContract(
        addresses["localNounsToken"][network],
        signer,
      );
    };

    return {
      account,
      closeModal,
      salePrice,
      tradeForPrefectures,
      handleUpdateMyTokens,
      isSaleBusy,
      isTradeBusy,
      displayInformationDialog,
      informationMessage,
      buyNoun,
      tradeNoun,
    };
  },
};
</script>
