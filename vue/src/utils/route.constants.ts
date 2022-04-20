import {Component} from "vue";
import BasicsBasicScene from "@/views/BasicsBasicScene.vue";
import BasicsTransformObjects from "@/views/BasicsTransformObjects.vue";
import BasicAnimations from "@/views/BasicAnimations.vue";
import BasicCameras from "@/views/BasicCameras.vue";
import BasicFullscreen from "@/views/BasicFullscreen.vue";
import BasicGeometries from "@/views/BasicGeometries.vue";
import BasicDebugUi from "@/views/BasicDebugUi.vue";

export const RouteConstants: { title: string, sectionTitle?: boolean, url: string, component: Component }[] = [
  {title: 'Basics', sectionTitle: true, url: '', component: {} as Component},
  {title: "Basic scene", url: "/basic-scene", component: BasicsBasicScene},
  {title: "Transform objects", url: "/transform-objects", component: BasicsTransformObjects},
  {title: "Animations", url: "/animations", component: BasicAnimations},
  {title: "Camera's", url: "/cameras", component: BasicCameras},
  {title: "Fullscreen and resizing", url: "/fullscreen", component: BasicFullscreen},
  {title: "Geometries", url: "/geometries", component: BasicGeometries},
  {title: "Debug UI", url: "/debug-ui", component: BasicDebugUi},
]
