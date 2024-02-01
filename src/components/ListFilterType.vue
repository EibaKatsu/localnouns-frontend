<template>
  <div class="grid w-auto grid-cols-1 place-content-center items-center gap-2">
    <span class="font-londrina font-yusei text-xl whitespace-nowrap">
      {{ $t("listFilterType.filterType") }}:
      <select @change="updateValue">
        <option
          v-for="(option, index) in filterType"
          :value="option"
          :key="index"
          :selected="index == selectedValue"
        >
          {{ $t("listFilterType." + option) }}
        </option>
      </select>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup(props, context) {
    const filterType = ["prefecture", "onSale", "onTrade", "myNouns", "admins"];
    const selectedValue = ref(filterType[0]);

    const updateValue = (event: { target: HTMLSelectElement }) => {
      context.emit("update:modelValue", event.target.value);
    };
    return {
      selectedValue,
      filterType,
      updateValue,
    };
  },
});
</script>
