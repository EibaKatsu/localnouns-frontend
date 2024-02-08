<template>
  <div class="mb-4">
    <hr class="border-t border-gray-600 my-4 w-full" />

    <p class="font-londrina font-yusei text-2xl text-center">
      {{ $t("statistics.last30days") }}
    </p>

    <div class="flex justify-center">
      <!-- https://www.npmjs.com/package/vue-google-charts -->
      <GChart
        type="ColumnChart"
        :data="chartData"
        :options="chartOptions"
        :settings="chartSettings"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { GChart } from "vue-google-charts";
import { COUNTER, COUNTER_TYPE } from "@/firestore/const";
import { getDocs, collection, query, orderBy, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { dateAdd, dateToYYYYMMMDD } from "@/utils/utils";

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
  name: "DailyRecordChart",
  components: {
    GChart,
  },
  async setup(props) {
    const collectionPath = `/${props.network}/${props.tokenAddress}`;

    const counters = ref<COUNTER[]>([]);
    // 30日前の日付を取得
    const dayStart = dateAdd(new Date(), -30);
    const getCounter = async () => {
      // コレクションへの参照を取得
      const counterCollectionRef = collection(db, collectionPath + "/counter");

      const counterQuery = query(
        counterCollectionRef,
        where("counterType", "==", COUNTER_TYPE.DAILY),
        where("key", ">=", dateToYYYYMMMDD(dayStart)),
        orderBy("key", "asc"),
      );

      try {
        const results = await getDocs(counterQuery);
        counters.value = results.docs.map((doc) => {
          // return doc.data();
          const data = doc.data();
          // doc.data() を COUNTER 型にキャスト
          const counter: COUNTER = {
            key: data.key,
            counterType: data.counterType,
            numOfMint: data.numOfMint,
            numOfSale: data.numOfSale,
            numOfTrade: data.numOfTrade,
          };
          return counter;
        });
      } catch (e) {
        console.error("getCounter", e);
      }
    };
    await getCounter();

    const chartData = ref([["Date", 0, 0, 0]]);
    chartData.value = [["Date", "Mint", "P2PSale", "P2PTrade"]];

    for (let i = 0; i < 30; i++) {
      const x = dateToYYYYMMMDD(dateAdd(dayStart, i));
      const counter = counters.value.find((counter) => counter.key === x);

      if (counter) {
        chartData.value.push([
          x,
          counter.numOfMint,
          counter.numOfSale,
          counter.numOfTrade,
        ]);
      } else {
        chartData.value.push([x, 0, 0, 0]);
      }
    }
    const chartOptions = {
      width: 600,
      height: 400,
    };

    const chartSettings = {};

    return {
      chartData,
      chartOptions,
      chartSettings,
    };
  },
});
</script>
