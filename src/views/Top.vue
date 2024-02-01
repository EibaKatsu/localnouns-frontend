<template>
  <div class="mx-auto p-2 mb-200 text-center font-londrina font-yusei">
    <img src="/banner_t4.gif" class="mb-8 mt-8 w-full md:w-4/5 mx-auto" />
    <div v-if="lang === 'en'">
      <div class="text-3xl">
        <p>Someone else's miss</p>
        <p>become</p>
        <p>Someone else's hit</p>
      </div>
      <img
        class="h-3 w-8 animate-spin mx-auto mt-8 mb-8"
        src="@/assets/red160px.png"
      />
      <div class="mt-8 mb-8 text-8xl">
        <p>Local Nouns</p>
      </div>
      <img
        class="h-3 w-8 animate-spin mx-auto mt-8 mb-8"
        src="@/assets/red160px.png"
      />
      <div class="mt-8 mb-16 text-3xl">
        <p>Love for the local community</p>
        <p>Exchangeable</p>
        <p>Full On-Chain</p>
      </div>

      <div class="mt-8 mb-8">
        <button
          class="inline-block rounded bg-green-600 px-6 py-2.5 leading-tight text-white text-3xl shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
        >
          <router-link :to="localizedUrl('/mint')"> >>> Mint Page</router-link>
        </button>
      </div>
      <div class="mt-8 mb-8">
        <button
          class="inline-block rounded bg-green-600 px-6 py-2.5 leading-tight text-white text-3xl shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
        >
          <router-link :to="localizedUrl('/list/0')">
            >>> Marketplace</router-link
          >
        </button>
      </div>
      <div>
        <p class="mt-8 mb-2 text-5xl">WTF?</p>
        <p class="text-xl">
          Local Nouns is a NFT with full-on chain of dots depicting famous
          places and specialties from all over Japan!
        </p>
        <p class="mt-2 text-xl">
          If you get a Nouns of your locality, you win, of course!
        </p>
        <p class="mt-2 text-xl">
          If you get a Nouns from an unfamiliar locality, it will be a winner
          for someone else!
        </p>
        <p class="mt-2 mb-2 text-xl underline">
          <router-link :to="localizedUrl('/about')"> >>> more...</router-link>
        </p>
      </div>
    </div>
    <div v-else>
      <div class="text-3xl">
        <p>誰かのハズレが 誰かの当たり</p>
      </div>
      <img
        class="h-3 w-8 animate-spin mx-auto mt-8 mb-8"
        src="@/assets/red160px.png"
      />
      <div class="mt-8 mb-8 text-8xl">
        <p>ご当地Nouns</p>
      </div>
      <img
        class="h-3 w-8 animate-spin mx-auto mt-8 mb-8"
        src="@/assets/red160px.png"
      />
      <div class="mt-8 mb-16 text-3xl">
        <p>郷土愛・交換可能・フルオンチェーン</p>
      </div>
      <div class="mt-8 mb-8">
        <button
          class="inline-block rounded bg-green-600 px-6 py-2.5 leading-tight text-white text-3xl shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
        >
          <router-link :to="localizedUrl('/mint')">
            >>> ミントページ</router-link
          >
        </button>
      </div>
      <div class="mt-8 mb-8">
        <button
          class="inline-block rounded bg-green-600 px-6 py-2.5 leading-tight text-white text-3xl shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
        >
          <router-link :to="localizedUrl('/list/0')">
            >>> マーケット</router-link
          >
        </button>
      </div>
      <div>
        <p class="mt-16 mb-2 text-5xl">WTF?</p>
        <p class="text-xl">
          ご当地Nounsは日本各地の名所や特産品をフルオンチェーンのドット絵で表現した、交換できるNFT
        </p>
        <p class="mt-2 text-xl">自分のご当地のNounsが出ればもちろん当たり!</p>
        <p class="mt-2 text-xl">
          縁遠いご当地のNounsが出たら、それは別の誰かの当たり!
        </p>
        <p class="mt-2 text-2xl">さぁ、交換しよう!!</p>
        <p class="mt-2 mb-2 text-xl underline">
          <router-link :to="localizedUrl('/about')"> >>> more...</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "Top",
  setup() {
    const i18n = useI18n();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    return {
      lang,
    };
  },
});
</script>
