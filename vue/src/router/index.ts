import {createRouter, createWebHistory, RouteRecordRaw, RouterOptions} from 'vue-router'
import Home from '../views/Home.vue'
import Basics from '../views/BasicsBasicScene.vue'
import BasicsBasicScene from "@/views/BasicsBasicScene.vue";
import BasicsTransformObjects from "@/views/BasicsTransformObjects.vue";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/basic-scene',
    component: BasicsBasicScene
  },
  {
    path: '/transform-objects',
    component: BasicsTransformObjects
  }
] as RouteRecordRaw[]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes
} as RouterOptions)

export default router
