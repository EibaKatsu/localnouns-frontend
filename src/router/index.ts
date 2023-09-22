import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/components/Layout.vue";
import NotFound from "@/components/NotFound.vue";

import Home from "@/views/Home.vue";
import Mint from "@/views/Mint.vue";
import ComingSoon from "@/views/ComingSoon.vue";
import Shop from "@/views/Shop.vue";
import { addresses } from "@/utils/addresses";

const routeChildren: Array<RouteRecordRaw> = [
  {
    path: "",
    component: Home,
  },
  {
    path: "mint",
    component: Mint,
    props: {
      network: "mumbai",
      tokenAddress: addresses.localNounsToken["mumbai"],
      assetProvider: "localProvider",
      minterAddress: addresses.localNounsMinter["mumbai"],
      // network: "localhost",
      // tokenAddress: addresses.localNounsToken["localhost"],
    },
  },
  {
    path: "sale",
    component: ComingSoon,
  },
  {
    path: "trade",
    component: ComingSoon,
  },
  {
    path: "shop",
    component: Shop,
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
