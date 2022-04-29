<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";
import {fullscreenUtil} from "@/utils/fullscreen.util";
import * as dat from 'lil-gui'
import gsap from 'gsap'

@Options({})
export default class BasicDebugUi extends Vue {
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

  scene: Scene
  geometry: BoxGeometry
  material: MeshBasicMaterial
  mesh: Mesh

  // Debug
  gui = new dat.GUI({width: 400}).close()
  parameters: any


  doc = document as FullScreenDocument

  tick() {
    // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  debug() {
    this.gui.add(this.mesh.position, 'y')
        .min(-3)
        .max(3)
        .step(0.01)
        .name('elevation')

    this.gui.add(this.mesh, 'visible')
    this.gui.add(this.material, 'wireframe')

    this.gui.addColor(this.material, 'color')

    this.gui.add(this.parameters, 'spin')
  }

  mounted() {
    // Initialize scene
    this.scene = new THREE.Scene()

    // object
    this.geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3)
    this.material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: false})
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)

    // Debug
    this.parameters = {
      spin: () => {
        gsap.to(this.mesh.rotation, {duration: 1, y: this.mesh.rotation.y + Math.PI * 2})
      }
    }

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

    // Debug
    this.debug()

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
