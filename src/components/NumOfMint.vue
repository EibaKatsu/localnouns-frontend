<template>
  <span class="ml-16 font-londrina font-yusei text-xl">
    {{ $t("numOfMint.numOfMint") }}:

    <select @change="updateValue">
      <option
        v-for="(option, index) in numOfMint"
        :value="option"
        :key="index"
        :selected="option == selectedValue"
      >
        {{ option }}
      </option>
    </select>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    limit: {
      type: Number,
      required: true,
    },
  },
  setup(props, context) {

    const numOfMint = [...Array(Number(props.limit))].map((_, a) => a + 1);

    const selectedValue = ref(props.limit);

    const updateValue = (event: { target: HTMLSelectElement }) => {
      context.emit("update:modelValue", parseInt(event.target.value));
    };
    return {
      selectedValue,
      numOfMint,
      updateValue,
    };
  },
});
</script>
