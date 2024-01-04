<template>
  <!-- https://www.npmjs.com/package/vue-google-charts -->
  <GChart
    type="GeoChart"
    :data="chartData"
    :options="chartOptions"
    :settings="chartSettings"
    :events="chartEvents"
  />
</template>
<script lang="ts">
import { defineComponent, PropType, watch, ref } from "vue";
import { GChart } from "vue-google-charts";
import { prefectureList } from "@/i18n/prefectures";
import { TOKEN } from "@/firestore/const";
import { GOOGLE_MAPS_API_KEY } from "@/config/project";

export default defineComponent({
  props: {
    groupedByPrefecture: {
      type: Object as PropType<{ [key: number]: TOKEN[] }>,
      required: true,
    },
  },
  name: "NounsMap",
  components: {
    GChart,
  },
  setup(props) {
    const chartData = ref([["Prefecture", 0]]);
    chartData.value = [["Prefecture", "Nouns"]];
    Object.entries(props.groupedByPrefecture).forEach(
      ([prefectureId, tokens]) => {
        if (prefectureId) {
          chartData.value.push([
            prefectureList[Number(prefectureId)],
            tokens.length,
          ]);
        }
      },
    );

    // props.groupedByPrefectureが変更されたときに実行されるwatcher
    // Ownerページはデータの設定が遅延するのでこちらでデータセットされる
    watch(
      () => props.groupedByPrefecture,
      (newVal) => {
        console.log("newVal", newVal);
        chartData.value = [["Prefecture", "Nouns"]];
        Object.entries(newVal).forEach(([prefectureId, tokens]) => {
          if (prefectureId) {
            chartData.value.push([
              prefectureList[Number(prefectureId)],
              tokens.length,
            ]);
          }
        });
      },
    );

    const chartOptions = {
      width: 600,
      height: 400,
      region: "JP",
      resolution: "provinces",
    };

    const chartSettings = {
      packages: ["geochart"],
      mapsApiKey: GOOGLE_MAPS_API_KEY,
    };

    const chartEvents = {
      select: () => {
        const selection = getSelection();
        // Selectした結果を取得できず、、、一旦保留
        // 参考: https://stackoverflow.com/questions/73537575/how-to-use-getselection-on-timeline-chart-of-vue-google-charts-in-composition
        console.log("selection", selection);
      },
    };

    return {
      chartData,
      chartOptions,
      chartSettings,
      chartEvents,
    };
  },
});
</script>
