<template>
  <div class="mx-auto max-w-2xl p-2 text-left font-londrina font-yusei">
    <!-- <div v-if="lang === 'en'"></div>
    <div v-else> -->
    <div class="text-3xl">重要事項説明資料</div>
    <div class="mb-8 space-y-2">
      <p>
        この資料は、お客様がご当地Nounsをご購入いただくに当たり、特に留意いただきたい事項を記載したものです。その他遵守すべき事項及び権利義務関係は利用規約をご確認ください。
      </p>
    </div>
    <hr class="border-t border-gray-600 my-4 w-full" />

    <div class="text-2xl">ユーティリティ・ロードマップ</div>
    <div class="mb-8 space-y-2">
      <p>ご当地Nounsはノーユーティリティ・ノーロードマップです。</p>
    </div>

    <div class="text-2xl">独自マーケットプレイス</div>
    <div class="mb-8 space-y-2">
      <p>ご当地Nounsは独自マーケットプレイス(本サイト)を提供します。</p>
      <p>
        Openseaなど他の共通マーケットプレイスではNFTを見ることはできますが、取引できません。
      </p>
    </div>

    <div class="text-2xl">CC0</div>
    <div class="mb-8 space-y-2">
      <p>
        本家NounsDAOと同様にCC0(Creative Commons
        Zero)のパブリックドメインのため、誰でも自由に使用することが出来、それにより営利を得ることが可能です。
      </p>
      <p>
        ご当地Nounsの使用によって損害が発生した場合、当組合に故意又は重過失ある場合を除き、当組合は一切の責任を負いません。
      </p>
    </div>

    <div class="text-2xl">今後の販売計画</div>
    <div class="mb-8 space-y-2">
      <p>初期販売では1,500体を上限に販売いたします。</p>
      <p>
        今後、新しいパーツやお城・武将などの限定バージョンの販売を予定しています。
      </p>
    </div>
  </div>
  <!-- </div> -->
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "Terms",
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
