<template>
  <div class="layout">
    <div v-if="displayMenu" id="nav" class="bg-gray-200">
      <router-link
        :to="localizedUrl('/')"
        class="font-londrina font-yusei text-xl"
        >{{ $t("nav.top") }}</router-link
      >
      |
      <router-link
        :to="localizedUrl('/mint')"
        class="font-londrina font-yusei text-xl"
        >{{ $t("nav.mint") }}</router-link
      >
      |
      <router-link
        :to="localizedUrl('/list/0')"
        class="font-londrina font-yusei text-xl"
        >{{ $t("nav.list") }}</router-link
      >
      |
      <router-link
        :to="localizedUrl('/statistics')"
        class="font-londrina font-yusei text-xl"
        >{{ $t("nav.statistics") }}</router-link
      >
      <Languages class="mt-4" />
      <Connect v-if="displayWallet" :network="network" />
    </div>
    <div v-else class="flex justify-end">
      <Languages class="mt-4 mb-2 mr-4" />
    </div>
    <div v-if="networkChainId == chainId || !chainId">
      <router-view />
    </div>
    <div v-else class="font-londrina font-yusei text-xl">
      {{ $t("menu.switchNetwork") }}
    </div>

    <div id="nav" class="mt-200 bg-gray-200">
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
      |
      <router-link
        :to="localizedUrl('/about')"
        class="font-londrina font-yusei"
        >{{ $t("nav.about") }}</router-link
      >
    </div>
    <div id="nav">
      <a
        :href="TWITTER_URL"
        target="_blank"
        class="font-londrina font-yusei text-sm"
        >X(Twitter)</a
      >
      |
      <a
        :href="DISCORD_URL"
        target="_blank"
        class="font-londrina font-yusei text-sm"
        >discord</a
      >
      |
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
import { useRoute } from "vue-router";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import { ChainIdMap } from "@/utils/MetaMask";
import { useI18nParam } from "@/i18n/utils";

import Languages from "@/components/Languages.vue";
import Connect from "@/components/Connect.vue";
import { getAddresses } from "@/utils/const";
import { TWITTER_URL, DISCORD_URL } from "@/config/project";

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
    const route = useRoute();
    const user = reactive<UserData>({ user: null });
    useI18nParam();

    const displayMenu = computed(() => {
      if (
        route.path != "/" &&
        route.path != "/ja" &&
        route.path != "/en" &&
        route.path != "/ja/" &&
        route.path != "/en/"
      ) {
        return true;
      } else {
        return false;
      }
    });

    const displayWallet = computed(() => {
      if (
        route.path.includes("/terms") ||
        route.path.includes("/tokushoho") ||
        route.path.includes("/privacy") ||
        route.path.includes("/about")
      ) {
        return false;
      } else {
        return true;
      }
    });

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
      TWITTER_URL,
      DISCORD_URL,
      displayMenu,
      displayWallet,
    };
  },
});
</script>
