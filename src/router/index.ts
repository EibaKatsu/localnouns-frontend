import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/components/Layout.vue";
import NotFound from "@/components/NotFound.vue";

// import Home from "@/views/Home.vue";
import Mint from "@/views/Mint.vue";
import List from "@/views/List.vue";
import Owner from "@/views/Owner.vue";
import Statistics from "@/views/Statistics.vue";
import AllNouns from "@/views/AllNouns.vue";
// import ComingSoon from "@/views/ComingSoon.vue";
import Shop from "@/views/Shop.vue";
import About from "@/views/About.vue";
import Tokushoho from "@/views/Tokushoho.vue";
import Terms from "@/views/Terms.vue";
import Explanation from "@/views/Explanation.vue";
import Privcy from "@/views/Privacy.vue";
import Top from "@/views/Top.vue";
import { addresses } from "@/utils/addresses";
import { NETWORK } from "@/config/project";

const routeChildren: Array<RouteRecordRaw> = [
  {
    path: "",
    component: Top,
  },
  {
    path: "mint",
    component: Mint,
    props: {
      network: NETWORK,
      tokenAddress: addresses.localNounsToken[NETWORK],
      assetProvider: "localProvider",
      minterAddress: addresses.localNounsMinter[NETWORK],
      tokenGateAddress: addresses.tokenGate[NETWORK],
    },
  },
  {
    path: "list/:id",
    component: List,
    props: {
      network: NETWORK,
      tokenAddress: addresses.localNounsToken[NETWORK],
      // test: true,
    },
  },
  {
    path: "list",
    redirect: "/list/0",
  },
  {
    path: "owner",
    component: Owner,
    props: {
      network: NETWORK,
      tokenAddress: addresses.localNounsToken[NETWORK],
      // test: true,
    },
  },
  {
    path: "statistics",
    component: Statistics,
    props: {
      network: NETWORK,
      tokenAddress: addresses.localNounsToken[NETWORK],
    },
  },
  {
    path: "allnouns",
    component: AllNouns,
  },
  {
    path: "shop",
    component: Shop,
  },
  {
    path: "about",
    component: About,
  },
  {
    path: "tokushoho",
    component: Tokushoho,
  },
  {
    path: "terms",
    component: Terms,
  },
  {
    path: "explanation",
    component: Explanation,
  },
  {
    path: "privacy",
    component: Privcy,
  },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:lang(ja|en)",
    component: Layout,
    props: {
      network: NETWORK,
      tokenAddress: addresses.localNounsToken[NETWORK],
    },
    children: routeChildren,
  },
  {
    path: "",
    component: Layout,
    props: {
      network: NETWORK,
      tokenAddress: addresses.localNounsToken[NETWORK],
    },
    children: routeChildren,
  },
  {
    path: "/:page(.*)",
    name: "NotFoundPage",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
