<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <p class="mb-2 font-londrina font-yusei text-xl">
      {{ $t("owner.description") }}
    </p>
  </div>

  <div
    v-for="tokenGroup in groupedByPrefecture"
    :key="tokenGroup.key"
    class="px-2 py-1 flex flex-col items-left justify-center"
  >
    <p class="mb-2 font-londrina font-yusei text-3xl text-left">
      {{ $t("prefecture." + tokenGroup[0].prefecture) }}
    </p>
    <div
      class="grid w-screen grid-cols-2 place-content-center items-center gap-2 sm:grid-cols-5"
    >
      <div
        v-for="token in tokenGroup"
        :key="token.key"
        class="px-2 py-1 flex flex-col items-center justify-center"
      >
        <div @click="showTokenModal(token)" class="items-center justify-center">
          <TokenDetail :token="token" size="S" />
        </div>
      </div>
    </div>

    <TokenManagement
      v-if="selectedToken"
      :network="network"
      :isOpen="isManagementModalOpen"
      :token="selectedToken"
      @close="closeTokenModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { getDocs, collection, query, where, Query } from "firebase/firestore";
import { db } from "@/utils/firebase";
import TokenDetail from "@/components/TokenDetail.vue";
import TokenManagement from "@/components/TokenManagement.vue";
import { TOKEN } from "@/firestore/const";
import { getPartsNameAndDescription } from "@/utils/partsDataUtil";
import { getTokenListForTest } from "@/utils/testData";

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
  name: "Owner",
  components: {
    TokenDetail,
    TokenManagement,
  },
  async setup(props) {
    const store = useStore();
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

    const account = computed(() => {
      return store.state.account;
    });

    // accountが変更されたらgetTokenListを実行するウォッチャー
    watch(account, async (newAccount, oldAccount) => {
      if (newAccount !== oldAccount) {
        getTokenList();
      }
    });

    const isManagementModalOpen = ref(false);

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
        }

        const headName = getPartsNameAndDescription(
          "Heads",
          `${token.prefecture.toLowerCase()}-${token.head.toLowerCase()}`,
          lang.value,
        );
        if (headName) {
          token.head = headName.name;
          token.headDescription = headName.description;
        }
      }
    };

    const tokenCollectionPath = `/${props.network}/${props.tokenAddress}`;
    const tokens = ref<TOKEN[]>([]);
    const getTokenList = async () => {
      let tokenQuery: Query<TOKEN> = collection(
        db,
        tokenCollectionPath + "/tokens",
      ) as Query<TOKEN>;

      tokenQuery = query(
        tokenQuery,
        where("holder", "==", String(account.value).toLowerCase()),
      );

      try {
        if (!props.test) {
          const results = await getDocs(tokenQuery);
          tokens.value = results.docs.map((doc) => {
            return doc.data();
          });
        } else {
          // for test
          tokens.value = getTokenListForTest();
        }
        getPartsName(tokens.value);
      } catch (e) {
        console.error("getTokenList", e);
      }
    };
    getTokenList();

    // トークンを都道府県IDでグループ化するcomputedプロパティ
    const groupedByPrefecture = computed(() => {
      const groups = tokens.value.reduce((acc: any, token) => {
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
      isManagementModalOpen.value = true;
    };

    const closeTokenModal = (reload: boolean) => {
      isManagementModalOpen.value = false;
      console.log("closeTokenModal-reload", reload);
      if (reload) {
        getTokenList();
      }
    };

    return {
      account,
      lang,
      groupedByPrefecture,
      isManagementModalOpen,
      getTokenList,
      showTokenModal,
      closeTokenModal,
      selectedToken,
    };
  },
});
</script>
