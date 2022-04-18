import {createRouter, createWebHistory, RouteRecordRaw, RouterOptions} from 'vue-router'
import BasicsBasicScene from "@/views/BasicsBasicScene.vue";
import {RouteConstants} from "@/utils/route.constants";

const routes = (): RouteRecordRaw[] => {
  const allRoutes: RouteRecordRaw[] = [{path: '/', component: BasicsBasicScene}] as RouteRecordRaw[];
  for (const route of RouteConstants) {
    if (!route.sectionTitle) {
      allRoutes.push({path: route.url, component: route.component} as RouteRecordRaw)
    }
  }
  return allRoutes
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes()
} as RouterOptions)

export default router
