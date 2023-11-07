<template>
  <div class="mx-auto max-w-2xl p-2 text-left">
    <div v-if="lang === 'en'">
      <p class="mb-2 font-londrina text-3xl">About</p>
      <div class="mb-8 space-y-2 font-pt-root font-medium">
        <p></p>
      </div>
    </div>
    <div v-else>
      <p class="font-yusei text-3xl">
        Nouns✕郷土愛＝地方活性、そして人のつながり
      </p>
      <div class="mb-8 space-y-2">
        <p>
          日本に在住している方の中でもこの各都道府県Nounsを見て
          「あ、この都道府県ってこういうカタチだったんだ」と気づくことがあるかと思います。
          「知ること」は「愛すること」に繋がります。
        </p>
        <p>
          このNouns、そして郷土愛を通して日本の地方のさらなる活性化につなげたいと思っています。
          出身地、住んでるところ、単に可愛いから、理由は何でもいいのですがこのご当地Nounsを
          PFPにすることでSNSにおけるさらなる人と人のつながりに繋がります。
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "HomePage",
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
