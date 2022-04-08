import {createRouter, createWebHistory, RouteRecordRaw, RouterOptions} from 'vue-router'
import Home from '../views/Home.vue'
import Basics from '../views/BasicScene.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/basics',
    component: Basics
  }
] as RouteRecordRaw[]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: routes
} as RouterOptions)

export default router
