<template>
  <div class="mx-auto max-w-2xl p-2 text-left font-londrina font-yusei">
    <!-- <div v-if="lang === 'en'"></div>
    <div v-else> -->
    <div class="text-3xl">特定商取引法に基づく表記</div>
    <hr class="border-t border-gray-600 my-4 w-full" />

    <div class="text-2xl">販売事業者</div>
    <div class="mb-8 space-y-2">
      <p>合同会社カラクサ</p>
    </div>
    <div class="text-2xl">代表者</div>
    <div class="mb-8 space-y-2">
      <p>○○ ○○</p>
    </div>
    <div class="text-2xl">所在地</div>
    <div class="mb-8 space-y-2">
      <p>〒763-0081</p>
      <p>香川県丸亀市土器町西１丁目５４０番地３</p>
    </div>
    <div class="text-2xl">お問い合わせ</div>
    <div class="mb-8 space-y-2">
      <p>
        <a
          href="https://discord.com/channels/953897306833432617/991939745255010387"
          target="_blank"
        >
          Nouns DAO JAPAN discord 内 ご当地Nouns チャンネル</a
        >
      </p>
    </div>
    <!-- <div class="text-2xl">ホームページ</div>
    <div class="mb-8 space-y-2">
      <p>
        <a href="https://otaku-coin.com/ja" target="_blank">
          https://otaku-coin.com/ja</a
        >
      </p>
    </div> -->
    <div class="text-2xl">販売価格</div>
    <div class="mb-8 space-y-2">
      <p>
        申込手続きの際に画面に表示されます。消費税は内税として表示しています。
      </p>
    </div>
    <div class="text-2xl">販売価格以外に必要な費用</div>
    <div class="mb-8 space-y-2">
      <p>
        情報端末の購入費、インターネット接続料金、通信料金、Ethereumトランザクション実行手数料（Gas代）等はお客様のご負担になります。
      </p>
    </div>
    <div class="text-2xl">お支払時期及び方法</div>
    <div class="mb-8 space-y-2">
      <p>
        Ethereumによる支払い。申込と同時に支払いが必要です。申込期間を定めております。販売数に上限があるため、申込期間内に申込しても購入できない場合があります。
      </p>
    </div>
    <div class="text-2xl">売買契約の成立</div>
    <div class="mb-8 space-y-2">
      <p>
        Ethereumによる支払いが完了したとき（Ethereumトランザクションが承認されたとき）にご当地NounsのNFTが引き渡されます。
      </p>
      <p>このタイミングで売買契約が成立します。</p>
    </div>
    <div class="text-2xl">返品・キャンセル等</div>
    <div class="mb-8 space-y-2">
      <p>商品の特性上、申込者から申込後の返品／キャンセルはできません。</p>
    </div>
    <div class="text-2xl">必要な機器の仕様、性能・その他必要な条件</div>
    <div class="mb-8 space-y-2">
      <p>
        メタマスク（wallet）が使用可能でご当地Nouns（ERC721トークンなど）を表示可能なブラウザ機能を備えた情報端末及びインターネットへの接続が必要です。
      </p>
    </div>
    <div class="text-2xl">その他</div>
    <div class="mb-8 space-y-2">
      <p>重要事項説明資料をご参照ください。</p>
    </div>
  </div>
  <!-- </div> -->
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "Tokushoho",
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
