<template>
  <div class="mx-auto max-w-4xl p-4">
    <div class="text-center mb-6">
      <p class="font-londrina font-yusei text-xl">
        {{ $t("statistics.description") }}
      </p>
    </div>

    <DailyRecordChart :network="network" :tokenAddress="tokenAddress" />

    <MonthlyRecordChart :network="network" :tokenAddress="tokenAddress" />

    <OwnerRanking :network="network" :tokenAddress="tokenAddress" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OwnerRanking from "@/components/OwnerRanking.vue";
import DailyRecordChart from "@/components/DailyRecordChart.vue";
import MonthlyRecordChart from "@/components/MonthlyRecordChart.vue";

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
  name: "Statistics",
  components: {
    OwnerRanking,
    DailyRecordChart,
    MonthlyRecordChart,
  },
  async setup() {},
});
</script>
