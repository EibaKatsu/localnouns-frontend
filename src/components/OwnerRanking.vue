<template>
  <div class="mb-4">
    <hr class="border-t border-gray-600 my-4 w-full" />

    <p class="font-londrina font-yusei text-2xl text-center mb-4">
      {{ $t("statistics.owners") }}
    </p>

    <!-- Holder information and SVG icons row -->
    <div v-for="holder in holders" :key="holder.key" class="mb-4">
      <div class="flex items-center justify-start gap-4 flex-wrap">
        <!-- Holder address and number of holds -->
        <p class="font-londrina font-yusei text-lg whitespace-nowrap">
          {{ holder.addressName }} ({{ holder.numOfHold }})
        </p>

        <!-- SVG icons with wrapping -->
        <div class="flex flex-wrap gap-2">
          <span v-for="token in holder.tokens" :key="token.key" class="block">
            <svg v-html="token.svg" class="w-8 h-8"></svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  getDocs,
  collection,
  Query,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { TOKEN, HOLDER } from "@/firestore/const";

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
  },
  name: "OwnerRanking",
  components: {},
  async setup(props) {
    const collectionPath = `/${props.network}/${props.tokenAddress}`;

    const getTokenList = async () => {
      for (const holder of holders.value) {
        let tokenQuery: Query<TOKEN> = collection(
          db,
          collectionPath + "/tokens",
        ) as Query<TOKEN>;

        tokenQuery = query(
          tokenQuery,
          where("holder", "==", holder.address.toLowerCase()),
        );

        try {
          const results = await getDocs(tokenQuery);
          holder.tokens = results.docs.map((doc) => {
            return doc.data();
          });
        } catch (e) {
          console.error("getTokenList", e);
        }
      }
    };

    const holders = ref<HOLDER[]>([]);
    const getHolders = async () => {
      // コレクションへの参照を取得
      const holdersCollectionRef = collection(db, collectionPath + "/holders");

      // クエリ条件（orderByとlimit）を適用
      const holderQuery = query(
        holdersCollectionRef,
        orderBy("numOfHold", "desc"), // numOfHoldで降順にソート
        limit(20), // 最初の20件を取得
      );
      try {
        const results = await getDocs(holderQuery);
        holders.value = results.docs.map((doc) => {
          // return doc.data();
          const data = doc.data();
          // doc.data() を HOLDER 型にキャスト
          const holder: HOLDER = {
            address: data.address,
            addressName: data.addressName,
            numOfHold: data.numOfHold,
            tokens: [],
            // FirestoreのtimestampをDateオブジェクトに変換
            timestamp: data.timestamp?.toDate(), // timestampが存在する場合、toDate() メソッドで Date オブジェクトに変換
          };
          return holder;
        });
      } catch (e) {
        console.error("getHolders", e);
      }

      getTokenList();
    };
    getHolders();

    return {
      holders,
    };
  },
});
</script>
