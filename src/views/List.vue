<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <p class="mb-2 font-londrina font-yusei text-xl">
      {{ $t("list.description") }}
    </p>
    <p class="mb-2 font-londrina font-yusei text-sm text-right">
      <router-link :to="localizedUrl('/allnouns')">
        >>> {{ $t("list.goToAllnouns") }}</router-link
      >
    </p>
  </div>

  <!-- 検索条件 -->
  <div>
    <span class="ml-2 font-londrina font-yusei text-xl">
      <label class="flex items-center">
        <ListFilterType
          class="mx-2 my-1"
          v-model="filterType"
          @change="getTokenList"
        />

        <Prefectures
          v-if="filterType == 'prefecture'"
          class="ml-2 mx-2 my-1"
          :notIncludeNotSpecified="true"
          :initialPrefecture="initialPrefecture"
          v-model="selectedPrefecture"
          @change="getTokenList"
        />
      </label>
    </span>
  </div>

  <div
    v-if="!account && filterType == 'myNouns'"
    class="mb-2 font-londrina font-yusei text-2xl text-center"
  >
    {{ $t("list.connectWallet") }}
  </div>

  <div
    v-if="filterType != 'prefecture'"
    class="px-5 py-1 flex flex-col items-center justify-center mx-5"
  >
    <hr class="border-t border-gray-600 my-4 w-full" />
    <NounsMap :groupedByPrefecture="groupedByPrefecture" />
    <p class="mb-2 font-londrina font-yusei text-2xl text-center">
      {{ $t("owner.total") }} : {{ tokensForDisplay.length }} Noun(s) /
      {{ Object.keys(groupedByPrefecture).length }}
      {{ $t("owner.prefectures") }}
    </p>
  </div>
  <div
    v-for="tokenGroup in groupedByPrefecture"
    :key="tokenGroup.key"
    class="px-2 py-1 flex flex-col items-left justify-center"
  >
    <hr class="border-t border-gray-600 my-4 w-full" />
    <p class="mb-2 font-londrina font-yusei text-3xl text-left mx-10">
      {{ $t("prefecture." + tokenGroup[0].prefecture) }}({{
        tokenGroup.length
      }})
    </p>

    <div
      class="grid w-screen grid-cols-2 place-content-center items-center gap-2 sm:grid-cols-5"
    >
      <div
        v-for="token in tokenGroup"
        :key="token.key"
        class="px-2 py-6 flex flex-col items-center justify-center"
      >
        <div
          @click="showTokenModal(token)"
          class="cursor-pointer items-center justify-center"
        >
          <TokenDetail :token="token" size="S" />
        </div>

        <span
          v-if="token.holder.toLowerCase() == account"
          class="ml-2 font-londrina font-yusei text-xl"
        >
          <button
            class="inline-block rounded bg-green-500 w-20 px-1 py-2.5 leading-tight text-white shadow-md transition duration-150 my-2"
          >
            {{ $t("list.manage") }}
          </button>
        </span>
      </div>

      <TokenManagement
        v-if="selectedToken"
        :network="network"
        :tokenAddress="tokenAddress"
        :isOpen="isManagementModalOpen"
        :token="selectedToken"
        @close="closeTokenModal"
      />

      <TokenSaleOrTrade
        v-if="selectedToken"
        :network="network"
        :tokenAddress="tokenAddress"
        :isOpen="isSaleOrTradeModalOpen"
        :token="selectedToken"
        :myTokens="myTokens"
        @close="closeTokenModal"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { getDocs, collection, query, where, Query } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Prefectures from "@/components/Prefectures.vue";
import ListFilterType from "@/components/ListFilterType.vue";
import TokenDetail from "@/components/TokenDetail.vue";
import TokenManagement from "@/components/TokenManagement.vue";
import TokenSaleOrTrade from "@/components/TokenSaleOrTrade.vue";
import NounsMap from "@/components/NounsMap.vue";
import { prefectureList } from "@/i18n/prefectures";
import { TOKEN } from "@/firestore/const";
import { getPartsNameAndDescription } from "@/utils/partsDataUtil";
import { getTokenListForTest } from "@/utils/testData";
import { ADMINISTRATORS_ADDRESS } from "@/config/project";

export default defineComponent({
  props: {
    network: {
      type: String,
      required: true,
    },
    tokenAddress: {
      type: String,
      required: true,
    },
    test: {
      type: Boolean,
      required: false,
    },
  },
  name: "List",
  components: {
    Prefectures,
    ListFilterType,
    TokenDetail,
    TokenManagement,
    TokenSaleOrTrade,
    NounsMap,
  },
  async setup(props) {
    const store = useStore();
    const i18n = useI18n();
    const route = useRoute();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    // langが変更されたらgetTokenListを実行するウォッチャー
    watch(lang, async (newLang, oldLang) => {
      if (newLang !== oldLang) {
        getTokenList();
      }
    });
    const myTokens = ref<TOKEN[]>([]);
    const getMyTokenList = async (account: string) => {
      if (!props.test) {
        let tokenQuery: Query<TOKEN> = collection(
          db,
          tokenCollectionPath + "/tokens",
        ) as Query<TOKEN>;
        if (account) {
          tokenQuery = query(tokenQuery, where("holder", "==", account));
          try {
            const results = await getDocs(tokenQuery);
            myTokens.value = results.docs.map((doc) => {
              return doc.data();
            });
          } catch (e) {
            console.error("getMyTokenList", e);
          }
        }
      } else {
        // for test
        tokens.value = getTokenListForTest();
      }
    };

    let beforeAccount = "";
    const account = computed(() => {
      if (beforeAccount != store.state.account && store.state.account) {
        getMyTokenList(store.state.account);
        beforeAccount = store.state.account;
      }
      return store.state.account;
    });

    let initialPrefecture: number = 0;
    // パラメタでidが指定されていればその都道府県を指定
    let id: number;
    console.log("route.params.id", route.params.id);
    if (Array.isArray(route.params.id)) {
      id = parseInt(route.params.id[0]);
    } else {
      id = parseInt(route.params.id);
    }
    if (id != 0) {
      initialPrefecture = id;
    } else {
      // 表示する都道府県をランダムに設定
      initialPrefecture = new Date().getSeconds() % 47;
    }
    const selectedPrefecture = ref(initialPrefecture);

    console.log("selectedPrefecture.value ", selectedPrefecture.value);
    const selectedSortOrder = ref("newer");
    const filterType = ref("prefecture");
    const isManagementModalOpen = ref(false);
    const isSaleOrTradeModalOpen = ref(false);

    const getPartsName = async (tokens: TOKEN[]) => {
      // パーツ名を取得
      for (const token of tokens) {
        const accessoryName = getPartsNameAndDescription(
          "Accessories",
          `${token.prefecture.toLowerCase()}-${token.accessory.toLowerCase()}`,
          lang.value,
        );
        if (accessoryName) {
          token.accessory = accessoryName.name;
          token.accessoryDescription = accessoryName.description;
          if (accessoryName.author) {
            token.accessoryDescription += " (" + accessoryName.author + ")";
          }
        }

        const headName = getPartsNameAndDescription(
          "Heads",
          `${token.prefecture.toLowerCase()}-${token.head.toLowerCase()}`,
          lang.value,
        );
        if (headName) {
          token.head = headName.name;
          token.headDescription = headName.description;
          if (headName.author) {
            token.headDescription += " (" + headName.author + ")";
          }
        }
      }
    };

    const filterTokenByCriteria = () => {
      tokensForDisplay.value = tokens.value;

      switch (selectedSortOrder.value) {
        case "newer":
          tokensForDisplay.value.sort(
            (a, b) => Number(b.tokenId) - Number(a.tokenId),
          );
          break;
        case "older":
          tokensForDisplay.value.sort(
            (a, b) => Number(a.tokenId) - Number(b.tokenId),
          );
          break;
        case "lower":
          tokensForDisplay.value.sort((a, b) => a.salePrice - b.salePrice);
          break;
        case "higher":
          tokensForDisplay.value.sort((a, b) => b.salePrice - a.salePrice);
          break;
      }
    };

    const tokenCollectionPath = `/${props.network}/${props.tokenAddress}`;
    const tokens = ref<TOKEN[]>([]);
    const tokensForDisplay = ref<TOKEN[]>([]);
    const getTokenList = async () => {
      if (!props.test) {
        let tokenQuery: Query<TOKEN> = collection(
          db,
          tokenCollectionPath + "/tokens",
        ) as Query<TOKEN>;

        if (filterType.value == "onSale") {
          tokenQuery = query(tokenQuery, where("salePrice", ">", 0));
        } else if (filterType.value == "onTrade") {
          tokenQuery = query(tokenQuery, where("isOnTrade", "==", true));
        } else if (filterType.value == "myNouns") {
          tokenQuery = query(tokenQuery, where("holder", "==", account.value));
        } else if (filterType.value == "admins") {
          tokenQuery = query(
            tokenQuery,
            where("holder", "==", ADMINISTRATORS_ADDRESS.toLowerCase()),
          );
        } else {
          tokenQuery = query(
            tokenQuery,
            where("prefecture", "==", prefectureList[selectedPrefecture.value]),
          );
        }

        try {
          const results = await getDocs(tokenQuery);
          tokens.value = results.docs.map((doc) => {
            return doc.data();
          });
        } catch (e) {
          console.error("getTokenList", e);
        }
      } else {
        // for test
        tokens.value = getTokenListForTest();
      }
      filterTokenByCriteria();
      getPartsName(tokens.value);
    };
    getTokenList();

    // トークンを都道府県IDでグループ化するcomputedプロパティ
    const groupedByPrefecture = computed(() => {
      // 最初にtokensをtokenIdでソート
      const sortedTokens = [...tokensForDisplay.value].sort((a, b) => {
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

    const selectedToken = ref<TOKEN | null>(null);

    // 保有していたら管理用モーダル、そうでない場合はP2P用
    const showTokenModal = (token: TOKEN) => {
      selectedToken.value = token;
      if (!account.value || token.holder != account.value.toLowerCase()) {
        isSaleOrTradeModalOpen.value = true;
      } else {
        isManagementModalOpen.value = true;
      }
    };

    const closeTokenModal = (reload: boolean) => {
      isManagementModalOpen.value = false;
      isSaleOrTradeModalOpen.value = false;
      console.log("closeTokenModal-reload", reload);
      if (reload) {
        getTokenList();
      }
    };

    return {
      account,
      lang,
      tokensForDisplay,
      myTokens,
      selectedPrefecture,
      initialPrefecture,
      selectedSortOrder,
      filterType,
      filterTokenByCriteria,
      isManagementModalOpen,
      isSaleOrTradeModalOpen,
      getTokenList,
      groupedByPrefecture,
      showTokenModal,
      closeTokenModal,
      selectedToken,
    };
  },
});
</script>
