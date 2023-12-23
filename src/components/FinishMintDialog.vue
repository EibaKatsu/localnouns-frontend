<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex justify-center items-center font-londrina font-yusei"
  >
    <div
      class="relative p-6 bg-white w-3/4 flex flex-col items-center justify-center"
    >
      <p class="mt-10 mb-2 text-2xl">
        {{ $t("finishMintDialog.message") }}
      </p>
      <p class="mt-10 mb-2 text-xl">
        {{ $t("finishMintDialog.message2") }}
      </p>

      <a v-if="hashLink" :href="hashLink" target="_blank"> etherscan </a>
      <span class="absolute top-2 right-4 cursor-pointer">
        <button
          @click="closeModal"
          class="mt-2 inline-block rounded bg-green-500 px-6 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
        >
          {{ $t("tokenManagement.close") }}
        </button>
        <router-link
          :to="localizedUrl('/owner')"
          class="mt-2 ml-4 inline-block rounded bg-green-500 px-6 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
          >{{ $t("nav.owner") }}</router-link
        >
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    mintedTokenId: {
      type: Number,
      required: true,
    },
    mintedNumber: {
      type: Number,
      required: true,
    },
    hashLink: {
      type: String,
      required: false,
    },
  },
  setup(props, context) {
    const closeModal = () => {
      context.emit("close");
    };
    return {
      closeModal,
    };
  },
};
</script>
