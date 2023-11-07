<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <p class="mb-2 font-londrina font-yusei text-3xl">
      {{ $t("commingSoon.commingSoon") }}
    </p>
    <div class="mx-auto max-w-lg p-2 text-left"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "HomePage",
  components: {},
  setup() {
    const i18n = useI18n();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    return {
      lang,
    };
  },
});
</script>
