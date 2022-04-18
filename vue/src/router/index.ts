import {createRouter, createWebHistory, RouteRecordRaw, RouterOptions} from 'vue-router'
import Home from '../views/Home.vue'
import Basics from '../views/BasicsBasicScene.vue'
import BasicsBasicScene from "@/views/BasicsBasicScene.vue";
import BasicsTransformObjects from "@/views/BasicsTransformObjects.vue";
import BasicAnimations from "@/views/BasicAnimations.vue";
import BasicCameras from "@/views/BasicCameras.vue";
import BasicFullscreen from "@/views/BasicFullscreen.vue";

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
  },
  {
    path: '/animations',
    component: BasicAnimations
  },
  {
    path: '/cameras',
    component: BasicCameras
  },
  {
    path: '/fullscreen',
    component: BasicFullscreen
  }
] as RouteRecordRaw[]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes
} as RouterOptions)

export default router
