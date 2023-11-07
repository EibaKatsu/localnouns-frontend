<template>
  <div class="flex flex-col items-start w-full">
    <div>
      <div>
        <!-- NotSpecified を1行目に表示 -->
        <div class="flex items-center mb-4">
          <input
            type="checkbox"
            value="0"
            v-model="selectedValues"
            @change="updateValues"
          />
          <label class="ml-2">{{ $t("prefecture.NotSpecified") }}</label>
        </div>
        <!-- 残りの選択肢を2行目以降に表示 -->
        <div class="flex flex-wrap">
          <div
            v-for="(option, index) in prefectureList"
            :key="index"
            class="flex items-center mr-4 mb-2"
          >
            <div v-if="option !== 'NotSpecified'">
              <input
                type="checkbox"
                :value="index"
                v-model="selectedValues"
                @change="updateValues"
              />
              <label class="ml-2">{{ $t("prefecture." + option) }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from "vue";
import { prefectureList } from "@/i18n/prefectures";

export default defineComponent({
  props: {
    initialPrefectures: {
      type: Array as PropType<number[]>,
      required: true,
    },
    modelValue: {
      type: Array as PropType<number[]>,
      required: true,
    },
  },
  setup(props, context) {
    const selectedValues = ref<number[]>(props.initialPrefectures);

    watch(
      () => props.modelValue,
      (newVal: number[]) => {
        selectedValues.value = newVal;
      },
    );

    const updateValues = () => {
      // 指定しない(0)が選ばれた場合は他をクリア
      if (selectedValues.value[selectedValues.value.length - 1] == 0) {
        selectedValues.value = [0];
      } else {
        // 指定しない(0)以外が選ばらた場合は0を削除
        selectedValues.value = selectedValues.value.filter(
          (item) => item !== 0,
        );
      }
      console.log(selectedValues.value);
      // context.emit("update:modelValue", selectedValues.value);
      context.emit("updateValues", selectedValues.value);
    };
    return {
      selectedValues,
      prefectureList,
      updateValues,
    };
  },
});
</script>
