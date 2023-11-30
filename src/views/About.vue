<template>
  <div class="mx-auto max-w-2xl p-2 text-left">
    <div v-if="lang === 'en'">
      <div class="font-yusei text-3xl">What are local Nouns?</div>
      <div class="mb-8 space-y-2">
        <p>
          Local Nouns are NFTs that represent famous places and specialty
          products from all over Japan with full-on chain pixel art. By making a
          character from one's hometown or place of memories into one's own PFP,
          one can deepen one's attachment to that hometown and create
          connections with people from the same hometown or those who have
          visited on a trip.
        </p>
        <p>
          In the first round, we created three heads and three accessories for
          each prefecture. Combine this with Nouns parts. There are
          approximately 530,000 combination patterns (3 heads * 3 accessories) *
          47 prefectures * 30 glasses * 21 bodies * 2 backgrounds, but 1,500
          will be issued in the first edition.
        </p>
        <p>
          Local Nouns has no roadmap and no utility, but like the original
          NounsDAO, it is in the CC0 (Creative Commons Zero) public domain, so
          anyone can use it freely, and there is no problem with profiting from
          it. Future developments are unknown.
        </p>
      </div>

      <div class="font-yusei text-3xl">mint sale</div>
      <div class="mb-8 space-y-2">
        <p>
          Local Nouns will start a mint sale from December 9, 2023 with a limit
          of 1,500 pieces. If you mint by specifying a prefecture, the cost is
          0.03 ETH per item, and if you mint randomly without specifying a
          prefecture, the cost is 0.01 ETH.
        </p>
        <p class="font-yusei text-xl">✅Pre-sale</p>
        <p>
          On December 9th, mints will only be available to addresses that own
          the following NFTs.
        </p>
        <ul>
          <li>- NounsDAOJapan PFP</li>
          <li>- NounsDAOJapan POAP</li>
          <li>- NounishCNP</li>
          <li>- pNouns NFT</li>
        </ul>
        <p class="font-yusei text-xl">✅Public sale</p>
        <p>
          After the presale ends, anyone can purchase it. The mint will end as
          soon as the maximum number of 1,500 bodies is reached.
        </p>
        <p>
          There is no limit to the number of items per address, but you can mint
          up to 5 items at once in one operation.
        </p>
      </div>

      <div class="font-yusei text-3xl">Special marketplace</div>
      <div class="mb-8 space-y-2">
        <p>
          Normally NFTs are traded on common marketplaces such as Opensea, but
          Local Nouns provides its own marketplace (this site, hereinafter
          referred to as Makepre) so that you can enjoy its worldview.
        </p>
        <p>
          ※ You can view NFTs on other common marketplaces such as Opensea, but
          you cannot trade them. (This site, hereinafter referred to as
          Makepre).
        </p>
        <p>
          On Makepre, you can view minted local Nouns by prefecture. The
          descriptions of the parts of each local Nouns are registered by
          volunteers of NounsDaoJapan. Please enjoy it with the artwork.
        </p>
        <p class="font-yusei text-xl">✅P2P sale</p>
        <p>
          Local Nouns conducts sales transactions between individuals using
          smart contracts. If you set a sales price for the local Noun you want
          to sell, that Noun will be listed and can be traded, and the
          transaction will be completed when someone who wants to buy it at that
          sales price agrees to the transaction.
        </p>
        <p>
          When a transaction is completed, 10% of the transaction price is
          transferred to the operator, and the remaining 90% is transferred to
          the seller using a smart contract.
        </p>
        <p>
          *Separate gas fees are required when setting sales prices and making
          transactions.
        </p>
        <p class="font-yusei text-xl">✅P2P trade</p>
        <p>
          P2P trading is the exchange of local Nouns held by oneself with local
          Nouns held by others. P2P trading will also be carried out using smart
          contracts.
        </p>
        <p>
          If you list the local Noun you want to exchange as an exchange
          request, that local Noun will be available for exchange. At the time
          of selection, it is possible to select the prefecture to be exchanged.
        </p>
        <p>
          Another Local Noun holder can select and exchange that Local Noun with
          their own Local Noun.
        </p>
        <p>
          When an exchange transaction is completed, a 0.003 ETH fee will be
          charged to the party who accepted the exchange.
        </p>
        <p>
          *A separate gas fee will be required when you wish to exchange or
          perform an exchange transaction.
        </p>
      </div>
    </div>
    <div v-else>
      <div class="font-yusei text-3xl">ご当地Nounsとは</div>
      <div class="mb-8 space-y-2">
        <p>
          ご当地Nounsは日本各地の名所や特産品をフルオンチェーンのドット絵で表現したNFTです。
          ふるさとや思い出の地のキャラクターを自らのPFPにすることで、その郷土への愛着も深まりますし、また同郷の方や旅行で訪れた方との繋がりを創出します。
        </p>
        <p>
          第一弾では都道府県ごとに3つのヘッドと3つのアクセサリを制作しました。これをNounsのパーツ類と組み合わせます。組み合わせパターンは、(
          3ヘッド * 3アクセサリ ) * 47都道府県 * 30メガネ * 21ボディ * 2背景 =
          約53万通りになりますが、第一弾では1,500体を発行します。
        </p>
        <p>
          ご当地Nounsはノーロードマップ・ノーユーティリティですが、本家NounsDAOと同様にCC0(Creative
          Commons
          Zero)のパブリックドメインのため、誰でも自由に使用することが出来、それにより営利を得てもまったく問題ありません。今後の展開は未知数です。
        </p>
      </div>

      <div class="font-yusei text-3xl">ミントセール</div>
      <div class="mb-8 space-y-2">
        <p>
          ご当地Nounsは、2023年12月9日から1,500体を上限にミントセールを開始します。
          都道府県を指定してミントする場合は1体あたり0.03ETH、都道府県を指定せずにランダムミントする場合は0.01ETHです。
        </p>
        <p class="font-yusei text-xl">✅プリセール</p>
        <p>12月9日は、以下のNFTを保有しているアドレスでのみミント可能です。</p>
        <ul>
          <li>- NounsDAOJapan PFP</li>
          <li>- NounsDAOJapan POAP</li>
          <li>- NounishCNP</li>
          <li>- pNouns NFT</li>
        </ul>
        <p class="font-yusei text-xl">✅パブリックセール</p>
        <p>
          プリセール終了後は誰でも購入可能になります。
          上限数1,500体に到達次第、ミントは終了となります。
        </p>
        <p>
          アドレスごとで個数制限はありませんが、1回の操作で最大5体まで一括でミント可能です。
        </p>
      </div>

      <div class="font-yusei text-3xl">独自マーケットプレイス</div>
      <div class="mb-8 space-y-2">
        <p>
          通常のNFTはOpenseaなどの共通マーケットプレイスで取引しますが、ご当地Nounsは、その世界観を楽しんでいただくために独自マーケットプレイス(本サイト。以降、マケプレ)を提供します。
        </p>
        <p>
          ※
          Openseaなど他の共通マーケットプレイスではNFTを見ることはできますが、取引できません。
        </p>
        <p>
          マケプレでは、ミントされたご当地Nounsを都道府県ごとに閲覧することができます。個々のご当地Nounsのパーツの説明は、NounsDaoJapanの有志によって登録されたものです。アートワークと共にお楽しみください。
        </p>
        <p class="font-yusei text-xl">✅P2Pセール</p>
        <p>
          ご当地Nounsは個人間の売買取引をスマートコントラクトで実施します。
          販売したいご当地Nounに販売価格をセットすると、そのNounはリストされ取引可能になり、その販売価格で購入したい他者が取引に応じると成立します。
        </p>
        <p>
          取引が成立した際には、取引価格のうち10%が運営、残り90%が販売者へ、スマートコントラクトで送金されます。
        </p>
        <p>※ 販売価格セット時、取引時には別途ガス代が必要になります。</p>
        <p class="font-yusei text-xl">✅P2Pトレード</p>
        <p>
          P2Pトレードとは自分の保持するご当地Nounと他者の保持するご当地Nounを交換することです。P2Pトレードもスマートコントラクトで実施します。
        </p>
        <p>
          交換したいご当地Nounを交換希望にリストすると、そのご当地Nounは交換可能になります。選択時に交換対象の都道府県を選択することが可能です。
        </p>
        <p>
          別のご当地Noun保有者が、そのご当地Nounと自らのご当地Nounを選んで交換することができます。
        </p>
        <p>
          交換の取引が成立した際には、交換に応じた側に0.003ETH手数料がかかります。
        </p>
        <p>※ 交換希望時、交換取引時には別途ガス代が必要になります。</p>
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
