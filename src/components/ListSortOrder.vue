<template>
  <div class="grid w-auto grid-cols-1 place-content-center items-center gap-2">
    <span class="font-londrina font-yusei text-xl whitespace-nowrap">
      {{ $t("listSortOrder.sortOrder") }}:
      <select @change="updateValue">
        <option
          v-for="(option, index) in sortOrder"
          :value="option"
          :key="index"
          :selected="index == selectedValue"
        >
          {{ $t("listSortOrder." + option) }}
        </option>
      </select>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup(props, context) {
    const sortOrder = [
      // "sortOrder",
      "newer",
      "older",
      "lower",
      "higher",
    ];
    const selectedValue = ref(sortOrder[0]);

    const updateValue = (event: { target: HTMLSelectElement }) => {
      context.emit("update:modelValue", event.target.value);
    };
    return {
      selectedValue,
      sortOrder,
      updateValue,
    };
  },
});
</script>
