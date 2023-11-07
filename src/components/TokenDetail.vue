<template>
  <!-- For List thumbnail -->
  <div v-if="size == 'L'">
    <div class="flex flex-col justify-center items-center">
      <div>
        <svg v-html="token.svg" style="width: 320px; height: 320px"></svg>
      </div>
      <div class="mb-2 font-yusei text-3xl">
        #{{ token.tokenId }}, {{ $t("prefecture." + token.prefecture) }}
      </div>
      <div class="mb-2 font-londrina font-yusei text-2xl relative z-10">
        {{ token.head }}
      </div>
      <div class="mb-2 font-londrina font-yusei relative z-10 text-left">
        {{ token.headDescription }}
      </div>
      <div class="mb-2 font-londrina font-yusei text-2xl relative z-10">
        {{ token.accessory }}
      </div>
      <div class="mb-2 font-londrina font-yusei relative z-10 text-left">
        {{ token.accessoryDescription }}
      </div>
    </div>
  </div>
  <!-- For Token View -->
  <div v-if="size == 'S'">
    <div class="flex flex-col justify-center items-center">
      <svg v-html="token.svg" style="width: 80%; height: auto"></svg>
    </div>

    <div class="mb-2 font-londrina font-yusei text-xl">
      #{{ token.tokenId }}, {{ $t("prefecture." + token.prefecture) }}
    </div>
    <div class="mb-2 font-londrina font-yusei">
      {{ token.head }}
    </div>
    <div class="mb-2 font-londrina font-yusei">
      {{ token.accessory }}
    </div>
  </div>

  <!-- Common View -->
  <div>
    <div
      class="flex justify-center gap-2 w-full font-londrina font-yusei text-xl"
    >
      <div>
        <button
          v-if="token.salePrice > 0"
          class="inline-block rounded bg-red-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-1 my-2"
          disabled
        >
          {{ $t("list.onSale") }}
        </button>
        <button
          v-else
          class="inline-block rounded bg-gray-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-1 my-2"
          disabled
        >
          {{ $t("list.onSale") }}
        </button>
      </div>
      <div>
        <button
          v-if="token.isOnTrade"
          class="inline-block rounded bg-blue-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-1 my-2"
          disabled
        >
          {{ $t("list.onTrade") }}
        </button>
        <button
          v-else
          class="inline-block rounded bg-gray-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 mx-1 my-2"
          disabled
        >
          {{ $t("list.onTrade") }}
        </button>
      </div>
    </div>
    <p v-if="token.salePrice > 0" class="mb-2 font-londrina font-yusei text-xl">
      {{ token.salePrice }} ETH
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TOKEN } from "@/firestore/const";

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
  },
  name: "TokenDetail",
  setup() {},
});
</script>
