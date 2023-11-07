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
        {{ $t("tokenManagement.sale") }}
      </p>
      <p class="mb-2 font-londrina font-yusei text-l">
        {{ $t("tokenManagement.saleDescription") }}
      </p>

      <div class="mt-4 flex flex-col items-center">
        <label for="salePrice" class="mb-2 font-londrina font-yusei text-l">
          {{ $t("tokenManagement.setSalePrice") }}
        </label>
        <InformationDialog
          :isOpen="displayInformationDialog"
          :message="informationMessage"
          @close="closeModal(true)"
        />
        <div v-if="!isSaleBusy">
          <div class="flex items-center">
            <input
              id="salePrice"
              v-model="salePrice"
              type="text"
              class="p-2 border-2 border-gray-400 rounded-md"
            />
            <span class="ml-2">ETH</span>
          </div>

          <div class="flex justify-center gap-2 w-full">
            <button
              @click="setSalePrice"
              class="mt-4 inline-block rounded bg-red-500 px-6 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg"
            >
              {{ $t("tokenManagement.setPriceButton") }}
            </button>

            <button
              v-if="token.salePrice > 0"
              @click="removeSalePrice"
              class="mt-4 inline-block rounded bg-red-700 px-6 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-900 hover:shadow-lg focus:bg-red-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-1000 active:shadow-lg"
            >
              {{ $t("tokenManagement.stopSaleButton") }}
            </button>
            <button
              v-else
              class="mt-4 inline-block rounded bg-gray-500 px-6 py-2.5 leading-tight text-white shadow-md transition duration-150"
              disabled
            >
              {{ $t("tokenManagement.stopSaleButton") }}
            </button>
          </div>
        </div>
        <!-- end of isSaleBusy -->
        <button
          type="button"
          v-else
          class="inline-block rounded px-6 py-2.5 leading-tight text-gray-500 shadow-md"
          disabled
        >
          <img
            class="absolute h-3 w-8 animate-spin"
            src="@/assets/red160px.png"
          />
          <span class="ml-10">{{ $t("message.processing") }}</span>
        </button>
      </div>

      <hr class="border-t border-gray-600 my-4 w-full" />

      <p class="mb-2 font-yusei text-3xl">
        {{ $t("tokenManagement.trade") }}
      </p>
      <p class="mb-2 font-londrina font-yusei text-l">
        {{ $t("tokenManagement.tradeDescription") }}
      </p>
      <div>
        <div class="flex justify-center w-full mt-4">
          <PrefecturesCheckbox
            :initialPrefectures="initialPrefectures"
            @updateValues="handleUpdatePrefectures"
          />
        </div>

        <div v-if="!isTradeBusy">
          <div class="flex justify-center gap-2 w-full">
            <button
              @click="setTrade"
              class="mt-4 inline-block rounded bg-blue-500 px-6 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
            >
              {{ $t("tokenManagement.setTradeButton") }}
            </button>

            <button
              v-if="token.isOnTrade"
              @click="stopTrade"
              class="mt-4 inline-block rounded bg-blue-700 px-6 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-900 hover:shadow-lg focus:bg-blue-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-1000 active:shadow-lg"
            >
              {{ $t("tokenManagement.stopTradeButton") }}
            </button>
            <button
              v-else
              class="mt-4 inline-block rounded bg-gray-500 px-6 py-2.5 leading-tight text-white shadow-md transition duration-150"
              disabled
            >
              {{ $t("tokenManagement.stopTradeButton") }}
            </button>
          </div>
        </div>
        <!-- end of isTradeBusy -->
        <button
          type="button"
          v-else
          class="inline-block rounded px-6 py-2.5 leading-tight text-gray-500 shadow-md"
          disabled
        >
          <img
            class="absolute h-3 w-8 animate-spin"
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
import { ref, toRefs, computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { ethers } from "ethers";
import { getLocalNounsTokenContract } from "@/utils/const";
import { ChainIdMap } from "@/utils/MetaMask";
import TokenDetail from "@/components/TokenDetail.vue";
import PrefecturesCheckbox from "@/components/PrefecturesCheckbox.vue";
import InformationDialog from "@/components/InformationDialog.vue";
import { isValidNumber } from "@/utils/validator";
import { addresses } from "@/utils/addresses";

export default {
  components: {
    TokenDetail,
    PrefecturesCheckbox,
    InformationDialog,
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
  },
  setup(props, context) {
    const store = useStore();
    const i18n = useI18n();

    const { token, network } = toRefs(props);
    console.log("tokenManagement-network:", network.value);
    console.log("tokenManagement-token:", token.value);

    const salePrice = ref(""); // 初期値として空文字を設定
    const isSaleBusy = ref(false);
    const isTradeBusy = ref(false);
    const displayInformationDialog = ref(false);
    const informationMessage = ref("");

    const setSalePrice = async () => {
      // 入力チェック
      if (!isValidNumber(salePrice.value)) {
        alert(i18n.t("validator.validNumber"));
        return;
      }

      const contract = await getContract(props.network);
      isSaleBusy.value = true;
      console.log("isSaleBusy", isSaleBusy.value);
      try {
        const weiValue = ethers.parseEther(salePrice.value);
        console.log("weiValue", weiValue);
        const txParams = { value: 0 };
        const tx = await contract.setPriceOf(
          props.token.tokenId,
          weiValue,
          txParams,
        );
        const result = await tx.wait();
        console.log("setSalePrice:tx", result);
        isSaleBusy.value = false;
        informationMessage.value = "tokenManagement.finishSetSalePrice";
        displayInformationDialog.value = true;
      } catch (e) {
        isSaleBusy.value = false;
        console.error(e);
      }
    };

    const removeSalePrice = async () => {
      const contract = await getContract(props.network);
      isSaleBusy.value = true;
      try {
        const txParams = { value: 0 };
        const tx = await contract.setPriceOf(props.token.tokenId, 0, txParams);
        const result = await tx.wait();
        console.log("removeSalePrice:tx", result);
        isSaleBusy.value = false;
        informationMessage.value = "tokenManagement.finishRemoveSalePrice";
        displayInformationDialog.value = true;
      } catch (e) {
        isSaleBusy.value = false;
        console.error(e);
      }
    };

    const initialPrefectures = computed(() => token.value?.tradeToPrefecture);
    let selectedPrefectures = [initialPrefectures.value];

    const setTrade = async () => {
      // 入力チェック
      if (selectedPrefectures.length == 0) {
        alert(i18n.t("tokenManagement.validSelectPrefectures"));
        return;
      }

      const contract = await getContract(props.network);
      // 指定しない(0)は削除
      selectedPrefectures = selectedPrefectures.filter((item) => item != 0);

      isTradeBusy.value = true;
      try {
        const zeroAddress = "0x" + "0".repeat(40);
        const txParams = { value: 0 };
        const tx = await contract.putTradeLocalNoun(
          props.token.tokenId,
          selectedPrefectures,
          zeroAddress, // ここに交換先アドレスを指定することができるが今は使用しない
          txParams,
        );
        const result = await tx.wait();
        console.log("putTradeLocalNoun:tx", result);
        isTradeBusy.value = false;
        informationMessage.value = "tokenManagement.finishSetTrade";
        displayInformationDialog.value = true;
      } catch (e) {
        isTradeBusy.value = false;
        console.error(e);
      }
    };

    const stopTrade = async () => {
      const contract = await getContract(props.network);

      isTradeBusy.value = true;
      try {
        const txParams = { value: 0 };
        const tx = await contract.cancelTradeLocalNoun(
          props.token.tokenId,
          txParams,
        );
        const result = await tx.wait();
        console.log("cancelTradeLocalNoun:tx", result);
        isTradeBusy.value = false;
        informationMessage.value = "tokenManagement.finishStopTrade";
        displayInformationDialog.value = true;
      } catch (e) {
        isTradeBusy.value = false;
        console.error(e);
      }
    };

    const handleUpdatePrefectures = (prefectures) => {
      console.log("handleUpdatePrefectures", prefectures);
      selectedPrefectures = prefectures;
    };

    const closeModal = (reload) => {
      console.log("closeModal-reload", reload);
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
      closeModal,
      salePrice,
      setSalePrice,
      removeSalePrice,
      setTrade,
      stopTrade,
      initialPrefectures,
      handleUpdatePrefectures,
      isSaleBusy,
      isTradeBusy,
      displayInformationDialog,
      informationMessage,
    };
  },
};
</script>
