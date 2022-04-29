<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {
  BufferAttribute,
  BufferGeometry,
  Clock,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import BasicMaterials from "@/views/BasicMaterials.vue";



@Options({})
export default class BasicGeometries extends Vue {
  $refs!: {
    webgl: FullScreenDocumentElement
  }
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  cursor = {
    x: 0,
    y: 0
  }
  renderer: WebGLRenderer = {} as WebGLRenderer;
  // fov between 45 & 75 || only shows objects between near and far values
  camera: PerspectiveCamera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
  controls: OrbitControls = {} as OrbitControls

  doc = document as FullScreenDocument

  scene: Scene
  geometry: BufferGeometry
  mesh: Mesh
  material: MeshBasicMaterial


  tick() {
    // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  addObject() {
    // Object
// const mesh: Mesh = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1, 3, 3, 3),
//     new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true}))
    this.geometry = new THREE.BufferGeometry()
// const positionsArray: Float32Array = new Float32Array([
//   0, 0, 0,
//   0, 1, 0,
//   1,0 ,0,
// ]);
//
// const positionsAttribute: BufferAttribute = new THREE.BufferAttribute(positionsArray, 3)
// geometry.setAttribute('position', positionsAttribute)

    const count = 500 * 3 * 3
    const positionsArray: Float32Array = new Float32Array(count)
    for(let i = 0; i < count; i++) {
      positionsArray[i] = Math.random() - 0.5
    }
    const positionsAttribute: BufferAttribute = new THREE.BufferAttribute(positionsArray, 3)
    this.geometry.setAttribute('position', positionsAttribute)

    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }

  mounted() {
    // Initialize scene
    this.scene = new THREE.Scene()

    // Initialize object
    this.addObject()

    // object
    this.scene.add(this.mesh)

    //camera
    // this.camera.position.set(2, 2, 2)
    this.camera.position.z = 3
    this.camera.lookAt(this.mesh.position)
    this.scene.add(this.camera)

    //renderer
    this.renderer = new THREE.WebGLRenderer({canvas: this.$refs.webgl});
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.render(this.scene, this.camera)

    this.controls = new OrbitControls(this.camera, this.$refs.webgl);
    this.controls.enableDamping = true;

    // Resizing
    window.addEventListener('resize', () => {
      this.sizes.height = window.innerHeight
      this.sizes.width = window.innerWidth

      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.sizes.width, this.sizes.height)

      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    // Full screen
    fullscreenUtil(this.$refs.webgl)

    //animations
    this.tick()
  }

}
</script>

<style lang="scss">
.webgl {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  outline: none;

}
</style>
