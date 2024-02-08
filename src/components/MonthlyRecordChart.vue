<template>
  <div class="mb-4">
    <hr class="border-t border-gray-600 my-4 w-full" />

    <p class="font-londrina font-yusei text-2xl text-center">
      {{ $t("statistics.fromStart") }}
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
import { monthAdd, dateToYYYYMMM } from "@/utils/utils";

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
  name: "MonthlyRecordChart",
  components: {
    GChart,
  },
  async setup(props) {
    const collectionPath = `/${props.network}/${props.tokenAddress}`;

    const counters = ref<COUNTER[]>([]);
    // サービス開始日
    const dayStart = new Date(2023, 12, 1);
    const getCounter = async () => {
      // コレクションへの参照を取得
      const counterCollectionRef = collection(db, collectionPath + "/counter");

      const counterQuery = query(
        counterCollectionRef,
        where("counterType", "==", COUNTER_TYPE.MONTHLY),
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

    const chartData = ref([["Month", 0, 0, 0]]);
    chartData.value = [["Month", "Mint", "P2PSale", "P2PTrade"]];

    let xMonth: Date = dayStart;
    const today = new Date();
    let i = 0;
    while (xMonth.getTime() <= today.getTime()) {
      xMonth = monthAdd(dayStart, i);
      const x = dateToYYYYMMM(xMonth);
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

      i++;
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
