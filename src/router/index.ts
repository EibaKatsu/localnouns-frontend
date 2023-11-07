import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/components/Layout.vue";
import NotFound from "@/components/NotFound.vue";

// import Home from "@/views/Home.vue";
import Mint from "@/views/Mint.vue";
import List from "@/views/List.vue";
import Owner from "@/views/Owner.vue";
// import ComingSoon from "@/views/ComingSoon.vue";
import Shop from "@/views/Shop.vue";
import About from "@/views/About.vue";
import { addresses } from "@/utils/addresses";

const network = "mumbai";
const routeChildren: Array<RouteRecordRaw> = [
  {
    path: "",
    component: List,
    props: {
      network: network,
      tokenAddress: addresses.localNounsToken[network],
    },
  },
  {
    path: "mint",
    component: Mint,
    props: {
      network: network,
      tokenAddress: addresses.localNounsToken[network],
      assetProvider: "localProvider",
      minterAddress: addresses.localNounsMinter[network],
    },
  },
  {
    path: "list",
    component: List,
    props: {
      network: network,
      tokenAddress: addresses.localNounsToken[network],
      test: true,
    },
  },
  {
    path: "owner",
    component: Owner,
    props: {
      network: network,
      tokenAddress: addresses.localNounsToken[network],
      test: true,
    },
  },
  {
    path: "shop",
    component: Shop,
  },
  {
    path: "about",
    component: About,
  },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:lang(ja|en)",
    component: Layout,
    children: routeChildren,
  },
  {
    path: "",
    component: Layout,
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
