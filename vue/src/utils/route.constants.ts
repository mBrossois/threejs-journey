import {Component} from "vue";
import BasicsBasicScene from "@/views/BasicsBasicScene.vue";
import BasicsTransformObjects from "@/views/BasicsTransformObjects.vue";
import BasicAnimations from "@/views/BasicAnimations.vue";
import BasicCameras from "@/views/BasicCameras.vue";
import BasicFullscreen from "@/views/BasicFullscreen.vue";
import BasicGeometries from "@/views/BasicGeometries.vue";
import BasicDebugUi from "@/views/BasicDebugUi.vue";
import BasicTextures from "@/views/BasicTextures.vue";
import BasicMaterials from "@/views/BasicMaterials.vue";
import Basic3dText from "@/views/Basic3dText.vue";
import ClassicLights from "@/views/ClassicLights.vue";
import ClassicShadows from "@/views/ClassicShadows.vue";
import ClassicHauntedHouse from "@/views/ClassicHauntedHouse.vue";
import ClassicParticles from "@/views/ClassicParticles.vue";
import ClassicGalaxyGenerator from "@/views/ClassicGalaxyGenerator.vue";
import ClassicRaycaster from "@/views/ClassicRaycaster.vue";

export const RouteConstants: { title: string, sectionTitle?: boolean, url: string, component: Component }[] = [
  {title: 'Basics', sectionTitle: true, url: '', component: {} as Component},
  {title: "Basic scene", url: "/basic-scene", component: BasicsBasicScene},
  {title: "Transform objects", url: "/transform-objects", component: BasicsTransformObjects},
  {title: "Animations", url: "/animations", component: BasicAnimations},
  {title: "Camera's", url: "/cameras", component: BasicCameras},
  {title: "Fullscreen and resizing", url: "/fullscreen", component: BasicFullscreen},
  {title: "Geometries", url: "/geometries", component: BasicGeometries},
  {title: "Debug UI", url: "/debug-ui", component: BasicDebugUi},
  {title: "Textures", url: "/textures", component: BasicTextures},
  {title: "Materials", url: "/materials", component: BasicMaterials},
  {title: "3D text", url: "/3d-text", component: Basic3dText},
  {title: "Classic techniques", sectionTitle: true, url: "", component: {} as Component},
  {title: "Lights", url: "/lights", component: ClassicLights},
  {title: "Shadows", url: "/shadows", component: ClassicShadows},
  {title: "Haunted house", url: "/haunted-house", component: ClassicHauntedHouse},
  {title: "Particles", url: "/particles", component: ClassicParticles},
  {title: "Galaxy generator", url: "/galaxy-generator", component: ClassicGalaxyGenerator},
  {title: "Raycaster", url: "/raycaster", component: ClassicRaycaster}
]
