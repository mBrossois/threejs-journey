<template>
  <canvas class="webgl" ref="webgl"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import * as THREE from "three";
import {Clock, Mesh, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {FullScreenDocument, FullScreenDocumentElement} from "@/types/fullscreen.type";

@Options({})
export default class BasicFullscreen extends Vue {
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
  renderer: WebGLRenderer
  // fov between 45 & 75 || only shows objects between near and far values
  camera: PerspectiveCamera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100);
  controls: OrbitControls = {} as OrbitControls

  doc = document as FullScreenDocument

  scene: Scene

  // Object
  cube: Mesh

  // Clock
  clock: Clock = new THREE.Clock()

  tick() {
    // Update controls
    this.controls.update()

    //renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.tick)
  }

  mounted() {
    // Initialize scene
    this.scene = new THREE.Scene()

    // object
    this.cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({color: 0xff0000}))
    this.scene.add(this.cube)

    //camera
    // this.camera.position.set(2, 2, 2)
    this.camera.position.z = 3
    this.camera.lookAt(this.cube.position)
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

    // Double click to full screen
    window.addEventListener('dblclick', () => {

      const fullscreenElement = this.doc.fullscreenElement || this.doc.webkitFullscreenElement

      if (!fullscreenElement) {
        if(this.$refs.webgl.requestFullscreen) {
          this.$refs.webgl.requestFullscreen()
        } else if(this.$refs.webgl.webkitRequestFullscreen) {
          this.$refs.webgl.webkitRequestFullscreen()
        }
      } else {
        if(this.doc.exitFullscreen()) {
          document.exitFullscreen()
        } else if(this.doc.webkitExitFullscreen) {
          this.doc.webkitExitFullscreen()
        }
      }
    })

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
