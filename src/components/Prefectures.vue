<template>
  <span class="ml-16 font-londrina font-yusei text-xl">
    {{ $t("prefectures.prefectures") }}:

    <select @change="updateValue">
      <option
        v-for="(option, index) in prefectureList"
        :value="index"
        :key="index"
        :selected="index == selectedValue"
      >
        {{ $t("prefecture." + option) }}
      </option>
    </select>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { prefectureList } from "@/i18n/prefectures";

export default defineComponent({
  setup(props, context) {

    const selectedValue = ref(prefectureList[0]);

    const updateValue = (event: { target: HTMLSelectElement }) => {
      context.emit("update:modelValue", event.target.value);
      console.log(event.target.value);
    };
    return {
      selectedValue,
      prefectureList,
      updateValue,
    };
  },
});
</script>
