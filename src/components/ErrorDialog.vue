<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex justify-center items-center"
  >
    <div
      class="relative p-6 bg-red-200 w-3/4 flex flex-col items-center justify-center text-red"
    >
      <p
        class="mt-10 mb-2 font-londrina font-yusei text-xl whitespace-pre-line"
      >
        {{ $t("errorDialog.message") }}
      </p>
      <p
        v-if="description"
        class="mb-2 font-londrina font-yusei text-s whitespace-pre-line"
      >
        {{ description }}
      </p>
      <span class="absolute top-4 right-4 cursor-pointer">
        <button
          @click="closeModal"
          class="inline-block rounded bg-green-500 px-6 py-2.5 leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg"
        >
          {{ $t("tokenManagement.close") }}
        </button>
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
    description: {
      type: String,
      required: false,
    },
  },
  setup(props, context) {
    console.log("description:", props.description);

    const closeModal = () => {
      context.emit("close");
    };
    return {
      closeModal,
    };
  },
};
</script>
