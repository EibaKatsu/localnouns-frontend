<template>
  <div class="grid w-auto grid-cols-1 place-content-center items-center gap-2">
    <span class="font-londrina font-yusei text-xl whitespace-nowrap">
      {{ $t("prefectures.prefectures") }}:

      <select @change="updateValue">
        <option
          v-for="(option, index) in prefectureListForDisplay"
          :value="index"
          :key="index"
          :selected="index == selectedValue"
        >
          {{ $t("prefecture." + option) }}
        </option>
      </select>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { prefectureList } from "@/i18n/prefectures";

export default defineComponent({
  props: {
    notIncludeNotSpecified: {
      type: Boolean,
      required: false,
    },
    initialPrefecture: {
      type: Number,
      required: false,
    },
  },
  setup(props, context) {
    const prefectureListForDisplay = ref<string[]>(prefectureList);
    if (props.notIncludeNotSpecified) {
      // 要素番号0のNotSpecifiedを除外
      prefectureListForDisplay.value = prefectureListForDisplay.value.slice(1);
    }
    // initialPrefectureが定義されていればinitialPrefecture
    const selectedValue = ref(
      props.initialPrefecture ? props.initialPrefecture - 1 : 0,
    );

    const updateValue = (event: { target: HTMLSelectElement }) => {
      if (props.notIncludeNotSpecified) {
        context.emit("update:modelValue", Number(event.target.value) + 1);
      } else {
        context.emit("update:modelValue", Number(event.target.value));
      }
    };
    return {
      selectedValue,
      prefectureListForDisplay,
      updateValue,
    };
  },
});
</script>
