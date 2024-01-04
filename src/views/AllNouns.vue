<template>
  <div class="mx-auto max-w-lg text-left">
    <p class="font-londrina font-yusei text-xl">
      {{ $t("allNouns.description") }}
    </p>
    <p class="mb-2 font-londrina font-yusei text-sm text-right">
      ({{ $t("allNouns.created") }} : {{ displayTime }})
    </p>
  </div>
  <div class="px-5 py-1 flex flex-col items-center justify-center mx-5">
    <NounsMap :groupedByPrefecture="groupedByPrefecture" />
    <p class="mb-2 font-londrina font-yusei text-2xl text-center">
      {{ $t("allNouns.total") }} : {{ tokens.length }} Nouns
    </p>
    <div
      v-for="tokenGroup in groupedByPrefecture"
      :key="tokenGroup.key"
      class="px-2 py-1 flex flex-col items-left justify-center"
    >
      <hr class="border-t border-gray-600 my-4 w-full" />
      <div class="flex flex-wrap items-center mx-10">
        <span class="mb-2 font-londrina font-yusei text-3xl text-left mx-10">
          {{ $t("prefecture." + tokenGroup[0].prefecture) }}({{
            tokenGroup.length
          }})
        </span>
        <router-link
          :to="localizedUrl('/list/' + tokenGroup[0].prefectureId)"
          class="mb-2 font-londrina font-yusei text-left mx-10"
        >
          >>> {{ $t("allNouns.toList") }}</router-link
        >
      </div>
      <div
        class="grid w-screen grid-cols-2 place-content-center items-center gap-2 sm:grid-cols-5"
      >
        <div
          v-for="token in tokenGroup"
          :key="token.key"
          class="px-2 py-1 flex flex-col items-center justify-center"
        >
          <div class="items-center justify-center">
            <TokenDetail :token="token" size="SS" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import TokenDetail from "@/components/TokenDetail.vue";
import NounsMap from "@/components/NounsMap.vue";
import { TOKEN } from "@/firestore/const";
import { createdTime, tokenInfo_ja, tokenInfo_en } from "@/utils/allNouns";

export default defineComponent({
  name: "AllNouns",
  components: {
    TokenDetail,
    NounsMap,
  },
  async setup() {
    const i18n = useI18n();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    // langが変更されたらgetTokenListを実行するウォッチャー
    watch(lang, async (newLang, oldLang) => {
      if (newLang !== oldLang) {
        getTokenList();
      }
    });

    const displayTime = ref("");

    const tokens = ref<TOKEN[]>([]);
    const getTokenList = async () => {
      if (lang.value == "ja") {
        tokens.value = tokenInfo_ja;
        displayTime.value = new Intl.DateTimeFormat("ja-JP").format(
          new Date(createdTime),
        );
      } else {
        tokens.value = tokenInfo_en;
        displayTime.value = new Intl.DateTimeFormat("en-US").format(
          new Date(createdTime),
        );
      }
    };
    getTokenList();

    // トークンを都道府県IDでグループ化するcomputedプロパティ
    const groupedByPrefecture = computed(() => {
      // 最初にtokensをtokenIdでソート
      const sortedTokens = [...tokens.value].sort((a, b) => {
        return Number(a.tokenId) - Number(b.tokenId);
      });

      const groups = sortedTokens.reduce((acc: any, token) => {
        // prefectureIdをキーとする
        const key = token.prefectureId;
        if (!acc[key]) {
          // キーが存在しなければ、新しい配列を作成
          acc[key] = [];
        }
        // トークンをキーに対応する配列に追加
        acc[key].push(token);
        return acc;
      }, {}); // 初期値は空のオブジェクト
      return groups;
    });

    return {
      lang,
      groupedByPrefecture,
      tokens,
      getTokenList,
      displayTime,
    };
  },
});
</script>
