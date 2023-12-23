<template>
  <div class="layout">
    <div id="nav">
      <!-- <img class="mb-4" src="@/assets/banner.jpeg" /> -->
      <!-- <router-link :to="localizedUrl('/')" class="font-londrina text-2xl">{{
        $t("nav.top")
      }}</router-link>
      | -->
      <router-link
        :to="localizedUrl('/mint')"
        class="font-londrina font-yusei text-2xl"
        >{{ $t("nav.mint") }}</router-link
      >
      |
      <router-link
        :to="localizedUrl('/list')"
        class="font-londrina font-yusei text-2xl"
        >{{ $t("nav.list") }}</router-link
      >
      |
      <router-link
        :to="localizedUrl('/owner')"
        class="font-londrina font-yusei text-2xl"
        >{{ $t("nav.owner") }}</router-link
      >
      |
      <router-link
        :to="localizedUrl('/about')"
        class="font-londrina font-yusei text-2xl"
        >{{ $t("nav.about") }}</router-link
      >
      <Languages class="mt-4" />
      <Connect :network="network" />
    </div>
    <div v-if="networkChainId == chainId || !chainId">
      <router-view />
    </div>
    <div v-else class="font-londrina font-yusei text-xl">
      {{ $t("menu.switchNetwork") }}
    </div>

    <div id="nav" class="mt-200">
      <hr class="border-t border-gray-600 my-4 w-full" />
      <router-link
        :to="localizedUrl('/explanation')"
        class="font-londrina font-yusei"
        >{{ $t("nav.explanation") }}</router-link
      >
      |
      <router-link
        :to="localizedUrl('/terms')"
        class="font-londrina font-yusei"
        >{{ $t("nav.terms") }}</router-link
      >
      |
      <router-link
        :to="localizedUrl('/tokushoho')"
        class="font-londrina font-yusei"
        >{{ $t("nav.tokushoho") }}</router-link
      >
      |
      <router-link
        :to="localizedUrl('/privacy')"
        class="font-londrina font-yusei"
        >{{ $t("nav.privacy") }}</router-link
      >
    </div>
    <div id="nav">
      <a
        :href="OpenSeaPath"
        target="_blank"
        class="font-londrina font-yusei text-sm"
        >Opensea</a
      >
      |
      <a
        :href="EtherscanToken"
        target="_blank"
        class="font-londrina font-yusei text-sm"
        >Etherscan</a
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import { ChainIdMap } from "@/utils/MetaMask";
import { useI18nParam } from "@/i18n/utils";

import Languages from "@/components/Languages.vue";
import Connect from "@/components/Connect.vue";
import { getAddresses } from "@/utils/const";

interface UserData {
  user: User | null;
}

export default defineComponent({
  name: "AppLayout",
  props: {
    network: {
      type: String,
      required: true,
    },
    tokenAddress: {
      type: String,
      required: true,
    },
  },
  components: {
    Languages,
    Connect,
  },
  async setup(props) {
    const store = useStore();
    const user = reactive<UserData>({ user: null });
    useI18nParam();

    const chainId = computed(() => store.state.chainId);
    const networkChainId = ChainIdMap[props.network];

    onMounted(() => {
      auth.onAuthStateChanged((fbuser) => {
        console.log("authStateChanged:");
        if (fbuser) {
          user.user = fbuser;
          store.commit("setUser", fbuser);
        } else {
          store.commit("setUser", null);
        }
      });
    });

    const { OpenSeaPath, EtherscanToken } = getAddresses(
      props.network,
      props.tokenAddress,
    );

    return {
      user,
      OpenSeaPath,
      EtherscanToken,
      chainId,
      networkChainId,
    };
  },
});
</script>
