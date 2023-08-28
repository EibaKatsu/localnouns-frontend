import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from "@/components/Layout.vue";
import NotFound from "@/components/NotFound.vue";

import Home from "@/views/2022/Home2022Prized.vue";
import Home2022 from "@/views/2022/Home.vue";
import Videos from "@/views/2022/Videos.vue";
import Nominations from "@/views/2022/Nominations.vue";
import About from "@/views/About.vue";
import Derivative from "@/views/Derivative.vue";
import Shop from "@/views/Shop.vue";

const routeChildren: Array<RouteRecordRaw> = [
  {
    path: "",
    component: Home,
  },
  {
    path: "2022",
    component: Home2022,
  },
  {
    path: "about",
    component: About,
  },
  {
    path: "videos",
    component: Videos,
  },
  {
    path: "nomi",
    component: Nominations,
  },
  {
    path: "derivative",
    component: Derivative,
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
