<template>
  <span class="ml-16 font-londrina font-yusei text-xl">
    <div
      v-for="(option, index) in myTokens"
      :key="index"
      class="flex items-center my-1"
    >
      <input
        name="selectMyToken"
        type="radio"
        :value="option"
        :id="`option-${index}`"
        @change="updateValue($event, option.tokenId)"
        class="mr-2"
        :disabled="!option.canTrade"
      />
      <label :for="`option-${index}`" class="flex items-center">
        <svg
          v-html="option.svg"
          style="width: 40px; height: 40px"
          class="mx-1"
        ></svg>
        <div v-if="option.canTrade" class="items-center">
          <span> #{{ option.tokenId }}</span>
          <span>, {{ $t("prefecture." + option.prefecture) }}</span>
        </div>
        <div v-else class="flex items-center">
          <span style="color: grey"> #{{ option.tokenId }}</span>
          <span style="color: grey"
            >, {{ $t("prefecture." + option.prefecture) }}</span
          >
        </div>
      </label>
    </div>
    <div v-if="!hasTradableNouns">
      {{ $t("TokenSaleOrTrade.notHasTradableNouns") }}
    </div>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import { TOKEN } from "@/firestore/const";

export default defineComponent({
  props: {
    myTokens: {
      type: Array as PropType<TOKEN[]>,
      required: true,
    },
    tradeForPrefectures: {
      type: Array,
      required: true,
    },
  },
  setup(props, context) {
    const selectedValue = ref("");
    const hasTradableNouns = ref(false);
    if (props.tradeForPrefectures[0] == "NotSpecified") {
      props.myTokens.forEach((token) => {
        token.canTrade = true;
        hasTradableNouns.value = true;
      });
    } else {
      props.myTokens.forEach((token) => {
        token.canTrade = props.tradeForPrefectures.includes(token.prefecture);
        if (token.canTrade) {
          hasTradableNouns.value = true;
        }
      });
    }

    const updateValue = (
      event: { target: HTMLSelectElement },
      tokenId: string,
    ) => {
      if (event.target.value) {
        selectedValue.value = tokenId;
        console.log("MyNounsRadioButton:updateValue", tokenId);
        context.emit("updateValues", selectedValue.value);
      }
    };
    return {
      selectedValue,
      updateValue,
      hasTradableNouns,
    };
  },
});
</script>
