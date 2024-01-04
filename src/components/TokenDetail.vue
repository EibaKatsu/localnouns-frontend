<template>
  <div>
    <!-- For Token View -->
    <div v-if="size == 'L'" class="flex flex-col justify-center items-center">
      <div>
        <svg v-html="token.svg" style="width: 320px; height: 320px" mx-4></svg>
      </div>
      <div class="mb-2 font-yusei text-3xl">
        #{{ token.tokenId }}, {{ $t("prefecture." + token.prefecture) }}
      </div>
      <div class="mb-2 font-londrina font-yusei text-2xl relative mx-4">
        {{ token.head }}
      </div>
      <div class="mb-2 font-londrina font-yusei relative text-left mx-4">
        {{ token.headDescription }}
      </div>
      <div class="mb-2 font-londrina font-yusei text-2xl relative mx-4">
        {{ token.accessory }}
      </div>
      <div class="mb-2 font-londrina font-yusei relative text-left mx-4">
        {{ token.accessoryDescription }}
      </div>
    </div>

    <!-- For List thumbnail -->
    <div v-if="size == 'S'" class="flex flex-col justify-center items-center">
      <div>
        <svg v-html="token.svg" style="width: 100%; height: auto"></svg>
      </div>

      <div class="mb-0 font-londrina font-yusei text-xl">
        #{{ token.tokenId }}, {{ $t("prefecture." + token.prefecture) }}
      </div>
      <div class="mb-0 font-londrina font-yusei">
        {{ token.head }}
      </div>
      <div class="mb-2 font-londrina font-yusei">
        {{ token.accessory }}
      </div>
    </div>

    <!-- For AllNouns -->
    <div v-if="size == 'SS'" class="flex flex-col justify-center items-center">
      <div>
        <img :src="imagePath" style="width: 100%; height: auto" />
      </div>

      <div class="mb-0 font-londrina font-yusei text-xl">
        #{{ token.tokenId }}, {{ $t("prefecture." + token.prefecture) }}
      </div>
      <div class="mb-0 font-londrina font-yusei">
        {{ token.head }}
      </div>
      <div class="mb-2 font-londrina font-yusei">
        {{ token.accessory }}
      </div>
    </div>

    <!-- Common View -->
    <div
      v-if="size != 'SS'"
      class="flex justify-center gap-2 w-full font-londrina font-yusei text-xl"
    >
      <div>
        <button
          v-if="token.salePrice > 0"
          class="inline-block rounded bg-red-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-1 my-2"
        >
          {{ $t("list.onSale") }}
        </button>
        <button
          v-else
          class="inline-block rounded bg-gray-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-1 my-2"
        >
          {{ $t("list.onSale") }}
        </button>
      </div>
      <div>
        <button
          v-if="token.isOnTrade"
          class="inline-block rounded bg-blue-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-1 my-2"
        >
          {{ $t("list.onTrade") }}
        </button>
        <button
          v-else
          class="inline-block rounded bg-gray-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-1 my-2"
        >
          {{ $t("list.onTrade") }}
        </button>
      </div>
    </div>
    <p v-if="token.salePrice > 0" class="mb-2 font-londrina font-yusei text-xl">
      {{ token.salePrice }} ETH
    </p>
    <div v-if="token.isOnTrade" class="mb-2 font-londrina font-yusei text-sm">
      [{{ $t("TokenSaleOrTrade.tradeForPrefecture") }}]
      <div class="text-center">
        {{
          token.tradeToPrefecture
            .map((option) => $t("prefecture." + prefectureList[option]))
            .join(", ")
        }}
      </div>
    </div>
  </div>

  <!-- For Token View -->
  <div v-if="size == 'L'">
    <p class="mb-2 font-londrina font-yusei">
      {{ $t("tokenDetail.owner") }} : {{ token.holder }}
    </p>
    <a
      v-if="OpenSeaPath"
      :href="OpenSeaPath"
      target="_blank"
      class="font-londrina font-yusei text-sm"
      >Opensea</a
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TOKEN } from "@/firestore/const";
import { getAddresses } from "@/utils/const";
import { prefectureList } from "@/i18n/prefectures";

export default defineComponent({
  props: {
    token: {
      type: Object as () => TOKEN,
      required: true,
    },
    size: {
      type: String,
      required: false,
    },
    network: {
      type: String,
      required: false,
    },
    tokenAddress: {
      type: String,
      required: false,
    },
  },
  name: "TokenDetail",
  setup(props) {
    let OpenSeaPath = "";
    const strNetwork: string = props.network ? props.network : "";
    const strTokenAddress: string = props.tokenAddress
      ? props.tokenAddress
      : "";
    if (strNetwork && strTokenAddress) {
      const { OpenSeaBase } = getAddresses(strNetwork, strTokenAddress);
      OpenSeaPath =
        OpenSeaBase + "/" + props.tokenAddress + "/" + props.token.tokenId;
    }
    const imagePath = "/images/" + props.token.tokenId + ".svg";

    return {
      OpenSeaPath,
      prefectureList,
      imagePath,
    };
  },
});
</script>
